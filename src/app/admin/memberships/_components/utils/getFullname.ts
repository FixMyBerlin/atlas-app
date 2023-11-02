import { CurrentUser } from 'src/users/queries/getCurrentUser'

type Props = Partial<CurrentUser> & {
  name?: string | null
}

export const getFullname = (user: Props) => {
  if (!user) return null
  return user.name
}
