"use client";

import { Volume2, Type, Palette, Play, Square, Loader2 } from "lucide-react";

type ModalType = "typography" | "audio" | "display" | null;

interface MobileBottomNavbarProps {
  onSelect: (type: ModalType) => void;
  onPlayStop?: () => void;
  isPlaying?: boolean;
  isLoading?: boolean;
  hasText?: boolean;
}

export default function MobileBottomNavbar({
  onSelect,
  onPlayStop,
  isPlaying = false,
  isLoading = false,
  hasText = false,
}: MobileBottomNavbarProps) {
  const items: {
    type: "typography" | "audio" | "display";
    icon: React.ElementType;
    label: string;
  }[] = [
    { type: "audio", icon: Volume2, label: "Audio" },
    { type: "typography", icon: Type, label: "Type" },
    { type: "display", icon: Palette, label: "Display" },
  ];

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50 md:hidden'>
      <div className='mx-3 mb-3 flex items-center gap-2 rounded-2xl bg-white/90 backdrop-blur-xl shadow-[0_-2px_24px_rgba(0,0,0,0.08)] border border-slate-200/60 p-2'>
        {items.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className='flex-1 flex flex-col items-center gap-0.5 py-2 rounded-xl text-slate-500 hover:text-(--primary) hover:bg-slate-50 active:bg-slate-100 transition-all duration-200'
          >
            <Icon className='w-5 h-5' />
            <span className='text-[10px] font-semibold tracking-wide uppercase'>
              {label}
            </span>
          </button>
        ))}

        {/* Divider */}
        <span className='w-px h-8 bg-slate-200 shrink-0' />

        {/* Play/Stop FAB */}
        <button
          onClick={onPlayStop}
          disabled={isLoading || !hasText}
          className='shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed active:scale-90'
          style={{
            background: isPlaying
              ? "linear-gradient(135deg, #e53e3e, #c53030)"
              : "linear-gradient(135deg, var(--darkblue), #6b5b6e)",
          }}
        >
          {isLoading ? (
            <Loader2 className='w-5 h-5 text-white animate-spin' />
          ) : isPlaying ? (
            <Square className='w-5 h-5 text-white' />
          ) : (
            <Play className='w-5 h-5 text-white' />
          )}
        </button>
      </div>
    </div>
  );
}
