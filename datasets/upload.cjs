// Takes all files from ./pmtiles and upload them to the S3 bucket at https://s3.console.aws.amazon.com/s3/buckets/atlas-tiles?region=eu-central-1&tab=objects (replacing existing files).

// Prepare AWS credentials:
// 1. `code ~/.aws/credentials`
// 2. Create credentials at https://us-east-1.console.aws.amazon.com/iamv2/home#/security_credentials?section=IAM_credentials => "Zugriffsschlüssel erstellen"
// 3. Add the following snippet
//    [default]
//    aws_access_key_id = a123
//    aws_secret_access_key = b123
// Docs: https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html

const { S3 } = require('@aws-sdk/client-s3')
const fs = require('fs')
const path = require('path')

const s3 = new S3({
  region: 'eu-central-1',
})

const pmtilesFiles = fs
  .readdirSync(path.resolve(__dirname, './pmtiles'))
  .filter((file) => path.extname(file) === '.pmtiles')

pmtilesFiles.forEach((file) => {
  const Key = file
  const Body = fs.readFileSync(path.resolve(__dirname, './pmtiles', file))
  const ContentType = 'application/x-protobuf'

  s3.putObject({ Bucket: 'atlas-tiles', Key, Body, ContentType }, (err, _data) => {
    if (err) {
      console.error(err)
      return
    }
    const previewUrl = `https://atlas-tiles.s3.eu-central-1.amazonaws.com/${file}`
    console.log(`Test uploaded file: https://protomaps.github.io/PMTiles/?url=${previewUrl}`)
  })
})
