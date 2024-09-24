import { AuthServerPlugin, PrismaStorage, simpleRolesIsAuthorized } from '@blitzjs/auth'
import { setupBlitzServer } from '@blitzjs/next'
import { RpcServerPlugin } from '@blitzjs/rpc'
import { BlitzLogger, NotFoundError } from 'blitz'
import db from 'db'
import { notFound } from 'next/navigation'
import { authConfig } from './blitz-auth-config'

export const { gSSP, gSP, api, useAuthenticatedBlitzContext, invoke, getBlitzContext } =
  setupBlitzServer({
    plugins: [
      AuthServerPlugin({
        ...authConfig,
        storage: PrismaStorage(db),
        isAuthorized: simpleRolesIsAuthorized,
      }),
      RpcServerPlugin({
        logging: {
          // allowList: [], // if allowList is defined then only those routes will be logged
          // blockList: [], // If blockList is defined then all routes except those will be logged
          // disablelevel: 'debug', // info|debug Represents the flag to enable/disable logging for a particular level
          // verbose: true, // enable/disable logging If verbose is true then Blitz RPC will log the input and output of each resolver
        },
        onInvokeError(error) {
          if (error instanceof NotFoundError) {
            notFound()
          }
        },
      }),
    ],
    logger: BlitzLogger({}),
  })
