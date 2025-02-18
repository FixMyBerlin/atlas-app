import { isDev } from '../utils/isEnv'
import { RenderIfNotDoNotNavigateLinks } from './RenderIfNotDoNotNavigateLinks'

export function RenderIfNotDoNotNavigate({ children }: { children: React.ReactNode }) {
  const doNotNavigate = !!process.env.NEXT_PUBLIC_DO_NOT_NAVIGATE

  return isDev && doNotNavigate ? (
    <div className="flex items-center justify-between">
      <pre className="text-red-400">NEXT_PUBLIC_DO_NOT_NAVIGATE</pre>
      <RenderIfNotDoNotNavigateLinks />
    </div>
  ) : (
    children
  )
}
