import db, { UserRoleEnum } from '@/db'
import { SessionContext } from '@blitzjs/auth'
import { AuthorizationError } from 'blitz'

type GetterFn =
  | ((input: Record<string, any>) => number)
  | ((input: Record<string, any>) => Promise<number>)

export function authorizeRegionAdmin(getRegionId: GetterFn) {
  return async function authorize<T extends Record<string, any>>(
    input: T,
    ctx: { session: SessionContext },
  ): Promise<T> {
    if (!ctx.session.userId || !ctx.session.role) {
      throw new AuthorizationError()
    }

    // check if user is a super admin or...
    if (
      // await db.user.findFirst({
      //   where: {
      //     id: ctx.session.userId,
      //     role: UserRoleEnum.ADMIN,
      //   },
      // })
      ctx.session.role === UserRoleEnum.ADMIN
    ) {
      return input
    }

    const regionId = await getRegionId(input)

    if (
      await db.membership.findFirst({
        where: {
          userId: ctx.session.userId,
          regionId,
        },
        select: { id: true },
      })
    ) {
      return input
    }

    throw new AuthorizationError()
  }
}
