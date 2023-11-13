import { useMutation } from '@blitzjs/rpc'
import { clsx } from 'clsx'
import { useForm } from 'react-hook-form'

import Form, { FORM_ERROR } from 'src/app/_components/forms/Form'
import { buttonStyles } from 'src/app/_components/links/styles'
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
import { VerificationComment } from './VerificationComment'
import { VerificationRadio } from './VerificationRadio'

type Props = {
  initialValues: Record<string, any>
  disabled: boolean
  verificationStatus: TVerificationStatus | undefined
}

export function VerificationActionForm({ initialValues, disabled, verificationStatus }: Props) {
  const user = useCurrentUser()
  const [createBikelaneVerificationMutation] = useMutation(createBikelaneVerification)
  const {
    formState: { isSubmitting },
  } = useForm()

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
      await createBikelaneVerificationMutation(newVerificationItem)
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
        disabled={disabled || isSubmitting}
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

        <VerificationRadio
          verifiedOnce={verifiedOnce}
          verificationStatus={verificationStatus}
          disabled={disabled}
        />
        <VerificationComment disabled={disabled} />

        <button
          type="submit"
          disabled={disabled}
          className={clsx(
            buttonStyles,
            'bg-white px-3 py-1',
            disabled
              ? 'cursor-not-allowed border-gray-300 text-gray-400 shadow-sm hover:bg-white'
              : 'border-gray-400 shadow-md',
          )}
        >
          Speichern
        </button>
      </fieldset>
    </Form>
  )
}
