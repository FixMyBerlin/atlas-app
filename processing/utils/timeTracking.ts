const startTimes: Record<string, number> = {}
export function startTimer(timerId: string) {
  startTimes[timerId] = Date.now()
}

export function endTimer(timerId: string) {
  if (!startTimes[timerId]) {
    throw new Error(`Timer ${timerId} ended before it started`)
  }
  const timeElapsed = Date.now() - startTimes[timerId]
  delete startTimes[timerId]
  return timeElapsed
}
