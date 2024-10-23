import { proseClasses } from '@/src/app/_components/text/prose'
import { geoDataClient } from '@/src/prisma-client'
import { getAllStatistics } from '@prisma/client/sql'
import { twJoin } from 'tailwind-merge'

export async function generateMetadata() {
  return {
    robots: 'noindex',
    title: { absolute: `STATS im Radverkehrsatlas` },
  }
}

const sumLength = (lengthMap) =>
  Object.values(lengthMap).reduce((acc: number, curr: number) => acc + curr, 0)
const stats = await geoDataClient.$queryRawTyped(getAllStatistics())
export default async function StatsPage() {
  return (
    <div className={twJoin(proseClasses, 'mx-auto max-w-prose')}>
      {stats.map((region) => {
        return (
          <div key={region.name}>
            <h1> {region.name}</h1>
            Bikelanes ({sumLength(region.bikelane_length) as number} km):
            <p>{JSON.stringify(region.bikelane_length, null, 2)}</p>
            Roads ({sumLength(region.road_length) as number} km):
            <p>{JSON.stringify(region.road_length, null, 2)}</p>
          </div>
        )
      })}
    </div>
  )
}
