/// <reference types="vite/client" />
// Run from root with `npm run updateStyles`

import fs from 'fs'
import chalk from 'chalk'

// Configruation:
const keys = ['atlas-style-package-1', 'atlas-style-package-2', 'parking']
const apiConfigs = [
  {
    key: 'atlas-style-package-1',
    // Style https://studio.mapbox.com/styles/hejco/cl706a84j003v14o23n2r81w7/edit/#13.49/48.95568/9.13281
    apiUrl:
      import.meta.env.VITE_MAPBOX_STYLE_ACCESS_TOKEN &&
      `https://api.mapbox.com/styles/v1/hejco/cl706a84j003v14o23n2r81w7?fresh=true&access_token=${
        import.meta.env.VITE_MAPBOX_STYLE_ACCESS_TOKEN
      }`,
    // Only groups with `atlas_` prefix are used
    mapboxGroupPrefix: 'atlas_',
  },
  {
    key: 'atlas-style-package-2',
    // Style https://studio.mapbox.com/styles/hejco/clfs9mdh9007n01t6lw99gyqr/edit/#13.49/48.95568/9.13281
    apiUrl:
      import.meta.env.VITE_MAPBOX_STYLE_ACCESS_TOKEN &&
      `https://api.mapbox.com/styles/v1/hejco/clfs9mdh9007n01t6lw99gyqr?fresh=true&access_token=${
        import.meta.env.VITE_MAPBOX_STYLE_ACCESS_TOKEN
      }`,
    // Only groups with `atlas_` prefix are used
    mapboxGroupPrefix: 'atlas_',
  },
  {
    key: 'parking',
    // Style https://studio.mapbox.com/styles/osm-verkehrswende/clev6ho1i00hd01o9bfo80n9q/edit/#17.14/52.484928/13.430058
    apiUrl:
      import.meta.env.VITE_MAPBOX_PARKING_STYLE_ACCESS_TOKEN &&
      `https://api.mapbox.com/styles/v1/osm-verkehrswende/clev6ho1i00hd01o9bfo80n9q?fresh=true&access_token=${
        import.meta.env.VITE_MAPBOX_PARKING_STYLE_ACCESS_TOKEN
      }`,
    mapboxGroupPrefix: 'parking_',
  },
].filter((c) => Boolean(c.apiUrl))

// Folder
const scriptJsonFolder = 'scripts/MapboxStyles/json'
const componentFolder = 'src/components/MapInterface/mapData/topicsMapData/mapboxStyles'

// Helper:
const log = (title, object: any = '-') => {
  console.log(chalk.inverse.bold(` ${title}${object === '-' ? '' : ':'} `), object)
}

// ============= Collect data per `apiConfig`

type GroupsLayer = { group: string; layers: mapboxgl.AnyLayer[] }
const groupsAndLayers: Record<string, GroupsLayer[]> = Object.fromEntries(keys.map((k) => [k, []]))
const metaFileContent: Record<string, any> = Object.fromEntries(keys.map((k) => [k, undefined]))

await Promise.all(
  apiConfigs.map(async ({ key, apiUrl, mapboxGroupPrefix }) => {
    // Script:
    // Script: Fetch rawData
    const fetchStyles = await fetch(apiUrl)

    if (!fetchStyles.ok) {
      console.error('Fetch failed', fetchStyles)
      process.exit()
    }

    const rawData = await fetchStyles.json()

    // Script: For debugging, write the rawData
    fs.writeFileSync(
      `${scriptJsonFolder}/raw-api-response_${key}.json`,
      JSON.stringify(rawData, undefined, 2)
    )
    // log(`${key}: Received raw data`, rawData)
    log(`${key}: Received raw data`)

    // Script: Remove all non-FMC-groups
    type MapBoxGroupEntry = { name: string; collapsed: boolean }
    type Group = { key: string; name: string }

    const groups = Object.entries(rawData.metadata['mapbox:groups'])
      .map((entry) => {
        const key = entry[0] as string
        const values = entry[1] as MapBoxGroupEntry
        if (values.name.startsWith(mapboxGroupPrefix)) {
          return { key: key, name: values.name }
        }
        return null
      })
      .filter((e): e is Group => !!e) // Learn more https://www.benmvp.com/blog/filtering-undefined-elements-from-array-typescript/

    log(`${key}: Received ${groups.length} groups`)

    // Script: For each group, collect the layers:
    // Create our own data
    groupsAndLayers[key] = groups.map((group) => {
      return {
        group: group.name,
        layers: rawData.layers.filter((layer) => {
          return layer.metadata && layer.metadata['mapbox:group'] == group.key
        }),
      }
    })

    // Cleanup keys from layers that we don't need or that we need to add ourselved later:
    groupsAndLayers[key].forEach((g) =>
      g.layers.forEach((layer: any) => {
        delete layer.metadata
        delete layer.source
        delete layer['source-layer']
        delete layer?.layout?.visibility // The source styles are sometimes set hidden; we need to reset this
      })
    )

    // Cleanup layer names & collect debugging info
    const changedNamesForDebugging: {
      sourceName: string
      cleanedName: string
    }[] = []
    groupsAndLayers[key].forEach((g) => {
      const sourceName = g.group
      const cleanedName = sourceName.toLowerCase().replace(/[^a-z_]/g, '')
      if (sourceName !== cleanedName) {
        g.group = cleanedName
        changedNamesForDebugging.push({ sourceName, cleanedName })
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
  })
)

// ============= Now, we bring all `apiConfigs` back together

const mergedSortedGroupAndLayers = Object.values(groupsAndLayers)
  .map((layers) => layers)
  .flat()
  .sort((a, b) => a.group.localeCompare(b.group))

// Write file
const stylesFile = `${componentFolder}/mapbox-layer-styles-by-group.json`
fs.writeFileSync(stylesFile, JSON.stringify(mergedSortedGroupAndLayers, undefined, 2))
log(`Write stylesFile`, stylesFile)

// Script: Generate types file
// This is the file that we write.
// We create one type with all Ids
// And one Type per Group with only the Ids of that type.
// (Don't change the new lines and spaces in this template; the generated output does fit Prettier conventions.)
const typesFileContent = `// Autogenerated by \`scripts/MapboxStyles/process.ts\`
// Do not change this file manually

export type MapboxStylesByLayerGroupIds =
${mergedSortedGroupAndLayers.map((g) => `  | '${g.group}'\n`).join('')}`

fs.writeFileSync(`${componentFolder}/types.ts`, typesFileContent)
log(`Write typesFile`, typesFileContent)

fs.writeFileSync(
  `${scriptJsonFolder}/metadata_last_process.json`,
  JSON.stringify(metaFileContent, undefined, 2)
)
log(`Store metadata on processing`, metaFileContent)
