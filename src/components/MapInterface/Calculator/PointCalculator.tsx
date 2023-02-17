import clsx from 'clsx'
import { useMapStateInteraction } from '../mapStateInteraction/useMapStateInteraction'

export const PointCalculator = () => {
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
      </div>
    </section>
  )
}
