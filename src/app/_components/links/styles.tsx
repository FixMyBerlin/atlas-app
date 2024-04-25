import { twMerge } from 'tailwind-merge'

export const linkStyles =
  'underline decoration-yellow-600 underline-offset-4 hover:decoration-2 active:decoration-2 hover:text-yellow-700 active:text-yellow-700'
export const buttonStyles =
  'inline-flex items-center px-4 py-2 border border-transparent font-semibold rounded-md shadow-sm text-gray-800 bg-yellow-100 hover:bg-yellow-400 group-hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-50 select-none leading-4'

export const buttonStylesOnYellow = twMerge(buttonStyles, 'bg-yellow-400/80 shadow')
