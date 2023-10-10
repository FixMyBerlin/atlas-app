'use client'

// https://twitter.com/mattpocockuk/status/1653403198885904387
// eslint-disable-next-line @typescript-eslint/ban-types
export type Prettify<T> = { [K in keyof T]: T[K] } & {}
