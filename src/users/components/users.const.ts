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
    id: 18717122,
    displayName: 'rush42',
    isAdmin: true,
  },
  {
    // Bezirksamt Xhain
    id: 12741863,
    displayName: 'BAFK_St',
    isAdmin: false,
  },
  {
    // TrTo
    // https://www.openstreetmap.org/reports/new?reportable_id=18058212&reportable_type=User
    id: 18058212,
    displayName: 'Tüffi',
    isAdmin: false,
  },
  {
    // TrTo
    // https://www.openstreetmap.org/reports/new?reportable_id=18058219&reportable_type=User
    id: 18058219,
    displayName: 'Manner84',
    isAdmin: false,
  },
  // See https://github.com/FixMyBerlin/private-issues/issues/886
  {
    id: 12518419,
    displayName: 'mlanae',
    isAdmin: false,
  },
  // See https://github.com/FixMyBerlin/private-issues/issues/886
  {
    id: 347746,
    displayName: 'biker82',
    isAdmin: false,
  },
  // OSM Community, Magdeburg, OSM Hackweekenc 2023-10
  {
    id: 13565,
    displayName: 'hadhuey',
    isAdmin: false,
  },
]
