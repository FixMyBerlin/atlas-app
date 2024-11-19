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
  const payload = JSON.stringify({ text: `#${params.environment}: ${message}` })
  const body = new URLSearchParams({ payload }).toString()

  // send the request
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body,
    })
    if (!response.ok) {
      throw new Error(`${response.statusText}`)
    }
    // the synology API isn't implemented correctly the error code and message are actually in the body
    const responseBody = await response.json()
    if (!responseBody.success) {
      throw new Error(`${responseBody.error.errors}`)
    }
  } catch (error) {
    console.error(`Error logging to Synology: ${error}`)
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
