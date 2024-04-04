import React, { Suspense } from 'react'
import { Spinner } from 'src/app/_components/Spinner/Spinner'
import { useMapStateInteraction } from '../../_hooks/mapStateInteraction/useMapStateInteraction'
import { Inspector } from './Inspector'
import { InspectorHeader } from './InspectorHeader'

export const SidebarInspector: React.FC = () => {
  const { getUniqueInspectorFeatures, resetInspectorFeatures } = useMapStateInteraction()
  const features = getUniqueInspectorFeatures()

  if (!features.length) return null

  return (
    <div className="absolute bottom-0 right-0 top-0 z-20 w-[35rem] overflow-y-scroll bg-white p-5 pr-3 shadow-md">
      <Suspense fallback={<Spinner />}>
        <InspectorHeader count={features.length} handleClose={() => resetInspectorFeatures()} />

        <Inspector features={features} />
      </Suspense>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .maplibregl-ctrl-top-right { right: 35rem }
          `,
        }}
      />
    </div>
  )
}
