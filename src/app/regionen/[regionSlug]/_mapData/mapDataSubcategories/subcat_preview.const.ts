import { FileMapDataSubcategory } from '../types'
import { defaultStyleHidden } from './defaultStyle/defaultStyleHidden'
import { debugLayerStyles } from './mapboxStyles/debugLayerStyles'

const subcatId = 'tile_preview'
const source = 'tile_preview'
const sourceLayer = 'roads' // UPDATE HERE BASED ON TILEJSON
export type SubcatPreviewId = typeof subcatId
export type SubcatPreviewStyleIds = 'default' | 'bad'

export const subcat_preview: FileMapDataSubcategory = {
  id: subcatId,
  name: 'PREVIEW',
  ui: 'dropdown',
  sourceId: source,
  styles: [
    defaultStyleHidden,
    {
      id: 'default',
      name: 'Standard',
      desc: null,
      layers: debugLayerStyles({
        source,
        sourceLayer,
      }),
    },
  ],
}
