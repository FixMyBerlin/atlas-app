'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter, useSearchParams } from 'next/navigation'
import createMembership from 'src/memberships/mutations/createMembership'
import { Breadcrumb } from '../../_components/Breadcrumb'
import { FORM_ERROR, MembershipForm } from '../_components/MembershipForm'
import { breadcrump } from '../page'

export default function AdminNewMembershipPage() {
  const router = useRouter()
  const params = useSearchParams()

  const [createMembershipMutation] = useMutation(createMembership)

  type HandleSubmit = any // TODO
  const handleSubmit = async (values: HandleSubmit) => {
    try {
      await createMembershipMutation({ ...values })
      await router.push('/admin/memberships')
    } catch (error: any) {
      console.error(error)
      return { [FORM_ERROR]: error }
    }
  }

  return (
    <>
      <Breadcrumb pages={[breadcrump, { href: '/admin/memberships/new', name: 'Anlegen' }]} />
      <MembershipForm
        initialValues={{ userId: params?.get('userId') }}
        submitText="Erstellen"
        onSubmit={handleSubmit}
      />
    </>
  )
}

AdminNewMembershipPage.authenticate = { role: 'ADMIN' }
