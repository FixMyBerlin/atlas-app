import { params } from './parameters'

async function logToSynology(message: string, token: string) {
  if (!params.synologyURL) {
    return
  }
  const url = params.synologyURL + token
  const payload = { text: `#${params.environment}: ${message}` }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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
