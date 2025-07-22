"use client";

import { useState, useRef, useEffect } from "react";

export default function Multiselect({
  options,
  selected = [],
  onChange,
  placeholder = "Select options",
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className='w-full'
      ref={containerRef}
    >
      <div
        className={`p-2 border rounded-lg flex items-center justify-between min-h-[42px] cursor-pointer ${
          disabled ? "bg-gray-100 opacity-70" : "bg-white"
        } ${isOpen ? "border-slate-400" : "border-gray-300"}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className='truncate flex-1'>
          {selected.length === 0 ? (
            <span className='text-gray-500'>{placeholder}</span>
          ) : (
            <span className='text-slate-800'>
              {selected.length} {selected.length === 1 ? "item" : "items"}{" "}
              selected
            </span>
          )}
        </div>
        <div className='ml-2 text-gray-500'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-4 w-4'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 9l-7 7-7-7'
            />
          </svg>
        </div>
      </div>

      {isOpen && !disabled && (
        <div
          ref={dropdownRef}
          className='md:static absolute z-[9999] w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2 mb-2'
          style={{
            width: "100%",
          }}
        >
          <div className='bg-white p-2 border-b border-gray-200'>
            <input
              type='text'
              placeholder='Search...'
              className='w-full p-2 border rounded text-sm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {filteredOptions.length === 0 ? (
            <div className='p-3 text-center text-gray-500'>
              No options found
            </div>
          ) : (
            filteredOptions.map((option) => (
              <div
                key={option.value}
                className={`p-2 hover:bg-slate-100 cursor-pointer flex items-center ${
                  selected.includes(option.value) ? "bg-slate-50" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(option.value);
                }}
              >
                <input
                  type='checkbox'
                  checked={selected.includes(option.value)}
                  onChange={() => {}}
                  className='mr-2'
                />
                <span className='flex-1'>{option.label}</span>
                {selected.includes(option.value) && (
                  <span className='text-green-600 ml-2'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
