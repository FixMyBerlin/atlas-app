export const getRegionSelectOptions = (regions: any) => {
  const result: [number | string, string][] = [['', '(Keine Auswahl)']]
  regions.forEach((p: any) => {
    result.push([p.id, p.name])
  })
  return result
}
