import { Switch } from '@headlessui/react'
import classNames from 'classnames'

type Props = {
  active: boolean
  handleChange: () => void
  children: React.ReactNode
}

export const Toggle: React.FC<Props> = ({ active, handleChange, children }) => {
  return (
    <Switch.Group
      as="div"
      className="flex min-h-[1.3rem] cursor-pointer items-center"
    >
      <Switch
        checked={active}
        onChange={handleChange}
        className="group relative inline-flex h-5 w-10 flex-shrink-0 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-full w-full rounded-md bg-white"
        />
        <span
          aria-hidden="true"
          className={classNames(
            active ? 'bg-yellow-500' : 'bg-gray-200',
            'pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out'
          )}
        />
        <span
          aria-hidden="true"
          className={classNames(
            active ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-gray-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out'
          )}
        />
      </Switch>
      <Switch.Label
        as="div"
        className="ml-2 text-sm font-medium leading-[17px] text-gray-900"
      >
        {children}
      </Switch.Label>
    </Switch.Group>
  )
}
