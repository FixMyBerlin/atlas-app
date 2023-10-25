'use client'

import { usePaginatedQuery } from '@blitzjs/rpc'
import { Route } from 'next'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Markdown } from 'src/app/_components/text/Markdown'
import getBikelaneVerifications from 'src/bikelane-verifications/queries/getBikelaneVerifications'

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
    <div>
      <table>
        <thead>
          <tr>
            <td>id</td>
            <td>osm_type</td>
            <td>osm_id</td>
            <td>verified_at</td>
            <td>verified_by</td>
            <td>comment</td>
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

      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

AdminBikelaneVerificationsPage.authenticate = true
