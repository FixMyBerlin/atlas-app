import { twJoin } from 'tailwind-merge'
import React from 'react'
import { LabeledRadiobutton, LabeledRadiobuttonProps } from './LabeledRadiobutton'

type Props = {
  label?: string
  optional?: boolean
  scope: string
  items: Omit<LabeledRadiobuttonProps, 'scope'>[]
  classLabelOverwrite?: string
  classNameItemWrapper?: string
}

export const LabeledRadiobuttonGroup: React.FC<Props> = ({
  label,
  optional,
  scope,
  items,
  classLabelOverwrite,
  classNameItemWrapper,
}) => {
  const itemsWithScope = items.map((i) => ({ ...i, scope }))

  return (
    <div>
      {label && (
        <p className={classLabelOverwrite || 'mb-4 block text-sm font-semibold text-gray-700'}>
          {label} {optional && <> (optional)</>}
        </p>
      )}
      <div className={twJoin(classNameItemWrapper, 'space-y-3')}>
        {itemsWithScope.map((item) => {
          return (
            <LabeledRadiobutton
              key={item.value}
              labelProps={{ className: label ? 'font-normal' : undefined }}
              {...item}
            />
          )
        })}
      </div>
    </div>
  )
}
