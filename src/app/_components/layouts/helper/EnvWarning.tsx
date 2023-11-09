import { envKey } from '../../utils/isEnv'

export const EnvWarning = () => {
  if (envKey) return null

  return (
    <div className="absolute left-2 top-2 z-20 rounded bg-red-500 p-10 font-semibold text-white">
      Warning: <code>envKey</code> is undefined.
    </div>
  )
}
