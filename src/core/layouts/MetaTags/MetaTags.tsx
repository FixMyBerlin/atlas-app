import { isProd } from 'src/core/utils'
import React from 'react'
import SocialSharingImage from './assets/default.png'
import Head from 'next/head'
import { StaticImageData } from 'next/image'

const seoDefaultValues = {
  defaultTitle: 'Radverkehrsatlas',
  defaultDescription: 'Daten zum Radverkehr.',
  baseUrl: 'https://radverkehrsatlas.de',
}

type Props = {
  noindex?: boolean
  title?: string | null
  description?: string | null
  image?: StaticImageData | null
  article?: boolean | null
}

export const MetaTags: React.FC<Props> = ({ noindex, title, description, image, article }) => {
  const { defaultTitle, defaultDescription, baseUrl } = seoDefaultValues

  // On Production, take the prop or `false`. Staging (and everythign else) is set to `true`
  noindex = isProd ? noindex ?? false : true

  const seo = {
    title: title ?? defaultTitle,
    description: description ?? defaultDescription,
    image: `${baseUrl}${image?.src ?? SocialSharingImage.src}`,
  }

  // FYI, we do not inlcude the url meta tags since is work to handle edge cases but let the browser handle this.
  // We do not have propper SocialSharing anyways, since we don't generate static content.
  return (
    <Head>
      <title>{seo.title}</title>

      {/* Even when `noindex`, still render the meta tags so Social Sharing still looks nice */}
      {noindex === true && <meta name="robots" content="noindex" />}

      <meta property="og:title" content={seo.title} />
      <meta name="twitter:title" content={seo.title} />

      <meta name="description" content={seo.description} />
      <meta property="og:description" content={seo.description} />
      <meta name="twitter:description" content={seo.description} />

      <meta name="image" content={seo.image} />
      <meta property="og:image" content={seo.image} />
      <meta name="twitter:image" content={seo.image} />

      {(article ? true : null) && <meta property="og:type" content="article" />}
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="theme-color" content="#eab308" />
    </Head>
  )
}
