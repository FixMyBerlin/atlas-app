'use client'

import React from 'react'
import { MapDataStyleLegend } from '../../mapData/types'

type Props = Pick<MapDataStyleLegend, 'name' | 'desc'>

export const LegendNameDesc: React.FC<Props> = ({ name, desc }) => {
  if (desc) {
    return (
      <div className="ml-2.5 flex items-center text-xs font-medium leading-none text-gray-700">
        <details className="marker:text-gray-300 hover:marker:text-gray-700">
          <summary className="cursor-pointer" dangerouslySetInnerHTML={{ __html: name }} />
          <ul className="mt-1 font-normal">
            {desc.map((descLine) => (
              <li
                className="ml-[0.9rem] list-disc py-0.5 marker:text-gray-300 hover:marker:text-gray-300"
                key={descLine}
              >
                {descLine}
              </li>
            ))}
          </ul>
        </details>
      </div>
    )
  }

  return (
    <div
      className="ml-2.5 flex items-center text-sm font-medium leading-none text-gray-700"
      dangerouslySetInnerHTML={{ __html: name }}
    />
  )
}
