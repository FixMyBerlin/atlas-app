import { UserIcon } from '@heroicons/react/24/outline'
import { Route } from 'next'
import { useRouter } from 'next/navigation'

export const UserLoggedOut = () => {
  const router = useRouter()
  const loginUrl = `/login?next=${encodeURIComponent(
    `${location.pathname}${location.search}`,
  ).toString()}` as Route

  return (
    <button
      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none  focus:ring-2 focus:ring-inset focus:ring-white sm:ml-6 sm:border sm:border-gray-700"
      onClick={() => void router.push(loginUrl)}
    >
      <span className="sr-only">Anmelden</span>
      <UserIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  )
}
