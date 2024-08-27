import { NextApiRequest, NextApiResponse } from 'next'
import { isProd } from 'src/app/_components/utils/isEnv'
import { z } from 'zod'
import { register } from 'src/instrumentation'

const RefreshSchema = z.object({
  apiKey: z.string(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Parse and validate the query string
  let params
  try {
    params = RefreshSchema.parse(req.query)
  } catch (e) {
    if (!isProd) throw e
    res.status(400).send('Bad Request')
    return
  }

  // Check the API key
  try {
    if (params.apiKey !== process.env.ATLAS_API_KEY) {
      res.status(403).send('Forbidden')
      return
    }

    await register()

    res.status(200).send('OK')
  } catch (e) {
    if (!isProd) throw e
    res.status(500).send('Internal Server Error')
  }
}
