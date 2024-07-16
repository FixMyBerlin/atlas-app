// https://de.wikipedia.org/wiki/Anf%C3%BChrungszeichen

export const Quote = ({ children }: { children: React.ReactNode }) => {
  return <>„{children}“</>
}

export const QuoteSingle = ({ children }: { children: React.ReactNode }) => {
  return <>‚{children}‘</>
}

export const FrenchQuote = ({ children }: { children: React.ReactNode }) => {
  return <>»{children}«</>
}

export const FrenchQuoteSingle = ({ children }: { children: React.ReactNode }) => {
  return <>›{children}‹</>
}

export const quote = (input: string) => {
  return <>„{input}“</>
}

export const quoteSingle = (input: string) => {
  return <>‚{input}‘</>
}

export const frenchQuote = (input: string) => {
  return <>»{input}«</>
}

export const frenchQuoteSingle = (input: string) => {
  return <>›{input}‹</>
}
