import Image from 'next/image'
import svgTildaLogo from '../../assets/tilda-logo-weiss.svg'

export const HeaderAppLogo = () => {
  return (
    <>
      <Image src={svgTildaLogo} alt="" className="h-8 w-auto text-yellow-400" />{' '}
      <span className="ml-2 text-gray-400">TILDA</span>
    </>
  )
}
