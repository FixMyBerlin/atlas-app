'use client'
import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { cookieName } from 'src/users/hooks/cookieName'

export const RemoveCookie = () => {
  useEffect(() => {
    Cookies.remove(cookieName)
  })
  return null
}
