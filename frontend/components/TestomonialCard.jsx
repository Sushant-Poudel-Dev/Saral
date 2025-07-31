"use client";

import { useState } from "react";

export default function TestimonialCard({
  className = "",
  testimonial = "",
  userName = "User Name",
  userRank = "User academic rank",
  image = null,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex flex-col items-center justify-center text-center p-6 md:p-10 py-10 md:py-16 rounded-lg transition-all duration-300 cursor-pointer overflow-hidden ${className}`}
    >
      {isHovered && image ? (
        <div className='relative h-[16rem] w-[20rem]'>
          <img
            src={image}
            alt={`${userName}'s photo`}
            className='h-full w-full object-cover rounded-lg'
          />
          {/* Fading overlay */}
          <div className='absolute inset-0 rounded-lg pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(0,0,0,0)_40%,_rgba(0,0,0,0.7)_100%)]' />
        </div>
      ) : (
        <>
          <p className='w-full md:w-[20rem] mb-4 min-h-[4.5rem]'>
            {testimonial}
          </p>
          <div className='opacity-80'>
            <p className='!font-semibold'>{userName}</p>
            <p>{userRank}</p>
          </div>
        </>
      )}
    </div>
  );
}
