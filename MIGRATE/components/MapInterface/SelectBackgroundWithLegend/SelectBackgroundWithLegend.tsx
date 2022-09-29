import React from 'react'
import { BackgroundLegend } from './BackgroundLegend'
import { SelectBackground } from './SelectBackground'

export const SelectBackgroundWithLegend: React.FC = () => {
  return (
    <section className="fixed bottom-3 left-5 z-20 flex flex-row gap-2">
      <SelectBackground />
      <BackgroundLegend />
    </section>
  )
}
