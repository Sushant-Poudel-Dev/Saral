"use client";

import QuoteImage from "../media/Quote.svg";

export default function Quote({ text }) {
  return (
    <>
      <div className='flex flex-col justify-center items-center bg-green mt-10 md:mt-25 p-4 md:p-10 py-16 md:py-25 pb-16 md:pb-20 text-center relative'>
        <img
          src={QuoteImage.src}
          alt='"'
          className='w-6 md:w-8 absolute top-8 md:top-[3.5rem] left-4 md:left-[20.5rem] rotate-180'
        />
        <h2 className='w-[90%] md:w-[50%] text-xl md:!text-[1.5rem]'>{text}</h2>
        <img
          src={QuoteImage.src}
          alt='"'
          className='w-6 md:w-8 absolute bottom-20 md:bottom-[8.5rem] right-4 md:right-[20.5rem]'
        />
        <h2 className='mt-6 md:mt-8'> - Saral Team</h2>
      </div>
    </>
  );
}
