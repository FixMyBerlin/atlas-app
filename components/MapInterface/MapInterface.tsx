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
      <div className="flex flex-row gap-4 relative h-full w-full">
        <SelectTheme />
        <Map />
        <div className="absolute bg-white/80 rounded p-3 bottom-3 left-3 max-h-screen flex overflow-y-auto">
          <SelectBackground />
          <SelectTopics />
          <div className="space-y-10">
            <SelectStyles />
            <SelectFilters />
          </div>
        </div>
        <Calculator />
        <Inspector />
      </div>
    </MapProvider>
  )
}
