'use client'

type Props = {
  color?: string
  borderColor?: string
  borderWidth?: number
  size?: number
}

export const LegendIconArea = ({
  color = 'black',
  borderColor = 'white',
  borderWidth = 1,
  size = 24,
}: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${size} ${size}`}>
      <rect
        width="100%"
        height="100%"
        fill={color}
        stroke={borderColor}
        strokeWidth={borderWidth}
      />
    </svg>
  )
}
