import { isDev } from './isEnv'

declare global {
  interface Window {
    debug: any
  }
}

/** @desc Attach `something` as `window.debug` for debugging in the browser console. */
export const attachToWindow = (attachable: any) => {
  if (isDev) {
    window.debug = attachable
    console.log('Use `window.debug` to debug ', { type: typeof attachable, attachable })
  }
}
