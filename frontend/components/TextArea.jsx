"use client";

import { useState, useMemo, useRef } from "react";
import { useWordDefinition } from "../hooks/useWordDefinition";
import WordDefinitionTooltip from "./ui/WordDefinitionTooltip";
import DocumentUpload from "./DocumentUpload";
import Clear from "@/media/Clear.svg";

export default function TextArea({
  text,
  setText,
  onClear, // Add onClear prop
  onTextExtracted, // Add onTextExtracted prop for document upload
  isLoading = false,
  isPlaying = false,
  currentText = "",
  currentWordIndex = -1,
  currentCharIndex = -1,
  enableParagraphIsolation = false,
  enableSentenceIsolation = false,
  letterSpacing = 0,
  lineHeight = 1.5,
  fontSize = 16,
  fontFamily = "var(--font-lexend)",
  language = "en", // Add language prop
  className = "", // Add className prop
  enableHighlighting = false, // Add highlighting toggle prop
}) {
  // Definitions mode toggle
  const [definitionsMode, setDefinitionsMode] = useState(false);
  // Cache for isolation calculations to prevent lag
  const isolationCacheRef = useRef({
    lastWordIndex: -1,
    lastText: "",
    wordOpacities: new Map(),
    paragraphs: [],
    sentences: [],
  });

  // Pre-calculate text structure when text changes
  const textStructure = useMemo(() => {
    if (!currentText)
      return {
        words: [],
        paragraphs: [],
        sentences: [],
        wordToParagraph: new Map(),
        wordToSentence: new Map(),
      };

    console.log("Recalculating text structure...");

    // Split text into words with positions
    const words = [];
    const wordMatches = currentText.matchAll(/\S+/g);

    for (const match of wordMatches) {
      words.push({
        text: match[0],
        start: match.index,
        end: match.index + match[0].length,
        index: words.length,
      });
    }

    // Calculate paragraph boundaries
    const paragraphTexts = currentText.split(/\n\s*\n/);
    const paragraphs = [];
    let currentPos = 0;

    for (let i = 0; i < paragraphTexts.length; i++) {
      const paragraphText = paragraphTexts[i];
      const start = currentText.indexOf(paragraphText, currentPos);
      const end = start + paragraphText.length;

      paragraphs.push({
        index: i,
        start: start,
        end: end,
        text: paragraphText,
      });

      currentPos = end;
    }

    // Calculate sentence boundaries
    const sentences = [];
    const sentenceRegex = /[.!?]+/g;
    let sentenceMatch;
    let lastEnd = 0;
    let sentenceIndex = 0;

    while ((sentenceMatch = sentenceRegex.exec(currentText)) !== null) {
      const end = sentenceMatch.index + sentenceMatch[0].length;
      const sentenceText = currentText.substring(lastEnd, end).trim();

      if (sentenceText.length > 0) {
        sentences.push({
          index: sentenceIndex,
          start: lastEnd,
          end: end,
          text: sentenceText,
        });
        sentenceIndex++;
      }

      lastEnd = end;
    }

    // Add the last sentence if there's remaining text
    if (lastEnd < currentText.length) {
      const lastSentenceText = currentText.substring(lastEnd).trim();
      if (lastSentenceText.length > 0) {
        sentences.push({
          index: sentenceIndex,
          start: lastEnd,
          end: currentText.length,
          text: lastSentenceText,
        });
      }
    }

    // Create mapping from word index to paragraph/sentence
    const wordToParagraph = new Map();
    const wordToSentence = new Map();

    words.forEach((word) => {
      // Find which paragraph this word belongs to
      const paragraph = paragraphs.find(
        (p) => word.start >= p.start && word.end <= p.end
      );
      if (paragraph) {
        wordToParagraph.set(word.index, paragraph.index);
      }

      // Find which sentence this word belongs to
      const sentence = sentences.find(
        (s) => word.start >= s.start && word.end <= s.end
      );
      if (sentence) {
        wordToSentence.set(word.index, sentence.index);
      }
    });

    console.log(
      `Text structure: ${words.length} words, ${paragraphs.length} paragraphs, ${sentences.length} sentences`
    );

    return {
      words,
      paragraphs,
      sentences,
      wordToParagraph,
      wordToSentence,
    };
  }, [currentText]); // Recalculate when currentText changes
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
    // Extract the clean word for hover functionality (remove punctuation)
    const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();
    const shouldEnableHover =
      language === "en" && cleanWord.length > 1 && /[a-zA-Z]/.test(cleanWord);

    // Only apply highlighting if enableHighlighting is true
    const shouldHighlight = enableHighlighting && isCurrentWord;

    return (
      <span
        key={index}
        className={`
          ${
            shouldEnableHover ? "hover:bg-blue-100 cursor-help" : ""
          } transition-all duration-200 ease-in-out px-1 rounded
          ${shouldHighlight ? "text-white" : "text-gray-800"}
          ${additionalClasses}
        `}
        style={{
          backgroundColor: shouldHighlight ? "#5bb8d6" : "transparent",
        }}
        onMouseEnter={
          shouldEnableHover ? (e) => handleWordHover(cleanWord, e) : undefined
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
      ctx.font = `${fontSize}px ${fontFamily}`;

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

  // Function to render normal mode (editable textarea, no hover definitions)
  const renderNormalMode = () => {
    return (
      <textarea
        id='textInput'
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type something here...'
        className={`text-lg ${className}`}
        style={{
          lineHeight: getLineHeightValue(),
          letterSpacing: getLetterSpacingValue(),
          fontSize: `${fontSize}px`,
          fontFamily: fontFamily,
        }}
        rows='4'
        disabled={isLoading}
      />
    );
  };

  const renderTextWithWordHighlight = () => {
    // When playing speech, always use currentText, otherwise use the editable text
    const textToUse = isPlaying && currentText ? currentText : text;

    if (!textToUse) {
      return null;
    }

    // Always preserve the original text structure using character-by-character processing
    const textParts = [];
    let wordIndex = 0;

    // Process character by character to preserve exact structure
    for (let i = 0; i < textToUse.length; i++) {
      const char = textToUse[i];

      // Check if we're at the start of a word
      if (/\w/.test(char) && (i === 0 || !/\w/.test(textToUse[i - 1]))) {
        // Find the end of this word
        let wordEnd = i;
        while (wordEnd < textToUse.length && /\w/.test(textToUse[wordEnd])) {
          wordEnd++;
        }

        const word = textToUse.substring(i, wordEnd);
        const isCurrentWord = wordIndex === currentWordIndex;

        // Only apply highlighting if enableHighlighting is true
        const shouldHighlight = enableHighlighting && isCurrentWord;

        // Calculate isolation opacity for this word
        let opacity = 1;
        if (enableParagraphIsolation || enableSentenceIsolation) {
          opacity = getWordOpacity(wordIndex);
        }

        // Extract the clean word for hover functionality (remove punctuation)
        const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();
        const shouldEnableHover =
          language === "en" &&
          cleanWord.length > 1 &&
          /[a-zA-Z]/.test(cleanWord);

        textParts.push(
          <span
            key={`word-${wordIndex}-${i}`}
            className={`transition-all duration-200 ease-in-out ${
              shouldHighlight ? "text-white" : "text-gray-800"
            } ${shouldEnableHover ? "hover:bg-blue-100 cursor-help" : ""}`}
            style={{
              backgroundColor: shouldHighlight ? "#5bb8d6" : "transparent",
              borderRadius: shouldHighlight ? "4px" : "0",
              padding: shouldHighlight ? "0 2px" : "0",
              opacity: opacity,
            }}
            onMouseEnter={
              shouldEnableHover
                ? (e) => handleWordHover(cleanWord, e)
                : undefined
            }
            onMouseLeave={shouldEnableHover ? handleWordLeave : undefined}
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
          fontFamily: fontFamily,
          fontSize: `${fontSize}px`,
          lineHeight: getLineHeightValue(),
          letterSpacing: getLetterSpacingValue(), // Add letter spacing
          whiteSpace: "pre-wrap", // Preserve all whitespace and line breaks
        }}
      >
        {textParts}
      </div>
    );
  };

  // Optimized helper function to get opacity for a word based on isolation settings
  const getWordOpacity = (wordIndex) => {
    if (!currentText || currentWordIndex < 0) return 1;
    if (!enableParagraphIsolation && !enableSentenceIsolation) return 1;
    if (wordIndex === currentWordIndex) return 1; // Current word is always fully visible

    // Use pre-calculated structure for fast lookups
    const currentWordParagraph =
      textStructure.wordToParagraph.get(currentWordIndex);
    const currentWordSentence =
      textStructure.wordToSentence.get(currentWordIndex);

    const wordParagraph = textStructure.wordToParagraph.get(wordIndex);
    const wordSentence = textStructure.wordToSentence.get(wordIndex);

    // Sentence isolation takes precedence over paragraph isolation
    if (enableSentenceIsolation) {
      if (currentWordSentence !== undefined && wordSentence !== undefined) {
        return currentWordSentence === wordSentence ? 1 : 0.3;
      }
    }

    // Fallback to paragraph isolation
    if (enableParagraphIsolation) {
      if (currentWordParagraph !== undefined && wordParagraph !== undefined) {
        return currentWordParagraph === wordParagraph ? 1 : 0.3;
      }
    }

    return 1; // Default to full opacity if no isolation rules apply
  };

  // Helper function to get opacity for non-word characters (whitespace, punctuation)
  const getCharOpacity = (charIndex) => {
    if (!enableParagraphIsolation && !enableSentenceIsolation) return 1;

    // Find the word that this character belongs to or is closest to
    const word = textStructure.words.find(
      (w) => charIndex >= w.start && charIndex <= w.end
    );

    if (word) {
      return getWordOpacity(word.index);
    }

    // If not within a word, find the nearest word
    let nearestWord = null;
    let minDistance = Infinity;

    for (const word of textStructure.words) {
      const distance = Math.min(
        Math.abs(charIndex - word.start),
        Math.abs(charIndex - word.end)
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestWord = word;
      }
    }

    return nearestWord ? getWordOpacity(nearestWord.index) : 1;
  };

  return (
    <div className='relative'>
      {/* Upload Document Button - Top Right */}
      <DocumentUpload
        onTextExtracted={onTextExtracted}
        compact={true}
        className='absolute top-1 right-24 z-10'
      />

      {/* Definition Toggle Button - Top Right (between upload and clear) */}
      <button
        onClick={() => setDefinitionsMode((v) => !v)}
        className={`absolute top-1 right-14 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 bg-white shadow-sm border border-gray-200 cursor-pointer ${
          definitionsMode ? "bg-blue-50 border-blue-200" : ""
        }`}
        title={
          definitionsMode
            ? "Disable Definitions Mode"
            : "Enable Definitions Mode"
        }
      >
        <svg
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className={definitionsMode ? "text-blue-500" : "text-gray-500"}
        >
          <path
            d='M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z'
            fill='currentColor'
          />
          <path
            d='M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z'
            fill='currentColor'
          />
          <circle
            cx='18'
            cy='18'
            r='5'
            fill={definitionsMode ? "#3b82f6" : "#e5e7eb"}
            stroke='currentColor'
          />
        </svg>
      </button>

      {/* Clear Button - Top Right */}
      {text && (
        <button
          onClick={onClear}
          disabled={isLoading}
          className='absolute top-1 right-4 z-10 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 bg-white shadow-sm border border-gray-200 cursor-pointer'
          title='Clear Text'
        >
          <img
            src={Clear.src}
            alt='Clear'
            className='w-4 h-4'
          />
        </button>
      )}

      {/* Main area: either editable textarea or span-rendered view mode */}
      {isPlaying || definitionsMode
        ? renderTextWithWordHighlight()
        : renderNormalMode()}

      {/* Word Definition Tooltip (only in definitionsMode, not during playback) */}
      {definitionsMode && !isPlaying && (
        <WordDefinitionTooltip
          definition={definition}
          isLoading={definitionLoading}
          error={definitionError}
          isVisible={definitionVisible}
          position={mousePosition}
          onClose={hideDefinition}
        />
      )}
    </div>
  );
}
