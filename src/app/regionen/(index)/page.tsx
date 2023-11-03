import { Metadata } from 'next'
import { Footer } from '../../_components/layouts/Footer/Footer'
import { PublicRegionList } from './_components/PublicRegionList'

export const metadata: Metadata = { title: 'Regionenauswahl' }

export default function RegionsPage() {
  // TODO MIGRATION AUTH: Re add list of unpublished Regions based on permissions
  // const unPublishedRegions = regions?.filter((r) => !r.published)
  // const showUnpublishedRegions = unPublishedRegions?.length // TODO

  return (
    <>
      {/* <RegionIntro regions={regions} /> */}
      <PublicRegionList />
      {/* {Boolean(showUnpublishedRegions) && (
        <div className="mt-4 bg-pink-200 py-10">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="text-bold text-xl">Unpublished Regions </h2>
            <span className="text-xs">
              (Unsichtbar auf Production; Außer für Admins, die sehen es immer)
            </span>
          </div>
          <PageRegionsRegionList regions={unPublishedRegions} />
        </div>
      )} */}
    </>
  )
}

RegionsPage.authenticate = false
