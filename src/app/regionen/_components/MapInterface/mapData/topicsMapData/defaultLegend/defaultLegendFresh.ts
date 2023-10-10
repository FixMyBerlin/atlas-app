'use client'

import { MapDataStyleLegend } from '../../types'

export const defaultLegendFresh: MapDataStyleLegend[] = [
  {
    id: 'fresh_check_date',
    name: 'Aktuell (explizit)',
    style: {
      type: 'line',
      color: 'hsl(107, 88%, 57%)',
    },
  },
  {
    id: 'fresh_update_at',
    name: 'Aktuell (implizit)',
    style: {
      type: 'line',
      color: 'hsl(107, 88%, 57%)',
      dasharray: [7, 3],
    },
  },
  {
    id: 'outdated_check_date',
    name: 'Veraltet (explizit)',
    style: {
      type: 'line',
      color: 'hsl(0, 100%, 41%)',
    },
  },
  {
    id: 'outdated_update_at',
    name: 'Veraltet (implizit)',
    style: {
      type: 'line',
      color: 'hsl(0, 100%, 41%)',
      dasharray: [7, 3],
    },
  },
]
