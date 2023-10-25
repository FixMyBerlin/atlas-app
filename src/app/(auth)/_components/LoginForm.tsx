'use client'

import { useMutation } from '@blitzjs/rpc'
import { AuthenticationError, PromiseReturnType } from 'blitz'
import Link from 'next/link'
import { FORM_ERROR, Form } from 'src/app/_components/forms/Form'
import { LabeledTextField } from 'src/app/_components/forms/LabeledTextField'
import login from 'src/auth/mutations/login'
import { Login } from 'src/auth/schemas'

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)
  return (
    <>
      <h1>Login</h1>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: 'Sorry, those credentials are invalid' }
            } else {
              return {
                [FORM_ERROR]:
                  'Sorry, we had an unexpected error. Please try again. - ' + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <div>
          <Link href="/forgot-password">Forgot your password?</Link>
        </div>
      </Form>

      <div style={{ marginTop: '1rem' }}>
        Or <Link href="/signup">Sign Up</Link>
      </div>
    </>
  )
}

export default LoginForm
