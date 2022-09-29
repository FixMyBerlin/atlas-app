import { LayoutHeightScreenWithGeschichte } from '@/components/Layout/LayoutHeightScreenWithGeschichte'
import { MapInterface } from '@/components/MapInterface'
import type { NextPageWithLayout } from './_app'
import Head from 'next/head'

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>OSM Data viewer</title>
        <meta name="description" content="TODO" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <MapInterface />
    </>
  )
}

Home.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <LayoutHeightScreenWithGeschichte>{page}</LayoutHeightScreenWithGeschichte>
  )
}

export default Home
