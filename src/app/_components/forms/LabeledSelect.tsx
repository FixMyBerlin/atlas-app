import { ErrorMessage } from '@hookform/error-message'
import { twJoin } from 'tailwind-merge'
import { ComponentPropsWithoutRef, forwardRef, PropsWithoutRef } from 'react'
import { useFormContext } from 'react-hook-form'

export interface LabeledSelectProps extends PropsWithoutRef<JSX.IntrinsicElements['select']> {
  /** Select name. */
  name: string
  /** Options: [value, text], use `""` for `null` in some cases, see src/pages/[projectSlug]/uploads/[uploadId]/edit.tsx */
  options: [string | number | '', string][]
  /** Field label. */
  label: string
  help?: string | React.ReactNode
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>
  labelProps?: ComponentPropsWithoutRef<'label'>
  optional?: boolean
}

export const LabeledSelect = forwardRef<HTMLInputElement, LabeledSelectProps>(
  ({ name, options, label, help, outerProps, labelProps, optional, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext()

    const hasError = Boolean(errors[name])

    return (
      <div {...outerProps}>
        <label
          {...labelProps}
          htmlFor={name}
          className="mb-1 block text-sm font-semibold text-gray-700"
        >
          {label}
          {optional && <> (optional)</>}
        </label>
        <select
          disabled={isSubmitting}
          {...register(name)}
          id={name}
          {...props}
          className={twJoin(
            'w-full rounded-md border bg-white px-3 py-2 shadow-sm focus:outline-none sm:text-sm',
            hasError
              ? 'border-red-800 shadow-red-200 focus:border-red-800 focus:ring-red-800'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
          )}
        >
          {options.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
        {Boolean(help) && <p className="mt-2 text-sm text-gray-500">{help}</p>}

        <ErrorMessage
          render={({ message }) => (
            <div role="alert" className="mt-1 text-sm text-red-800">
              {message}
            </div>
          )}
          errors={errors}
          name={name}
        />
      </div>
    )
  },
)

LabeledSelect.displayName = 'LabeledSelect'
