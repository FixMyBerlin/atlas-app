import { TVerification } from 'src/bikelane-verifications/queries/getBikelaneVerification'
import { VerificationHistoryEntries } from './VerificationHistoryEntries'

type Props = {
  verifications: TVerification[]
  visible: boolean
}

export const VerificationHistory = ({ verifications, visible }: Props) => {
  if (!visible) return null

  // The first Item is shown by <VerificationStatus>
  const historyExceptFirst = verifications.slice(1)

  if (historyExceptFirst.length === 0) return null

  return (
    <details className="mb-0.5 mt-3">
      <summary className="cursor-pointer font-semibold text-gray-600">
        Prüfhistorie ({historyExceptFirst.length})
      </summary>
      <VerificationHistoryEntries history={historyExceptFirst} />
    </details>
  )
}
