'use client'

import { useMutation, useQuery } from '@blitzjs/rpc'
import { useRouter } from 'next/navigation'
import { Link } from 'src/app/_components/links/Link'
import { linkStyles } from 'src/app/_components/links/styles'
import { Pill } from 'src/app/_components/text/Pill'
import deleteMembership from 'src/memberships/mutations/deleteMembership'
import getUsersAndMemberships from 'src/users/queries/getUsersAndMemberships'
import { Breadcrumb } from '../_components/Breadcrumb'
import { HeaderWrapper } from '../_components/HeaderWrapper'
import { getFullname } from './_components/utils/getFullname'

export default function AdminMembershipsPage() {
  const [{ users: userAndMemberships }] = useQuery(getUsersAndMemberships, {})

  const router = useRouter()
  const [deleteMembershipMutation] = useMutation(deleteMembership)
  const handleDelete = async (
    membership: (typeof userAndMemberships)[number]['Membership'][number],
  ) => {
    if (
      window.confirm(
        `Den Eintrag mit ID ${membership.id} auf Projekt ${membership.region.slug} unwiderruflich löschen?`,
      )
    ) {
      await deleteMembershipMutation({ id: membership.id })
      router.push('/admin/memberships')
    }
  }

  return (
    <>
      <HeaderWrapper>
        <Breadcrumb pages={[{ href: '/admin/memberships', name: 'Nutzer & Mitgliedschaften' }]} />
      </HeaderWrapper>

      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold sm:pl-6">
              User
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold sm:pr-6">
              Projekt
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {userAndMemberships.map((user) => {
            return (
              <tr key={user.id}>
                <td className="h-20 py-4 pl-4 pr-3 text-sm sm:pl-6">
                  <strong>{getFullname(user)}</strong>
                  {user.role === 'ADMIN' && (
                    <Pill color="yellow" className="ml-1">
                      Admin
                    </Pill>
                  )}
                  <br />
                  {user.email}
                  <br />
                  OSM ID: {user.osmId}
                </td>
                <td className="h-20 py-4 pl-4 pr-3 text-sm sm:pr-6">
                  {user?.Membership?.length === 0 && <>Bisher keine Rechte</>}
                  {user?.Membership?.map((membership) => {
                    return (
                      <div key={membership.id} className="flex justify-between">
                        <Link blank href={`/regionen/${membership.region.slug}`}>
                          {membership.region.slug}
                        </Link>

                        <button onClick={() => handleDelete(membership)} className={linkStyles}>
                          Delete
                        </button>
                      </div>
                    )
                  })}
                  <div className="mt-2 border-t pt-2">
                    <Link
                      href={`/admin/memberships/new?${new URLSearchParams({
                        userId: String(user.id),
                      })}`}
                    >
                      Rechte
                    </Link>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}

// AdminMembershipsPage.authenticate = { role: 'ADMIN' }
