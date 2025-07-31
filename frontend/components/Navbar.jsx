"use client";

import Button from "./ui/Button";
import Link from "next/link";
import saralLogo from "../media/saralLogo.svg";

export default function Navbar() {
  const handleCTAClick = () => {
    // Navigate to the feature page
    window.location.href = "/feature";
  };

  const handleLogoClick = () => {
    // Navigate to the home page
    window.location.href = "/";
  };

  return (
    <>
      <div className='flex justify-between py-4 px-6 items-center'>
        <div className='w-[70rem]'>
          <button
            onClick={handleLogoClick}
            className='cursor-pointer'
          >
            <img
              src={saralLogo.src}
              alt='Saral Logo'
              className='h-10 ml-2 inline-block'
            />
          </button>
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
            onClick={handleCTAClick}
          />
        </div>
      </div>
    </>
  );
}
