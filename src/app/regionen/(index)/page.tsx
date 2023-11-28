import { Metadata } from 'next'
import { RegionListNonpublic } from './_components/RegionListNonpublic'
import { RegionListPublic } from './_components/RegionListPublic'

export const metadata: Metadata = { title: 'Regionenauswahl' }

export default async function RegionsPage() {
  return (
    <>
      {/* <RegionIntro regions={regions} /> */}
      <RegionListPublic />
      <RegionListNonpublic />
    </>
  )
}
