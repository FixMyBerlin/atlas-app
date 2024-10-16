'use client'
import Form, { FormProps } from '@/src/app/_components/forms/Form'
import { LabeledSelect } from '@/src/app/_components/forms/LabeledSelect'
import getRegionsWithAdditionalData from '@/src/regions/queries/getRegionsWithAdditionalData'
import getUsers from '@/src/users/queries/getUsers'
import { useQuery } from '@blitzjs/rpc'
import { z } from 'zod'
import { getRegionSelectOptions } from '../../regions/_components/utils/getRegionSelectOptions'
import { getUserSelectOptions } from './utils/getUserSelectOptions'
export { FORM_ERROR } from '@/src/app/_components/forms/Form'

export function MembershipForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  const [{ users }] = useQuery(getUsers, {})
  const [regions] = useQuery(getRegionsWithAdditionalData, {})

  return (
    <Form<S> {...props}>
      <LabeledSelect name="userId" label="User" options={getUserSelectOptions(users)} />
      <LabeledSelect
        name="regionId"
        label="Region, auf dem User Rechte erhalten soll"
        options={getRegionSelectOptions(regions)}
      />
    </Form>
  )
}
