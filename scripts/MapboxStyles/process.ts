// We use bun.sh to run this file
import chalk from 'chalk'
import { fetchStyle, saveJson } from './util'
import { mergeSprites } from './mergeSprites'
import { log } from './util'

console.log(chalk.inverse.bold('START'), __filename)

// Configuration
const baseMapStyle =
  'https://api.maptiler.com/maps/08357855-50d4-44e1-ac9f-ea099d9de4a5/style.json?key=ECOoUBmpqklzSCASXxcu'
const keys = ['atlas-style-package-1', 'atlas-style-package-2', 'parking']
const apiConfigs = [
  // The order in this array specifies which sprite "wins" when sprite filenames are identical (the last entry "wins")
  {
    key: 'parking',
    // Style https://studio.mapbox.com/styles/osm-verkehrswende/clev6ho1i00hd01o9bfo80n9q/edit/#17.14/52.484928/13.430058
    enabled: process.env.MAPBOX_PARKING_STYLE_ACCESS_TOKEN,
    apiUrl: `https://api.mapbox.com/styles/v1/osm-verkehrswende/clev6ho1i00hd01o9bfo80n9q?fresh=true&access_token=${process.env.MAPBOX_PARKING_STYLE_ACCESS_TOKEN}`,
    mapboxGroupPrefix: 'parking_',
  },
  {
    key: 'atlas-style-package-2',
    // Style https://studio.mapbox.com/styles/hejco/clfs9mdh9007n01t6lw99gyqr/edit/#13.49/48.95568/9.13281
    enabled: process.env.MAPBOX_STYLE_ACCESS_TOKEN,
    apiUrl: `https://api.mapbox.com/styles/v1/hejco/clfs9mdh9007n01t6lw99gyqr?fresh=true&access_token=${process.env.MAPBOX_STYLE_ACCESS_TOKEN}`,
    // Only groups with `atlas_` prefix are used
    mapboxGroupPrefix: 'atlas_',
  },
  {
    key: 'atlas-style-package-1',
    // Style https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/#13.49/48.95568/9.13281
    enabled: process.env.MAPBOX_STYLE_ACCESS_TOKEN,
    apiUrl: `https://api.mapbox.com/styles/v1/hejco/cl706a84j003v14o23n2r81w7?fresh=true&access_token=${process.env.MAPBOX_STYLE_ACCESS_TOKEN}`,
    // Only groups with `atlas_` prefix are used
    mapboxGroupPrefix: 'atlas_',
  },
].filter((c) => c.enabled)

// Folder
const scriptJsonFolder = 'scripts/MapboxStyles/json'
const componentFolder = 'src/app/regionen/[regionSlug]/_mapData/mapDataSubcategories/mapboxStyles'

// Sprites
export type SpriteSource = { url: string; searchParams?: { access_token: string | null } }
const spriteUrls: SpriteSource[] = []

// ============= Collect data per `apiConfig`

type GroupsLayer = { folderName: string; layers: mapboxgl.AnyLayer[] }
const groupsAndLayers: Record<string, GroupsLayer[]> = Object.fromEntries(keys.map((k) => [k, []]))
const metaFileContent: Record<string, any> = Object.fromEntries(keys.map((k) => [k, undefined]))

