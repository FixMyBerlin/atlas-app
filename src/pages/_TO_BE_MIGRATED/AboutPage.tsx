import { LayoutPage } from 'src/core/components--TODO-MIGRATE/Layout'
import { MetaTags } from 'src/core/components--TODO-MIGRATE/MetaTags'

export const AboutPage: React.FC = () => {
  return (
    <LayoutPage>
      <MetaTags noindex title="Über den Radverkehrsatlas" />
      Hallo About
    </LayoutPage>
  )
}
