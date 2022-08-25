// Run with node ./clean-style.js

const fs = require('fs')

fs.readFile('./output/tarmac-style-raw.json', 'utf8', (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  const rawData = JSON.parse(data)
  // console.log(rawData)

  const name = `${rawData.name} CLEANED`
  // Remove all non-FMC-groups
  const cleanGroups = Object.fromEntries(
    Object.entries(rawData.metadata['mapbox:groups']).filter(([_key, values]) =>
      values.name.startsWith('fmc-')
    )
  )
  // Remove all non-FMC-layer
  const cleanLayers = rawData.layers.filter((layer) =>
    layer.id.startsWith('fmc-')
  )
  // Add the groupName to the Layer's Metadata, so we can filter the more easily
  const enrichedLayers = cleanLayers.map((layer) => {
    const currentGroupId = layer.metadata['mapbox:group']
    const metaGroupName = {
      metadata: {
        ...layer.metadata,
        groupName: cleanGroups[currentGroupId].name,
      },
    }
    return { ...layer, ...metaGroupName }
  })
  // Put it all together, again
  const processedData = {
    ...rawData,
    name,
    ...{ metadata: { 'mapbox:groups': cleanGroups } },
    ...{ layers: enrichedLayers },
  }
  // console.log(processedData)

  fs.writeFile(
    './output/tarmac-style-clean.json',
    JSON.stringify(processedData, null, 2),
    (err) => {
      if (err) {
        console.error(err)
      }
      console.log('done')
    }
  )
})
