import React from 'react'
import { MapProvider } from 'react-map-gl'
import { Calculator } from './Calculator'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { SelectBackground } from './SelectBackground'
import { SelectSources } from './SelectSources'
import { SelectVis } from './SelectVis'
import { SelectFilter } from './SelectVis/SelectFilter'

export const MapInterface: React.FC = () => {
  return (
    // <GeschichteWithHistory history={createBrowserHistory()}>
    <MapProvider>
      <div className="flex flex-row gap-4">
        <Map />
        <SelectBackground />
        <SelectSources />
        <div className="space-y-10">
          <SelectVis />
          <SelectFilter />
        </div>
        <Calculator />
        <Inspector />
      </div>
    </MapProvider>
    // </GeschichteWithHistory>
  )
}