for (const { key, apiUrl, mapboxGroupPrefix } of apiConfigs) {
  const rawData: any = await fetchStyle(key, apiUrl, scriptJsonFolder)

  // Script: Remove all non-FMC-groups
  type MapBoxGroupEntry = { name: string; collapsed: boolean }

  // Get Groups from Mapbox-metadata, which is the only place where ID and Name are matched
  const groups = Object.entries(rawData.metadata['mapbox:groups'])
    .map((entry) => {
      const key = entry[0] as string
      const values = entry[1] as MapBoxGroupEntry
      if (values.name.startsWith(mapboxGroupPrefix)) {
        return {
          folderId: key,
          folderName: values.name,
        }
      }
      return null
    })
    .filter(Boolean)

  log(`${key}: Received ${groups.length} groups`)

  // Script: For each group, collect the layers:
  // Create our own data
  groupsAndLayers[key] = groups.map((group) => {
    return {
      folderName: group.folderName,
      layers: rawData.layers.filter((layer) => {
        return layer.metadata && layer.metadata['mapbox:group'] == group.folderId
      }),
    }
  })

  // Cleanup keys from layers that we don't need or that we need to add ourselved later:
  groupsAndLayers[key]?.forEach((g) =>
    g.layers.forEach((layer: any) => {
      delete layer.metadata
      delete layer.source
      delete layer.slot // Does not exict on maplibre
      delete layer['source-layer']
      delete layer?.layout?.visibility // The source styles are sometimes set hidden; we need to reset this
      if (layer?.layout && Object.keys(layer.layout).length === 0) {
        delete layer.layout
      }
    }),
  )

  // Cleanup layer names & collect debugging info
  const changedNamesForDebugging: {
    folderName: string
    cleanFolderName: string
  }[] = []
  groupsAndLayers[key]?.forEach((g) => {
    const folderName = g.folderName
    const cleanFolderName = folderName.toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (folderName !== cleanFolderName) {
      g.folderName = cleanFolderName
      changedNamesForDebugging.push({ folderName, cleanFolderName })
    }
  })
  if (changedNamesForDebugging.length) {
    log(`${key}: ${changedNamesForDebugging.length} group names where renamed:`, {
      changedNamesForDebugging,
    })
  }

  metaFileContent[key] = {
    key,
    about: `Metadata on the last processing of the ${key} styles api response`,
    processed_at: new Date().toLocaleString('de-DE'),
    style_last_published: {
      published_at: new Date(rawData.modified).toLocaleString('de-DE'),
      version: rawData.version,
    },
    style_id: rawData.id,
    style_owner: rawData.owner,
    style_name: rawData.name,
    debug_changed_names: {
      about: `The folder names in Mapbox need to follow a pattern of \`${mapboxGroupPrefix}[DataIdentifier]_[OptionalStyleIdentifier]\`, otherwise the script will create unexpected results. During processing, we cleanup the names. If any names show up below, those need to be fixed in Mapbox to prevent errors.`,
      changedNamesForDebugging,
    },
  }

  spriteUrls.push({
    url: `${rawData.sprite.replace(
      'mapbox://sprites/',
      'https://api.mapbox.com/styles/v1/',
    )}/sprite`,
    searchParams: {
      access_token: new URL(apiUrl).searchParams.get('access_token'),
    },
  })
}

// ============= Now, we bring all `apiConfigs` back together

const mergedGroupAndLayers = Object.values(groupsAndLayers)
  .map((layers) => layers)
  .flat()
  .filter((layers) => layers.layers.length > 0) // Delete empty folders, which are hidden Mapbox so they cannot be deleted in the UI

// Write files
for (const group of mergedGroupAndLayers) {
  const groupFile = `// Autogenerated by \`scripts/MapboxStyles/process.ts\`
  // Do not change this file manually

  import { MapboxStyleLayer } from '../types'

  export const mapboxStyleGroupLayers_${group.folderName}: MapboxStyleLayer[] = ${JSON.stringify(
    group.layers,
    null,
    2,
  )}
  `
  const stylesFile = `${componentFolder}/groups/${group.folderName}.ts`
  await Bun.write(stylesFile, groupFile)
  log(`Write stylesFile`, stylesFile)
}

// Script: Generate types file
// A type that represents all keys of the layers we generate
// (Don't change the new lines and spaces in this template; the generated output does fit Prettier conventions.)
const _layers = mergedGroupAndLayers.map((g) => g.layers).flat()
const _layerKeys = _layers.map((l) => Object.keys(l)).flat()
const deduplicatedLayerKeys = Array.from(new Set(_layerKeys)).sort((a, b) => a.localeCompare(b))
const typesFileContent = `// Autogenerated by \`scripts/MapboxStyles/process.ts\`
// Do not change this file manually

// This type is used in \`mapboxStyleLayers\` and gives some visibility into what kind of data we fetch from Mapbox.
export type MapboxStyleLayer = {${deduplicatedLayerKeys
  .map((key) => {
    const optional = key === 'id' ? '' : '?'
    return `${key}${optional}: any;\n`
  })
  .join('')}}`

const typeFileName = `${componentFolder}/types.ts`
await Bun.write(typeFileName, typesFileContent)
log(`Write typesFile`, typeFileName)

await Bun.write(
  `${scriptJsonFolder}/metadata_last_process.json`,
  JSON.stringify(metaFileContent, null, 2),
)
log(`Store metadata on processing`, metaFileContent)

// ============= Last, we handle sprites and create a new style.json

const originalBaseMapStyle = await fetchStyle('base', baseMapStyle, scriptJsonFolder)
// Store the original style. See README for more.
await saveJson('src/pages/api/map/style.json', originalBaseMapStyle)

// Create a merged sprite for pixelRatio 1 and 2
spriteUrls.push({ url: originalBaseMapStyle.sprite })
log('Merge sprites', spriteUrls)
await mergeSprites(spriteUrls, 1)
await mergeSprites(spriteUrls, 2)
