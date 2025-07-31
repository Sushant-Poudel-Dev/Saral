export default function FeatureCard({
  className = "",
  title = "",
  description = "",
  icon = null,
  onClick = () => {},
  isSpacingIncreased = false,
}) {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center text-center p-10 py-16 rounded-lg cursor-pointer transition-all duration-300 ${className}`}
    >
      {icon && <div className='mb-6'>{icon}</div>}
      <h2 className='mb-2 !font-semibold'>{title}</h2>
      <p
        className='w-[20rem] opacity-85'
        style={{
          height: "4.5rem", // fixed height to prevent jumping
          letterSpacing: isSpacingIncreased ? "0.15em" : "normal",
        }}
      >
        {description}
      </p>
    </div>
  );
}
