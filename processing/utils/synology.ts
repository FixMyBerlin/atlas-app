import { params } from './parameters'
import { join } from 'path'

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

export async function logInfo(message: string) {
  if (!params.synologyLogToken) {
    return
  }
  await logToSynology(message, params.synologyLogToken)
}

export async function logError(message: string) {
  if (!params.synologyErrorLogToken) {
    return
  }
  await logToSynology(message, params.synologyErrorLogToken)
}
