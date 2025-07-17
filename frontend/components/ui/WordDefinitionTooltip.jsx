"use client";

import { useState, useEffect, useRef } from "react";

export default function WordDefinitionTooltip({
  definition,
  isLoading,
  error,
  isVisible,
  position = { x: 0, y: 0 },
  onClose,
}) {
  const [audioPlaying, setAudioPlaying] = useState(false);
  const tooltipRef = useRef(null);

  console.log("WordDefinitionTooltip props:", {
    isVisible,
    definition,
    isLoading,
    error,
    position,
  });

  // Handle click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const playAudio = () => {
    if (definition?.audio) {
      setAudioPlaying(true);
      const audio = new Audio(definition.audio);
      audio.onended = () => setAudioPlaying(false);
      audio.onerror = () => setAudioPlaying(false);
      audio.play().catch(() => setAudioPlaying(false));
    }
  };

  return (
    <div
      ref={tooltipRef}
      className='fixed z-50 bg-white border-2 border-gray-300 rounded-lg shadow-lg p-4 max-w-sm animate-fade-in'
      style={{
        left: `${Math.min(
          position.x,
          typeof window !== "undefined" ? window.innerWidth - 350 : position.x
        )}px`,
        top: `${Math.max(position.y - 10, 10)}px`,
        minWidth: "300px",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className='absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold w-6 h-6 flex items-center justify-center'
      >
        ×
      </button>

      {/* Loading state */}
      {isLoading && (
        <div className='flex items-center gap-2 text-gray-600'>
          <div className='animate-spin w-4 h-4 border-2 border-honey border-t-transparent rounded-full'></div>
          <span>Looking up definition...</span>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className='text-red-600'>
          <p className='font-semibold'>Error</p>
          <p className='text-sm'>{error}</p>
        </div>
      )}

      {/* Definition content */}
      {definition && !isLoading && !error && (
        <div className='space-y-3'>
          {/* Word and phonetic */}
          <div className='flex items-center gap-2 border-b border-gray-200 pb-2'>
            <h3 className='font-semibold text-lg text-darkblue capitalize'>
              {definition.word}
            </h3>
            {definition.phonetic && (
              <span className='text-gray-600 text-sm italic'>
                {definition.phonetic}
              </span>
            )}
            {definition.audio && (
              <button
                onClick={playAudio}
                disabled={audioPlaying}
                className='ml-2 text-honey hover:text-darkblue transition-colors disabled:opacity-50'
                title='Play pronunciation'
              >
                <svg
                  className='w-4 h-4'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                >
                  <path
                    fillRule='evenodd'
                    d='M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.814L4.382 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.382l4.001-3.814zM14.357 6.643a1 1 0 011.414 0 5.233 5.233 0 010 7.414 1 1 0 01-1.414-1.414 3.233 3.233 0 000-4.586 1 1 0 010-1.414zm2.829-2.828a1 1 0 011.414 0A9.23 9.23 0 0121 10a9.23 9.23 0 01-2.4 6.185 1 1 0 01-1.414-1.414A7.23 7.23 0 0019 10a7.23 7.23 0 00-1.814-4.771 1 1 0 010-1.414z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Part of speech */}
          {definition.partOfSpeech && (
            <div className='text-sm text-honey font-medium italic'>
              {definition.partOfSpeech}
            </div>
          )}

          {/* Definition */}
          <div>
            <p className='text-gray-800 leading-relaxed'>
              {definition.definition}
            </p>
          </div>

          {/* Example */}
          {definition.example && (
            <div className='bg-gray-50 p-3 rounded border-l-4 border-honey'>
              <p className='text-sm text-gray-700'>
                <span className='font-medium'>Example: </span>
                <em>"{definition.example}"</em>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
