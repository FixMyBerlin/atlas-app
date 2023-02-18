import clsx from 'clsx'
import { MapDataSourceCalculator } from '../../mapData'
import { useMapStateInteraction } from '../../mapStateInteraction/useMapStateInteraction'

// NOTE: `keys` are unused for now. `capacity` is counted, not summed; lets see what other keys/data we will need …
type Props = { keys: MapDataSourceCalculator['keys'] }

export const CalculatorOutput: React.FC<Props> = ({ keys: _unused }) => {
  const { calculatorAreasWithFeatures } = useMapStateInteraction()

  // <PointCalculator> only sums Point feature. Each point is considere `capacity=1`
  const sums = calculatorAreasWithFeatures.map(({ key, features }) => {
    const onlyTypePoint = features.filter((f) => f.geometry.type === 'Point')
    return [key, onlyTypePoint.length] as const
  })

  return (
    <section
      className="z-1000 absolute flex items-center rounded-md bg-fuchsia-800/90 py-0.5 px-2 text-xl leading-tight text-white shadow-xl"
      style={{
        right: '7px',
        top: '75px',
        minHeight: '65px',
        paddingRight: '40px',
      }}
    >
      <div className={clsx(sums.length === 0 && 'text-white/60')}>
        <div className={clsx(sums.length > 0 && 'text-white/50')}>Summe</div>
        {sums.map(([key, sum]) => (
          <strong key={key} className="block">
            {sum}
          </strong>
        ))}
        {sums.length > 1 && (
          <strong className="mt-1 block w-full border-t border-white/60 py-0.5">
            {sums.map(([_k, v]) => v).reduce((prevV, currV) => prevV + currV)}
          </strong>
        )}
      </div>
    </section>
  )
}
