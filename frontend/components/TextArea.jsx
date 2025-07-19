"use client";

import { useState } from "react";
import { useWordDefinition } from "../hooks/useWordDefinition";
import WordDefinitionTooltip from "./ui/WordDefinitionTooltip";
import Clear from "@/media/Clear.svg";

export default function TextArea({
  text,
  setText,
  onClear, // Add onClear prop
  isLoading = false,
  isPlaying = false,
  currentText = "",
  currentWordIndex = -1,
  currentCharIndex = -1,
  enableParagraphIsolation = false,
  enableSentenceIsolation = false,
  letterSpacing = 0,
  lineHeight = 1.5,
  language = "en", // Add language prop
  className = "", // Add className prop
}) {
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
    // Disable hover functionality for non-English languages
    const shouldEnableHover = language === "en";

    return (
      <span
        key={index}
        className={`
          ${
            shouldEnableHover ? "hover:bg-blue-100 cursor-help" : ""
          } transition-all duration-200 ease-in-out px-1 rounded
          ${isCurrentWord ? "text-white" : "text-gray-800"}
          ${additionalClasses}
        `}
        style={{
          backgroundColor: isCurrentWord ? "#5bb8d6" : "transparent",
        }}
        onMouseEnter={
          shouldEnableHover ? (e) => handleWordHover(word, e) : undefined
        }
        onMouseLeave={shouldEnableHover ? handleWordLeave : undefined}
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
    // Don't process mouse events if tooltip is visible or if language is not English
    if (definitionVisible || language !== "en") return;

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
    // Don't process mouse leave if tooltip is visible or if language is not English
    if (definitionVisible || language !== "en") return;

    lastDetectedWord = null;
    e.target.title = "";
    handleWordLeave();
  };

  // Helper function to split text into sentences properly
  const splitIntoSentences = (text) => {
    // Split by sentence-ending punctuation while preserving the structure
    const sentences = text.split(/([.!?]+\s*)/);
    const result = [];

    for (let i = 0; i < sentences.length; i += 2) {
      const sentence = sentences[i];
      const punctuation = sentences[i + 1] || "";
      if (sentence.trim()) {
        result.push(sentence + punctuation);
      }
    }

    return result.filter((s) => s.trim().length > 0);
  };

  const renderTextWithWordHighlight = () => {
    if (!isPlaying || !currentText) {
      return null;
    }

    // Always preserve the original text structure using character-by-character processing
    const textParts = [];
    let wordIndex = 0;

    // Process character by character to preserve exact structure
    for (let i = 0; i < currentText.length; i++) {
      const char = currentText[i];

      // Check if we're at the start of a word
      if (/\w/.test(char) && (i === 0 || !/\w/.test(currentText[i - 1]))) {
        // Find the end of this word
        let wordEnd = i;
        while (
          wordEnd < currentText.length &&
          /\w/.test(currentText[wordEnd])
        ) {
          wordEnd++;
        }

        const word = currentText.substring(i, wordEnd);
        const isCurrentWord = wordIndex === currentWordIndex;

        // Calculate isolation opacity for this word
        let opacity = 1;
        if (enableParagraphIsolation || enableSentenceIsolation) {
          opacity = getWordOpacity(wordIndex);
        }

        textParts.push(
          <span
            key={`word-${wordIndex}-${i}`}
            className={`transition-all duration-200 ease-in-out ${
              isCurrentWord ? "text-white" : "text-gray-800"
            }`}
            style={{
              backgroundColor: isCurrentWord ? "#5bb8d6" : "transparent",
              borderRadius: isCurrentWord ? "4px" : "0",
              padding: isCurrentWord ? "0 2px" : "0",
              opacity: opacity,
            }}
          >
            {word}
          </span>
        );

        wordIndex++;
        i = wordEnd - 1; // Skip to end of word (loop will increment)
      } else {
        // For whitespace and punctuation, apply the same opacity as surrounding words
        let opacity = 1;
        if (enableParagraphIsolation || enableSentenceIsolation) {
          // Use the opacity of the nearest word (current or previous)
          opacity = getCharOpacity(i);
        }

        textParts.push(
          <span
            key={`char-${i}`}
            style={{ opacity: opacity }}
          >
            {char}
          </span>
        );
      }
    }

    return (
      <div
        className={`text-lg overflow-auto ${className}`}
        style={{
          resize: "none",
          fontFamily: "inherit",
          lineHeight: getLineHeightValue(),
          whiteSpace: "pre-wrap", // Preserve all whitespace and line breaks
        }}
      >
        {textParts}
      </div>
    );
  };

  // Helper function to get opacity for a word based on isolation settings
  const getWordOpacity = (wordIndex) => {
    if (!currentText || currentWordIndex < 0) return 1;

    // Split text into paragraphs and calculate word positions
    const paragraphs = currentText.split(/\n\s*\n/);
    let currentParagraphIndex = -1;
    let currentSentenceIndex = -1;
    let wordCount = 0;

    // Find which paragraph contains the current word
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

    // Find which paragraph contains the word we're checking opacity for
    let targetParagraphIndex = -1;
    wordCount = 0;
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraphWords = paragraphs[i]
        .trim()
        .split(/\s+/)
        .filter((w) => w.length > 0);

      if (
        wordIndex >= wordCount &&
        wordIndex < wordCount + paragraphWords.length
      ) {
        targetParagraphIndex = i;
        break;
      }
      wordCount += paragraphWords.length;
    }

    // For sentence isolation
    if (enableSentenceIsolation) {
      // Find current sentence
      let sentenceWordCount = 0;
      let globalSentenceIndex = 0;

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

        if (currentSentenceIndex !== -1) break;
      }

      // Find target sentence for the word we're checking
      let targetSentenceIndex = -1;
      sentenceWordCount = 0;
      globalSentenceIndex = 0;

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
            wordIndex >= sentenceWordCount &&
            wordIndex < sentenceWordCount + sentenceWords.length
          ) {
            targetSentenceIndex = globalSentenceIndex;
            break;
          }

          sentenceWordCount += sentenceWords.length;
          globalSentenceIndex++;
        }

        if (targetSentenceIndex !== -1) break;
      }

      return targetSentenceIndex === currentSentenceIndex ? 1 : 0.3;
    }

    // For paragraph isolation
    if (enableParagraphIsolation) {
      return targetParagraphIndex === currentParagraphIndex ? 1 : 0.3;
    }

    return 1;
  };

  // Helper function to get opacity for non-word characters (whitespace, punctuation)
  const getCharOpacity = (charIndex) => {
    if (!enableParagraphIsolation && !enableSentenceIsolation) return 1;

    // Find the nearest word before this character
    let nearestWordIndex = -1;
    let wordIndex = 0;

    for (let i = 0; i < charIndex; i++) {
      const char = currentText[i];
      if (/\w/.test(char) && (i === 0 || !/\w/.test(currentText[i - 1]))) {
        nearestWordIndex = wordIndex;
        wordIndex++;
      }
    }

    // If no word found before, check the word after
    if (nearestWordIndex === -1) {
      for (let i = charIndex; i < currentText.length; i++) {
        const char = currentText[i];
        if (/\w/.test(char) && (i === 0 || !/\w/.test(currentText[i - 1]))) {
          nearestWordIndex = wordIndex;
          break;
        }
      }
    }

    return nearestWordIndex !== -1 ? getWordOpacity(nearestWordIndex) : 1;
  };

  return (
    <div className='relative'>
      {/* Clear Button - Top Right */}
      {text && (
        <button
          onClick={onClear}
          disabled={isLoading}
          className='absolute top-2 right-2 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 bg-white shadow-sm border border-gray-200 cursor-pointer'
          title='Clear Text'
        >
          <img
            src={Clear.src}
            alt='Clear'
            className='w-4 h-4'
          />
        </button>
      )}

      {!isPlaying ? (
        <textarea
          id='textInput'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onMouseMove={handleTextareaMouseMove}
          onMouseLeave={handleTextareaMouseLeave}
          placeholder='Type something here...'
          className={`text-lg ${className}`}
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
