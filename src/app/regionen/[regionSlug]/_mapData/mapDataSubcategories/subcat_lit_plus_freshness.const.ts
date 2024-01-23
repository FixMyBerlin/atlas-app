import { FileMapDataSubcategory } from '../types'
import { mapboxStyleGroupLayers_atlas_lit_fresh } from './mapboxStyles/groups/atlas_lit_fresh'
import { mapboxStyleLayers } from './mapboxStyles/mapboxStyleLayers'

const subcatId = 'lit-freshness'
const source = 'atlas_roads'
const sourceLayer = 'roads'
export type SubcatLitPlusFreshnessId = typeof subcatId
export type SubcatLitPlusFreshnessStyleIds = 'default'

export const subcat_lit_plus_freshness: FileMapDataSubcategory = {
  id: subcatId,
  name: 'Aktualität',
  ui: 'checkbox',
  sourceId: source,
  styles: [
    {
      id: 'completeness',
      name: 'Aktualität',
      desc: 'Attribute in OSM können ein Prüfdatum erhalten. Dieses wird angezeigt, wenn verfügbar (> 350 Tage ist veraltet). Als zweiter Wert wird das Datum der letzten Bearbeitung der gesamten Geometrie angezeigt.',
      layers: mapboxStyleLayers({
        layers: mapboxStyleGroupLayers_atlas_lit_fresh,
        source,
        sourceLayer,
      }),
      legends: [
        {
          id: 'check_date_fresh',
          name: 'Aktuell (explizit)',
          style: {
            type: 'line',
            color: '#5bf231',
          },
        },
        {
          id: 'update_at_fresh',
          name: 'Aktuell (implizit)',
          style: {
            type: 'line',
            color: '#d10000',
            // dasharray: [7, 3],
          },
        },
        {
          id: 'check_date_outdated',
          name: 'Veraltet (explizit)',
          style: {
            type: 'line',
            color: '#dbf231',
          },
        },
        {
          id: 'update_at_outdated',
          name: 'Veraltet (implizit)',
          style: {
            type: 'line',
            color: '#7e0101',
            // dasharray: [7, 3],
          },
        },
      ],
    },
  ],
}
