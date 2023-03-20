type User = {
  id: number
  displayName: string
  isAdmin: boolean
}

// This is our users "Database" until we have a real one
// One way to find the osm user ID is http://whosthat.osmz.ru/?q=tordans
// But that database takes time to update.
// A better way is…
// 1. Open User Profile https://www.openstreetmap.org/user/boooshii (not your own)
// 2. "Report this User"
// 3. Copy the user ID from `reportable_id=9142806` (from the URL)
export const users: User[] = [
  {
    id: 9142806,
    displayName: 'boooshii',
    isAdmin: true,
  },
  {
    id: 11881,
    displayName: 'tordans',
    isAdmin: true,
  },
  {
    id: 17391407,
    displayName: 'elsueno',
    isAdmin: true,
  },
  {
    id: 155680,
    displayName: 'Henri97',
    isAdmin: true,
  },
  {
    id: 7302664,
    displayName: 'hejco',
    isAdmin: true,
  },
  {
    // http://whosthat.osmz.ru/?q=BAFK_St
    // Bezirksamt Xhain
    id: 12741863,
    displayName: 'BAFK_St',
    isAdmin: false,
  },
  {
    // http://whosthat.osmz.ru/?q=rush42
    id: 18717122,
    displayName: 'rush42',
    isAdmin: true,
  },
]
