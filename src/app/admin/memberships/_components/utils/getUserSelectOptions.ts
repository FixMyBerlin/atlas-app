import { User } from '@prisma/client'
import { Prettify } from 'src/app/_components/types/types'
import { getFullname } from './getFullname'

export type UserSelectOptions = Prettify<(Partial<User> & Required<Pick<User, 'id' | 'email'>>)[]>

export const getUserSelectOptions = (users: UserSelectOptions) => {
  const result: [number | string, string][] = [['', '(Keine Auswahl)']]
  users.forEach((u) => {
    result.push([u.id, [getFullname(u), `<${u.email}>`].join(' ')])
  })
  return result
}
