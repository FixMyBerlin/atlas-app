// SOURCE
// https://github.com/maproulette/maproulette3/blob/main/src/services/Challenge/ChallengeStatus/ChallengeStatus.js#L5-L15

/**
 * Constants defining the various statuses a Challenge may be
 * in. These statuses are defined on the server
 */
const CHALLENGE_STATUS_NONE = 0 // called NA on the server
const CHALLENGE_STATUS_BUILDING = 1
const CHALLENGE_STATUS_FAILED = 2
const CHALLENGE_STATUS_READY = 3
const CHALLENGE_STATUS_PARTIALLY_LOADED = 4
const CHALLENGE_STATUS_FINISHED = 5
const CHALLENGE_STATUS_DELETING_TASKS = 6

// We can ask the server for challenges that have no status by using -1
const CHALLENGE_STATUS_EMPTY = -1

export const ChallengeStatus = Object.freeze({
  none: CHALLENGE_STATUS_NONE,
  building: CHALLENGE_STATUS_BUILDING,
  failed: CHALLENGE_STATUS_FAILED,
  ready: CHALLENGE_STATUS_READY,
  partiallyLoaded: CHALLENGE_STATUS_PARTIALLY_LOADED,
  finished: CHALLENGE_STATUS_FINISHED,
  deletingTasks: CHALLENGE_STATUS_DELETING_TASKS,
  empty: CHALLENGE_STATUS_EMPTY,
})
