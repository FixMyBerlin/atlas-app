import { NextAuthAdapter } from '@blitzjs/auth/next-auth'
import db, { User } from 'db'
import { Provider } from 'next-auth/providers'
import { api } from 'src/blitz-server'
import { Role } from 'types'

const osmApiHostOrigin = new URL(process.env.NEXT_PUBLIC_OSM_API_URL).origin

const providers: Provider[] = [
  {
    id: 'osm',
    name: 'OpenStreetMap',
    type: 'oauth',
    wellKnown: `${osmApiHostOrigin}/.well-known/openid-configuration`,
    // Docs on `scope`s: https://wiki.openstreetmap.org/wiki/OAuth#OAuth_2.0
    // Reminder: Scope changes need to happen in all Oauth-Applications (production and dev server)
    authorization: { params: { scope: 'openid read_prefs write_prefs write_notes' } },
    idToken: true,
    checks: ['pkce', 'state'],
    // @ts-expect-error
    profile(profile) {
      const { id, display_name, description, img } = profile
      return {
        id: Number(id),
        osmName: display_name as string,
        description: description as string,
        avatar: (img?.href || null) as string | null,
      }
    },
    userinfo: {
      async request({ client, tokens }) {
        const apiUrl = `${process.env.NEXT_PUBLIC_OSM_API_URL}/user/details.json`
        const response = await fetch(apiUrl, {
          credentials: 'include',
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })
        const { user } = await response.json()
        return user
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
      const inputUser = user as typeof user & {
        osmName: string
        avatar: string | null
        token: string
      }

      let newUser: User | null
      const osmId = Number(user.id)
      newUser = await db.user.findFirst({ where: { osmId } })
      if (newUser) {
        newUser = await db.user.update({
          where: { osmId },
          data: {
            osmName: inputUser.osmName,
            osmAvatar: inputUser.avatar,
          },
        })
      } else {
        newUser = await db.user.create({
          data: {
            osmId,
            osmName: inputUser.osmName,
            osmAvatar: inputUser.avatar,
            role: 'USER',
          },
        })
      }

      const publicData = {
        // (!) Keep in sync with publicData Types are in /types.ts
        userId: newUser.id,
        // osmId: newUser.osmId,
        osmName: newUser.osmName, // needed for quick loockups
        osmAvatar: newUser.osmAvatar,
        osmToken: account?.access_token!,
        role: newUser.role as Role,
      }
      await session.$create(publicData)

      // TODO MIGRATION AUTH: We pass a next URL param to the Auth but it looks like we have no way to access the request/params from here
      return { redirectUrl: '/' }
    },
  }),
)
