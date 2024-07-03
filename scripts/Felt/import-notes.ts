#!/usr/bin/env bun

import path from 'node:path'
import { uniq } from 'lodash'
import db, { Prisma } from 'db'
import invariant from 'tiny-invariant'

// ---------- parameters ----------
const dryRun = false
const regionSlug = 'bb-sg'
const maxSubjectLength = 50
const deleteFromId: null | number = 10
const authorNameToUserId: Record<string, number | null> = {
  '': null, // set to null to ignore
  'Sabine Schmidt': 10,
  'Torsten Perner': 11,
  'Valentin Kranz': 14,
  'Pascale Christin Pawels': 15,
  Pawels: 15,
  'Pawels (LS)': 15,
}
const splitTextAt = ['&#13;', '->', ';']
// --------------------------------

const dataPath = path.join(import.meta.dir, 'data.json')
const file = Bun.file(dataPath)

const data = await file.json()

const regionId = (await db.region.findFirstOrThrow({ where: { slug: regionSlug } })).id

if (deleteFromId !== null && !dryRun) {
  await db.noteComment.deleteMany({ where: { noteId: { gte: deleteFromId } } })
  await db.note.deleteMany({ where: { id: { gte: deleteFromId } } })
}

// process.exit()

const users = await db.user.findMany({
  select: {
    id: true,
    osmId: true,
    osmName: true,
    email: true,
    firstName: true,
    lastName: true,
  },
  orderBy: { id: 'asc' },
})

function getUser(userId: number) {
  return users.find((user) => user.id === userId)
}

console.log('============================== existing users ==============================')
console.log(users)

const authorNames = uniq(
  data.map((comment) => comment.comments.map((c) => c.authorName)).flat(),
) as string[]

console.log('============================== authorName -> user ==============================')
authorNames.forEach((authorName) => {
  let info
  const userId = authorNameToUserId[authorName]
  if (userId === null) {
    info = '* ignored *'
  } else if (userId) {
    const user = getUser(userId)
    if (user) {
      info = JSON.stringify(user, null, 2)
    } else {
      info = `* user with id ${userId} not found *`
    }
  } else {
    info = '* no entry in authorNameToUserId *'
  }
  console.log(`"${authorName}": ${info}`)
})

// process.exit(0)

for (const entry of data) {
  console.log('========== data =========')
  console.log(entry)
  invariant(entry.comments.length > 0)
  let {
    location: [latitude, longitude],
    comments: [{ authorName, text, createdAt }],
    isResolved,
  } = entry
  createdAt = new Date(createdAt)
  const user = getUser(authorNameToUserId[authorName]!)
  if (!user) {
    console.log('* no user *')
    continue
  }

  let textWithLinefeeds = text
  splitTextAt.forEach((splitter) => (textWithLinefeeds = textWithLinefeeds.replace(splitter, '\n')))
  let [subject, ...body] = textWithLinefeeds.split('\n')
  subject = subject.trim().replace(/ +/g, ' ')
  body = body.join(' ').trim().replace(/ +/g, ' ')
  if (subject.length > maxSubjectLength) {
    body = '…' + subject.slice(maxSubjectLength) + body
    subject = subject.slice(0, maxSubjectLength) + '…'
  }

  const noteData = {
    createdAt,
    resolvedAt: isResolved ? createdAt : null,
    userId: user.id,
    regionId,
    subject,
    body,
    latitude,
    longitude,
  }

  console.log('---------- Note ----------')
  console.log(JSON.stringify(noteData, null, 2))

  let note
  if (!dryRun) {
    note = await db.note.create({ data: noteData })
  }

  for (let { authorName, text, createdAt } of entry.comments.slice(1)) {
    const user = getUser(authorNameToUserId[authorName]!)
    if (!user) {
      console.log('* no user *')
      continue
    }
    createdAt = new Date(createdAt)
    const noteCommentData = {
      createdAt,
      userId: user.id,
      noteId: note?.id,
      body: subject.trim().replace(/ +/g, ' '),
    }

    console.log('---------- NoteComment ----------')
    console.log(JSON.stringify(noteCommentData, null, 2))
    if (!dryRun) {
      await db.noteComment.create({ data: noteCommentData })
    }
  }

  console.log('---------- DB ----------')
  if (dryRun) {
    console.log('dry run.')
  } else {
    console.log('saved.')
  }
  console.log('')
}
