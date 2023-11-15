import { NextAuthAdapter } from '@blitzjs/auth/next-auth'
import db, { User } from 'db'
import { Provider } from 'next-auth/providers'
import { api } from 'src/blitz-server'
import { Role } from 'types'

const providers: Provider[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    type: 'oauth',
    wellKnown: 'https://www.openstreetmap.org/.well-known/openid-configuration',
    authorization: { params: { scope: 'openid' } },
    idToken: true,
    checks: ['pkce', 'state'],
    profile(profile) {
      // Example: { sub: '11881', preferred_username: 'tordans' }
      const { sub, preferred_username, ...rest } = profile

      return {
        id: Number(sub),
        osmName: preferred_username as string,
        ...rest,
      }
    },
    userinfo: {
      async request({ client, tokens }) {
        return await client.userinfo(tokens.access_token!)
      },
    },
    clientId: process.env.OSM_CLIENT_ID,
    clientSecret: process.env.OSM_CLIENT_SECRET,
  },
]

// Others that use this in NextJS:
// https://github.com/developmentseed/osm-teams/blob/develop/src/pages/api/auth/%5B...nextauth%5D.js

export default api(
  NextAuthAdapter({
    successRedirectUrl: '/',
    errorRedirectUrl: '/oAuthError',
    providers,
    callback: async (user, account, profile, session) => {
      // TS: Docs are unhelpful on how to easily motify the input https://next-auth.js.org/getting-started/typescript#popular-interfaces-to-augment
      const inputUser = user as typeof user & { osmName: string }

      let newUser: User
      try {
        newUser = await db.user.findFirstOrThrow({ where: { osmId: { equals: Number(user.id) } } })
      } catch (e) {
        newUser = await db.user.create({
          data: {
            osmId: Number(inputUser.id),
            osmName: inputUser.osmName,
            role: 'USER',
          },
        })
      }

      // publicData Types are in /types.ts
      const publicData = {
        userId: newUser.id,
        // osmId: newUser.osmId,
        osmName: newUser.osmName, // needed for quick loockups
        role: newUser.role as Role,
      }
      await session.$create(publicData)

      // TODO MIGRATION AUTH: We pass a next URL param to the Auth but it looks like we have no way to access the request/params from here
      return { redirectUrl: '/' }
    },
  }),
)
