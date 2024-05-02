import { SimpleRolesIsAuthorized } from '@blitzjs/auth'
import { User } from 'db'

export type Role = 'ADMIN' | 'USER'

declare module '@blitzjs/auth' {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      // (!) Keep in sync with session.$create in src/pages/api/auth/[...nextauth].ts
      userId: User['id']
      osmName: User['osmName']
      // osmAvatar: string | null
      osmToken: string
      role: Role // User['role']
    }
  }
}
