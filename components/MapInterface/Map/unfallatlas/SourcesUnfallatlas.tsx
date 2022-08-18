import React from 'react'
import { Layer, Source } from 'react-map-gl'
import { useStore } from 'zustand'
import { useStoreMap } from '../../store'
import { useQuery } from '../../store/geschichte'
import { getSourceVisibility } from '../utils'

export const SourcesUnfallatlas: React.FC = () => {
  // Default public token https://account.mapbox.com/
  const token =
    'pk.eyJ1IjoiaGVqY28iLCJhIjoiY2piZjd2bzk2MnVsMjJybGxwOWhkbWxpNCJ9.L1UNUPutVJHWjSmqoN4h7Q' // todo

  const {
    values: { selectedSources },
  } = useQuery()
  const { selectedFilters } = useStore(useStoreMap)
  const visibility = getSourceVisibility(selectedSources, 'unfallatlas')

  // Data https://studio.mapbox.com/tilesets/hejco.86v96gzk/#17.29/52.564196/13.327916
  // Style https://studio.mapbox.com/styles/hejco/cl6upu3zo000015o3im4kug1n/edit/#17.29/52.564196/13.327916

  const filterByYear = ['match', ['get', 'UJAHR'], selectedFilters, true, false]

  return (
    <Source
      id="unfallatlas"
      type="vector"
      tiles={[
        `https://api.mapbox.com/v4/hejco.5oexnrgf/{z}/{x}/{y}.vector.pbf?sku=101bSz70Afq22&access_token=${token}`, // todo
      ]}
      minzoom={14}
      maxzoom={22}
    >
      <Layer
        id="unfallatlas_points"
        type="circle"
        source="unfallatlas"
        source-layer="unfaelle_mit_personschaden-4zh9z7"
        layout={{ visibility }}
        filter={[
          'all',
          ['match', ['get', 'Unfallkate'], ['1', '2', '3'], true, false],
          filterByYear,
        ]}
        paint={{
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15,
            1,
            19,
            4,
            20,
            10,
          ],
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15.5,
            0,
            17,
            0.8,
          ],
          'circle-stroke-color': [
            'match',
            ['get', 'Unfallkate'],
            ['1'],
            'hsl(325, 91%, 43%)',
            ['2'],
            'hsl(0, 74%, 43%)',
            ['3'],
            'hsl(22, 85%, 60%)',
            'hsl(0, 0%, 100%)',
          ],
          'circle-color': [
            'match',
            ['get', 'Unfalltyp'],
            ['2'],
            'hsl(60, 98%, 66%)',
            ['3'],
            'hsl(0, 100%, 52%)',
            ['1'],
            'hsl(152, 79%, 30%)',
            ['5'],
            'hsl(203, 100%, 43%)',
            ['6'],
            'hsl(38, 94%, 56%)',
            ['7'],
            '#3f4948',
            'hsl(0, 0%, 100%)',
          ],
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            18,
            ['match', ['get', 'Unfallkate'], ['2', '1'], 2.5, 2],
            20,
            ['match', ['get', 'Unfallkate'], ['1', '2'], 7, 5],
          ],
          'circle-stroke-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            15.5,
            0,
            17,
            1,
          ],
        }}
      />
      <Layer
        id="unfallatlas_labels"
        type="symbol"
        source="unfallatlas"
        source-layer="unfaelle_mit_personschaden-4zh9z7"
        filter={[
          'all',
          ['match', ['get', 'Unfallkate'], ['1', '2', '3'], true, false],
          filterByYear,
        ]}
        layout={{
          visibility,
          'text-field': ['to-string', ['get', 'UJAHR']],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            16,
            8,
            18,
            12,
            20,
            20,
          ],
          'text-anchor': 'bottom',
          'text-offset': [0, -0.6],
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Regular'],
          'text-letter-spacing': 0.01,
        }}
        paint={{
          'text-color': [
            'match',
            ['get', 'Unfallkate'],
            ['1'],
            '#d10a7e',
            ['2'],
            '#bf1d1d',
            'hsl(0, 0%, 51%)',
          ],
          'text-halo-color': 'hsl(51, 5%, 100%)',
          'text-halo-blur': 0.5,
          'text-opacity': ['interpolate', ['linear'], ['zoom'], 17, 0, 17.3, 1],
          'text-halo-width': 1,
        }}
      />
    </Source>
  )
}
