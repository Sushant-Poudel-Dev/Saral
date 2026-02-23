"use client";

interface Option {
  value: string;
  label: string;
}

interface MultiselectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Multiselect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  disabled = false,
}: MultiselectProps) {
  const toggle = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div
      className={`space-y-1 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      {options.length === 0 && (
        <p className='text-sm text-gray-400'>{placeholder}</p>
      )}
      <div className='flex flex-wrap gap-2'>
        {options.map((opt) => (
          <button
            key={opt.value}
            type='button'
            onClick={() => toggle(opt.value)}
            className={`text-xs px-2 py-1 rounded border transition-all duration-150 ${
              selected.includes(opt.value)
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-white text-slate-700 border-slate-300 hover:border-slate-500"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
