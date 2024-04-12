import { memo, Suspense } from 'react'
import useResizeObserver from 'use-resize-observer'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { Categories } from './Categories/Categories'
import { StaticDatasetCategories } from './StaticDatasets/StaticDatasetCategories'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'

export const SidebarLayerControlsMemoized = memo(function SidebarLayerControlsMemoized(props: any) {
  const { setSidebarLayerControlsSize } = props

  const { ref } = useResizeObserver<HTMLDivElement>({
    box: 'border-box',
    onResize: setSidebarLayerControlsSize,
  })

  return (
    <section
      ref={ref}
      className="absolute left-0 top-0 z-10 max-h-full w-72 overflow-y-auto overflow-x-visible bg-white py-px shadow-md"
    >
      <Suspense fallback={<SmallSpinner />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<SmallSpinner />}>
        <StaticDatasetCategories />
      </Suspense>
    </section>
  )
})

export const SidebarLayerControls = () => {
  const { setSidebarLayerControlsSize } = useMapStateInteraction()
  const props = { setSidebarLayerControlsSize }
  return <SidebarLayerControlsMemoized {...props} />
}
