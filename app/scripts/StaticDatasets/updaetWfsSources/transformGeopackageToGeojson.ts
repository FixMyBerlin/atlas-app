export const transformGeopackageToGeojson = async (input: string, output: string) => {
  Bun.spawnSync(['ogr2ogr', '-f', 'GeoJSON', output, input], {
    onExit(_proc, exitCode, _signalCode, error) {
      exitCode && console.log('exitCode:', exitCode)
      error && console.log('error:', error)
    },
  })
}
