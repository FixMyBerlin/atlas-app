import React from 'react'
import { MapProvider } from 'react-map-gl'
import { Calculator } from './Calculator'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { SelectBackground } from './SelectBackground'
import { SelectTopics } from './SelectTopics'
import { SelectStyles } from './SelectStyles'
import { SelectFilters } from './SelectFilters'
import { SelectTheme } from './SelectTheme'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="flex flex-row gap-4 relative">
        <SelectTheme />
        <Map />
        <SelectBackground />
        <SelectTopics />
        <div className="space-y-10">
          <SelectStyles />
          <SelectFilters />
        </div>
        <Calculator />
        <Inspector />
      </div>
    </MapProvider>
  )
}
