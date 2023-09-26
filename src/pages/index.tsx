import { BlitzPage } from '@blitzjs/next'
import { Layout } from 'src/core/layouts/Layout'
import { MetaTags } from 'src/core/layouts/MetaTags'
import {
  HomePageCallToAction,
  HomePageCompanies,
  HomePageHero,
  HomePageLive,
  HomePagePrimaryFeatures,
  HomePageSecondaryFeaturesJustText,
} from 'src/home/components'

const Home: BlitzPage = () => {
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

export default Home
