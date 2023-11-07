import clsx from 'clsx'
import React from 'react'
import { linkStyles } from 'src/app/_components/links/styles'

type Props = { data: Object; className?: string }

export const ObjectDump = ({ data, className }: Props) => {
  return (
    <details className={clsx(className, 'prose-sm')}>
      <summary className={clsx(linkStyles, 'cursor-pointer')}>JSON Dump</summary>
      <pre>{JSON.stringify(data, undefined, 2)}</pre>
    </details>
  )
}
