import { Form, FormProps } from '@/src/app/_components/forms/Form'
import { LabeledRadiobuttonGroup } from '@/src/app/_components/forms/LabeledRadiobuttonGroup'
import { LabeledSelect } from '@/src/app/_components/forms/LabeledSelect'
import { Link } from '@/src/app/_components/links/Link'
import { staticRegion } from '@/src/app/regionen/(index)/_data/regions.const'
import { z } from 'zod'
export { FORM_ERROR } from '@/src/app/_components/forms/Form'

export function RegionForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const slugOptions = staticRegion.map((r) => [r.slug, `${r.slug} (${r.name})`] as [string, string])

  return (
    <Form<S> {...props}>
      <LabeledSelect
        name="slug"
        label="Slug & Bezug zur statischen Datenliste"
        options={slugOptions}
        help={
          <>
            Wir können nur Regionen anlegen, für die vorab{' '}
            <Link
              blank
              href="https://github.com/FixMyBerlin/atlas-app/blob/develop/src/regions/components/additionalRegionAttributes.const.ts#L89"
            >
              statische Daten deployed wurden
            </Link>
            .
          </>
        }
      />
      <LabeledRadiobuttonGroup
        scope="public"
        items={[
          { value: 'true', label: 'Öffentlich gelistet' },
          { value: 'false', label: 'Versteckt / Nur über Deeplink erreichbar' },
        ]}
      />
      <LabeledRadiobuttonGroup
        scope="exportPublic"
        items={[
          { value: 'true', label: 'Jeder kann exportieren' },
          { value: 'false', label: 'Nur Mitglieder der Region können exportieren' },
        ]}
      />
    </Form>
  )
}
