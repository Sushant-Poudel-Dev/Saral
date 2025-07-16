"use client";

import QuoteImage from "../media/Quote.svg";

export default function Quote({ text }) {
  return (
    <>
      <div className='flex flex-col justify-center items-center bg-green mt-25 p-10 py-25 pb-20 text-center relative'>
        <img
          src={QuoteImage.src}
          alt='"'
          className='w-8 absolute top-[3.5rem] left-[20.5rem] rotate-180'
        />
        <h2 className='w-[50%] !text-[1.5rem]'>{text}</h2>
        <img
          src={QuoteImage.src}
          alt='"'
          className='w-8 absolute bottom-[8.5rem] right-[20.5rem]'
        />
        <h2 className='mt-8'> - Saral Team</h2>
      </div>
    </>
  );
}
