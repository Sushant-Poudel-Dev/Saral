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
  const [language, setLanguage] = useState("en");
  const [speed, setSpeed] = useState("normal");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);

  const availableSpeeds = [
    { value: "slow", name: "Slow", rate: 0.5 },
    { value: "normal", name: "Normal", rate: 1 },
    { value: "fast", name: "Fast", rate: 1.5 },
  ];

  const handleTextSubmit = () => {
    if (text.trim()) {
      const speedValue =
        availableSpeeds.find((s) => s.value === speed)?.rate || 1;
      const settings = {
        language,
        speed: speedValue,
        enableParagraphIsolation,
        enableSentenceIsolation,
      };
      speak(text, settings);
    }
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div>
      <div className='text-center mt-6 mb-2'>
        <h1>Make reading yours</h1>
        <h2 className='mx-70 mt-1'>
          Upload a document, paste your text, or try our sample to begin your
          personalized reading experience.
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

      {/* Separated components with TTS functionality */}
      <div className='flex flex-col gap-4'>
        {/* Textarea in one section */}
        <div className='flex justify-center'>
          <TextArea
            text={text}
            setText={setText}
            isLoading={isLoading}
            isPlaying={isPlaying}
            currentText={currentText}
            currentWordIndex={currentWordIndex}
            currentCharIndex={currentCharIndex}
            enableParagraphIsolation={enableParagraphIsolation}
            enableSentenceIsolation={enableSentenceIsolation}
            letterSpacing={letterSpacing}
            lineHeight={lineHeight}
            language={language}
          />
        </div>

        {/* Controls in another section */}
        <div className='flex justify-center'>
          <TTSControls
            onSubmit={handleTextSubmit}
            onStop={stop}
            onClear={handleClear}
            isLoading={isLoading}
            isPlaying={isPlaying}
            language={language}
            setLanguage={setLanguage}
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
            hasText={text.trim().length > 0}
          />
        </div>
      </div>
    </div>
  );
}
