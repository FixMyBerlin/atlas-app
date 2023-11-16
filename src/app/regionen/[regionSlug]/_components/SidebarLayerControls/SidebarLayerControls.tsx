import { Suspense } from 'react'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { SelectCategories } from './SelectCategories/SelectCategories'

export const SidebarLayerControls = () => {
  return (
    <section className="absolute left-0 top-0 max-h-[calc(100vh-5.5rem)] w-72 overflow-y-auto overflow-x-visible  bg-white pb-3 pt-1 shadow-md">
      <Suspense fallback={<SmallSpinner />}>
        <SelectCategories />
      </Suspense>
    </section>
  )
}
