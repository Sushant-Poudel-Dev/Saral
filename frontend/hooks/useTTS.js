"use client";

import { useState } from "react";

export const useTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const speak = async (text, voiceSettings = {}) => {
    if (!text.trim()) {
      setError("Please enter some text to speak");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Build query parameters
      const params = new URLSearchParams({
        text: text,
        lang: voiceSettings.language || "en",
        slow: voiceSettings.speed || false,
        tld: voiceSettings.accent || "com",
      });

      const res = await fetch(`http://localhost:8000/tts?${params.toString()}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      await audio.play();

      // Clean up the URL after playback ends
      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(url);
      });

      // Also clean up if there's an error
      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url);
      });
    } catch (error) {
      console.error("Error generating speech:", error);
      setError("Error generating speech. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    speak,
    isLoading,
    error,
    clearError,
  };
};
