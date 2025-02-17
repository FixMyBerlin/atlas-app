import { LinkExternal } from '../links/LinkExternal'
import { isDev } from '../utils/isEnv'
import { getAdminInfoEnvUrl } from './Header/User/utils/getAdminInfoEnvUrl'

export function RenderIfNotDoNotNavigate({ children }: { children: React.ReactNode }) {
  const doNotNavigate = !!process.env.NEXT_PUBLIC_DO_NOT_NAVIGATE
  const stagingUrl = getAdminInfoEnvUrl('staging')
  const prodUrl = getAdminInfoEnvUrl('production')

  return isDev && doNotNavigate ? (
    <div className="flex items-center justify-between">
      <pre className="text-red-400">NEXT_PUBLIC_DO_NOT_NAVIGATE</pre>
      <div className="space-x-4 text-white">
        {stagingUrl && (
          <LinkExternal blank href={stagingUrl}>
            Open Staging
          </LinkExternal>
        )}
        {prodUrl && (
          <LinkExternal blank href={prodUrl}>
            Open Production
          </LinkExternal>
        )}
      </div>
    </div>
  ) : (
    children
  )
}
