import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import { Tooltip } from 'src/app/_components/Tooltip/Tooltip'
import { Link } from 'src/app/_components/links/Link'
import { getOsmUrl } from 'src/app/_components/utils/getOsmUrl'

type Props = { osmName?: string; firstName?: string; lastName?: string; hasPermission: boolean }

export const OsmUserLink = ({ osmName, firstName, lastName, hasPermission }: Props) => {
  if (!osmName) return <>Eine anonyme Nutzer:in</>

  return (
    <span className="inline-flex items-center gap-1">
      {firstName} {lastName}
      <Link blank href={getOsmUrl(`/user/${osmName}`)} className="relative">
        {osmName}{' '}
      </Link>{' '}
      {hasPermission ? (
        <Tooltip text="Ist Mitarbeiter:in dieser Region">
          <CheckBadgeIcon className="h-5 w-5" />
        </Tooltip>
      ) : (
        ''
      )}
    </span>
  )
}
