import { useFormContext } from 'react-hook-form'
import { TVerificationStatus, verificationStatusOptions } from 'src/bikelane-verifications/schemas'
import { verifiedColor } from '../verifiedColor.const'

type Props = {
  verifiedOnce: boolean | undefined
  verificationStatus: TVerificationStatus | undefined
}

export const VerificationFormRadio = ({ verifiedOnce, verificationStatus }: Props) => {
  const {
    formState: { isSubmitting },
    register,
  } = useFormContext()

  return (
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
                {...register('verified')}
                value={verificationOption}
                id={verificationOption}
                defaultChecked={active}
                className="h-4 w-4 border-gray-300 text-yellow-500 focus:ring-0"
                disabled={isSubmitting}
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
  )
}
