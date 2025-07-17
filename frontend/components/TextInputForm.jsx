"use client";

import { useState } from "react";
import { useWordDefinition } from "../hooks/useWordDefinition";
import WordDefinitionTooltip from "./ui/WordDefinitionTooltip";

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

  // Word definition hook
  const {
    definition,
    isLoading: definitionLoading,
    error: definitionError,
    isVisible: definitionVisible,
    position: mousePosition,
    handleWordHover,
    handleWordLeave,
    hideDefinition,
  } = useWordDefinition();

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

  // Helper function to create hoverable words
  const createHoverableWord = (
    word,
    index,
    isCurrentWord = false,
    additionalClasses = ""
  ) => {
    return (
      <span
        key={index}
        className={`
          hover:bg-blue-100 cursor-help transition-all duration-200 ease-in-out px-1 rounded
          ${isCurrentWord ? "text-white" : "text-gray-800"}
          ${additionalClasses}
        `}
        style={{
          backgroundColor: isCurrentWord ? "#5bb8d6" : "transparent",
        }}
        onMouseEnter={(e) => handleWordHover(word, e)}
        onMouseLeave={handleWordLeave}
      >
        {word}
      </span>
    );
  };

  // Function to get word at mouse position in textarea
  const getWordAtPosition = (textarea, clientX, clientY) => {
    try {
      const rect = textarea.getBoundingClientRect();
      const x =
        clientX -
        rect.left -
        parseInt(window.getComputedStyle(textarea).paddingLeft || "0");
      const y =
        clientY -
        rect.top -
        parseInt(window.getComputedStyle(textarea).paddingTop || "0");

      const text = textarea.value;
      if (!text.trim()) return null;

      const style = window.getComputedStyle(textarea);
      const fontSize = parseFloat(style.fontSize) || 16;
      const lineHeight = parseFloat(style.lineHeight) || fontSize * 1.2;

      // Calculate which line we're on
      const lineIndex = Math.floor(y / lineHeight);
      const lines = text.split("\n");

      if (lineIndex < 0 || lineIndex >= lines.length) return null;

      const lineText = lines[lineIndex];
      if (!lineText || !lineText.trim()) return null;

      // Create a canvas to measure text width more accurately
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      ctx.font = `${style.fontSize} ${style.fontFamily}`;

      // Check if the x position is beyond the actual text width
      const lineWidth = ctx.measureText(lineText).width;
      if (x > lineWidth + 5) return null; // Add 5px tolerance

      // Find the character position by measuring text width
      let charIndex = 0;

      for (let i = 0; i <= lineText.length; i++) {
        const substring = lineText.substring(0, i);
        const measuredWidth = ctx.measureText(substring).width;

        if (measuredWidth > x) {
          charIndex = Math.max(0, i - 1);
          break;
        }
        charIndex = i;
      }

      // Make sure we're within bounds
      if (charIndex >= lineText.length) charIndex = lineText.length - 1;
      if (charIndex < 0) return null;

      // Check if the character at this position is actually a letter/word character
      const charAtPosition = lineText[charIndex];
      if (!charAtPosition || !/\w/.test(charAtPosition)) return null;

      // Find start of word
      let wordStart = charIndex;
      while (wordStart > 0 && /\w/.test(lineText[wordStart - 1])) {
        wordStart--;
      }

      // Find end of word
      let wordEnd = charIndex;
      while (wordEnd < lineText.length && /\w/.test(lineText[wordEnd])) {
        wordEnd++;
      }

      // Extract the word
      const word = lineText.substring(wordStart, wordEnd);

      // Return word if it's valid (more than 1 character and contains letters)
      if (word.length > 1 && /[a-zA-Z]/.test(word)) {
        return word.toLowerCase();
      }

      return null;
    } catch (error) {
      console.error("Error getting word at position:", error);
      return null;
    }
  };

  // Handle textarea mouse events for word detection
  let lastDetectedWord = null;

  const handleTextareaMouseMove = (e) => {
    // Don't process mouse events if tooltip is visible
    if (definitionVisible) return;

    if (!e.target.value.trim()) return;

    const word = getWordAtPosition(e.target, e.clientX, e.clientY);
    console.log("Mouse position:", { x: e.clientX, y: e.clientY });
    console.log("Detected word:", word);

    // Only process if word changed to avoid excessive calls
    if (word !== lastDetectedWord) {
      lastDetectedWord = word;

      if (word && word.length > 1) {
        e.target.title = "";

        // Immediately trigger hover - let the hook handle the 2-second delay
        console.log("Triggering hover for word:", word);
        handleWordHover(word, e);
      } else {
        e.target.title = "";
        handleWordLeave();
      }
    }
  };

  const handleTextareaMouseLeave = (e) => {
    // Don't process mouse leave if tooltip is visible
    if (definitionVisible) return;

    lastDetectedWord = null;
    e.target.title = "";
    handleWordLeave();
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
              const currentPart = createHoverableWord(
                part,
                index,
                isCurrentWord
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
                          const currentPart = createHoverableWord(
                            part,
                            partIndex,
                            isCurrentWord
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
                  const currentPart = createHoverableWord(
                    part,
                    partIndex,
                    isCurrentWord
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
              onMouseMove={handleTextareaMouseMove}
              onMouseLeave={handleTextareaMouseLeave}
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

      {/* Word Definition Tooltip */}
      <WordDefinitionTooltip
        definition={definition}
        isLoading={definitionLoading}
        error={definitionError}
        isVisible={definitionVisible}
        position={mousePosition}
        onClose={hideDefinition}
      />
    </div>
  );
}
