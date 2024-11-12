import { join } from 'path'
import { params } from './parameters'

async function logToSynology(message: string, token: string) {
  if (!params.synologyURL) {
    return
  }
  const url = join(params.synologyURL, token)
  const payload = { text: `#${params.environment}: ${message}` }
  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
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
