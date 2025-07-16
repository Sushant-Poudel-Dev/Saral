"use client";

export default function FeatureCard({
  className = "",
  title = "",
  description = "",
  icon = null,
}) {
  return (
    <div
      className={`flex flex-col items-center text-center p-10 py-16 rounded-lg ${className}`}
    >
      {icon && <div className='mb-6'>{icon}</div>}
      <h2 className='mb-2 !font-semibold'>{title}</h2>
      <p className='w-[20rem] opacity-85'>{description}</p>
    </div>
  );
}
