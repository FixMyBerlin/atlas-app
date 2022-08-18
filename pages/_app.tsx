import GeschichteForNextjs from 'geschichte/nextjs'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import '../styles/globals.css'

export const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <GeschichteForNextjs>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </GeschichteForNextjs>
  )
}

export default MyApp
