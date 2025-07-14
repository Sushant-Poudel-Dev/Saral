"use client";

import { useState, useRef } from "react";

export const useTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);
  const [enableParagraphIsolation, setEnableParagraphIsolation] =
    useState(false);
  const [enableSentenceIsolation, setEnableSentenceIsolation] = useState(false);

  const currentAudioRef = useRef(null);
  const utteranceRef = useRef(null);
  const wordsRef = useRef([]);
  const isStoppedRef = useRef(false);

  const speak = async (text, voiceSettings = {}) => {
    if (!text.trim()) {
      setError("Please enter some text to speak");
      return;
    }

    // Stop any current speech
    stop();

    setIsLoading(true);
    setError(null);
    setCurrentText(text);
    setCurrentWordIndex(-1);
    setCurrentCharIndex(-1);
    isStoppedRef.current = false;

    // Store paragraph and sentence isolation settings
    if (voiceSettings.enableParagraphIsolation !== undefined) {
      setEnableParagraphIsolation(voiceSettings.enableParagraphIsolation);
    }
    if (voiceSettings.enableSentenceIsolation !== undefined) {
      setEnableSentenceIsolation(voiceSettings.enableSentenceIsolation);
    }

    const language = voiceSettings.language || "en";

    // Use Web Speech API for English
    // Use gTTS for Nepali
    if (language === "en") {
      await speakWithWebSpeech(text, voiceSettings);
    } else if (language === "ne") {
      await speakWithGTTSAndHighlighting(text, voiceSettings);
    } else {
      setError("Only English and Nepali languages are supported");
      setIsLoading(false);
    }
  };

  const speakWithWebSpeech = async (text, voiceSettings) => {
    // Check if Web Speech API is available
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      setError("Speech synthesis is not supported in this browser");
      return;
    }

    try {
      // Split text into words for tracking
      const words = text.trim().split(/\s+/);
      wordsRef.current = words;

      // Create speech synthesis utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set voice settings with language mapping
      const voices = speechSynthesis.getVoices();

      console.log(
        "Available voices:",
        voices.map((v) => `${v.name} (${v.lang})`)
      );

      // Language mapping for Web Speech API
      let selectedVoice;
      let targetLang;

      if (voiceSettings.language === "ne") {
        // For Nepali, try multiple fallback options
        selectedVoice = voices.find(
          (voice) => voice.lang.startsWith("ne") || voice.lang.includes("nepal")
        );

        if (!selectedVoice) {
          // Try Hindi voices for Devanagari script
          selectedVoice = voices.find(
            (voice) =>
              voice.lang.startsWith("hi") || voice.lang.includes("hindi")
          );
          console.log("Nepali voice not found, using Hindi as fallback");
        }

        if (!selectedVoice) {
          // Try Hindi-India specifically
          selectedVoice = voices.find((voice) => voice.lang === "hi-IN");
        }

        if (!selectedVoice) {
          // As last resort, use any voice that might handle Devanagari
          selectedVoice = voices.find(
            (voice) => voice.lang.includes("IN") || voice.lang.includes("hi")
          );
        }

        if (!selectedVoice) {
          console.log(
            "No suitable voice found for Nepali, triggering gTTS fallback immediately"
          );
          throw new Error("No suitable voice for Nepali");
        }

        targetLang = selectedVoice?.lang || "hi-IN";
      } else {
        // For English and other languages
        selectedVoice = voices.find((voice) =>
          voice.lang.startsWith(voiceSettings.language || "en")
        );
        targetLang =
          voiceSettings.language === "en" ? "en-US" : voiceSettings.language;
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log(
          `Selected voice: ${selectedVoice.name} (${selectedVoice.lang})`
        );
      }

      // Set language code
      utterance.lang = targetLang;

      // Handle speed settings more granularly
      // voiceSettings.speed can be: "slow", "normal", "fast", or a number (0.1 - 10)
      if (typeof voiceSettings.speed === "number") {
        utterance.rate = Math.max(0.1, Math.min(10, voiceSettings.speed));
      } else if (voiceSettings.speed === "slow") {
        utterance.rate = 0.5;
      } else if (voiceSettings.speed === "fast") {
        utterance.rate = 1.5;
      } else {
        utterance.rate = 1; // normal speed
      }

      utterance.pitch = 1;
      utterance.volume = 1;

      // Track speech start time to detect immediate failures
      let speechStartTime = null;

      // Word boundary event
      utterance.onboundary = (event) => {
        if (isStoppedRef.current) return;

        if (event.name === "word") {
          const charIndex = event.charIndex;
          const wordIndex = findWordIndexFromCharIndex(text, charIndex);

          console.log(
            `Word boundary: charIndex=${charIndex}, wordIndex=${wordIndex}`
          );

          setCurrentCharIndex(charIndex);
          setCurrentWordIndex(wordIndex);
        }
      };

      // Start speech synthesis first
      speechSynthesis.speak(utterance);

      // Return a promise that resolves when speech completes or rejects for fallback
      return new Promise((resolve, reject) => {
        let timeoutId;
        let hasStarted = false;

        // Set timeout for Nepali to catch if speech never starts
        if (voiceSettings.language === "ne") {
          timeoutId = setTimeout(() => {
            if (!hasStarted) {
              console.log(
                "Speech timeout - never started, triggering gTTS fallback"
              );
              speechSynthesis.cancel();
              reject(new Error("Speech timeout - never started"));
            }
          }, 3000); // 3 second timeout
        }

        // Speech events
        utterance.onstart = () => {
          hasStarted = true;
          if (timeoutId) clearTimeout(timeoutId);

          speechStartTime = Date.now();
          console.log("Speech started");
          console.log(`Speaking: "${text.substring(0, 50)}..."`);
          console.log(
            `Using voice: ${utterance.voice?.name} (${utterance.lang})`
          );
          setIsLoading(false);
          setIsPlaying(true);
        };

        utterance.onend = () => {
          if (timeoutId) clearTimeout(timeoutId);

          const speechDuration = speechStartTime
            ? Date.now() - speechStartTime
            : 0;
          console.log("Speech ended");
          console.log(`Speech duration: ${speechDuration}ms`);

          if (!isStoppedRef.current) {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
            setCurrentCharIndex(-1);
          }
          utteranceRef.current = null;

          // If speech ended too quickly for Nepali, trigger fallback
          if (voiceSettings.language === "ne" && speechDuration < 500) {
            console.log(
              `Speech ended too quickly (${speechDuration}ms), triggering gTTS fallback`
            );
            reject(new Error("Speech too short, probably failed"));
            return;
          }

          resolve();
        };

        utterance.onerror = (event) => {
          if (timeoutId) clearTimeout(timeoutId);

          console.error("Speech error occurred:", event.error);
          console.error("Error details:", event);

          // Ignore "interrupted" errors completely (happens when user stops speech)
          if (event.error === "interrupted" || isStoppedRef.current) {
            resolve(); // Treat interruption as normal completion
            return;
          }

          // For Nepali, any error should trigger gTTS fallback
          if (voiceSettings.language === "ne") {
            console.log("Speech error for Nepali, triggering gTTS fallback");
            setIsPlaying(false);
            setIsLoading(false);
            utteranceRef.current = null;
            reject(new Error(`Speech synthesis failed: ${event.error}`));
            return;
          }

          // Handle other errors silently
          setIsPlaying(false);
          setIsLoading(false);
          utteranceRef.current = null;
          setError(`Speech error: ${event.error}`);
          resolve(); // Don't reject for non-Nepali errors
        };
      });
    } catch (error) {
      console.error("Error starting speech:", error);
      if (voiceSettings.language === "ne") {
        // Re-throw error to trigger gTTS fallback
        throw error;
      } else {
        setError("Error starting speech. Please try again.");
        setIsLoading(false);
        setIsPlaying(false);
      }
    }
  };

  // Enhanced gTTS with word highlighting simulation for both languages
  const speakWithGTTSAndHighlighting = async (text, voiceSettings) => {
    try {
      const language = voiceSettings.language || "en";
      console.log(`🔄 Using gTTS for ${language} with word highlighting`);

      // Split text into words for tracking
      const words = text.trim().split(/\s+/);
      wordsRef.current = words;

      setIsLoading(true);
      setCurrentWordIndex(-1);
      setCurrentCharIndex(-1);

      // Convert speed settings to gTTS slow parameter
      let isSlowSpeed = false;
      if (typeof voiceSettings.speed === "number") {
        isSlowSpeed = voiceSettings.speed < 0.8; // Slow if rate is less than 0.8
      } else if (voiceSettings.speed === "slow") {
        isSlowSpeed = true;
      }

      // Make API call
      const params = new URLSearchParams({
        text: text,
        lang: language,
        slow: isSlowSpeed,
      });

      const res = await fetch(`/api/tts?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      // Store reference for potential stopping
      currentAudioRef.current = audio;

      // Preload the audio
      await new Promise((resolve, reject) => {
        audio.addEventListener("canplaythrough", resolve);
        audio.addEventListener("error", reject);
        audio.load();
      });

      const duration = audio.duration;
      console.log(`✅ gTTS audio loaded! Duration: ${duration.toFixed(2)}s`);

      setIsLoading(false);
      setIsPlaying(true);

      // Calculate timing for word highlighting
      const wordDuration = duration / words.length; // Simple equal distribution

      // Adjust timing based on speed setting
      const speedMultiplier = isSlowSpeed ? 2 : 1; // Slower highlighting for slow speech
      const highlightDelay = (wordDuration * 1000) / speedMultiplier;

      // Start word highlighting simulation
      const startHighlighting = () => {
        let currentWordIdx = 0;

        const highlightInterval = setInterval(() => {
          if (isStoppedRef.current || currentWordIdx >= words.length) {
            clearInterval(highlightInterval);
            return;
          }

          setCurrentWordIndex(currentWordIdx);

          // Calculate character index
          let charIndex = 0;
          for (let i = 0; i < currentWordIdx; i++) {
            charIndex += words[i].length + 1; // +1 for space
          }
          setCurrentCharIndex(charIndex);

          currentWordIdx++;
        }, highlightDelay);

        // Store interval for cleanup
        currentAudioRef.current.highlightInterval = highlightInterval;
      };

      // Start playback and highlighting
      await audio.play();
      startHighlighting();

      // Wait for audio to finish
      await new Promise((resolve, reject) => {
        audio.addEventListener("ended", () => {
          console.log(`gTTS playback completed for ${language}`);
          if (currentAudioRef.current?.highlightInterval) {
            clearInterval(currentAudioRef.current.highlightInterval);
          }
          if (!isStoppedRef.current) {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
            setCurrentCharIndex(-1);
          }
          resolve();
        });

        audio.addEventListener("error", (e) => {
          if (currentAudioRef.current?.highlightInterval) {
            clearInterval(currentAudioRef.current.highlightInterval);
          }
          reject(new Error(`Audio error: ${e.message}`));
        });
      });

      // Clean up
      URL.revokeObjectURL(audio.src);
      currentAudioRef.current = null;
    } catch (error) {
      console.error("Error with gTTS:", error);
      setError(
        `Error generating ${
          voiceSettings.language || "English"
        } speech. Please check your internet connection and try again.`
      );
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  // Fallback gTTS for Nepali when Web Speech API fails
  const speakWithGTTS = async (text, voiceSettings) => {
    try {
      console.log("🔄 Using gTTS fallback for Nepali");

      // Reset states for gTTS fallback
      setIsLoading(false);
      setIsPlaying(true);
      setCurrentWordIndex(-1); // No word highlighting for gTTS
      setCurrentCharIndex(-1);

      // Make API call for Nepali text
      // Convert speed settings to gTTS slow parameter
      let isSlowSpeed = false;
      if (typeof voiceSettings.speed === "number") {
        isSlowSpeed = voiceSettings.speed < 0.8; // Slow if rate is less than 0.8
      } else if (voiceSettings.speed === "slow") {
        isSlowSpeed = true;
      }

      const params = new URLSearchParams({
        text: text,
        lang: "ne",
        slow: isSlowSpeed,
      });

      const res = await fetch(`/api/tts?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      // Store reference for potential stopping
      currentAudioRef.current = audio;

      // Preload the audio
      await new Promise((resolve, reject) => {
        audio.addEventListener("canplaythrough", resolve);
        audio.addEventListener("error", reject);
        audio.load();
      });

      console.log(
        `✅ Nepali gTTS audio loaded! Duration: ${audio.duration.toFixed(2)}s`
      );

      // Play audio (no highlighting for gTTS fallback)
      await audio.play();

      // Wait for audio to finish
      await new Promise((resolve, reject) => {
        audio.addEventListener("ended", () => {
          console.log(`Nepali gTTS playback completed`);
          if (!isStoppedRef.current) {
            setIsPlaying(false);
            setCurrentWordIndex(-1);
            setCurrentCharIndex(-1);
          }
          resolve();
        });

        audio.addEventListener("error", (e) => {
          reject(new Error(`Audio error: ${e.message}`));
        });
      });

      // Clean up
      URL.revokeObjectURL(audio.src);
      currentAudioRef.current = null;
    } catch (error) {
      console.error("Error with gTTS fallback:", error);
      setError(
        "Error generating Nepali speech. Please check your internet connection and try again."
      );
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  // Helper function to find word index from character index
  const findWordIndexFromCharIndex = (text, charIndex) => {
    const words = text.trim().split(/\s+/);
    let currentCharIndex = 0;

    for (let i = 0; i < words.length; i++) {
      const wordStart = currentCharIndex;
      const wordEnd = currentCharIndex + words[i].length;

      if (charIndex >= wordStart && charIndex < wordEnd) {
        return i;
      }

      currentCharIndex = wordEnd + 1; // +1 for space
    }

    return words.length - 1; // Return last word index if not found
  };

  const clearError = () => {
    setError(null);
  };

  const stop = () => {
    isStoppedRef.current = true;

    // Stop speech synthesis (Web Speech API)
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }

    // Clean up utterance
    if (utteranceRef.current) {
      utteranceRef.current = null;
    }

    // Stop audio playback and clear highlighting intervals
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();

      // Clear highlighting interval if it exists
      if (currentAudioRef.current.highlightInterval) {
        clearInterval(currentAudioRef.current.highlightInterval);
      }

      URL.revokeObjectURL(currentAudioRef.current.src);
      currentAudioRef.current = null;
    }

    setIsPlaying(false);
    setCurrentWordIndex(-1);
    setCurrentCharIndex(-1);
  };

  return {
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
  };
};
