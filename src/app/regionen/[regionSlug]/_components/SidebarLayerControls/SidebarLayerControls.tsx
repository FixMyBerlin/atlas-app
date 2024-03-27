import { Suspense } from 'react'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { Categories } from './Categories/Categories'
import { StaticDatasetCategories } from './StaticDatasets/StaticDatasetCategories'

export const SidebarLayerControls = () => {
  return (
    <section className="absolute left-0 top-0 max-h-full w-72 overflow-y-auto overflow-x-visible bg-white py-px shadow-md">
      <Suspense fallback={<SmallSpinner />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<SmallSpinner />}>
        <StaticDatasetCategories />
      </Suspense>
    </section>
  )
}
