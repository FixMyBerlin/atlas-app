import { Disclosure } from '@headlessui/react'
import { InformationCircleIcon as InformationCircleIconOutline } from '@heroicons/react/24/outline'
import { InformationCircleIcon } from '@heroicons/react/24/solid'

export const ValueDisclosure = ({ children }: { children: React.ReactNode }) => {
  return <Disclosure>{children}</Disclosure>
}

export const ValueDisclosureButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <Disclosure.Button className="group/button flex w-full items-center justify-between gap-1 text-left">
      <div className="w-full">{children}</div>
      <div className="rounded border border-transparent bg-gray-50 p-1 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-gray-500 focus-visible:ring-opacity-75 group-hover/button:border-gray-500 group-hover/button:bg-yellow-100">
        <InformationCircleIcon
          className="hidden h-5 w-5 data-[headlessui-state=open]:block"
          title="Hinweise anzeigen…"
        />
        <InformationCircleIconOutline
          className="block h-5 w-5 data-[headlessui-state=open]:hidden"
          title="Hinweise anzeigen…"
        />
      </div>
    </Disclosure.Button>
  )
}

export const ValueDisclosurePanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Disclosure.Panel className="mt-0.5 text-xs leading-tight text-gray-400 [&>p]:mt-1 [&>p]:first:mt-0">
      {children}
    </Disclosure.Panel>
  )
}
