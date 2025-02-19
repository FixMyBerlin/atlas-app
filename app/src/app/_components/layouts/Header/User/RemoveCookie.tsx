'use client'
import { cookieName } from '@/src/server/auth/cookieName'
import Cookies from 'js-cookie'
import { useEffect } from 'react'

export const RemoveCookie = () => {
  useEffect(() => {
    Cookies.remove(cookieName)
  })
  return null
}
