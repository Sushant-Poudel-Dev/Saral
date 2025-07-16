"use client";

// Force Tailwind to include all our custom colors
export default function TestColors() {
  return (
    <div className='hidden'>
      {/* This forces Tailwind to include these classes in the build */}
      <div className='bg-honey bg-green bg-pink bg-darkblue bg-yellow bg-blue'></div>
      <div className='hover:bg-honey/90 hover:bg-green/90 hover:bg-pink/90'></div>
      <div className='hover:bg-darkblue/90 hover:bg-yellow/90 hover:bg-blue/90'></div>
    </div>
  );
}
