"use client";

import { useState, useCallback } from "react";
import TextInputForm from "./TextInputForm";
import { useTTS } from "../hooks/useTTS";

export default function TTS() {
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

  const handleTextSubmit = (text, language, voiceSettings = {}) => {
    const settings = { language, ...voiceSettings };
    speak(text, settings);
  };

  return (
    <main>
      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          <span>{error}</span>
          <button
            onClick={clearError}
            className='float-right font-bold text-red-700 hover:text-red-900'
          >
            ×
          </button>
        </div>
      )}
      <div className='flex justify-center'>
        <TextInputForm
          onSubmit={handleTextSubmit}
          onStop={stop}
          isLoading={isLoading}
          isPlaying={isPlaying}
          currentText={currentText}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
          enableParagraphIsolation={enableParagraphIsolation}
          setEnableParagraphIsolation={setEnableParagraphIsolation}
          enableSentenceIsolation={enableSentenceIsolation}
          setEnableSentenceIsolation={setEnableSentenceIsolation}
        />
      </div>
    </main>
  );
}
