import path from 'path'
import * as turf from '@turf/turf'

const originalFile = Bun.file(path.resolve(__dirname, './bb-uckermark-radwege.geojson'))
const originalJson = await originalFile.json()

// Route category
const isUeberregionaleRadroute = [
  'R_B_Usedom',
  'R_od_neiss',
  'R_tour_bb',
  'R_hist_Sta',
  'R_grOder',
  'R_BlueVelo',
  'R_Havel',
]
const isRegionaleRadroute = ['R_uckerrund', 'R_steine', 'R_Naturpar', 'R_kranich', 'R_gutsherr']

// Translate route names
const routeNames = {
  R_B_Usedom: 'Berlin-Usedom-Radweg',
  R_od_neiss: 'Oder-Neiße-Radweg (D12)',
  R_tour_bb: 'Tour Brandenburg',
  R_hist_Sta: 'Historische Stadtkerne - Route 1',
  R_uckerrund: 'Uckermärkischer Radrundweg',
  R_steine: 'Spur der Steine',
  R_Naturpar: 'Naturparktour',
  R_kranich: 'Kranichtour',
  R_gutsherr: 'Gutsherrentour',
  R_gruetzpo: 'Grützpottradrundweg',
  R_MuseumsT: 'Museumstour',
  R_SeenTour: 'Seentour',
  R_WindradT: 'Windradtour',
  R_Bauern: 'Uckermärker Bauerntour',
  R_NaturTou: 'Natur Tour',
  R_SchlossK: 'Schloss- und Kirchentour',
  R_TP1_See: 'Templin Radweg R1: Kleine Seen Tour',
  R_TP2_Kur: 'Templin Radweg R2: Die Kurmeilen Tour',
  R_TP3_Allee: 'Templin Radweg R3: Kurze Alleen Tour',
  R_TP4_Luebbe: 'Templin Radweg R4: Um den Lübbesee',
  R_TP5_Glas: 'Templin Radweg R5: Glashütten-Tour',
  R_TP6_Bios: 'Templin Radweg R6: Ins Biosphärenreservat',
  R_TP7_Stock: 'Templin Radweg R7: Über Stock und Stein',
  R_Wokuhl: 'Wokuhl Rundweg',
  R_Glashuette: 'Glashüttenweg',
  R_HeckenR: 'Hecken Rundweg',
  R_Gerswalde: 'Gerswalde Rundtour',
  R_grOder: 'Grüne Oder (Polen)',
  R_BlueVelo: 'Blue Velo (Nr. 3) (Polen)',
  R_Havel: 'Havel Radweg',
}

// Translate keys, values
const translations = {
  use: {
    keyTranslation: 'Eignung des Weges für den Radfahrer (Subjektiv)',
    valuesTranslations: {
      10: 'sehr schlecht',
      15: 'schlecht',
      20: 'gut',
      25: 'sehr gut',
    },
  },
  befahr: {
    keyTranslation: 'Gibt es weitere Nutzung auf dem Weg?',
    valuesTranslations: {
      10: 'ohne weitere Nutzung',
      15: 'Anliegerverkehr',
      20: 'allgemeiner Straßenverkehr',
      25: 'Land- und forstwirtschaftlicher Betrieb',
      30: null,
      35: 'Anlieger-/ allg. Straßenverkehr & Land- & fw. Betrieb',
      40: null,
      45: null,
      50: null,
      55: null,
      60: null,
      65: null,
      70: null,
      75: null,
      80: null,
      85: null,
      90: null,
      95: 'zum Zeitpunkt der Aufnahme nicht klar',
    },
  },
  belag: {
    keyTranslation: 'Untergrund des Weges (überwiegend)',
    valuesTranslations: {
      10: 'Asphalt',
      15: 'Betonoberfläche',
      20: 'Betonspurbahn',
      25: 'Betonspurplatten',
      30: 'Kunststeinpflaster',
      35: 'Kopfsteinpflaster',
      40: 'Wassergebundene Decke',
      45: 'Waldweg',
      50: 'Schotter',
      55: 'Sand/Kies',
      60: 'Holz',
      65: 'Wiese',
      70: 'Kunststeinpflaster/Kopfsteinpflaster',
      75: 'Kopfsteinpflaster/Asphalt',
      80: null,
      85: null,
      90: null,
      95: 'naturbelassen unbefestigt',
    },
  },
}

const transposedFeatures = originalJson.features.map((feature) => {
  const result = {
    // Clean the null values…
    originalProperties: Object.fromEntries(
      Object.entries(feature.properties).filter(([_, value]) => value !== null && value !== 0),
    ),
  }

  // Route category (but only if true)
  const isUeber = Object.entries(feature.properties).some(([pKey, pValue]) =>
    isUeberregionaleRadroute.some((checkKey) => pKey === checkKey && pValue === 1),
  )
  if (isUeber === true) {
    result['isUeberregionaleRadroute'] = 'ja'
  }
  const isRegio = Object.entries(feature.properties).some(([pKey, pValue]) =>
    isRegionaleRadroute.some((checkKey) => pKey === checkKey && pValue === 1),
  )
  if (isRegio === true) {
    result['isRegionaleRadroute'] = 'ja'
  }

  // Translate route names
  Object.entries(routeNames).forEach(([key, translation]) => {
    if (feature.properties[key] === 1) {
      result[key] = translation
    }
  })

  // Translate keys, values
  Object.entries(translations).forEach(([key, { keyTranslation, valuesTranslations }]) => {
    const value = feature.properties[key]
    result[keyTranslation] = valuesTranslations[value]
  })

  // Reduce precision
  return turf.truncate({ ...feature, properties: result }, { precision: 8 })
})

const transposed = turf.featureCollection(transposedFeatures)

console.log(transposed.features[17])

Bun.write(
  path.resolve(__dirname, '../../geojson/bb-uckermark-radwege-translated.geojson'),
  JSON.stringify(transposed, undefined, 2),
)

console.log('DONE: Datei wurde übersetzt und in geojson Ordner geschrieben.')
