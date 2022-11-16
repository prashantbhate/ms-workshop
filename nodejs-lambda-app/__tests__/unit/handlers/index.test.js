const { mockClient } = require("aws-sdk-client-mock");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, DeleteCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const ddbMock = mockClient(DynamoDBDocumentClient);

const lambda = require('../../../src/handlers/index.js');


describe('Test putItemHandler', function () {
    let putSpy;

    beforeAll(() => {

    });

    // Clean up mocks
    afterAll(() => {

    });

    beforeEach(() => {
        ddbMock.reset();
    });


    it('should list table', async () => {

        const returnedItem = [{ id: "user1", fn: "John", ln: "Die" }]

        ddbMock.on(ScanCommand).resolves({
            httpStatusCode: 200,
            Items: returnedItem,
        });

        const event = {
            httpMethod: 'GET',
            // body: '{"id": "id1","name": "name1"}'
        };

        const context = {

        }

        // Invoke getHandler()
        const result = await lambda.handler(event, context);
        const expectedResult = {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(returnedItem)
        };

        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult);
    });

    it('POST should add item to the table', async () => {


        ddbMock.on(PutCommand).resolves({
            httpStatusCode: 200
        });

        const event = {
            httpMethod: 'POST',
            body: '{"fn": "John","ln": "Dough"}'
        };

        const context = {

        }

        // Invoke postHandler()
        const result = await lambda.handler(event, context);


        // Compare the result with the expected result
        expect(result.statusCode).toEqual(200);
    });

    it('POST fn ln mandatory to add item to the table', async () => {


        ddbMock.on(PutCommand).resolves({
            httpStatusCode: 200
        });

        const event = {
            httpMethod: 'POST',
            body: '{"fn1": "John","ln1": "Dough"}'
        };

        const context = {

        }

        // Invoke postHandler() 
        const result = await lambda.handler(event, context);


        // Compare the result with the expected result 
        expect(result.statusCode).toEqual(400);
    });


    it('PUT should update item in the table', async () => {


        ddbMock.on(PutCommand).resolves({
            httpStatusCode: 200
        });

        const event = {
            httpMethod: 'PUT',
            body: '{"id":"1234", "fn": "John","ln": "Dough"}'
        };

        const context = {

        }

        // Invoke putHandler()
        const result = await lambda.handler(event, context);


        // Compare the result with the expected result
        expect(result.statusCode).toEqual(200);
    });


    it('PUT all fields mandatory for  update item', async () => {


        ddbMock.on(DeleteCommand).resolves({
            httpStatusCode: 200
        });

        const event = {
            httpMethod: 'DELETE',
            body: '{"a":"1234"}'
        };

        const context = {

        }

        // Invoke deleteHandler()
        const result = await lambda.handler(event, context);


        // Compare the result with the expected result
        expect(result.statusCode).toEqual(400);
    });


    it('DELETE should delete item in the table', async () => {


        ddbMock.on(DeleteCommand).resolves({
            httpStatusCode: 200
        });

        const event = {
            httpMethod: 'DELETE',
            body: '{"id":"1234"}'
        };

        const context = {

        }

        // Invoke postHandler() 
        const result = await lambda.handler(event, context);


        // Compare the result with the expected result
        expect(result.statusCode).toEqual(200);
    });


    it('id mandatory for  delete item', async () => {


        ddbMock.on(DeleteCommand).resolves({
            httpStatusCode: 200
        });

        const event = {
            httpMethod: 'DELETE',
            body: '{"fn":"1234"}'
        };

        const context = {

        }

        // Invoke postHandler() 
        const result = await lambda.handler(event, context);


        // Compare the result with the expected result
        expect(result.statusCode).toEqual(400);
    });



    it('should fail for unimplemented method', async () => {

        const event = {
            httpMethod: 'PATCH',
        };

        const context = {

        }

        // Invoke postHandler() 
        const result = await lambda.handler(event, context);


        // Compare the result with the expected result
        expect(result.statusCode).toEqual(400);
    });

});
