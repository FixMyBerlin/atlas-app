'use client'

import { useMutation } from '@blitzjs/rpc'
import { twJoin } from 'tailwind-merge'
import { useRouter } from 'next/navigation'
import { FORM_ERROR, Form, FormProps } from 'src/app/_components/forms/Form'
import { LabeledTextField } from 'src/app/_components/forms/LabeledTextField'
import { Link } from 'src/app/_components/links/Link'
import { proseClasses } from 'src/app/_components/text/prose'
import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import updateUser from 'src/users/mutations/updateUser'
import { UpdateUserSchema } from 'src/users/schema'
import { z } from 'zod'
export { FORM_ERROR } from 'src/app/_components/forms/Form'

export function UserFormForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField
        name="firstName"
        label="Vorname"
        placeholder=""
        autoComplete="given-name"
        optional
      />
      <LabeledTextField
        name="lastName"
        label="Nachname"
        placeholder=""
        autoComplete="family-name"
        optional
      />
      <LabeledTextField
        type="email"
        name="email"
        label="E-Mail-Adresse"
        placeholder=""
        autoComplete="email"
        help="Verwendet zur Kontaktaufnahme durch FixMyCity und für Benachrichtigungen aus dem Atlas."
      />
    </Form>
  )
}

export const UserForm = () => {
  const router = useRouter()
  const user = useCurrentUser()!
  const [updateUserMutation] = useMutation(updateUser)

  return (
    <div className="flex gap-10">
      <UserFormForm
        submitText="Account aktualisieren"
        schema={UpdateUserSchema}
        initialValues={{
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email || '',
        }}
        onSubmit={async (values) => {
          try {
            await updateUserMutation(values)
            router.push('/settings/user')
          } catch (error: any) {
            console.error(error)
            return { [FORM_ERROR]: error }
          }
        }}
      />
      <aside className={twJoin(proseClasses, 'prose-sm prose-gray')}>
        <p>
          <strong>OpenStreetMap Name:</strong> {user.osmName}
          <br />
          <span className="text-xs text-gray-500">
            <Link blank href="https://www.openstreetmap.org/account/edit">
              Im OSM Profil bearbeiten
            </Link>
            .
          </span>
        </p>
      </aside>
    </div>
  )
}
