import Image from 'next/image'
import svgTildaLogoWhite from '../../assets/tilda-logo-weiss.svg'
import svgTildaLogoBlack from '../../assets/tilda-logo.svg'

export const HeaderAppLogoWhite = () => {
  return (
    <>
      <Image src={svgTildaLogoWhite} alt="TILDA Logo" className="h-8 w-auto" />{' '}
    </>
  )
}

export const HeaderAppLogoBlack = () => {
  return (
    <>
      <Image src={svgTildaLogoBlack} alt="TILDA Logo" className="h-8 w-auto" />{' '}
    </>
  )
}
