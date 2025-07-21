"use client";

import Button from "./ui/Button";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <div className='flex justify-between py-4 px-6 items-center'>
        <div className='w-[70rem]'>
          <span>SARAL</span>
        </div>
        <div className='flex items-center justify-between w-full'>
          <ul className='hidden md:flex space-x-30 item-center'>
            <li className='text-lg'>
              <Link href='/'>Home</Link>
            </li>
            <li className='text-lg'>
              <Link href='/feature'>Feature</Link>
            </li>
          </ul>
          <Button
            text='Saral Now'
            className='whitespace-nowrap min-w-[120px]'
          />
        </div>
      </div>
    </>
  );
}
