import React from 'react'
import { MapProvider } from 'react-map-gl'
import { Calculator } from './Calculator'
import { DebugStateInteraction, DebugStateReactLocation } from './DebugBoxes'
import { Download } from './Download'
import { Inspector } from './Inspector'
import { Map } from './Map'
import { SelectBackgroundWithLegend } from './SelectBackgroundWithLegend'
import { SelectTheme } from './SelectTheme'
import { SelectTopics } from './SelectTopics'
import { UserInfo } from './UserInfo'

export const MapInterface: React.FC = () => {
  return (
    <MapProvider>
      <div className="relative flex h-full w-full flex-row gap-4">
        <SelectTheme />
        <Map />
        <SelectBackgroundWithLegend />
        <SelectTopics />
        <Calculator />
        <Inspector />
        <Download />
        <DebugStateInteraction />
        <DebugStateReactLocation />
        <UserInfo />
      </div>
    </MapProvider>
  )
}
