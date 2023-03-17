// https://de.wikipedia.org/wiki/Anf%C3%BChrungszeichen

export const quote = (text: string) => {
  return `„${text}“`
}

export const quoteSingle = (text: string) => {
  return `‚${text}‘`
}

export const frenchQuote = (text: string) => {
  return `»${text}«`
}

export const frenchQuoteSingle = (text: string) => {
  return `›${text}‹`
}
