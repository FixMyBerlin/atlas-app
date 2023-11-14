import { useFormContext } from 'react-hook-form'

export const VerificationFormComment = () => {
  const {
    formState: { isSubmitting },
    register,
  } = useFormContext()

  return (
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
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}
