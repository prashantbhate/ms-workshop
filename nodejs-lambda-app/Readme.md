
# Run locally and unit test

```
npm install
npm test
```

# Run dynamo db locally

```
docker run -p 8000:8000 amazon/dynamodb-local
```

Create table

```
aws dynamodb  create-table \
  --endpoint-url http://localhost:8000 \
  --table-name SampleTable \
  --key-schema AttributeName=id,KeyType=HASH \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
  --table-class STANDARD
```


# Start api & test

```
sam local start-api --debug --env-vars env.json

```


## Test api using Curl

```
#GET
curl 'http://localhost:3000/'

#POST
curl 'http://localhost:3000/' -X POST -d '{"fn":"a","ln":"b"}'

#PUT
curl 'http://localhost:3000/' -X PUT -d '{"fn":"a","ln":"b", "id":"<id>"}'

#DELETE
curl 'http://localhost:3000/' -X DELETE -d '{"id":"<id>"}'

```

## Test api using Postman

Configure http://localhost:3000/ in postman and test



# Start lambda and test using aws cli

```
sam local start-lambda --debug --env-vars env.json

```

```
aws lambda invoke \
--function-name "crudFunction" \
--endpoint-url "http://127.0.0.1:3001" \
--payload fileb://events/payload.json \
--no-verify-ssl out.txt
```


# Invoke lambda and test using event

```
sam local invoke crudFunction --env-vars env.json -e "events/get.json"

sam local invoke crudFunction --env-vars env.json -e "events/post.json"


```