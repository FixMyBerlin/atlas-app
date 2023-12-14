export const fetchStyle = async (key, url, folder) => {
  const fetchStyle = await fetch(url)
  if (!fetchStyle.ok) {
    console.error('Fetch failed', fetchStyle)
    process.exit()
  }
  const data: any = await fetchStyle.json()
  await Bun.write(`${folder}/raw-api-response_${key}.json`, JSON.stringify(data, null, 2))
  return data
}

export async function saveJson(filename, data) {
  await Bun.write(filename, JSON.stringify(data, null, 2))
}

export const cleanString = (s) => s.replace(/[^\x00-\x7F]/g, '').replace(/[/\\?%*:|"<>]/g, '')

export const checkIconIds = (styleData) => {
  // removes non-ascii characters and characters not allowed in filenames from icon ids
  styleData.layers.forEach((layer) => {
    ;[
      ['paint', 'background-pattern'],
      ['paint', 'fill-pattern'],
      ['paint', 'line-pattern'],
      ['paint', 'fill-extrusion-pattern'],
      ['layout', 'icon-image'],
    ].forEach(([pl, prop]) => {
      if (layer[pl]?.[prop]) {
        const removeNonAscii = (obj, idx, indent = '') => {
          if (typeof obj[idx] === 'string') {
            if (obj[idx] !== cleanString(obj[idx])) {
              throw Error(`"${obj[idx]}" is not a valid icon id.`)
            }
          } else if (Array.isArray(obj[idx])) {
            const arr = obj[idx]
            arr.forEach((v, i) => {
              removeNonAscii(arr, i, indent + '  ')
            })
          }
        }
        removeNonAscii(layer[pl], prop)
      }
    })
  })
}
