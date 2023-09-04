import { LocationGenerics } from '@routes/routes'
import { useSearch } from '@tanstack/react-location'
import React from 'react'
import { themes } from '../../mapData'
import { SelectTopic } from './SelectTopic'

export const SelectTopics: React.FC = () => {
  const { config: configThemes } = useSearch<LocationGenerics>()
  const activeThemes = configThemes?.filter((t) => t.active)

  if (!activeThemes?.length) return null

  return (
    <>
      {activeThemes.map((activeTheme) => {
        const themeData = themes.find((t) => t.id === activeTheme.id)
        if (!themeData) return null
        return <SelectTopic key={themeData.id} themeData={themeData} themeConfig={activeTheme} />
      })}
    </>
  )
}
