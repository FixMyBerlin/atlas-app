import { LinkExternal } from '@/src/app/_components/links/LinkExternal'
import { invoke } from '@/src/blitz-server'
import getAllStats from '@/src/statistics/queries/getAllStats'

const sumLength = (lengthMap) =>
  Object.values(lengthMap).reduce((acc: number, curr: number) => acc + curr, 0)

export default async function StatsPage() {
  const stats = await invoke(getAllStats, {})
  return (
    <main className="prose z-0 mx-auto my-10 max-w-prose flex-grow">
      <div className="pb-8">
        <h1>Download</h1>
        <LinkExternal
          href="/api/stats"
          classNameOverwrite="w-28 flex-none rounded-md border border-gray-300 bg-gray-50 px-3 py-2 shadow-sm hover:bg-yellow-50 focus:ring-1 focus:ring-yellow-500"
          download
          blank
        >
          <strong className="mb-0.5 text-xs font-medium text-gray-900">Download</strong>
        </LinkExternal>
      </div>

      {stats &&
        stats
          .sort((a, b) => Number(a.level) - Number(b.level))
          .map((region) => {
            return (
              <div key={region.name}>
                <h1> {region.name}</h1>
                <h2 className="text-gray-900">{`admin_level=${region.level}`}</h2>
                Bikelanes ({sumLength(region.bikelane_length) as number} km):
                <p>{JSON.stringify(region.bikelane_length, null, 2)}</p>
                Roads ({sumLength(region.road_length) as number} km):
                <p>{JSON.stringify(region.road_length, null, 2)}</p>
              </div>
            )
          })}
    </main>
  )
}
