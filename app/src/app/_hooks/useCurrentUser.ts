import getCurrentUser from '@/src/server/users/queries/getCurrentUser'
import { useQuery } from '@blitzjs/rpc'

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
