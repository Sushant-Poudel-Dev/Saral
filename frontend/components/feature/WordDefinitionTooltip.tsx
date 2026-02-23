"use client";

import { useEffect, useRef, useState } from "react";
import { X, Volume2, BookOpen } from "lucide-react";

interface WordDefinition {
  word: string;
  definition: string;
  phonetic?: string;
  partOfSpeech?: string;
  example?: string;
  audio?: string;
}

interface WordDefinitionTooltipProps {
  definition: WordDefinition | null;
  isLoading: boolean;
  error: string | null;
  isVisible: boolean;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

export default function WordDefinitionTooltip({
  definition,
  isLoading,
  error,
  isVisible,
  position,
  onClose,
}: WordDefinitionTooltipProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [adjustedPos, setAdjustedPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // Adjust position so the tooltip doesn't go off-screen
  useEffect(() => {
    if (!isVisible || !position) {
      setAdjustedPos(null);
      return;
    }
    const pad = 16;
    const tooltipW = 320;
    const tooltipH = 220;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x = position.x + 14;
    let y = position.y + 14;

    if (x + tooltipW + pad > vw) x = position.x - tooltipW - 14;
    if (y + tooltipH + pad > vh) y = position.y - tooltipH - 14;
    if (x < pad) x = pad;
    if (y < pad) y = pad;

    setAdjustedPos({ x, y });
  }, [isVisible, position]);

  const playAudio = () => {
    if (definition?.audio) {
      const audio = new Audio(definition.audio);
      audio.play();
    }
  };

  if (!isVisible || !adjustedPos) return null;

  return (
    <div
      ref={ref}
      className='fixed z-[100] animate-in fade-in-0 slide-in-from-bottom-2 duration-200'
      style={{ left: adjustedPos.x, top: adjustedPos.y, width: 320 }}
    >
      <div className='rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)] border border-slate-200/70 overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-4 pt-3.5 pb-2'>
          <div className='flex items-center gap-2 text-slate-300'>
            <BookOpen className='w-3.5 h-3.5' />
            <span className='text-[10px] font-semibold tracking-widest uppercase'>
              Definition
            </span>
          </div>
          <button
            onClick={onClose}
            className='p-1 -mr-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors'
          >
            <X className='w-3.5 h-3.5' />
          </button>
        </div>

        {/* Content */}
        <div className='px-4 pb-4'>
          {isLoading && (
            <div className='flex items-center gap-3 py-4'>
              <div className='w-5 h-5 rounded-full border-2 border-slate-200 border-t-slate-500 animate-spin' />
              <span className='text-sm text-slate-400'>Looking up word…</span>
            </div>
          )}

          {error && !isLoading && (
            <p className='text-sm text-slate-400 italic py-3'>{error}</p>
          )}

          {definition && !isLoading && (
            <div className='space-y-2.5'>
              {/* Word + phonetic */}
              <div className='flex items-end gap-2.5'>
                <h3 className='text-xl font-bold text-slate-800 leading-tight capitalize'>
                  {definition.word}
                </h3>
                {definition.phonetic && (
                  <span className='text-sm text-slate-400 font-mono pb-0.5'>
                    {definition.phonetic}
                  </span>
                )}
                {definition.audio && (
                  <button
                    onClick={playAudio}
                    className='p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mb-0.5'
                    title='Play pronunciation'
                  >
                    <Volume2 className='w-4 h-4' />
                  </button>
                )}
              </div>

              {/* Part of speech tag */}
              {definition.partOfSpeech && (
                <span className='inline-block text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-500'>
                  {definition.partOfSpeech}
                </span>
              )}

              {/* Definition */}
              <p className='text-[13px] leading-relaxed text-slate-600'>
                {definition.definition}
              </p>

              {/* Example */}
              {definition.example && (
                <p className='text-[12px] leading-relaxed text-slate-400 italic border-l-2 border-slate-200 pl-3'>
                  &ldquo;{definition.example}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
