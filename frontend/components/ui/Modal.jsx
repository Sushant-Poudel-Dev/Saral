"use client";

import { Dialog } from "@headlessui/react";

export default function Modal({ isOpen, onClose, title, children }) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className='relative z-50 sm:hidden'
    >
      {/* Background overlay */}
      <div
        className='fixed inset-0 bg-black/30'
        aria-hidden='true'
      />

      {/* Modal content wrapper */}
      <div className='fixed inset-0 flex items-end sm:items-center justify-center px-4'>
        <Dialog.Panel className='w-full max-w-md sm:rounded-xl rounded-t-xl bg-white p-6 max-h-[90vh] overflow-y-auto'>
          {/* Header */}
          <div className='flex justify-between items-center mb-4'>
            <Dialog.Title className='text-base font-semibold text-gray-800'>
              {title}
            </Dialog.Title>
            <button
              onClick={onClose}
              className='text-gray-500 hover:text-gray-700'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
