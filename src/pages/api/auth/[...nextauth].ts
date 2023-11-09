import { api } from 'src/blitz-server'
import { NextAuthAdapter } from '@blitzjs/auth/next-auth'
import db, { User } from 'db'
import { Role } from 'types'

const providers = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    type: 'oauth',
    wellKnown: 'https://www.openstreetmap.org/.well-known/openid-configuration',
    authorization: { params: { scope: 'openid' } },
    idToken: true,
    checks: ['pkce', 'state'],
    profile(profile) {
      const { sub, preferred_username, ...rest } = profile
      return {
        id: Number(sub),
        name: preferred_username as string,
        ...rest,
      }
    },
    userinfo: {
      async request({ client, tokens }) {
        return await client.userinfo(tokens.access_token)
      },
    },
    clientId: process.env.OSM_CLIENT_ID,
    clientSecret: process.env.OSM_CLIENT_SECRET,
  },
]

export default api(
  NextAuthAdapter({
    successRedirectUrl: '/',
    errorRedirectUrl: '/error',
    // @ts-ignore TODO: make this work
    providers,
    callback: async (user, account, profile, session) => {
      let newUser: User
      try {
        newUser = await db.user.findFirstOrThrow({ where: { osmId: { equals: Number(user.id) } } })
      } catch (e) {
        newUser = await db.user.create({
          data: {
            osmId: Number(user.id),
            name: user.name,
            role: 'USER',
          },
        })
      }
      const publicData = {
        userId: newUser.id,
        name: newUser.name,
        role: newUser.role as Role,
        source: 'osm',
      }
      await session.$create(publicData)
      // TODO MIGRATION AUTH: We pass a next URL param to the Auth but it looks like we have no way to access the request/params from here
      return { redirectUrl: '/' }
    },
  }),
)
