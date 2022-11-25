import classNames from 'classnames'
import React, { useState } from 'react'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'

type Props = { whatToSum: 'capacity' | 'length' }

export const Calculator: React.FC = () => {
  const { calculatorFeatures, removeFromCalculator, clearCalculator } =
    useMapStateInteraction()

  const [whatToSum, setWhatToSum] = useState<Props['whatToSum']>('capacity')

  if (!calculatorFeatures?.length) return null
  let sum = 0
  const precision = { capacity: 0, length: 1 }

  return (
    <section className="z-1000 fixed bottom-3 left-4 flex min-w-[8rem] items-center rounded-md bg-fuchsia-800/90 py-0.5 px-2 text-xl leading-tight text-white shadow-xl">
      <div className="absolute -top-3 space-x-3 text-[10px] text-fuchsia-800">
        <button
          type="button"
          onClick={() => setWhatToSum('capacity')}
          className={classNames('tracking-tight', {
            'font-bold': whatToSum === 'capacity',
          })}
        >
          Anzahl Autos
        </button>
        <button
          type="button"
          onClick={() => setWhatToSum('length')}
          className={classNames('tracking-tight', {
            'font-bold': whatToSum === 'length',
          })}
        >
          Länge
        </button>
      </div>
      <div className="flex w-full items-center justify-between">
        <div>
          {calculatorFeatures.map((calculatorFeature, index) => {
            const { properties } = calculatorFeature
            if (!properties) return null
            if (!properties[whatToSum]) {
              // eslint-disable-next-line no-console
              console.warn(`MISSING ${whatToSum}`, { calculatorFeature })
              return null
            }
            sum += properties[whatToSum]
            return (
              <span key={properties.id}>
                <button
                  title={`${JSON.stringify(properties)
                    .replaceAll('"', '')
                    .replaceAll(',', ',\n')}`}
                  className="cursor-help"
                  type="button"
                  onClick={() => removeFromCalculator(calculatorFeature)}
                >
                  {properties[whatToSum].toFixed(precision[whatToSum])}
                </button>
                {calculatorFeatures.length - 1 !== index ? (
                  <span className="pl-1 pr-0.5 text-white/80">+</span>
                ) : null}
              </span>
            )
          })}
          <span className="pl-1 pr-1 text-white/80">=</span>
          <span className="font-semibold">
            {sum.toFixed(precision[whatToSum])}
          </span>{' '}
        </div>
        <button
          type="button"
          onClick={clearCalculator}
          className="ml-2 inline-flex h-4 w-4 items-center justify-center justify-self-end rounded-full border border-white/40 text-xs text-white/30 hover:text-white"
        >
          &times;
        </button>
      </div>
    </section>
  )
}
