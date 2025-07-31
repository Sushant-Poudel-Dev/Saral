"use client";

import Button from "./ui/Button";
import saralLogo from "../media/saralLogo.svg";

export default function Footer() {
  return (
    <>
      <div className='flex px-15 py-10'>
        <div className='w-[120%]'>
          <h2>Built for every mind.</h2>
          <img
            src={saralLogo.src}
            alt='Saral Logo'
            className='h-20 mt-2 ml-2 inline-block'
          />
        </div>
        <div className='w-full'>
          <h2>Stay updated with Saral</h2>
          <p className='opacity-80'>
            Get the latest updates on new features and accessibility
            improvements.
          </p>
          <div className='flex gap-5 mt-4'>
            <div className='relative w-3/5'>
              <svg
                className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                />
              </svg>
              <input
                type='text'
                name=''
                id=''
                placeholder='Enter your email'
                className='w-full py-3 px-2 pl-10 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-honey'
              />
            </div>
            <Button
              text='Subscribe'
              onClick={() => alert("Subscribed!")}
            />
          </div>
        </div>
      </div>
    </>
  );
}
