import * as turf from '@turf/turf'
import { useMap } from 'react-map-gl/maplibre'
import { buttonStyles } from 'src/app/_components/links/styles'
import {
  StoreFeaturesInspector,
  useMapStateInteraction,
} from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import {
  useNewOsmNoteMapParam,
  useOsmNotesParam,
} from '../../../_hooks/useQueryState/useOsmNotesParam'
import { pointFromGeometry } from './osmUrls/pointFromGeometry'

type Props = {
  properties: StoreFeaturesInspector['inspectorFeatures'][number]['properties']
  geometry: StoreFeaturesInspector['inspectorFeatures'][number]['geometry']
}

export const ToolsLinkNewOsmNote = ({ properties, geometry }: Props) => {
  const { mainMap } = useMap()
  const { setOsmNotesParam } = useOsmNotesParam()
  const { setOsmNewNoteFeature } = useMapStateInteraction()
  const { setNewOsmNoteMapParam } = useNewOsmNoteMapParam()

  const [lng, lat] = pointFromGeometry(geometry)

  if (!mainMap || !lng || !lat || !properties || !geometry) return null

  return (
    <button
      className={buttonStyles}
      onClick={() => {
        setOsmNotesParam(true)
        setOsmNewNoteFeature(turf.feature(geometry, properties))
        // Note: The zoom will be specified by the `bounds` prop in <OsmNotesNewMap/>
        setNewOsmNoteMapParam({ zoom: 12, lng, lat })
      }}
    >
      Hinweis zu diesem Kartenobjekt erstellen
    </button>
  )
}
