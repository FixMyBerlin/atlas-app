import { Routes } from '@blitzjs/next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useMutation } from '@blitzjs/rpc'
import Layout from 'src/core/layouts/Layout'
import { VerificationSchema } from 'src/bikelane-verifications/schemas'
import createBikelaneVerification from 'src/bikelane-verifications/mutations/createBikelaneVerification'
import {
  BikelaneVerificationForm,
  FORM_ERROR,
} from 'src/bikelane-verifications/components/BikelaneVerificationForm'
import { Suspense } from 'react'

const NewBikelaneVerificationPage = () => {
  const router = useRouter()
  const [createBikelaneVerificationMutation] = useMutation(createBikelaneVerification)

  return (
    <Layout title={'Create New BikelaneVerification'}>
      <h1>Create New BikelaneVerification</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <BikelaneVerificationForm
          submitText="Create BikelaneVerification"
          schema={VerificationSchema}
          // initialValues={{}}
          onSubmit={async (values) => {
            try {
              const bikelaneVerification = await createBikelaneVerificationMutation(values)
              await router.push(
                Routes.ShowBikelaneVerificationPage({
                  bikelaneVerificationId: bikelaneVerification.id,
                }),
              )
            } catch (error: any) {
              console.error(error)
              return {
                [FORM_ERROR]: error.toString(),
              }
            }
          }}
        />
      </Suspense>
      <p>
        <Link href={Routes.BikelaneVerificationsPage()}>BikelaneVerifications</Link>
      </p>
    </Layout>
  )
}

NewBikelaneVerificationPage.authenticate = true

export default NewBikelaneVerificationPage
