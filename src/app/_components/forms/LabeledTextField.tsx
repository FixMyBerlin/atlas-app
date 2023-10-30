import { ErrorMessage } from '@hookform/error-message'
import { ComponentPropsWithoutRef, PropsWithoutRef, forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements['input']> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: 'text' | 'password' | 'email' | 'number'
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements['div']>
  labelProps?: ComponentPropsWithoutRef<'label'>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ label, outerProps, labelProps, name, ...props }, ref) => {
    const {
      register,
      formState: { isSubmitting, errors },
    } = useFormContext()

    return (
      <div className="" {...outerProps}>
        <label className="block font-semibold" {...labelProps}>
          {label}
        </label>
        <input disabled={isSubmitting} {...register(name)} {...props} />

        <ErrorMessage
          render={({ message }) => (
            <div role="alert" className="text-red-500">
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

LabeledTextField.displayName = 'LabeledTextField'

export default LabeledTextField
