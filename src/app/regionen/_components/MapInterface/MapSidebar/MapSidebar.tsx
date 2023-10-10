'use client'

import { SelectThemes } from './SelectThemes/SelectThemes'

export const MapSidebar = () => {
  return (
    <section className="absolute left-0 top-0 max-h-[calc(100vh-5.5rem)] w-72 overflow-y-auto overflow-x-visible  bg-white pb-3 pt-1 shadow-md">
      <SelectThemes />
    </section>
  )
}
