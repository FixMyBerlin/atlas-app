export const visibilityOptions = ['promote', 'secondary', 'hidden'] as const

export const visibilitySelect = visibilityOptions
  .map((status) => {
    return {
      label: status,
      value: status,
    }
  })
  .filter(Boolean)
