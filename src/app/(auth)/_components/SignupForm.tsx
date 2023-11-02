'use client'

import { useMutation } from '@blitzjs/rpc'
import { useRouter } from 'next/router'
import { Form, FORM_ERROR } from 'src/app/_components/forms/Form'
import { LabeledTextField } from 'src/app/_components/forms/LabeledTextField'
import signup from 'src/auth/mutations/signup'
import { Signup } from 'src/auth/schemas'

export const SignupForm = () => {
  const router = useRouter()
  const [signupMutation] = useMutation(signup)
  return (
    <>
      <h1>Create an Account</h1>

      <Form
        submitText="Create Account"
        schema={Signup}
        initialValues={{ email: '', password: '' }}
        onSubmit={async (values) => {
          try {
            await signupMutation(values)
            router.push('/')
          } catch (error: any) {
            if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
              // This error comes from Prisma
              return { email: 'This email is already being used' }
            } else {
              return { [FORM_ERROR]: error.toString() }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
      </Form>
    </>
  )
}

export default SignupForm
