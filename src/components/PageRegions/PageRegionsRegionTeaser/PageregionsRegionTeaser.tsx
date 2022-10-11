import { Region } from '@fakeServer/index'
import { Link } from '@tanstack/react-location'

type Props = { region: Region }

export const PageRegionsRegionTeaser: React.FC<Props> = ({ region }) => {
  return (
    <Link to={`/regionen/${region.path}`}>
      <div
        key={region.path}
        className="group relative border-r border-b border-gray-200 p-4 sm:p-6"
      >
        <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
          <span className="h-full w-full object-cover object-center">
            {region.logo}
          </span>
        </div>
        <div className="pt-10 pb-4 text-center">
          <h3 className="text-sm font-medium text-gray-900">
            <span aria-hidden="true" className="absolute inset-0" />
            {region.name}
          </h3>
          <div className="mt-3 flex flex-col items-center">
            <p className="sr-only">{region.path} out of 5 stars</p>
            <div className="flex items-center">Icons</div>
            <p className="mt-1 text-sm text-gray-500">{region.path} reviews</p>
          </div>
          <p className="mt-4 text-base font-medium text-gray-900">
            {region.path}
          </p>
        </div>
      </div>
    </Link>
  )
}
