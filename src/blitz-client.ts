import { AuthClientPlugin } from '@blitzjs/auth'
import { setupBlitzClient } from '@blitzjs/next'
import { BlitzRpcPlugin } from '@blitzjs/rpc'

export const authConfig = {
  cookiePrefix: 'atlas',
}

export const { withBlitz, BlitzProvider } = setupBlitzClient({
  plugins: [AuthClientPlugin(authConfig), BlitzRpcPlugin({})],
})
