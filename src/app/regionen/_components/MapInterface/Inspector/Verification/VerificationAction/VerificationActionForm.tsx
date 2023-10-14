'use client'

import { useMutation } from '@blitzjs/rpc'
import { clsx } from 'clsx'
import { useForm } from 'react-hook-form'
import Form, { FORM_ERROR, FormProps } from 'src/app/_components/forms/Form'
import { buttonStyles } from 'src/app/_components/links/styles'
import { useUserStore } from 'src/app/regionen/_components/MapInterface/UserInfo/useUserStore'
import { useMapStateInteraction } from 'src/app/regionen/_components/MapInterface/mapStateInteraction/useMapStateInteraction'
import createBikelaneVerification from 'src/bikelane-verifications/mutations/createBikelaneVerification'
import {
  TVerificationSchema,
  TVerificationStatus,
  verificationStatusOptions,
} from 'src/bikelane-verifications/schemas'
import invariant from 'tiny-invariant'
import { z } from 'zod'
import { verifiedColor } from '../verifiedColor.const'

export function VerificationActionForm<S extends z.ZodType<any, any>>(
  props: Omit<FormProps<S>, 'onSubmit'> & {
    disabled: boolean
    verificationStatus: TVerificationStatus | undefined
  },
) {
  const { disabled, verificationStatus } = props
  const [createBikelaneVerificationMutation] = useMutation(createBikelaneVerification)
  const { currentUser } = useUserStore()
  // TODO MIGRATION: Do we still need removeLocalUpdate ?
  const { addLocalUpdate } = useMapStateInteraction()
  const {
    register,
    formState: { isSubmitting, errors },
  } = useForm()

  const handleSubmit = async (values) => {
    try {
      invariant(currentUser?.id, 'User is required')

      const newVerificationItem: Omit<TVerificationSchema, 'id'> = {
        osm_id: BigInt(values.osm_id),
        osm_type: 'W',
        verified_at: new Date().toISOString(),
        verified_by: BigInt(currentUser.id),
        verified: values.verified_status,
        comment: values.comment.trim(),
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
    <Form<S> {...props} onSubmit={handleSubmit}>
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
        <div className="flex">
          {verificationStatusOptions.map((verificationOption) => {
            const verificationOptionTranslations: Record<TVerificationStatus, string> = {
              approved: verifiedOnce ? 'Daten richtig' : 'Richtig',
              rejected: 'Daten überarbeiten',
            }
            const active = verificationStatus
              ? verificationOption === verificationStatus
              : verificationOption === 'approved'

            return (
              <label
                key={verificationOption}
                htmlFor={verificationOption}
                className="group flex cursor-pointer select-none items-start border border-gray-300 bg-gray-100 p-2 shadow-sm first:-mr-px first:rounded-l-md last:rounded-r-md hover:bg-gray-50"
              >
                <div className="flex h-5 items-center">
                  <input
                    type="radio"
                    {...register('verified_status')}
                    value={verificationOption}
                    id={verificationOption}
                    defaultChecked={active}
                    className="h-4 w-4 border-gray-300 text-yellow-500 focus:ring-0"
                    disabled={disabled}
                    style={{ color: verifiedColor[verificationOption] }}
                  />
                </div>
                <div className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                  {verificationOptionTranslations[verificationOption]}
                </div>
              </label>
            )
          })}
        </div>

        <div>
          <label htmlFor="comment" className="sr-only">
            Optionaler Kommentar
          </label>
          <div className="mt-2">
            {/* Potentially resize height automatically with https://medium.com/@oherterich/creating-a-textarea-with-dynamic-height-using-react-and-typescript-5ed2d78d9848 */}
            <textarea
              {...register('comment')}
              placeholder="Optionaler Kommentar"
              rows={2}
              className="block w-full rounded-md border-0 bg-gray-50 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:py-1.5 sm:text-sm sm:leading-6"
              defaultValue={''}
              disabled={disabled}
            />
          </div>
        </div>

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
