import { twJoin } from 'tailwind-merge'
import { FormattedMessage } from 'react-intl'
import { proseClasses } from '../text/prose'
import { isDev } from '../utils/isEnv'

type Props = {
  formError: any // TODO buil proper type
}

// See also https://github.com/blitz-js/blitz/issues/4059
export const FormError: React.FC<Props> = ({ formError }) => {
  if (!formError) return null

  return (
    <div role="alert" className={twJoin(proseClasses, 'rounded bg-red-50 px-2 py-1 text-red-800')}>
      {formError.name === 'ZodError' ? (
        <>
          {(formError?.issues || formError?.message || []).map((error: any) => (
            <>
              <code className="text-red-800">{error.path[0]}</code>: {error.message}
              <br />
            </>
          ))}
        </>
      ) : (
        <span
          {...(isDev ? { 'data-message-id': formError.toString().replaceAll('\n', '') } : {})}
          className="font-mono text-sm leading-tight"
        >
          <FormattedMessage
            id={formError.toString().replaceAll('\n', '')}
            defaultMessage={formError}
          />
        </span>
      )}
    </div>
  )
}
