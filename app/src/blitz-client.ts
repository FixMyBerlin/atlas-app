'use client'
import { AuthClientPlugin } from '@blitzjs/auth'
import { setupBlitzClient } from '@blitzjs/next'
import { BlitzRpcPlugin } from '@blitzjs/rpc'
import { authConfig } from './server/auth/blitz-auth-config.const'

export const { withBlitz, BlitzProvider } = setupBlitzClient({
  plugins: [AuthClientPlugin(authConfig), BlitzRpcPlugin({})],
})
