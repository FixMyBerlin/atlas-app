import { useQuery } from '@blitzjs/rpc'
import { Suspense } from 'react'
import { Spinner } from 'src/core/components/Spinner/Spinner'
import { Layout } from 'src/core/layouts/Layout'
import { PageRegionsRegionList } from 'src/regions/components/PageRegions/PageRegionsRegionList'
import getPublicRegions from 'src/regions/queries/getPublicRegions'
import getCurrentUser from 'src/users/queries/getCurrentUser'

export const RegionsList = () => {
  const [regions] = useQuery(getPublicRegions, {})

  // TODO MIGRATION: This part can be solved better in Blitz, now…
  // const router = useRouter()
  // if (router.query.regionPathNotFound) {
  //   return (
  //     <Layout>
  //       <p>
  //         <code>{router.query.regionPathNotFound}</code> konnte nicht gefunden werden.
  //       </p>
  //     </Layout>
  //   )
  // }

  // TODO MIGRATION: Re add list of unpublished Regions based on permissions
  const unPublishedRegions = regions?.filter((r) => !r.published)
  const showUnpublishedRegions = unPublishedRegions?.length // TODO

  return (
    <>
      {/* <PageregionsRegionIntro regions={regions} /> */}
      <PageRegionsRegionList regions={regions} />
      {Boolean(showUnpublishedRegions) && (
        <div className="mt-4 bg-pink-200 py-10">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="text-bold text-xl">Unpublished Regions </h2>
            <span className="text-xs">
              (Unsichtbar auf Production; Außer für Admins, die sehen es immer)
            </span>
          </div>
          <PageRegionsRegionList regions={unPublishedRegions} />
        </div>
      )}
    </>
  )
}

const RegionsPage = () => {
  return (
    <Layout>
      {/* TODO MIGRATION: add title tag logic */}
      <Suspense fallback={<Spinner />}>
        <RegionsList />
      </Suspense>
    </Layout>
  )
}

RegionsPage.authenticate = false
export default RegionsPage
