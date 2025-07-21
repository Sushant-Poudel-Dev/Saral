"use client";

export default function TestimonialCard({
  className = "",
  testimonial = "",
  userName = "User Name",
  userRank = "User academic rank",
}) {
  return (
    <div
      className={`flex flex-col items-center text-center p-6 md:p-10 py-10 md:py-16 rounded-lg ${className}`}
    >
      <p className='w-full md:w-[20rem] mb-4'>{testimonial}</p>
      <div className='opacity-80'>
        <p className='!font-semibold'>{userName}</p>
        <p>{userRank}</p>
      </div>
    </div>
  );
}
