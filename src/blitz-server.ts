import { setupBlitzServer } from '@blitzjs/next'
import { AuthServerPlugin, PrismaStorage } from '@blitzjs/auth'
import { simpleRolesIsAuthorized } from '@blitzjs/auth'
import { BlitzLogger } from 'blitz'
import db from 'db'
import { authConfig } from './blitz-client'
// import { RpcServerPlugin } from '@blitzjs/rpc'

export const {
  gSSP,
  gSP,
  api,
  // useAuthenticatedBlitzContext,
  // invoke
} = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
    // RpcServerPlugin({}),
  ],
  logger: BlitzLogger({}),
})
