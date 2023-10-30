import { useQuery } from '@blitzjs/rpc'
import getCurrentUser, { CurrentUser } from 'src/users/queries/getCurrentUser'

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
