import { envKey } from '../../utils/isEnv'

// This can happen if the build does not know about `NEXT_PUBLIC_APP_ORIGIN`
export const MissingEnvError = () => {
  if (envKey) return null

  return (
    <div
      className="absolute bottom-2 left-2 rounded bg-red-500 p-5 font-semibold text-white"
      style={{ zIndex: 1005 }}
    >
      Error: <code>envKey</code> is not set.
      <br />
      <pre>NEXT_PUBLIC_APP_ENV={process.env.NEXT_PUBLIC_APP_ENV}</pre>
      <pre>NEXT_PUBLIC_APP_ORIGIN={process.env.NEXT_PUBLIC_APP_ORIGIN}</pre>
      <pre>NODE_ENV={process.env.NODE_ENV}</pre>
    </div>
  )
}
