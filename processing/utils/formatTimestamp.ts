export function formatTimestamp(durationMS: number): string {
  const date = new Date(durationMS)
  const hours = date.getUTCHours()
  const minutes = date.getUTCMinutes()
  const seconds = date.getUTCSeconds()
  const padded = [hours, minutes, seconds].map((x) => x.toString().padStart(2, '0'))
  return padded.join(':')
}
