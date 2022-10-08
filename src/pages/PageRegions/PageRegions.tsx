import { Layout } from '@components/Layout'
import { PageregionsRegionIntro } from '@components/PageRegions'
import { PageRegionsRegionList } from '@components/PageRegions/PageRegionsRegionList'
import { useMatch } from '@tanstack/react-location'
import { LocationGenerics } from '../../routes'

export const PageRegions: React.FC = () => {
  const {
    data: { regions },
    search: { regionPathNotFound },
  } = useMatch<LocationGenerics>()

  if (regionPathNotFound) {
    return (
      <Layout>
        <p>
          <code>{regionPathNotFound}</code> konnte nicht gefunden werden.
        </p>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* <PageregionsRegionIntro regions={regions} /> */}
      <PageRegionsRegionList regions={regions} />
    </Layout>
  )
}
