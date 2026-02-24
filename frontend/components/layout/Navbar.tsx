"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSessionTracker } from "@/hooks/useSessionTracker";
import { LogIn } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  // Track session time while user is authenticated
  useSessionTracker();

  // Derive display values from real data
  const displayName =
    profile?.full_name?.split(" ")[0] ||
    user?.user_metadata?.name?.split(" ")[0] ||
    "User";
  const initials = (profile?.full_name || user?.user_metadata?.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url || null;

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

          {/* Auth-aware right section */}
          {isLoading ? (
            <div className='w-8 h-8 rounded-full bg-slate-100 animate-pulse' />
          ) : user ? (
            <button
              onClick={() => router.push("/profile")}
              className='flex items-center gap-2.5 pl-1 pr-3.5 py-1 rounded-full border border-slate-200/80 bg-white hover:border-(--honey)/40 hover:shadow-sm transition-all duration-200 cursor-pointer group'
            >
              <div className='w-8 h-8 rounded-full bg-(--honey)/15 flex items-center justify-center text-(--honey) text-xs font-bold shrink-0 overflow-hidden'>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt='Avatar'
                    className='w-full h-full rounded-full object-cover'
                    referrerPolicy='no-referrer'
                  />
                ) : (
                  initials
                )}
              </div>
              <span className='text-sm font-medium text-(--primary) hidden sm:inline group-hover:text-(--honey) transition-colors'>
                {displayName}
              </span>
            </button>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className='flex items-center gap-2 px-4 py-2 rounded-full bg-(--honey) text-white text-sm font-medium hover:bg-(--honey)/90 transition-all duration-200 cursor-pointer shadow-sm'
            >
              <LogIn className='w-4 h-4' />
              <span className='hidden sm:inline'>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
