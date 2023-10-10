'use client'

export type PrimaryNavigation = {
  name: string
  href: string
}

export type SecondaryNavigation = {
  name: string
  href: string
}

export type PrimaryNavigationProps = {
  primaryNavigation: PrimaryNavigation[]
  secondaryNavigation: SecondaryNavigation[][]
}
