'use client'
import { useEffect, useState } from 'react'
import { LinkExternal } from '../links/LinkExternal'
import { getAdminInfoEnvUrl } from './Header/User/utils/getAdminInfoEnvUrl'

export const RenderIfNotDoNotNavigateLinks = () => {
  const [stagingUrl, setStagingUrl] = useState<string | undefined>(undefined)
  const [prodUrl, setProdUrl] = useState<string | undefined>(undefined)

  // This construct is to work around hydration erros
  // There is probably a cleaner way to do this by reworking the get*Url helper
  // They access the URL bar ATM but there is probably some NextJS way to do this…
  useEffect(() => {
    setStagingUrl(getAdminInfoEnvUrl('staging'))
    setProdUrl(getAdminInfoEnvUrl('production'))
  }, [])

  return (
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
  )
}
