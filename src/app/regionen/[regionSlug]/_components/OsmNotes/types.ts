export type OsmNotesComment = {
  date: string
  action: 'opened' | 'commented' | 'closed'
  // Apparently can be blank, see https://github.com/openstreetmap/openstreetmap-website/blob/master/app/views/api/notes/_note.xml.builder#L30-L33
  text?: string
  html: string
  // Optional author fields, see https://github.com/openstreetmap/openstreetmap-website/blob/master/app/views/api/notes/_note.xml.builder#L22-L26
  uid?: number
  user?: string | undefined
  user_url?: `https://api.openstreetmap.org/user/${string}`
}

// Those are our feature.properties
export type OsmNotesThread = {
  id: number
  url: `https://api.openstreetmap.org/api/0.6/notes/${number}`
  comment_url: `https://api.openstreetmap.org/api/0.6/notes/${number}/comment`
  close_url: `https://api.openstreetmap.org/api/0.6/notes/${number}/close`
  date_created: string
  status: 'open' | 'closed'
  comments: OsmNotesComment[]
}
