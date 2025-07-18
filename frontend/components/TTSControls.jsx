"use client";

export default function TTSControls({
  onSubmit,
  onStop,
  onClear,
  isLoading = false,
  isPlaying = false,
  language,
  setLanguage,
  speed,
  setSpeed,
  enableParagraphIsolation,
  setEnableParagraphIsolation,
  enableSentenceIsolation,
  setEnableSentenceIsolation,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  hasText = false,
}) {
  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "ne", name: "Nepali" },
  ];

  const availableSpeeds = [
    { value: "slow", name: "Slow", rate: 0.5 },
    { value: "normal", name: "Normal", rate: 1 },
    { value: "fast", name: "Fast", rate: 1.5 },
  ];

  return (
    <div>
      {/* Main Controls */}
      <div className='flex gap-2 mt-2'>
        <button
          type='submit'
          onClick={onSubmit}
          disabled={isLoading || !hasText}
          className='border-1 p-2 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
        >
          {isLoading ? (
            <>
              <span className='animate-spin'>⏳</span>
              Processing...
            </>
          ) : (
            <>Speak Text</>
          )}
        </button>

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          disabled={isLoading}
          className='border-1 p-2 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
        >
          {availableLanguages.map((lang) => (
            <option
              key={lang.code}
              value={lang.code}
            >
              {lang.name}
            </option>
          ))}
        </select>

        <select
          value={speed}
          onChange={(e) => setSpeed(e.target.value)}
          disabled={isLoading}
          className='border-1 p-2 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
          title='Speech Speed'
        >
          {availableSpeeds.map((speedOption) => (
            <option
              key={speedOption.value}
              value={speedOption.value}
            >
              {speedOption.name}
            </option>
          ))}
        </select>

        <button
          type='button'
          onClick={onClear}
          disabled={isLoading}
          className='border-1 p-2 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200'
        >
          Clear
        </button>

        <button
          type='button'
          onClick={onStop}
          disabled={!isPlaying}
          className='border-1 p-2 hover:cursor-pointer hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50'
        >
          Stop
        </button>
      </div>

      {/* Reading Mode Settings */}
      <div className='flex gap-4 mt-2 items-center flex-wrap'>
        <label className='flex items-center gap-2 text-sm cursor-pointer'>
          <input
            type='checkbox'
            checked={enableParagraphIsolation}
            onChange={(e) => setEnableParagraphIsolation(e.target.checked)}
            disabled={isLoading || enableSentenceIsolation}
            className='h-4 w-4'
          />
          <span>Focus on current paragraph (blur others)</span>
        </label>

        <label className='flex items-center gap-2 text-sm cursor-pointer'>
          <input
            type='checkbox'
            checked={enableSentenceIsolation}
            onChange={(e) => setEnableSentenceIsolation(e.target.checked)}
            disabled={isLoading || enableParagraphIsolation}
            className='h-4 w-4'
          />
          <span>Focus on current sentence (blur others)</span>
        </label>
      </div>

      {/* Typography Settings */}
      <div className='flex gap-4 mt-2 items-center'>
        <label className='flex items-center gap-2 text-sm'>
          <span>Letter Spacing:</span>
          <div className='flex items-center gap-2'>
            <input
              type='range'
              min='-0.1'
              max='0.2'
              step='0.01'
              value={letterSpacing}
              onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
              disabled={isLoading}
              className='w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
            />
            <span className='text-xs text-gray-600 w-12'>
              {letterSpacing > 0 ? "+" : ""}
              {letterSpacing.toFixed(2)}em
            </span>
          </div>
        </label>

        <label className='flex items-center gap-2 text-sm'>
          <span>Line Height:</span>
          <div className='flex items-center gap-2'>
            <input
              type='range'
              min='1'
              max='3'
              step='0.1'
              value={lineHeight}
              onChange={(e) => setLineHeight(parseFloat(e.target.value))}
              disabled={isLoading}
              className='w-20 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
            />
            <span className='text-xs text-gray-600 w-8'>
              {lineHeight.toFixed(1)}
            </span>
          </div>
        </label>
      </div>
    </div>
  );
}
