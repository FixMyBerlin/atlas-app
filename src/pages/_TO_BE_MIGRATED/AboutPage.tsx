import { LayoutPage } from 'src/core/layouts/Layout--TODO-MIGRATE'
import { MetaTags } from 'src/core/layouts/MetaTags'

export const AboutPage: React.FC = () => {
  return (
    <LayoutPage>
      <MetaTags noindex title="Über den Radverkehrsatlas" />
      Hallo About
    </LayoutPage>
  )
}
