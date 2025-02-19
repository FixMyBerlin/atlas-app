export const recommendedActions = ['maproulette', 'map', 'streetcomplete', 'mapillary'] as const

export const recommendedActionSelect = [
  { label: 'Radverkehrsatlas MapRoulette', value: 'maproulette' },
  { label: 'Radverkehrsatlas Karte', value: 'map' },
  { label: 'StreetComplete', value: 'streetcomplete' },
  { label: 'Mapillary', value: 'mapillary' },
] as const satisfies Array<{ label: string; value: (typeof recommendedActions)[number] }>
