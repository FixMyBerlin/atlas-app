'use client'

import { useMutation } from '@blitzjs/rpc'
import forgotPassword from 'src/auth/mutations/forgotPassword'
import { ForgotPassword } from 'src/auth/schemas'
import { Form, FORM_ERROR } from 'src/app/_components/forms/Form'
import { LabeledTextField } from 'src/app/_components/forms/LabeledTextField'
import { MetaTags } from 'src/app/_components/layouts/MetaTags/MetaTags'

export default function ForgotPasswordPage() {
  const [forgotPasswordMutation, { isSuccess }] = useMutation(forgotPassword)

  return (
    <>
      <MetaTags noindex title="Passwort vergessen" />

      <h1>Passwort vergessen</h1>

      {isSuccess ? (
        <div>
          <h2>Request Submitted</h2>
          <p>
            If your email is in our system, you will receive instructions to reset your password
            shortly.
          </p>
        </div>
      ) : (
        <Form
          submitText="Send Reset Password Instructions"
          schema={ForgotPassword}
          initialValues={{ email: '' }}
          onSubmit={async (values) => {
            try {
              await forgotPasswordMutation(values)
            } catch (error: any) {
              return {
                [FORM_ERROR]: 'Sorry, we had an unexpected error. Please try again.',
              }
            }
          }}
        >
          <LabeledTextField name="email" label="Email" placeholder="Email" />
        </Form>
      )}
    </>
  )
}

ForgotPasswordPage.authenticate = false
