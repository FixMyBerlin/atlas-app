import { Suspense } from 'react'
import Head from 'next/head'
import { usePaginatedQuery } from '@blitzjs/rpc'
import { useRouter } from 'next/router'
import Layout from 'src/core/layouts/Layout'
import getBikelaneVerifications from 'src/bikelane-verifications/queries/getBikelaneVerifications'

const ITEMS_PER_PAGE = 100

export const BikelaneVerificationsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ bikelaneVerifications, hasMore }] = usePaginatedQuery(getBikelaneVerifications, {
    orderBy: { id: 'asc' },
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
            <td>verified</td>
            <td>comment</td>
          </tr>
        </thead>
        <tbody>
          {bikelaneVerifications.map((row) => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.osm_type}</td>
              <td>{Number(row.osm_id)}</td>
              <td>verified_at</td>
              <td>verified_by</td>
              <td>{row.verified}</td>
              <td>{row.comment}</td>
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

const BikelaneVerificationsPage = () => {
  return (
    <Layout>
      <Head>
        <title>BikelaneVerifications</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <BikelaneVerificationsList />
        </Suspense>
      </div>
    </Layout>
  )
}

export default BikelaneVerificationsPage
