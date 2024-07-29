import { useEffect, useState } from 'react'

// https://tailwindcss.com/docs/screens
const screens = {
  sm: '640px', // => @media (min-width: 640px) { ... }
  md: '768px', // => @media (min-width: 768px) { ... }
  lg: '1024px', // => @media (min-width: 1024px) { ... }
  xl: '1280px', // => @media (min-width: 1280px) { ... }
  '2xl': '1536px', // => @media (min-width: 1536px) { ... }
}

export const useBreakpoint = (breakpoint: keyof typeof screens) => {
  const [isBreakpointOrAbove, setIsBreakpointOrAbove] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(min-width: ${screens[breakpoint]})`)
    setIsBreakpointOrAbove(mediaQuery.matches)

    const onMediaQueryChange = (event: MediaQueryListEvent) => {
      setIsBreakpointOrAbove(event.matches)
    }
    mediaQuery.addEventListener('change', onMediaQueryChange)

    return () => mediaQuery.removeEventListener('change', onMediaQueryChange)
  }, [breakpoint])

  return isBreakpointOrAbove
}
