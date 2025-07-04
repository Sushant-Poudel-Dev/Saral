"use client";

import { useState, useCallback } from "react";
import TextInputForm from "./TextInputForm";
import VoiceSettings from "./VoiceSettings";
import { useTTS } from "../hooks/useTTS";

export default function TTS() {
  const { speak, isLoading, error, clearError } = useTTS();
  const [voiceSettings, setVoiceSettings] = useState({
    language: "en",
    accent: "com",
    speed: false,
  });

  const handleSettingsChange = useCallback((newSettings) => {
    setVoiceSettings(newSettings);
  }, []);

  const handleTextSubmit = (text) => {
    speak(text, voiceSettings);
  };

  return (
    <main className='p-8 max-w-4xl mx-auto'>
      <h1>Text-to-Speech Demo</h1>

      {error && (
        <div className='mb-6 p-4 bg-coral/20 border border-coral rounded-lg flex justify-between items-center'>
          <span className='font-roboto text-plum'>{error}</span>
          <button
            onClick={clearError}
            className='text-plum hover:text-coral font-bold text-xl transition-colors'
          >
            ×
          </button>
        </div>
      )}

      <div>
        <VoiceSettings
          onSettingsChange={handleSettingsChange}
          isLoading={isLoading}
        />

        <TextInputForm
          onSubmit={handleTextSubmit}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
