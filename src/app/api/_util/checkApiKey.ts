export const checkApiKey = (data: Request | Record<string, any>) => {
  let apiKey: string | null
  if (data instanceof Request) {
    apiKey = new URL(data.url).searchParams.get('apiKey')
  } else if ('apiKey' in data) {
    apiKey = data.apiKey
  } else {
    apiKey = null
  }

  if (apiKey === process.env.EXPORT_ACCESS_TOKEN) {
    return { ok: true, errorResponse: null }
  } else {
    return {
      ok: false,
      errorResponse: Response.json({ statusText: 'Unauthorized' }, { status: 401 }),
    }
  }
}
