import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from '@blitzjs/auth'
import { setupBlitzServer } from '@blitzjs/next'
import { RpcServerPlugin } from '@blitzjs/rpc'
import { BlitzLogger } from 'blitz'
import db from 'db'
import { authConfig } from './blitz-auth-config'

export const { gSSP, gSP, api, useAuthenticatedBlitzContext, invoke } = setupBlitzServer({
  plugins: [
    AuthServerPlugin({
      ...authConfig,
      storage: PrismaStorage(db),
      isAuthorized: simpleRolesIsAuthorized,
    }),
    RpcServerPlugin({}),
  ],
  logger: BlitzLogger({}),
})
