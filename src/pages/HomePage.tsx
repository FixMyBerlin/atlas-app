import { Layout } from '@components/Layout'
import { MetaTags } from '@components/MetaTags'
import {
  HomePageCallToAction,
  HomePageCompanies,
  HomePageHero,
  HomePagePrimaryFeatures,
  HomePageTestimonials,
  HomePageLive,
  HomePageSecondaryFeatures,
} from './PageHome'

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <MetaTags title="Radverkehrsatlas" />
      <HomePageHero />
      <HomePageCompanies />
      <HomePagePrimaryFeatures />
      <HomePageSecondaryFeatures />
      <HomePageCallToAction />
      <HomePageTestimonials />
      <HomePageLive />
    </Layout>
  )
}
