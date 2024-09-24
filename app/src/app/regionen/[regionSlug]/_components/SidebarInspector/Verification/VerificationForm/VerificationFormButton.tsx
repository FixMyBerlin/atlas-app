import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { SmallSpinner } from 'src/app/_components/Spinner/SmallSpinner'
import { buttonStyles } from 'src/app/_components/links/styles'
import { twJoin } from 'tailwind-merge'

export const VerificationFormButton = () => {
  const {
    formState: { isSubmitting, isSubmitSuccessful },
    reset,
  } = useFormContext()

  useEffect(() => {
    reset()
  }, [isSubmitSuccessful, reset])

  return (
    <div className="flex items-center gap-3">
      <button
        type="submit"
        disabled={isSubmitting}
        className={twJoin(
          buttonStyles,
          'bg-white px-3 py-1',
          isSubmitting
            ? 'cursor-not-allowed border-gray-300 text-gray-400 shadow-sm hover:bg-white'
            : 'border-gray-400 shadow-md',
        )}
      >
        Speichern
      </button>
      {isSubmitting && <SmallSpinner />}
    </div>
  )
}
