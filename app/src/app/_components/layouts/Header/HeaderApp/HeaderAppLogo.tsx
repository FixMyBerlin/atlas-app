import { MapIcon } from '@heroicons/react/24/outline'

export const HeaderAppLogo = () => {
  return (
    <>
      <MapIcon className="h-8 w-auto text-yellow-400" />{' '}
      <span className="ml-2 text-gray-400">Radverkehrsatlas (beta)</span>
    </>
  )
}
