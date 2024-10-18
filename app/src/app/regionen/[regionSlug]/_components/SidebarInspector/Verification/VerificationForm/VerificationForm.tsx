import { Spinner } from '@/src/app/_components/Spinner/Spinner'
import Form, { FORM_ERROR } from '@/src/app/_components/forms/Form'
import { useRegionSlug } from '@/src/app/regionen/[regionSlug]/_components/regionUtils/useRegionSlug'
import { useMapActions } from '@/src/app/regionen/[regionSlug]/_hooks/mapState/useMapState'
import createBikelaneVerification from '@/src/bikelane-verifications/mutations/createBikelaneVerification'
import {
  FormVerificationSchema,
  TCreateVerificationSchema,
  TVerificationStatus,
  verificationStatusOptions,
} from '@/src/bikelane-verifications/schemas'
import { useCurrentUser } from '@/src/users/hooks/useCurrentUser'
import { useMutation } from '@blitzjs/rpc'
import { Suspense } from 'react'
import { twJoin } from 'tailwind-merge'
import invariant from 'tiny-invariant'
import { VerificationFormButton } from './VerificationFormButton'
import { VerificationFormComment } from './VerificationFormComment'
import { VerificationFormRadio } from './VerificationFormRadio'

export function VerificationFormWithQuery({
  initialValues,
  disabled,
  verificationStatus,
  refetchVerifications,
}: {
  initialValues: Record<string, any>
} & Pick<Props, 'disabled' | 'verificationStatus' | 'refetchVerifications'>) {
  const user = useCurrentUser()
  const regionSlug = useRegionSlug()
  const [createBikelaneVerificationMutation] = useMutation(createBikelaneVerification)

  // Reminder: We cannot use useForm() here. Instead we need to use useFormContext() from a child component of <Form>

  const { addLocalUpdate } = useMapActions()
  const handleSubmit = async (values) => {
    try {
      invariant(user)
      const newVerificationItem: TCreateVerificationSchema = {
        osm_type: 'W',
        osm_id: values.osm_id,
        verified_by: user.osmId,
        verified: values.verified,
        comment: values.comment?.trim(),
      }
      await createBikelaneVerificationMutation({ regionSlug: regionSlug!, ...newVerificationItem })
      addLocalUpdate(newVerificationItem)
      refetchVerifications()
    } catch (error: any) {
      console.error(error)
      return {
        [FORM_ERROR]: error.toString(),
      }
    }
  }

  const verifiedOnce = verificationStatus && verificationStatusOptions.includes(verificationStatus)

  return (
    <Form schema={FormVerificationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
      <fieldset
        disabled={disabled}
        className={twJoin('mb-2 space-y-2', verifiedOnce ? 'flex flex-col' : '')}
      >
        <h4 className="mb-2 font-semibold text-gray-900">Daten prüfen</h4>
        {disabled && (
          <div className="mb-2">
            Ein Status kann nur eingetragen werden, wenn die Primärdaten vorliegen.
          </div>
        )}

        <VerificationFormRadio
          verifiedOnce={verifiedOnce}
          verificationStatus={verificationStatus}
        />
        <VerificationFormComment />

        <VerificationFormButton />
      </fieldset>
    </Form>
  )
}

type Props = {
  disabled: boolean
  osmId: number
  verificationStatus: TVerificationStatus | undefined
  refetchVerifications: () => void
}

export const VerificationForm = ({
  disabled: outerDisabled,
  osmId,
  verificationStatus,
  refetchVerifications,
}: Props) => {
  return (
    <Suspense fallback={<Spinner />}>
      <VerificationFormWithQuery
        disabled={outerDisabled}
        verificationStatus={verificationStatus}
        initialValues={{ osm_id: osmId }}
        refetchVerifications={refetchVerifications}
      />
    </Suspense>
  )
}
