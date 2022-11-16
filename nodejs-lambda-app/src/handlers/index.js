
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const client = new DynamoDBClient({});
const { DynamoDBDocumentClient, PutCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const ddbDocClient = DynamoDBDocumentClient.from(client);

const tableName = process.env.SAMPLE_TABLE;

async function get() {
    const scanparams = {
        TableName: tableName
    };
    const res = await ddbDocClient.send(new ScanCommand(scanparams));
    const statusCode = res.httpStatusCode;
    const body = res.Items
    return { statusCode, body }
}

async function post(postitem, id) {
    delete postitem['id'];
    const postparams = {
        TableName: tableName, ReturnValues: 'ALL_OLD',
        Item: { fn: postitem.fn, ln: postitem.ln, id: id },
        ConditionExpression: "attribute_not_exists(id)",
    }
    const postRes = await ddbDocClient.send(new PutCommand(postparams));
    const statusCode = postRes.httpStatusCode;
    const body = { postRes };
    return { statusCode, body }
}

async function put(putitem) {
    const putparams = {
        TableName: tableName, ReturnValues: 'ALL_OLD',
        Item: { fn: putitem.fn, ln: putitem.ln, id: putitem.id },
        ConditionExpression: "attribute_exists(id)",
    }
    const putRes = await ddbDocClient.send(new PutCommand(putparams));
    const statusCode = putRes.httpStatusCode;
    const body = { putRes };
    return { statusCode, body }
}
async function del(deleteitem) {
    const deleteparams = {
        TableName: tableName, ReturnValues: 'ALL_OLD',
        Key: { "id": deleteitem.id },
        ConditionExpression: "attribute_exists(id)",
    }
    const delRes = await ddbDocClient.send(new DeleteCommand(deleteparams));
    const statusCode = delRes.httpStatusCode;
    const body = { delRes };
    return { statusCode, body }
}

function parseAndValidate(body, mandatoryAttrs) {
    const item = JSON.parse(body)
    mandatoryAttrs.forEach((e) => {
        if (!item.hasOwnProperty(e)) {
            throw new Error(`Attribute "$e" is mandatory`);
        }
    })
    return item;
}


exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    let body;
    let statusCode = '200';

    try {
        switch (event.httpMethod) {
            case 'DELETE':

                const deleteitem = parseAndValidate(event.body, ['id']);
                ({ statusCode, body } = await del(deleteitem));
                break;

            case 'GET':

                ({ statusCode, body } = await get());
                break;

            case 'POST':

                const postitem = parseAndValidate(event.body, ['fn', 'ln']);
                ({ statusCode, body } = await post(postitem, context.awsRequestId))
                break;

            case 'PUT':

                const putitem = parseAndValidate(event.body, ['id', 'fn', 'ln']);
                ({ statusCode, body } = await put(putitem))
                break;

            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = 400;
        body = err.stack;
    } finally {
        body = JSON.stringify(body);
    }

    const headers = {
        'Content-Type': 'application/json',
    };
    return {
        statusCode,
        body,
        headers,
    };
};
