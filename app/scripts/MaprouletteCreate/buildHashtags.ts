export const buildHashtags = (slug: string, category: string, hasMaproulette?: boolean) => {
  return [
    '#radinfra_de',
    `#${slug}`,
    // The other categories are less relevant
    category == 'traffic_signs' ? `#${category}` : undefined,
    hasMaproulette ? '#maproulette' : undefined,
  ]
    .flat()
    .filter(Boolean)
}
