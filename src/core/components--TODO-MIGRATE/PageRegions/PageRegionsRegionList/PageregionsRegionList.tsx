import { Region } from 'src/users/components/fakeServer/index'
import { PageRegionsRegionTeaser } from '../PageRegionsRegionTeaser'

type Props = { regions: Region[] | undefined }

export const PageRegionsRegionList: React.FC<Props> = ({ regions }) => {
  if (!regions) return <h1>Loading…</h1>

  return (
    <div className="bg-transparent">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className="my-10 grid grid-cols-2 border-t border-l border-gray-200 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {regions.map((region) => (
            <PageRegionsRegionTeaser key={region.path} region={region} />
          ))}
        </div>
      </div>
    </div>
  )
}
