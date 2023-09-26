// https://de.wikipedia.org/wiki/Anf%C3%BChrungszeichen

export const Quote = (input: string | Record<'text', React.ReactNode>) => {
  return <>„{typeof input === 'string' ? input : input.text}“</>
}

export const QuoteSingle = (input: string | Record<'text', React.ReactNode>) => {
  return <>‚{typeof input === 'string' ? input : input.text}‘</>
}

export const FrenchQuote = (input: string | Record<'text', React.ReactNode>) => {
  return <>»{typeof input === 'string' ? input : input.text}«</>
}

export const FrenchQuoteSingle = (input: string | Record<'text', React.ReactNode>) => {
  return <>›{typeof input === 'string' ? input : input.text}‹</>
}
