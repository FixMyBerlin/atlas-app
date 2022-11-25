import { LayoutPage } from '@components/Layout'
import { MetaTags } from '@components/MetaTags'

export const AboutPage: React.FC = () => {
  return (
    <LayoutPage>
      <MetaTags title="Über den Radverkehrsatlas" />
      Hallo About
    </LayoutPage>
  )
}
