'use client'

import { usePaginatedQuery } from '@blitzjs/rpc'
import { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { buttonStyles } from 'src/app/_components/links/styles'
import { Markdown } from 'src/app/_components/text/Markdown'
import getBikelaneVerifications from 'src/bikelane-verifications/queries/getBikelaneVerifications'
import { Breadcrumb } from '../_components/Breadcrumb'
import { HeaderWrapper } from '../_components/HeaderWrapper'

const ITEMS_PER_PAGE = 100

export default function AdminBikelaneVerificationsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const page = Number(useSearchParams()?.get('page')) || 0
  const [{ verifications, hasMore }] = usePaginatedQuery(getBikelaneVerifications, {
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => pathname && router.push(`${pathname}?page=${page - 1}` as Route)
  const goToNextPage = () => pathname && router.push(`${pathname}?page=${page + 1}` as Route)

  return (
    <>
      <HeaderWrapper>
        <Breadcrumb pages={[{ href: '/admin/verifications', name: 'Prüfungen' }]} />
      </HeaderWrapper>

      <table className="overflow-clip rounded bg-white/50">
        <thead>
          <tr className="bg-white/90">
            <th>id</th>
            <th>osm_type</th>
            <th>osm_id</th>
            <th>verified_at</th>
            <th>verified_by</th>
            <th>status</th>
            <th>comment</th>
          </tr>
        </thead>
        <tbody>
          {verifications.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.osm_type}</td>
              <td>{Number(row.osm_id)}</td>
              <td>{row.verified_at.toLocaleDateString()}</td>
              <td>{Number(row.verified_by)}</td>
              <td>{row.verified}</td>
              <td>
                <Markdown markdown={row.comment} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button disabled={page === 0} onClick={goToPreviousPage} className={buttonStyles}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage} className={buttonStyles}>
        Next
      </button>
    </>
  )
}

AdminBikelaneVerificationsPage.authenticate = { role: 'ADMIN' }
