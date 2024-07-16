import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type Props = { children: React.ReactNode }

export const Portal: React.FC<Props> = ({ children }) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  return createPortal(children, document.body)
}
