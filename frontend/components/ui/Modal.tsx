"use client";

import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
}: ModalProps) {
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
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Modal body */}
          <div>{children}</div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
