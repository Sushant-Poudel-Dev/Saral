"use client";

import { useState } from "react";

export default function TextInputForm({
  onSubmit,
  onStop,
  isLoading = false,
  isPlaying = false,
  currentText = "",
  currentWordIndex = -1,
  currentCharIndex = -1,
}) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");

  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "ne", name: "Nepali" },
    { code: "hi", name: "Hindi" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text, language);
    }
  };

  const handleClear = () => {
    setText("");
  };

  const renderTextWithWordHighlight = () => {
    if (!isPlaying || !currentText) {
      return null;
    }

    // Split text while preserving whitespace and line breaks
    const parts = currentText.split(/(\s+)/);
    const words = currentText.trim().split(/\s+/);
    let wordIndex = 0;

    return (
      <div
        className='border-1 w-full h-full mt-2 p-2 bg-white text-lg overflow-auto'
        style={{
          resize: "none",
          fontFamily: "inherit",
          lineHeight: "inherit",
          whiteSpace: "pre-wrap", // Preserve whitespace and line breaks
        }}
      >
        {parts.map((part, index) => {
          // If it's whitespace, render as is
          if (/^\s+$/.test(part)) {
            return <span key={index}>{part}</span>;
          }

          // If it's a word, apply highlighting
          if (part.trim()) {
            const isCurrentWord = wordIndex === currentWordIndex;
            const currentPart = (
              <span
                key={index}
                className={`
                  transition-colors duration-200 ease-in-out
                  ${isCurrentWord ? "text-white px-1 rounded" : "text-gray-800"}
                `}
                style={{
                  backgroundColor: isCurrentWord ? "#5bb8d6" : "transparent",
                }}
              >
                {part}
              </span>
            );
            wordIndex++;
            return currentPart;
          }

          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className='flex justify-center'>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col w-[60rem] h-[20rem] mt-6'>
          <h1 className='text-2xl'>Enter text to speak</h1>

          {!isPlaying ? (
            <textarea
              id='textInput'
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Type something here...'
              className='border-1 w-full h-full mt-2 p-2 bg-white text-lg'
              rows='4'
              disabled={isLoading}
            />
          ) : (
            renderTextWithWordHighlight()
          )}
        </div>

        <div className='flex gap-2 mt-2'>
          <button
            type='submit'
            disabled={isLoading || !text.trim()}
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

          <button
            type='button'
            onClick={handleClear}
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
      </form>
    </div>
  );
}
