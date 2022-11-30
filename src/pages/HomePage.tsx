import { Layout } from '@components/Layout'
import { MetaTags } from '@components/MetaTags'
import {
  HomePageCallToAction,
  HomePageCompanies,
  HomePageHero,
  HomePageLive,
  HomePagePrimaryFeatures,
  HomePageSecondaryFeaturesJustText,
} from './PageHome'

export const HomePage: React.FC = () => {
  return (
    <Layout>
      <MetaTags title="Radverkehrsatlas" />
      <HomePageHero />
      <HomePageCompanies />
      <HomePagePrimaryFeatures />
      {/* <HomePageSecondaryFeatures /> */}
      <HomePageSecondaryFeaturesJustText />
      <HomePageCallToAction />
      {/* <HomePageTestimonials /> */}
      <HomePageLive />
    </Layout>
  )
}
