import Image from 'next/image'
import { TagsTableRow } from '../TagsTableRow'
import { ConditionalFormattedKey } from '../translations/ConditionalFormattedKey'
import { ConditionalFormattedValue } from '../translations/ConditionalFormattedValue'
import { NodataFallback } from './NodataFallback'
import { CompositTableRow } from './types'

// Gute Liste:
// https://wiki.openstreetmap.org/wiki/DE:Verkehrszeichen_in_Deutschland
const trafficSigns: Record<string, { title: string; signUrl: string }> = {
  '240': {
    title: 'Zeichen 240, Gemeinsamer Geh- und Radweg',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/08/Zeichen_240_-_Gemeinsamer_Fu%C3%9F-_und_Radweg%2C_StVO_1992.svg',
  },
  '241': {
    title: 'Zeichen 241, Getrennter Geh- und Radweg oder Getrennter Rad- und Gehweg',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/86/Zeichen_241-30_-_getrennter_Rad-_und_Fu%C3%9Fweg%2C_StVO_1992.svg',
  },
  '241-30': {
    title: 'Zeichen 241-30, Getrennter Geh- und Radweg (Radweg links)',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/86/Zeichen_241-30_-_getrennter_Rad-_und_Fu%C3%9Fweg%2C_StVO_1992.svg',
  },
  '241-31': {
    title: 'Zeichen 241-31, Getrennter Rad- und Gehweg (Radweg rechts)',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/6/68/Zeichen_241-31_-_getrennter_Fu%C3%9F-_und_Radweg%2C_StVO_1992.svg',
  },
  '1022-10': {
    title: 'Zusatzzeichen 1022-10, Radfahrer frei',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/0/04/Zusatzzeichen_1022-10_-_Radfahrer_frei%2C_StVO_1992.svg',
  },
  '244.1': {
    title: 'Zeichen 244.1, Fahrradstraße (Beginn)',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/bf/Zeichen_244_-_Beginn_der_Fahrradstra%C3%9Fe%2C_StVO_1997.svg',
  },
  '1020-30': {
    title: 'Zusatzzeichen 1020-30, Anlieger frei',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c1/Zusatzzeichen_1020-30_-_Anlieger_frei_%28600x330%29%2C_StVO_1992.svg',
  },
  '237': {
    title: 'Zeichen 237, Radweg',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/9/91/Zeichen_237_-_Sonderweg_Radfahrer%2C_StVO_1992.svg',
  },
  '239': {
    title: 'Zeichen 239, Gehweg',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/5a/Zeichen_239_-_Sonderweg_Fu%C3%9Fg%C3%A4nger%2C_StVO_1992.svg',
  },
  '1000-30': {
    title: 'Zusatzzeichen 1000-30, Beide Richtungen',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/c/c9/Zusatzzeichen_1000-30_-_beide_Richtungen%2C_zwei_gegengerichtete_waagerechte_Pfeile%2C_StVO_1992.svg',
  },
  '1000-31': {
    title: 'Zusatzzeichen 1000-31, Beide Richtungen',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/5/5e/Zusatzzeichen_1000-31_-_beide_Richtungen%2C_zwei_gegengerichtete_senkrechte_Pfeile%2C_StVO_1992.svg',
  },
  '1026-35': {
    title: 'Zusatzzeichen 1026-35, Lieferverkehr frei',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/e6/Zusatzzeichen_1026-35_-_Lieferverkehr_frei%2C_StVO_1992.svg',
  },
  '274.1': {
    title: 'Beginn einer Tempo 30-Zone',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/e/eb/Zeichen_274.1_-_Beginn_einer_Tempo_30-Zone%2C_StVO_2013.svg',
  },
  '274.1-20': {
    title: 'Beginn einer Tempo 20-Zone',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/b/bc/Zeichen_274.1-20_-_Beginn_einer_Tempo_20-Zone_in_verkehrsberuhigten_Gesch%C3%A4ftsbereichen_%28einseitig%29%2C_StVO_2013.svg',
  },
  '274-30': {
    title: 'Zulässige Höchst­geschwindigkeit 30 km/h',
    signUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/Zeichen_274-53.svg',
  },
  '350.1': {
    title: 'Radschnellweg',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a1/Zeichen_350.1_-_Radschnellweg%3B_StVO_2020.svg',
  },
  '350.2': {
    title: 'Ende des Radschnellwegs',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/a/a5/Zeichen_350.2_-_Ende_des_Radschnellwegs%3B_StVO_2020.svg',
  },
  '1024-14': {
    title: 'Kraftomnibusse frei',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/9/96/Zusatzzeichen_1024-14_-_Kraftomnibusse_frei%2C_StVO_1992.svg',
  },
  '1026-36': {
    title: 'Landwirtschaftlicher Verkehr frei',
    signUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/41/Zusatzzeichen_1026-36_-_Landwirtschaftlicher_Verkehr_frei_%28450x600%29%2C_StVO_1992.svg',
  },
  // "Kfz frei" hat wohl keine ID https://de.wikipedia.org/wiki/Datei:Zusatzzeichen_KFZ_frei.svg
}

