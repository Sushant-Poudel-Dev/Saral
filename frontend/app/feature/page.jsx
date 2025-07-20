"use client";
import TextArea from "@/components/TextArea";
import TTSControls from "@/components/TTSControls";
import { useState } from "react";
import { useTTS } from "@/hooks/useTTS";

export default function FeaturePage() {
  // Use the actual TTS hook
  const {
    speak,
    stop,
    isLoading,
    isPlaying,
    currentText,
    currentWordIndex,
    currentCharIndex,
    error,
    clearError,
    enableParagraphIsolation,
    setEnableParagraphIsolation,
    enableSentenceIsolation,
    setEnableSentenceIsolation,
  } = useTTS();

  // Local state for the separated components
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState("normal");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("var(--font-lexend)");
  const [enableHighlighting, setEnableHighlighting] = useState(false);

  const availableSpeeds = [
    { value: "slow", name: "Slow", rate: 0.5 },
    { value: "normal", name: "Normal", rate: 1 },
    { value: "fast", name: "Fast", rate: 1.5 },
  ];

  // Function to detect primary language based on beginning of text
  const detectLanguage = (text) => {
    // Get the first word or first few characters to determine primary language
    const trimmedText = text.trim();

    // Devanagari script range for Nepali
    const nepaliRegex = /[\u0900-\u097F]/;

    // Check the very first character that's not whitespace or punctuation
    for (let i = 0; i < trimmedText.length; i++) {
      const char = trimmedText[i];
      // Skip whitespace and common punctuation
      if (char.match(/[\s.,!?;:()[\]{}"'-]/)) {
        continue;
      }

      // Check if the first meaningful character is Nepali
      if (nepaliRegex.test(char)) {
        return "ne";
      }

      // If we find an English letter or number first, it's English
      if (char.match(/[a-zA-Z0-9]/)) {
        return "en";
      }
    }

    // Default to English if no clear determination
    return "en";
  };

  // Function to filter text for TTS based on primary language
  const filterTextForTTS = (text, primaryLanguage) => {
    const nepaliRegex = /[\u0900-\u097F]/g;

    if (primaryLanguage === "ne") {
      // If primary language is Nepali, extract only Nepali words for TTS
      // Replace English characters with spaces but keep structure
      return text
        .replace(/[a-zA-Z0-9]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    } else {
      // If primary language is English, extract only English words for TTS
      // Replace Nepali characters with spaces but keep structure
      return text.replace(nepaliRegex, " ").replace(/\s+/g, " ").trim();
    }
  };

  const handleTextSubmit = () => {
    if (text.trim()) {
      // Automatically detect primary language from beginning of text
      const detectedLanguage = detectLanguage(text);

      const speedValue =
        availableSpeeds.find((s) => s.value === speed)?.rate || 1;
      const settings = {
        language: detectedLanguage,
        speed: speedValue,
        enableParagraphIsolation,
        enableSentenceIsolation,
        // Pass the filtering information to TTS instead of filtering here
        primaryLanguage: detectedLanguage,
        filterByLanguage: true,
      };

      // Pass the original text - let TTS handle the filtering internally
      speak(text, settings);
    }
  };

  const handleClear = () => {
    setText("");
  };

  const handleDocumentUpload = (extractedText) => {
    setText(extractedText);
  };

  return (
    <div>
      <div className='text-center mt-6 mb-2'>
        <h1>Make reading yours</h1>
        <h2 className='mx-70 mt-1'>
          Upload a document (PDF, DOC, DOCX, TXT), paste your text, or try our
          sample to begin your personalized reading experience.
        </h2>
      </div>

      {/* Error display */}
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-auto max-w-4xl'>
          <span>{error}</span>
          <button
            onClick={clearError}
            className='float-right font-bold text-red-700 hover:text-red-900'
          >
            ×
          </button>
        </div>
      )}

      <div className='mx-4 mt-6 flex gap-4 justify-center items-start'>
        <div className='w-full space-y-4'>
          {/* Text Area */}
          <TextArea
            text={text}
            setText={setText}
            onClear={handleClear}
            onTextExtracted={handleDocumentUpload}
            isLoading={isLoading}
            isPlaying={isPlaying}
            currentText={currentText}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            enableParagraphIsolation={enableParagraphIsolation}
            enableSentenceIsolation={enableSentenceIsolation}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
            fontSize={fontSize}
            fontFamily={fontFamily}
            enableHighlighting={enableHighlighting}
            className='bg-white drop-shadow-lg drop-shadow-gray-350 w-full rounded-lg p-10 h-[40rem] resize-none'
          />
        </div>
        <div className='h-[40rem] drop-shadow-lg drop-shadow-gray-350 rounded-xl bg-white transition-all duration-500 ease-in-out'>
          <TTSControls
            onSubmit={handleTextSubmit}
            onStop={stop}
            isLoading={isLoading}
            isPlaying={isPlaying}
            speed={speed}
            setSpeed={setSpeed}
            enableParagraphIsolation={enableParagraphIsolation}
            setEnableParagraphIsolation={setEnableParagraphIsolation}
            enableSentenceIsolation={enableSentenceIsolation}
            setEnableSentenceIsolation={setEnableSentenceIsolation}
            letterSpacing={letterSpacing}
            setLetterSpacing={setLetterSpacing}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            hasText={text.trim().length > 0}
            enableHighlighting={enableHighlighting}
            setEnableHighlighting={setEnableHighlighting}
            className='flex flex-col w-full bg-white'
          />
        </div>
      </div>
    </div>
  );
}
