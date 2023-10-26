import { Form, FormProps } from 'src/app/_components/forms/Form'
import { LabeledTextField } from 'src/app/_components/forms/LabeledTextField'
import { z } from 'zod'
export { FORM_ERROR } from 'src/app/_components/forms/Form'

export function RegionForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="slug" label="Slug" placeholder="Slug" type="text" />
      <LabeledTextField name="shortName" label="Short Name" placeholder="Short Name" type="text" />
      <LabeledTextField name="name" label="Name" placeholder="Name" type="text" />
      <LabeledTextField name="public" label="Public" placeholder="Public" type="text" />
    </Form>
  )
}
