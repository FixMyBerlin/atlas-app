import { Layout } from '@components/Layout'
import { MetaTags } from '@components/MetaTags'
import { HomePageCallToAction } from './PageHome/HomePageCallToAction'
import { HomePageCompanies } from './PageHome/HomePageCompanies'
import { HomePageHero } from './PageHome/HomePageHero'
import { PageHomeLive } from './PageHome/HomePageLive'
import { HomePagePrimaryFeatures } from './PageHome/HomePagePrimaryFeatures'
import { PageHomeSecondaryFeatures } from './PageHome/HomePageSecondaryFeatures'
import { PageHomeTestimonials } from './PageHome/PageHomeTestimonials'

export const PageHome: React.FC = () => {
  return (
    <Layout>
      <MetaTags title="Radverkehrsatlas" />
      <HomePageHero />
      <HomePageCompanies />
      <HomePagePrimaryFeatures />
      <PageHomeSecondaryFeatures />
      <HomePageCallToAction />
      <PageHomeTestimonials />
      <PageHomeLive />
    </Layout>
  )
}
