import { Metadata } from 'next'
import { RegionListAdmins } from './_components/RegionListAdmins'
import { RegionListPermissions } from './_components/RegionListPermissions'
import { RegionListPublic } from './_components/RegionListPublic'

export const metadata: Metadata = { title: 'Regionenauswahl' }

export default async function RegionsPage() {
  return (
    <>
      {/* <RegionIntro regions={regions} /> */}
      <RegionListPermissions />
      <RegionListPublic />
      <RegionListAdmins />
    </>
  )
}
