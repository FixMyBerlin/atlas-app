import { NextApiRequest, NextApiResponse } from 'next'

import data from './style.json'

data.sprite = process.env.NEXT_PUBLIC_APP_ORIGIN + '/map/sprite'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.json(data)
}
