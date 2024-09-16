import { useQuery } from '@blitzjs/rpc'
import { Form, FormProps } from 'src/app/_components/forms/Form'
import { LabeledCheckboxGroup } from 'src/app/_components/forms/LabeledCheckboxGroup'
import { LabeledRadiobuttonGroup } from 'src/app/_components/forms/LabeledRadiobuttonGroup'
import getRegions from 'src/regions/queries/getRegionsWithAdditionalData'
import { z } from 'zod'
export { FORM_ERROR } from 'src/app/_components/forms/Form'

export function UploadForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [regions] = useQuery(getRegions, {})
  const regionOptions = regions.map((region) => ({
    value: String(region.id),
    label: region.slug,
  }))

  return (
    <Form<S> {...props}>
      <div>
        <LabeledCheckboxGroup scope="regions" label="Regionen" items={regionOptions} />
      </div>
      <LabeledRadiobuttonGroup
        scope="public"
        label="Sichtbarkeit"
        items={[
          { value: 'true', label: 'Öffentlich' },
          { value: 'false', label: 'Nur für Mitglieder der Region' },
        ]}
      />
    </Form>
  )
}
