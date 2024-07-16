import { twJoin } from 'tailwind-merge'
import React from 'react'
import { linkStyles } from 'src/app/_components/links/styles'

type Props = { data: Object; open?: true; className?: string }

export const ObjectDump = ({ data, open, className }: Props) => {
  return (
    <details open={open} className={twJoin(className, 'prose-sm')}>
      <summary className={twJoin(linkStyles, 'cursor-pointer whitespace-nowrap')}>
        JSON Dump
      </summary>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </details>
  )
}
