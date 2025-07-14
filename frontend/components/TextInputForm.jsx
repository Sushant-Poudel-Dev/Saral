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
  enableParagraphIsolation = false,
  setEnableParagraphIsolation,
  enableSentenceIsolation = false,
  setEnableSentenceIsolation,
}) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [speed, setSpeed] = useState("normal");
  const [letterSpacing, setLetterSpacing] = useState(0); // in em units
  const [lineHeight, setLineHeight] = useState(1.5); // multiplier

  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "ne", name: "Nepali" },
  ];

  const availableSpeeds = [
    { value: "slow", name: "Slow", rate: 0.5 },
    { value: "normal", name: "Normal", rate: 1 },
    { value: "fast", name: "Fast", rate: 1.5 },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      // Convert speed setting to appropriate format
      const speedValue =
        availableSpeeds.find((s) => s.value === speed)?.rate || 1;
      onSubmit(text, language, {
        speed: speedValue,
        enableParagraphIsolation: enableParagraphIsolation,
        enableSentenceIsolation: enableSentenceIsolation,
      });
    }
  };

  const handleClear = () => {
    setText("");
  };

  // Helper functions to get style values
  const getLetterSpacingValue = () => {
    return `${letterSpacing}em`;
  };

  const getLineHeightValue = () => {
    return lineHeight;
  };

  const renderTextWithWordHighlight = () => {
    if (!isPlaying || !currentText) {
      return null;
    }

    // Helper function to split text into sentences properly
    const splitIntoSentences = (text) => {
      // Split by sentence-ending punctuation while preserving the structure
      // This regex captures sentence boundaries more accurately
      const sentences = [];
      const parts = text.split(/([.!?]+\s*)/);

      for (let i = 0; i < parts.length; i += 2) {
        const sentence = parts[i] || "";
        const punctuation = parts[i + 1] || "";
        if (sentence.trim() || punctuation.trim()) {
          sentences.push((sentence + punctuation).trim());
        }
      }

      return sentences.filter((s) => s.length > 0);
    };

    // Split text into paragraphs for isolation feature
    const paragraphs = currentText.split(/\n\s*\n/);
    const words = currentText.trim().split(/\s+/);

    // Find which paragraph and sentence contains the current word
    let currentParagraphIndex = -1;
    let currentSentenceIndex = -1;
    let wordCount = 0;

    // If we have isolation enabled, find the current paragraph/sentence
    if (
      (enableParagraphIsolation || enableSentenceIsolation) &&
      currentWordIndex >= 0
    ) {
      // For paragraph isolation
      if (enableParagraphIsolation) {
        for (let i = 0; i < paragraphs.length; i++) {
          const paragraphWords = paragraphs[i]
            .trim()
            .split(/\s+/)
            .filter((w) => w.length > 0);
          if (
            currentWordIndex >= wordCount &&
            currentWordIndex < wordCount + paragraphWords.length
          ) {
            currentParagraphIndex = i;
            break;
          }
          wordCount += paragraphWords.length;
        }
      } // For sentence isolation
      if (enableSentenceIsolation) {
        let sentenceWordCount = 0;
        let globalSentenceIndex = 0;

        // Go through each paragraph and its sentences
        for (
          let paragraphIndex = 0;
          paragraphIndex < paragraphs.length;
          paragraphIndex++
        ) {
          const paragraphSentences = splitIntoSentences(
            paragraphs[paragraphIndex]
          );

          for (
            let sentenceIndex = 0;
            sentenceIndex < paragraphSentences.length;
            sentenceIndex++
          ) {
            const sentenceWords = paragraphSentences[sentenceIndex]
              .trim()
              .split(/\s+/)
              .filter((w) => w.length > 0);

            if (
              currentWordIndex >= sentenceWordCount &&
              currentWordIndex < sentenceWordCount + sentenceWords.length
            ) {
              currentSentenceIndex = globalSentenceIndex;
              break;
            }
            sentenceWordCount += sentenceWords.length;
            globalSentenceIndex++;
          }

          if (currentSentenceIndex >= 0) break;
        }
      }
    }

    // If we have single paragraph or no isolation is enabled, use original logic
    if (
      paragraphs.length === 1 ||
      (!enableParagraphIsolation && !enableSentenceIsolation)
    ) {
      // Split text while preserving whitespace and line breaks
      const parts = currentText.split(/(\s+)/);
      let wordIndex = 0;

      return (
        <div
          className='border-1 w-full h-full mt-2 p-2 bg-white text-lg overflow-auto'
          style={{
            resize: "none",
            fontFamily: "inherit",
            lineHeight: getLineHeightValue(),
            letterSpacing: getLetterSpacingValue(),
            whiteSpace: "pre-wrap",
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
                    ${
                      isCurrentWord
                        ? "text-white px-1 rounded"
                        : "text-gray-800"
                    }
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
    }

    // Handle sentence isolation (takes priority over paragraph isolation)
    if (enableSentenceIsolation) {
      let globalWordIndex = 0;

      return (
        <div
          className='border-1 w-full h-full mt-2 p-2 bg-white text-lg overflow-auto'
          style={{
            resize: "none",
            fontFamily: "inherit",
            lineHeight: getLineHeightValue(),
            letterSpacing: getLetterSpacingValue(),
            whiteSpace: "pre-wrap",
          }}
        >
          {paragraphs.map((paragraph, paragraphIndex) => {
            // Split paragraph into sentences while preserving structure
            const sentences = splitIntoSentences(paragraph);

            return (
              <div
                key={paragraphIndex}
                style={{
                  marginBottom:
                    paragraphIndex < paragraphs.length - 1 ? "1em" : "0",
                }}
              >
                {sentences.map((sentence, sentenceIndex) => {
                  // Calculate global sentence index across all paragraphs
                  let globalSentenceIndex = sentenceIndex;
                  for (let i = 0; i < paragraphIndex; i++) {
                    globalSentenceIndex += splitIntoSentences(
                      paragraphs[i]
                    ).length;
                  }

                  const isCurrentSentence =
                    globalSentenceIndex === currentSentenceIndex;

                  // Split sentence while preserving whitespace
                  const sentenceParts = sentence.split(/(\s+)/);

                  return (
                    <span
                      key={sentenceIndex}
                      className={`transition-all duration-300 ${
                        currentSentenceIndex >= 0 && !isCurrentSentence
                          ? "blur-sm opacity-50"
                          : ""
                      }`}
                    >
                      {sentenceParts.map((part, partIndex) => {
                        // If it's whitespace, render as is
                        if (/^\s+$/.test(part)) {
                          return <span key={partIndex}>{part}</span>;
                        }

                        // If it's a word, apply highlighting
                        if (part.trim()) {
                          const isCurrentWord =
                            globalWordIndex === currentWordIndex;
                          const currentPart = (
                            <span
                              key={partIndex}
                              className={`
                                transition-colors duration-200 ease-in-out
                                ${
                                  isCurrentWord
                                    ? "text-white px-1 rounded"
                                    : "text-gray-800"
                                }
                              `}
                              style={{
                                backgroundColor: isCurrentWord
                                  ? "#5bb8d6"
                                  : "transparent",
                              }}
                            >
                              {part}
                            </span>
                          );
                          globalWordIndex++;
                          return currentPart;
                        }

                        return <span key={partIndex}>{part}</span>;
                      })}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      );
    }

    // Render with paragraph isolation
    let globalWordIndex = 0;

    return (
      <div
        className='border-1 w-full h-full mt-2 p-2 bg-white text-lg overflow-auto'
        style={{
          resize: "none",
          fontFamily: "inherit",
          lineHeight: getLineHeightValue(),
          letterSpacing: getLetterSpacingValue(),
          whiteSpace: "pre-wrap",
        }}
      >
        {paragraphs.map((paragraph, paragraphIndex) => {
          const isCurrentParagraph = paragraphIndex === currentParagraphIndex;
          const paragraphParts = paragraph.split(/(\s+)/);

          return (
            <div
              key={paragraphIndex}
              className={`transition-all duration-300 ${
                enableParagraphIsolation &&
                currentParagraphIndex >= 0 &&
                !isCurrentParagraph
                  ? "blur-sm opacity-50"
                  : ""
              }`}
              style={{
                marginBottom:
                  paragraphIndex < paragraphs.length - 1 ? "1em" : "0",
              }}
            >
              {paragraphParts.map((part, partIndex) => {
                // If it's whitespace, render as is
                if (/^\s+$/.test(part)) {
                  return <span key={partIndex}>{part}</span>;
                }

                // If it's a word, apply highlighting
                if (part.trim()) {
                  const isCurrentWord = globalWordIndex === currentWordIndex;
                  const currentPart = (
                    <span
                      key={partIndex}
                      className={`
                        transition-colors duration-200 ease-in-out
                        ${
                          isCurrentWord
                            ? "text-white px-1 rounded"
                            : "text-gray-800"
                        }
                      `}
                      style={{
                        backgroundColor: isCurrentWord
                          ? "#5bb8d6"
                          : "transparent",
                      }}
                    >
                      {part}
                    </span>
                  );
                  globalWordIndex++;
                  return currentPart;
                }

                return <span key={partIndex}>{part}</span>;
              })}
            </div>
          );
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
              style={{
                lineHeight: getLineHeightValue(),
                letterSpacing: getLetterSpacingValue(),
                fontFamily: "inherit",
              }}
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

        {/* Additional settings row */}
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

        {/* Typography settings row */}
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
      </form>
    </div>
  );
}
