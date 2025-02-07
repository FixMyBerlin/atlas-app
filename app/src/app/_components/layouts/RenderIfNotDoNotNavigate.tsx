import { isDev } from '../utils/isEnv'

export function RenderIfNotDoNotNavigate({ children }: { children: React.ReactNode }) {
  const doNotNavigate = !!process.env.NEXT_PUBLIC_DO_NOT_NAVIGATE
  return isDev && doNotNavigate ? (
    <pre className="text-red-400">NEXT_PUBLIC_DO_NOT_NAVIGATE</pre>
  ) : (
    children
  )
}
