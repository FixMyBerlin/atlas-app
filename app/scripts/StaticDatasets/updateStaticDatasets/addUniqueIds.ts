import adler32 from 'adler-32'

const areIdsUnique = (features: { id: any }[]) => {
  const ids = new Set()
  for (const feature of features) {
    if (ids.has(feature.id)) {
      return false // Duplicate ID found
    }
    ids.add(feature.id)
  }
  return true // All IDs are unique
}

export const addUniqueIds = (data: { features: { id: any }[] }) => {
  const allHaveIds = data.features.every((f) => !f.id)
  let allIdsUnique = false
  if (allHaveIds) {
    allIdsUnique = areIdsUnique(data.features)
  }
  if (allIdsUnique) {
    console.log(`  All features have a unique id, using those...`)
  } else {
    console.log(`  Adding unique ids...`)
    data.features.forEach((f) => (f.id = new Uint32Array([adler32.str(JSON.stringify(f))])[0]!))
  }

  return data
}