export const tableKeyTrafficSign = 'traffic_sign'
export const TagsTableRowCompositTrafficSign = ({
  sourceId,
  tagKey,
  properties,
}: CompositTableRow) => {
  type Signs = {
    both: ReturnType<typeof split>
    forward: ReturnType<typeof split>
    backward: ReturnType<typeof split>
  }
  const split = (input: string | undefined) => input?.replaceAll('DE:', '')?.split(/[,;]/) // TODO: This is not very hardy. We need to use the traffic sign package here
  const receivedSigns: Signs = {
    both: split(properties['traffic_sign']),
    forward: split(properties['traffic_sign:forward']),
    backward: split(properties['traffic_sign:backward']),
  }

  const anySigns = Object.values(receivedSigns).flat().filter(Boolean).length > 0
  if (!anySigns) {
    return (
      <TagsTableRow
        key={tagKey}
        sourceId={sourceId}
        tagKey={tagKey}
        tagValue={properties[tagKey]}
      />
    )
  }

  // CASE: Show only 'both'
  if (
    receivedSigns.both &&
    receivedSigns.forward === undefined &&
    receivedSigns.backward === undefined
  ) {
    return (
      <TagsTableRow key={tagKey} sourceId={sourceId} tagKey={tagKey}>
        <Signs signKeys={receivedSigns.both} />
      </TagsTableRow>
    )
  }

  // CASE: Show all variations
  return (
    <TagsTableRow key={tagKey} sourceId={sourceId} tagKey={tagKey}>
      <div className="flex flex-col gap-3">
        {receivedSigns.both && <Signs signKeys={receivedSigns.both} />}
        {(receivedSigns.forward || receivedSigns.backward) && (
          <>
            <Signs titleTag="traffic_sign:forward" signKeys={receivedSigns.forward} />
            <Signs titleTag="traffic_sign:backward" signKeys={receivedSigns.backward} />
          </>
        )}
      </div>
    </TagsTableRow>
  )
}

function Signs({ titleTag, signKeys }: { titleTag?: string; signKeys: string[] | undefined }) {
  return (
    <div>
      {titleTag && (
        <strong className="font-medium">
          <ConditionalFormattedKey sourceId="" tagKey={titleTag} />:
        </strong>
      )}
      {signKeys === undefined ? (
        <NodataFallback />
      ) : signKeys.at(0) === 'none' ? (
        <ConditionalFormattedValue sourceId="" tagKey="traffic_sign" tagValue="none" />
      ) : (
        <div className="flex divide-x">
          {signKeys.map((signKey) => {
            return <Sign key={signKey} signKey={signKey} />
          })}
        </div>
      )}
    </div>
  )
}

function Sign({ signKey }: { signKey: string }) {
  return (
    <div
      key={signKey}
      className="flex flex-col items-start justify-center px-3 first:pl-0 last:pr-0"
    >
      {trafficSigns[signKey]?.title ? (
        <>
          <p className="mb-1 leading-tight">{trafficSigns[signKey]?.title}</p>
          {trafficSigns[signKey]?.signUrl && (
            // TS: Why do I need to "!" this when I just guarded it…?
            <Image
              src={trafficSigns[signKey]!.signUrl}
              width={48}
              height={48}
              alt=""
              className="h-12 max-w-[3rem]"
            />
          )}
        </>
      ) : (
        <code className="block rounded-md border bg-gray-700 p-1.5 text-center text-xs leading-tight text-gray-50">
          {signKey}
        </code>
      )}
    </div>
  )
}
