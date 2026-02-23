"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";

// Hardcoded user — will come from auth context / API later
const currentUser = {
  name: "Sushant",
  initials: "SA",
  avatar: null as string | null,
};

export default function Navbar() {
  const router = useRouter();

  return (
    <>
      <div className='flex justify-between py-4 px-6 items-center'>
        <div className='w-[70rem]'>
          <button
            onClick={() => router.push("/")}
            className='cursor-pointer'
          >
            <Image
              src='/saralLogo.svg'
              alt='Saral Logo'
              width={80}
              height={40}
              className='h-10 w-auto ml-2 inline-block'
            />
          </button>
        </div>
        <div className='flex items-center justify-between w-full'>
          <ul className='hidden md:flex space-x-20 item-center'>
            <li className='text-lg'>
              <Link href='/'>Home</Link>
            </li>
            <li className='text-lg'>
              <Link href='/about'>About</Link>
            </li>
            <li className='text-lg'>
              <Link href='/feature'>Studio</Link>
            </li>
          </ul>

          {/* User profile button */}
          <button
            onClick={() => router.push("/profile")}
            className='flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-full border border-slate-200/80 bg-white hover:border-(--honey)/40 hover:shadow-sm transition-all duration-200 cursor-pointer group'
          >
            <div className='w-8 h-8 rounded-full bg-(--honey)/15 flex items-center justify-center text-(--honey) text-xs font-bold shrink-0'>
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt='Avatar'
                  className='w-full h-full rounded-full object-cover'
                />
              ) : (
                currentUser.initials
              )}
            </div>
            <span className='text-sm font-medium text-(--primary) hidden sm:inline group-hover:text-(--honey) transition-colors'>
              {currentUser.name}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}
