import { Route } from 'next'

export type PrimaryNavigation = {
  name: string
  href: Route
}

export type SecondaryNavigation = {
  name: string
  href: Route
}

export type PrimaryNavigationProps = {
  primaryNavigation: PrimaryNavigation[]
  secondaryNavigation: SecondaryNavigation[][]
}
