
#!/bin/bash
set -x

rm -rf function.zip
npm i --prod
zip -r function.zip .
aws lambda update-function-code --function-name ddbdemo --zip-file fileb://function.zip