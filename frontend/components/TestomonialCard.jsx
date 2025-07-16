"use client";

export default function TestimonialCard({
  className = "",
  testimonial = "",
  userName = "User Name",
  userRank = "User academic rank",
}) {
  return (
    <div
      className={`flex flex-col items-center text-center p-10 py-16 rounded-lg ${className}`}
    >
      <p className='w-[20rem] mb-4'>{testimonial}</p>
      <div className='opacity-80'>
        <p className='!font-semibold'>{userName}</p>
        <p>{userRank}</p>
      </div>
    </div>
  );
}
