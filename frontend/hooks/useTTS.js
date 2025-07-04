"use client";

import { useState, useRef } from "react";

export const useTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentAudioRef = useRef(null);

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

      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      currentAudioRef.current = audio;
      setIsPlaying(true);

      await audio.play();

      // Clean up the URL after playback ends
      audio.addEventListener("ended", () => {
        URL.revokeObjectURL(url);
        setIsPlaying(false);
        currentAudioRef.current = null;
      });

      // Also clean up if there's an error
      audio.addEventListener("error", () => {
        URL.revokeObjectURL(url);
        setIsPlaying(false);
        currentAudioRef.current = null;
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

  const stop = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsPlaying(false);
    }
  };

  return {
    speak,
    stop,
    isLoading,
    isPlaying,
    error,
    clearError,
  };
};
