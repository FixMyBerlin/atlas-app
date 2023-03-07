import { GeoJSONFeature } from 'maplibre-gl'
import React from 'react'
import { TagsTableRow, TagsTableRowProps } from '../TagsTableRow'
import { ConditionalFormattedValue } from '../translations'

type Props = Pick<TagsTableRowProps, 'sourceId' | 'tagKey'> & {
  properties: GeoJSONFeature['properties']
}

const trafficSignImages: Record<string, string[]> = {
  'DE:240': [
    'https://upload.wikimedia.org/wikipedia/commons/0/08/Zeichen_240_-_Gemeinsamer_Fu%C3%9F-_und_Radweg%2C_StVO_1992.svg',
  ],
  'DE:1022-10': [
    'https://upload.wikimedia.org/wikipedia/commons/0/04/Zusatzzeichen_1022-10_-_Radfahrer_frei%2C_StVO_1992.svg',
  ],
  'DE:244.1': [
    'https://upload.wikimedia.org/wikipedia/commons/b/bf/Zeichen_244_-_Beginn_der_Fahrradstra%C3%9Fe%2C_StVO_1997.svg',
  ],
  'DE:240;1000-31': [
    'https://upload.wikimedia.org/wikipedia/commons/0/08/Zeichen_240_-_Gemeinsamer_Fu%C3%9F-_und_Radweg%2C_StVO_1992.svg',
    'https://upload.wikimedia.org/wikipedia/commons/5/5e/Zusatzzeichen_1000-31_-_beide_Richtungen%2C_zwei_gegengerichtete_senkrechte_Pfeile%2C_StVO_1992.svg',
  ],
  // Liste:
  // https://wiki.openstreetmap.org/wiki/DE:Verkehrszeichen_in_Deutschland
  // Kandidat:
  // 1000-30 beide Richtungen, zwei gegengerichtete waagerechte Pfeile, StVO 1992.svg
  // https://wiki.openstreetmap.org/wiki/File:Zusatzzeichen_1000-30_-_beide_Richtungen,_zwei_gegengerichtete_waagerechte_Pfeile,_StVO_1992.svg
}

export const TagsTableRowCompositTrafficSign: React.FC<Props> = ({
  sourceId,
  tagKey,
  properties,
}) => {
  if (!properties['traffic_sign']) {
    return (
      <TagsTableRow key={tagKey} sourceId={sourceId} tagKey={tagKey} value="" />
    )
  }

  const images = trafficSignImages[properties['traffic_sign']]

  return (
    <TagsTableRow
      key={tagKey}
      sourceId={sourceId}
      tagKey={tagKey}
      value={
        <div className="flex gap-3">
          <ConditionalFormattedValue
            sourceId={sourceId}
            tagKey={'traffic_sign'}
            tagValue={properties['traffic_sign']}
          />{' '}
          {images?.length && (
            <div className="flex flex-none flex-col items-start gap-1">
              {images.map((imageSrc) => (
                <img
                  key={imageSrc}
                  src={imageSrc}
                  alt=""
                  className="h-12 max-w-[3rem]"
                />
              ))}
            </div>
          )}
        </div>
      }
    />
  )
}
