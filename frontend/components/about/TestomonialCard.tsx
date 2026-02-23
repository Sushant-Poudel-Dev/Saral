"use client";

import Image from "next/image";
import { useState } from "react";

interface TestimonialCardProps {
  className?: string;
  testimonial?: string;
  userName?: string;
  userRank?: string;
  image?: string | null;
}

export default function TestomonialCard({
  className = "",
  testimonial = "",
  userName = "User Name",
  userRank = "User academic rank",
  image = null,
}: TestimonialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col items-center justify-center text-center p-6 md:p-10 py-10 md:py-16 rounded-lg transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      {isHovered && image ? (
        <div className='relative h-64 w-[20rem]'>
          <Image
            src={image}
            alt={`${userName}'s photo`}
            fill
            className='object-cover rounded-lg'
          />
          {/* Fading overlay */}
          <div className='absolute inset-0 rounded-lg pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_40%,rgba(0,0,0,0.7)_100%)]' />
        </div>
      ) : (
        <>
          <p className='w-full md:w-[20rem] mb-4 min-h-18'>{testimonial}</p>
          <div className='opacity-80'>
            <p className='font-semibold!'>{userName}</p>
            <p>{userRank}</p>
          </div>
        </>
      )}
    </div>
  );
}
