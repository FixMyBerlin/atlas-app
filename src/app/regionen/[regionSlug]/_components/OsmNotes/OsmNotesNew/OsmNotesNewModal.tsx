import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useRef } from 'react'
import { CloseButton } from 'src/app/_components/CloseButton/CloseButton'
import { useMapStateInteraction } from '../../../_hooks/mapStateInteraction/useMapStateInteraction'
import { useNewOsmNoteMapParam } from '../../../_hooks/useQueryState/useOsmNotesParam'

export const OsmNotesNewModal = ({ children }: { children: React.ReactNode }) => {
  const { setNewOsmNoteMapParam } = useNewOsmNoteMapParam()
  const { setOsmNewNoteFeature } = useMapStateInteraction()
  const closeButtonRef = useRef(null)

  const setClose = () => {
    setNewOsmNoteMapParam(null)
    setOsmNewNoteFeature(undefined)
  }

  return (
    <Transition.Root appear show={true} as={Fragment}>
      <Dialog onClose={setClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 z-10 flex w-screen justify-center overflow-y-auto bg-gray-950/25 px-2 py-2 backdrop-blur-sm focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-gray-950/50" />
        </Transition.Child>

        <Transition.Child
          as="main"
          className="fixed inset-0 z-20 w-screen overflow-y-auto sm:pt-0"
          // Transition props
          enter="ease-out duration-300"
          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enterTo="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div className="mx-auto grid min-h-full max-w-7xl grid-rows-[1fr_auto] justify-items-center p-2.5 sm:grid-rows-[1fr_auto_3fr] sm:p-4">
            <Transition.Child
              as={Dialog.Panel}
              className="relative row-start-2 w-full min-w-0 overflow-clip rounded-lg bg-amber-50 shadow-xl ring-1 ring-gray-950/10 sm:mb-auto dark:bg-gray-900 dark:ring-white/10 forced-colors:outline"
              // Transition props
              enter="ease-out duration-100"
              enterFrom="sm:scale-95"
              enterTo="sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="sm:scale-100"
              leaveTo="sm:scale-100"
            >
              <CloseButton
                ref={closeButtonRef}
                onClick={setClose}
                positionClasses="absolute z-30 top-2 right-2"
              />
              {children}
            </Transition.Child>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}
