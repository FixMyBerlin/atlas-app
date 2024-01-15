import { Suspense } from 'react'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { Categories } from './Categories/Categories'

export const SidebarLayerControls = () => {
  return (
    <section className="absolute left-0 top-0 max-h-full w-72 overflow-y-auto overflow-x-visible  bg-white pb-3 pt-1 shadow-md">
      <Suspense fallback={<SmallSpinner />}>
        <Categories />
      </Suspense>
    </section>
  )
}
