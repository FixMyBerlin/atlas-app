import React, { useState } from 'react'
import { ModalDialog, ModalDialogProps } from './ModalDialog'

export type Props = Pick<ModalDialogProps, 'title' | 'buttonCloseName'> & {
  titleIcon?: ModalDialogProps['icon']
  triggerStyle: 'circle' | 'button'
  triggerIcon: React.ReactNode
  children: React.ReactNode
}

export const IconModal: React.FC<Props> = ({
  title,
  titleIcon = 'info',
  triggerStyle = 'button',
  children,
  buttonCloseName = 'Schließen',
  triggerIcon,
}) => {
  const [open, setOpen] = useState(false)

  const triggerStyles: Record<Props['triggerStyle'], string> = {
    circle:
      'inline-flex flex-none grow-0 items-center rounded-full border border-transparent bg-slate-300 px-1 py-1 text-sm font-medium leading-4 text-gray-500 shadow-sm hover:bg-yellow-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2',
    button:
      'inline-flex justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-500',
  }

  return (
    <>
      <button type="button" className={triggerStyles[triggerStyle]} onClick={() => setOpen(true)}>
        {triggerIcon}
      </button>
      <ModalDialog
        title={title}
        icon={titleIcon}
        open={open}
        setOpen={setOpen}
        buttonCloseName={buttonCloseName}
      >
        {children}
      </ModalDialog>
    </>
  )
}
