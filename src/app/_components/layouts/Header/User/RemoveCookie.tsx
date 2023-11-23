'use client'

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { cookieName } from './cookieName'

export const RemoveCookie = () => {
  useEffect(() => {
    Cookies.remove(cookieName)
  })
  return null
}
