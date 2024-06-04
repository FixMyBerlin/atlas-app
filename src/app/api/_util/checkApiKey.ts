import { isDev, isStaging } from '../../_components/utils/isEnv'

export const parseData = (body, Schema) => {
  try {
    const data = Schema.parse(body)
    return { ok: true, data, errorResponse: null }
  } catch (e) {
    const responseData: Record<string, any> = { statusText: 'Bad Request' }
    if (isDev || isStaging) {
      responseData.error = e
    }
    return {
      ok: false,
      data: null,
      errorResponse: Response.json(responseData, { status: 400 }),
    }
  }
}

export const checkApiKey = (data: Request | Record<string, any>) => {
  if (process.env.NODE_ENV === 'development') {
    return { ok: true, errorResponse: null }
  }

  let apiKey: string | null
  if (data instanceof Request) {
    apiKey = new URL(data.url).searchParams.get('apiKey')
  } else if ('apiKey' in data) {
    apiKey = data.apiKey
  } else {
    apiKey = null
  }

  if (apiKey === process.env.ATLAS_API_KEY) {
    return { ok: true, errorResponse: null }
  } else {
    return {
      ok: false,
      errorResponse: Response.json({ statusText: 'Unauthorized' }, { status: 401 }),
    }
  }
}
