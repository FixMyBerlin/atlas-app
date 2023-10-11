'use client'

import { Routes } from '@blitzjs/next'
import { useMutation } from '@blitzjs/rpc'
import { assert } from 'blitz'
import Link from 'next/link'
import { useRouter } from 'next/router'
import resetPassword from 'src/auth/mutations/resetPassword'
import { ResetPassword } from 'src/auth/schemas'
import { Form, FORM_ERROR } from 'src/app/_components/forms/Form'
import { LabeledTextField } from 'src/app/_components/forms/LabeledTextField'

export default function ResetPasswordPage() {
  const router = useRouter()
  const token = router.query.token?.toString()
  const [resetPasswordMutation, { isSuccess }] = useMutation(resetPassword)

  return (
    <>
      <h1>Set a New Password</h1>

      {isSuccess ? (
        <div>
          <h2>Password Reset Successfully</h2>
          <p>
            Go to the <Link href={Routes.Home()}>homepage</Link>
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
