import db, { Prisma } from 'db'
import { getBlitzContext } from '@blitzjs/auth'
import { NextRequest } from 'next/server'
import GeoJSON from 'geojson'
import { Parser } from '@json2csv/plainjs'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params
  const apiKey = request.nextUrl.searchParams.get('apiKey') as null | string
  const format = request.nextUrl.searchParams.get('format') as
    | null
    | 'raw'
    | 'points'
    | 'csv'
    | 'geojson'

  const region = await db.region.findFirst({ where: { slug } })
  if (!region) {
    return Response.json({ statusText: 'Not Found' }, { status: 404 })
  }

  const notes = await db.note.findMany({
    where: { regionId: region.id },
    orderBy: { createdAt: 'asc' },
    include: { noteComments: true },
  })

  if (apiKey !== process.env.ATLAS_API_KEY) {
    const forbidden = Response.json({ statusText: 'Forbidden' }, { status: 403 })
    const session = (await getBlitzContext()).session
    if (!session.userId) {
      return forbidden
    }
    if (session.role !== 'ADMIN') {
      const membershipExists = !!(await db.membership.count({
        where: { userId: session.userId!, region: { slug } },
      }))
      if (!membershipExists) {
        return forbidden
      }
    }
  }

  if (format === 'raw') {
    return Response.json({ notes })
  }

  const usersById = Object.fromEntries((await db.user.findMany()).map((user) => [user.id, user]))
  const getUserName = (noteOrComment: Record<string, any> & { userId: number }): string =>
    usersById[noteOrComment.userId]!.osmName || 'n/a'

  const points: {
    type: 'note' | 'comment'
    threadId: number
    id: number
    status: 'open' | 'closed' | null
    subject: string | null
    body: string | null
    author: string
    latitude: number
    longitude: number
    createdAt: Date
    lastUpdateAt: Date
  }[] = []

  notes.forEach((note) => {
    const {
      noteComments,
      id: threadId,
      resolvedAt,
      subject,
      body,
      createdAt,
      updatedAt,
      longitude,
      latitude,
    } = note
    points.push({
      type: 'note',
      threadId,
      id: threadId,
      status: !!resolvedAt ? 'closed' : 'open',
      subject,
      body,
      author: getUserName(note),
      latitude,
      longitude,
      createdAt,
      lastUpdateAt: updatedAt,
    })
    noteComments.forEach((comment) => {
      const { id, body, createdAt, updatedAt } = comment
      points.push({
        type: 'comment',
        threadId,
        id,
        status: null,
        subject: null,
        author: getUserName(comment),
        body,
        createdAt,
        lastUpdateAt: updatedAt,
        latitude,
        longitude,
      })
    })
  })

  if (format === 'points') {
    return Response.json({ points })
  }

  if (format === 'csv') {
    return new Response(new Parser().parse(points), {
      headers: {
        'Content-type': 'text/csv',
        'Content-Disposition': `attachment; filename=${slug}-notes.csv`,
      },
    })
  }

  // @ts-expect-error
  return Response.json(GeoJSON.parse(points, { Point: ['latitude', 'longitude'] }))
}
