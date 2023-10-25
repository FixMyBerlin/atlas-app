'use client'

import { useMutation } from '@blitzjs/rpc'
import { assert } from 'blitz'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FORM_ERROR, Form } from 'src/app/_components/forms/Form'
import { LabeledTextField } from 'src/app/_components/forms/LabeledTextField'
import resetPassword from 'src/auth/mutations/resetPassword'
import { ResetPassword } from 'src/auth/schemas'

// TODO: Formular in client component extrahieren und page zu server component machen
// export const metadata: Metadata = { title: 'Passwort neu vergeben' }

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = String(searchParams?.get('token'))
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <>
      <h1>Passwort neu vergeben</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href="/">homepage</Link>
          </p>
        </div>
      ) : (
        <Form
          submitText="Reset Password"
          schema={ResetPassword}
          initialValues={{
            password: '',
            passwordConfirmation: '',
            token,
          }}
          onSubmit={async (values) => {
            try {
              assert(token, 'token is required.')
              await resetPasswordMutation({ ...values, token })
            } catch (error: any) {
              if (error.name === 'ResetPasswordError') {
                return {
                  [FORM_ERROR]: error.message,
                }
              } else {
                return {
                  [FORM_ERROR]: 'Sorry, we had an unexpected error. Please try again.',
                }
              }
            }
          }}
        >
          <LabeledTextField name="password" label="New Password" type="password" />
          <LabeledTextField
            name="passwordConfirmation"
            label="Confirm New Password"
            type="password"
          />
        </Form>
      )}
    </>
  )
}

ResetPasswordPage.redirectAuthenticatedTo = '/'
