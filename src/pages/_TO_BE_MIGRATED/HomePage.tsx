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
      <MetaTags
        title="Radverkehrsatlas – Daten für die Radverkehrsplanung"
        description="Der Radverkehrsatlas beschleunigt die kommunale Radverkehrsplanung, mit umfassenden und amtlich nutzbaren Daten für die Radverkehrsplanung."
      />
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
