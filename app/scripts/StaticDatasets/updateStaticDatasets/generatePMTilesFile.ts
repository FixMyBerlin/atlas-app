import path from 'node:path'
import { red } from '../utils/log'

/** @returns pmtiles outputFullFile */
export const generatePMTilesFile = async (inputFullFile: string, outputFolder: string) => {
  const outputFilename = path.parse(inputFullFile).name
  // This line is only used for `app/scripts/StaticDatasets/geojson/region-bb/bb-ramboll-netzentwurf-2/README.md`
  // const outputFullFile = path.join(outputFolder, `${outputFilename}.mbtiles`)
  const outputFullFile = path.join(outputFolder, `${outputFilename}.pmtiles`)

  console.log(`  Generating pmtiles file "${outputFullFile}"...`)

  // TODO: Check out https://github.com/amandasaurus/waterwaymap.org/blob/main/functions.sh#L20-L33
  // We should add those commands…
  // -n "OSM River Topologies" \
  // -N "Generated on $(date -I) from OSM data from ${FILE_TIMESTAMP:-OSMIUM_HEADER_MISSING} with $(osm-lump-ways --version) and argument $LUMP_ARGS" \
  // -A "© OpenStreetMap. Open Data under ODbL. https://osm.org/copyright" \
  //
  // TODO: We might want to make this an optional flag that we specify based on the meta.js?
  // The goal would be to have lines merged automatically instead of just dropped in spieces
  // BUT, the docs suggest it does not work for linestrings… https://github.com/felt/tippecanoe?tab=readme-ov-file#dropping-a-fraction-of-features-to-keep-under-tile-size-limits
  // --coalesce-smallest-as-needed

  Bun.spawnSync(
    [
      'tippecanoe',
      `--output=${outputFullFile}`,
      '--force',
      '--minimum-zoom=6', // Lowest zoom level for which tiles are generated (default `0`) (`6` is all of Germany on a Laptop)
      // Smallest maxzoom which is acceptable for our precision requirements, is higher, if tippecanoe guesses a higher maxzoom, it will be used ttps://github.com/felt/tippecanoe#zoom-levels / Automatic --maximum-zoom didn't have the required precision
      '--smallest-maximum-zoom-guess=8',
      // If you use -rg, it will guess a drop rate that will keep at most 50,000 features in the densest tile https://github.com/felt/tippecanoe#dropping-a-fixed-fraction-of-features-by-zoom-level
      '-rg',
      // https://github.com/felt/tippecanoe?tab=readme-ov-file#dropping-a-fraction-of-features-to-keep-under-tile-size-limits
      '--drop-densest-as-needed',
      // https://github.com/felt/tippecanoe?tab=readme-ov-file#zoom-levels
      '--extend-zooms-if-still-dropping',
      '--layer=default',
      inputFullFile,
    ],
    {
      onExit(_proc, exitCode, _signalCode, error) {
        if (exitCode) {
          red(`  exitCode: ${exitCode}`)
          process.exit(1)
        }
        if (error) {
          red(`  error: ${error.message}`)
          process.exit(1)
        }
      },
    },
  )

  return outputFullFile
}
