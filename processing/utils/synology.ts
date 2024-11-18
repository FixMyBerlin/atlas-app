import { params } from './parameters'

async function logToSynology(message: string, token: string) {
  // if the URL is not set, we don't log
  if (!params.synologyURL) {
    return
  }

  // prepare the URL
  const synologyParams = {
    token: decodeURIComponent(token), // the token is already encoded in the env
    api: 'SYNO.Chat.External',
    method: 'incoming',
    version: '2',
  }
  const url = new URL(params.synologyURL)
  Object.entries(synologyParams).forEach(([key, value]) => {
    url.searchParams.append(key, value)
  })

  //prepare the payload
  const payload = { text: `#${params.environment}: ${message}` }
  const body = new URLSearchParams({ payload: JSON.stringify(payload) })
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body.toString(),
    })

    if (response.status !== 200) {
      throw new Error(`Error logging to Synology: ${response.statusText}`)
    }
  } catch (error) {
    console.error(`Error logging to Synology`)
  }
}

/**
 * Log an info message to the synology chat
 * @param message
 * @returns
 */

export async function synologyLogInfo(message: string) {
  if (!params.synologyLogToken) {
    return
  }
  await logToSynology(message, params.synologyLogToken)
}

/**
 * Log an error message to the synology chat
 * @param message
 * @returns
 */
export async function synologyLogError(message: string) {
  if (!params.synologyErrorLogToken) {
    return
  }
  await logToSynology(message, params.synologyErrorLogToken)
}
