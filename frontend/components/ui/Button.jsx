"use client";

export default function Button({
  text,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  icon = null,
}) {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        className={`bg-honey py-2.5 px-6 rounded-lg font-semibold cursor-pointer hover:opacity-85 disabled:opacity-50 flex items-center gap-2 transition-all duration-300 group ${className}`}
        disabled={disabled}
      >
        <span>{text}</span>
        {icon && (
          <div className='transition-transform duration-300 group-hover:translate-x-1'>
            {icon}
          </div>
        )}
      </button>
    </div>
  );
}
