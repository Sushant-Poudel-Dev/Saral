"use client";

import { useState, useCallback } from "react";
import TextInputForm from "./TextInputForm";
import VoiceSettings from "./VoiceSettings";
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
  } = useTTS();
  const [voiceSettings, setVoiceSettings] = useState({
    language: "en",
    accent: "com",
    speed: false,
  });

  const handleSettingsChange = useCallback((newSettings) => {
    setVoiceSettings(newSettings);
  }, []);

  const handleTextSubmit = (text, language) => {
    const settings = {
      ...voiceSettings,
      language: language || voiceSettings.language,
    };
    speak(text, settings);
  };

  return (
    <main>
      {error && (
        <div>
          <span>{error}</span>
          <button onClick={clearError}>×</button>
        </div>
      )}
      <div className='flex justify-evenly'>
        <TextInputForm
          onSubmit={handleTextSubmit}
          onStop={stop}
          isLoading={isLoading}
          isPlaying={isPlaying}
          currentText={currentText}
          currentWordIndex={currentWordIndex}
          currentCharIndex={currentCharIndex}
        />
        {/* <VoiceSettings
          onSettingsChange={handleSettingsChange}
          isLoading={isLoading}
        /> */}
      </div>
    </main>
  );
}
