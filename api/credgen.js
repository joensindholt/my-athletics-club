const fs = require('fs');
const accessKeyId = process.argv[2];
const secretAccessKey = process.argv[3];

if (!accessKeyId || !secretAccessKey) {
  console.error('Usage: node credgen {accessKeyId} {secretAccessKey}');
  process.exit(-1);
}

fs.writeFileSync('./src/aws.config.json', JSON.stringify({
  "region": "eu-west-1",
  "endpoint": "https://dynamodb.eu-west-1.amazonaws.com",
  "accessKeyId": accessKeyId,
  "secretAccessKey": secretAccessKey
}, null, 4));
