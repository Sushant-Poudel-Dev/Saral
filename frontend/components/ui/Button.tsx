"use client";

import React from "react";

interface ButtonProps {
  text: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: React.ReactNode;
}

export default function Button({
  text,
  onClick,
  className = "",
  disabled = false,
  type = "button",
  icon = null,
}: ButtonProps) {
  return (
    <div>
      <button
        type={type}
        onClick={onClick}
        className={`bg-honey py-2.5 px-6 rounded-lg font-semibold cursor-pointer hover:opacity-85 disabled:opacity-50 flex items-center gap-2 transition-all duration-300 group ${className}`}
        disabled={disabled}
      >
        <span className='whitespace-nowrap'>{text}</span>
        {icon && (
          <div className='transition-transform duration-300 group-hover:translate-x-1'>
            {icon}
          </div>
        )}
      </button>
    </div>
  );
}
