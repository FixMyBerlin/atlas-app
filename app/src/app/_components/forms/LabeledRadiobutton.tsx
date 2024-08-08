import { ErrorMessage } from '@hookform/error-message'
import { ComponentPropsWithoutRef, PropsWithoutRef, forwardRef, type JSX } from 'react'
import { useFormContext } from 'react-hook-form'
import { twJoin, twMerge } from 'tailwind-merge'

export interface LabeledRadiobuttonProps extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
  /** Radiobutton scope */
  scope: string
  /** The field value must be a string. If the value is a number in the DB, it needs to be parsed to a string to be used as `initialValues`. When passed to the mutation, the value needs to be parsed back to a number using `parseInt`. This requires corresponding modifications to the ZOD schemas. */
  value: string
  /** Field label */
  label: string | React.ReactNode
  /** Optional help text below field label */
  help?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>
  labelProps?: ComponentPropsWithoutRef<'label'>
  readonly?: boolean
}

// Note: See also src/participation/components/form/ParticipationLabeledRadiobutton.tsx
export const LabeledRadiobutton = forwardRef<HTMLInputElement, LabeledRadiobuttonProps>(
  ({ scope, value, label, help, outerProps, labelProps, readonly, ...props }, _ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext()

    const hasError = Boolean(errors[value])
    const key = [scope, value].join('-')

    return (
      <div
        {...outerProps}
        className={twMerge(
          outerProps?.className,
          'flex break-inside-avoid items-center justify-start',
        )}
      >
        <div className="flex h-5 items-center">
          <input
            type="radio"
            disabled={isSubmitting || readonly}
            value={value}
            {
              ...register(scope) /* this adds the name property */
            }
            id={key}
            {...props}
            className={twJoin(
              'h-4 w-4',
              hasError
                ? 'border-red-800 text-red-500 shadow-sm shadow-red-200 focus:ring-red-800'
                : readonly
                  ? 'border-gray-300 bg-gray-50'
                  : 'border-gray-300 text-blue-600 focus:ring-blue-500',
            )}
            readOnly={readonly}
          />
        </div>
        <label
          {...labelProps}
          htmlFor={key}
          className={twMerge(
            'ml-3 block text-sm font-medium',
            readonly
              ? 'text-gray-400'
              : 'cursor-pointer whitespace-nowrap text-gray-700 hover:text-gray-800',
            labelProps?.className,
          )}
        >
          {label}
          {help && <div className="m-0 text-gray-500">{help}</div>}
          <ErrorMessage
            render={({ message }) => (
              <p role="alert" className="m-0 text-sm text-red-800">
                {message}
              </p>
            )}
            errors={errors}
            name={value}
          />
        </label>
      </div>
    )
  },
)

LabeledRadiobutton.displayName = 'LabeledRadiobutton'
