import { Suspense } from 'react'
import Head from 'next/head'
import { usePaginatedQuery } from '@blitzjs/rpc'
import { useRouter } from 'next/router'
import { Layout } from 'src/core/layouts/Layout'
import getBikelaneVerifications from 'src/bikelane-verifications/queries/getBikelaneVerifications'
import { Markdown } from '@components/text'

const ITEMS_PER_PAGE = 100

export const AdminBikelaneVerificationsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ verifications, hasMore }] = usePaginatedQuery(getBikelaneVerifications, {
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

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

const AdminBikelaneVerificationsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Eine liste aller (bikelane) Verifications</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <AdminBikelaneVerificationsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default AdminBikelaneVerificationsPage
