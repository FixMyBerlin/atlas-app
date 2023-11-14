import { useMutation } from '@blitzjs/rpc'
import { clsx } from 'clsx'

import Form, { FORM_ERROR } from 'src/app/_components/forms/Form'
import { useMapStateInteraction } from 'src/app/regionen/[regionSlug]/_components/mapStateInteraction/useMapStateInteraction'
import createBikelaneVerification from 'src/bikelane-verifications/mutations/createBikelaneVerification'
import {
  FormVerificationSchema,
  TCreateVerificationSchema,
  TVerificationStatus,
  verificationStatusOptions,
} from 'src/bikelane-verifications/schemas'
import { useCurrentUser } from 'src/users/hooks/useCurrentUser'
import invariant from 'tiny-invariant'
import { VerificationButton } from './VerificationButton'
import { VerificationComment } from './VerificationComment'
import { VerificationRadio } from './VerificationRadio'
import { useRegionSlug } from 'src/app/(pages)/_components/regionUtils/useRegionSlug'

type Props = {
  initialValues: Record<string, any>
  disabled: boolean
  verificationStatus: TVerificationStatus | undefined
}

export function VerificationActionForm({ initialValues, disabled, verificationStatus }: Props) {
  const user = useCurrentUser()
  const regionSlug = useRegionSlug()
  const [createBikelaneVerificationMutation] = useMutation(createBikelaneVerification)

  // Reminder: We cannot use useForm() here. Instead we need to use useFormContext() from a child component of <Form>

  const { addLocalUpdate } = useMapStateInteraction()
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
        className={clsx('mb-2 space-y-2', {
          'flex flex-col': verifiedOnce,
        })}
      >
        <h4 className="mb-2 font-semibold text-gray-900">Daten prüfen</h4>
        {disabled && (
          <div className="mb-2">
            Ein Status kann nur eingetragen werden, wenn die Primärdaten vorliegen.
          </div>
        )}

        <VerificationRadio verifiedOnce={verifiedOnce} verificationStatus={verificationStatus} />
        <VerificationComment />

        <VerificationButton />
      </fieldset>
    </Form>
  )
}
