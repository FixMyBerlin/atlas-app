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
