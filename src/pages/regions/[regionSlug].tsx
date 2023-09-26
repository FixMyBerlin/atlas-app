import { Suspense } from 'react'
import { Routes } from '@blitzjs/next'
import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useQuery, useMutation } from '@blitzjs/rpc'
import { useParam } from '@blitzjs/next'

import Layout from 'src/core/layouts/Layout'
import getRegion from 'src/regions/queries/getRegion'
import deleteRegion from 'src/regions/mutations/deleteRegion'

export const Region = () => {
  const router = useRouter()
  const regionSlug = useParam('regionSlug', 'number')
  const [deleteRegionMutation] = useMutation(deleteRegion)
  const [region] = useQuery(getRegion, { id: regionSlug })

  return (
    <>
      <Head>
        <title>Region {region.id}</title>
      </Head>

      <div>
        <h1>Region {region.id}</h1>
        <pre>{JSON.stringify(region, null, 2)}</pre>

        <Link href={Routes.EditRegionPage({ rg: region.id })}>Edit</Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm('This will be deleted')) {
              await deleteRegionMutation({ id: region.id })
              await router.push(Routes.RegionsPage())
            }
          }}
          style={{ marginLeft: '0.5rem' }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowRegionPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.RegionsPage()}>Regions</Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Region />
      </Suspense>
    </div>
  )
}

ShowRegionPage.authenticate = true
ShowRegionPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowRegionPage
