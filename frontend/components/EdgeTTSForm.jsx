"use client";
import { useState } from "react";

export default function EdgeTTSForm({
  onSubmit,
  isLoading,
  error,
  settings,
  onSettingsChange,
  voices,
  isLoadingVoices,
}) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
    }
  };

  const handleVoiceChange = (voiceName) => {
    onSettingsChange({ voice: voiceName });
  };

  const handleRateChange = (rate) => {
    onSettingsChange({ rate });
  };

  const handlePitchChange = (pitch) => {
    onSettingsChange({ pitch });
  };

  const rateOptions = [
    { value: "-50%", label: "Very Slow" },
    { value: "-25%", label: "Slow" },
    { value: "+0%", label: "Normal" },
    { value: "+25%", label: "Fast" },
    { value: "+50%", label: "Very Fast" },
    { value: "+100%", label: "Maximum" },
  ];

  const pitchOptions = [
    { value: "-200Hz", label: "Very Low" },
    { value: "-100Hz", label: "Low" },
    { value: "+0Hz", label: "Normal" },
    { value: "+100Hz", label: "High" },
    { value: "+200Hz", label: "Very High" },
  ];

  return (
    <div className='border-2 p-4'>
      <div>
        <h2>Edge-TTS Generator</h2>
      </div>

      {error && (
        <div className='mb-6 p-4 bg-coral-50 border border-coral-200 rounded-xl'>
          <p className='text-coral-700 font-medium'>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='text'>Enter Text to Convert</label>
          <textarea
            id='text'
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Type your text here...'
            className='border-2 w-full'
            disabled={isLoading}
          />
          <div className='mt-2 text-right'>
            <span className='text-sm text-plum-500'>
              {text.length} characters
            </span>
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div>
            <label>
              US English Voice
              {isLoadingVoices && (
                <span className='ml-2 text-sm text-mint-600'>(Loading...)</span>
              )}
            </label>
            <select
              value={settings.voice}
              onChange={(e) => handleVoiceChange(e.target.value)}
              className='border-2 p-2 w-14'
              disabled={isLoadingVoices || isLoading}
            >
              {voices.map((voice) => (
                <option
                  key={voice.name}
                  value={voice.name}
                >
                  {voice.friendly_name || voice.name} ({voice.gender})
                </option>
              ))}
            </select>
          </div>

          {/* Speed Control */}
          <div>
            <label>Speed</label>
            <select
              value={settings.rate}
              onChange={(e) => handleRateChange(e.target.value)}
              className='border-2 p-2 w-14'
              disabled={isLoading}
            >
              {rateOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Pitch Control */}
          <div>
            <label>Pitch</label>
            <select
              value={settings.pitch}
              onChange={(e) => handlePitchChange(e.target.value)}
              className='border-2 p-2 w-14'
              disabled={isLoading}
            >
              {pitchOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex justify-center pt-4'>
          <button
            type='submit'
            disabled={isLoading || !text.trim() || isLoadingVoices}
            className='border-2 p-2'
          >
            {isLoading ? (
              <span className='flex items-center'>
                <svg
                  className='animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Generating Speech...
              </span>
            ) : (
              "Generate Speech"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
