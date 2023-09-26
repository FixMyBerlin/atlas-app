import { Layout } from 'src/core/components--TODO-MIGRATE/Layout'
import { useUserStore } from 'src/core/components--TODO-MIGRATE/MapInterface/UserInfo/useUserStore'
import { PageRegionsRegionList } from 'src/core/components--TODO-MIGRATE/PageRegions/PageRegionsRegionList'
import { isDev, isStaging } from 'src/core/components--TODO-MIGRATE/utils'
import { isAdmin } from '@fakeServer/utils'
import { useMatch } from '@tanstack/react-location'
import { LocationGenerics } from '../../routes'

export const PageRegions: React.FC = () => {
  const {
    data: { regions },
    search: { regionPathNotFound },
  } = useMatch<LocationGenerics>()

  const { currentUser } = useUserStore()

  if (regionPathNotFound) {
    return (
      <Layout>
        <p>
          <code>{regionPathNotFound}</code> konnte nicht gefunden werden.
        </p>
      </Layout>
    )
  }

  const publishedRegions = regions?.filter((r) => r.published)
  const unPublishedRegions = regions?.filter((r) => !r.published)
  const showUnpublishedRegions =
    unPublishedRegions?.length && ((currentUser && isAdmin(currentUser)) || isDev || isStaging)

  return (
    <Layout>
      {/* <PageregionsRegionIntro regions={regions} /> */}
      <PageRegionsRegionList regions={publishedRegions} />
      {showUnpublishedRegions && (
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
    </Layout>
  )
}
