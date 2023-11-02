import { CurrentUser } from 'src/users/queries/getCurrentUser'

type Props = Partial<CurrentUser> & {
  firstName?: string | null
  lastName?: string | null
}

export const getFullname = (user: Props) => {
  if (!user) return null

  return [user.firstName, user.lastName].filter(Boolean).join(' ')
}
