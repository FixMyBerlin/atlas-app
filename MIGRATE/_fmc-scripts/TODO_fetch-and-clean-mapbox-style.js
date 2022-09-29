const fs = require('fs')
const https = require('https')

// Docs https://docs.mapbox.com/help/glossary/styles-api/

const process = async () => {
  const rawFile = './output/tarmac-style-raw.json'

  const download = async () => {
    // const file = fs.createWriteStream(rawFile)
    // const styleApiUrl = `https://api.mapbox.com/styles/v1/hejco/cl706a84j003v14o23n2r81w7?access_token=${process.env.MAPBOX_STYLE_ACCESS_TOKEN}`
    // https
    //   .get(styleApiUrl, (response) => {
    //     console.log(
    //       '📥 Download:',
    //       styleApiUrl,
    //       'Response StatusCode:',
    //       response.statusCode
    //     )
    //     console.log({ response })
    //     response.pipe(file)
    //     return 'success'
    //   })
    //   .on('error', (error) => {
    //     console.error(
    //       '🧨 Download failed:',
    //       styleApiUrl,
    //       'Response Status Code:',
    //       error
    //     )
    //     return 'error'
    //   })
  }

  const load = async () => {
    return await fs.readFile(rawFile, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      const rawData = JSON.parse(data)
      return rawData
    })
  }

  await download()
  const data = await load()
  console.log({ data })
}

process()
