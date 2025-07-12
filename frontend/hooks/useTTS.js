"use client";

import { useState, useRef } from "react";

export const useTTS = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [currentCharIndex, setCurrentCharIndex] = useState(-1);

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

    const language = voiceSettings.language || "en";

    // Check if Web Speech API supports this language
    const supportedLanguages = ["en", "es", "fr", "de", "it", "pt"];
    const useWebSpeech = supportedLanguages.includes(language);

    if (useWebSpeech) {
      await speakWithWebSpeech(text, voiceSettings);
    } else {
      // Fall back to gTTS for unsupported languages like Nepali
      await speakWithGTTS(text, voiceSettings);
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

      // Set voice settings
      const voices = speechSynthesis.getVoices();
      const selectedVoice = voices.find((voice) =>
        voice.lang.startsWith(voiceSettings.language || "en")
      );

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.lang = voiceSettings.language || "en-US";
      utterance.rate = voiceSettings.speed ? 0.5 : 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      // Word boundary event - this is where the magic happens!
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

      // Speech events
      utterance.onstart = () => {
        console.log("Speech started");
        setIsLoading(false);
        setIsPlaying(true);
      };

      utterance.onend = () => {
        console.log("Speech ended");
        if (!isStoppedRef.current) {
          setIsPlaying(false);
          setCurrentWordIndex(-1);
          setCurrentCharIndex(-1);
        }
        utteranceRef.current = null;
      };

      utterance.onerror = (event) => {
        // Ignore "interrupted" errors completely (happens when user stops speech)
        if (event.error === "interrupted" || isStoppedRef.current) {
          return;
        }
        // Handle other errors silently
        setIsPlaying(false);
        setIsLoading(false);
        utteranceRef.current = null;
      };

      // Start speech synthesis
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error starting speech:", error);
      setError("Error starting speech. Please try again.");
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const speakWithGTTS = async (text, voiceSettings) => {
    try {
      // Split text into sentences using Devanagari danda (।)
      const sentences = text.split("।").filter((sentence) => sentence.trim());
      const allWords = text.trim().split(/\s+/);
      wordsRef.current = allWords;

      console.log(
        `🚀 Processing ${sentences.length} sentences in ${voiceSettings.language}`
      );

      setIsLoading(false);
      setIsPlaying(true);

      // Process sentences one by one
      await processSentencesSequentially(sentences, voiceSettings, text);
    } catch (error) {
      console.error("Error generating speech:", error);
      setError("Error generating speech. Please try again.");
      setIsLoading(false);
      setIsPlaying(false);
    }
  };

  const processSentencesSequentially = async (
    sentences,
    voiceSettings,
    originalText
  ) => {
    let globalWordIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
      if (isStoppedRef.current) break;

      const sentence = sentences[i].trim();
      if (!sentence) continue;

      // Add back the danda for proper pronunciation (except for last sentence)
      const sentenceWithDanda =
        i < sentences.length - 1 ? sentence + "।" : sentence;

      console.log(
        `🎯 Processing sentence ${i + 1}/${
          sentences.length
        }: "${sentenceWithDanda}"`
      );

      try {
        // Make API call for this sentence
        const params = new URLSearchParams({
          text: sentenceWithDanda,
          lang: voiceSettings.language || "en",
          slow: voiceSettings.speed || false,
          tld: voiceSettings.accent || "com",
        });

        const res = await fetch(
          `http://localhost:8000/tts?${params.toString()}`
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        // Preload the audio
        await new Promise((resolve, reject) => {
          audio.addEventListener("canplaythrough", resolve);
          audio.addEventListener("error", reject);
          audio.load();
        });

        console.log(
          `✅ Sentence ${
            i + 1
          } audio loaded! Duration: ${audio.duration.toFixed(2)}s`
        );

        // Play this sentence with word highlighting
        const sentenceWords = sentenceWithDanda.trim().split(/\s+/);
        await playSentenceWithWordTiming(
          sentenceWithDanda,
          audio,
          sentenceWords,
          globalWordIndex
        );

        // Update global word index for next sentence
        globalWordIndex += sentenceWords.length;

        // Clean up
        URL.revokeObjectURL(audio.src);
      } catch (error) {
        // Don't show error if user stopped manually
        if (!isStoppedRef.current) {
          console.error(`Error processing sentence ${i + 1}:`, error);
          console.log(`Skipping sentence ${i + 1} due to error`);
        }
        break;
      }
    }

    // Reset states when all sentences are done
    setIsPlaying(false);
    setCurrentWordIndex(-1);
    setCurrentCharIndex(-1);
  };

  const playSentenceWithWordTiming = async (
    sentence,
    audio,
    sentenceWords,
    globalWordStartIndex
  ) => {
    try {
      currentAudioRef.current = audio;

      // Start playing audio
      await audio.play();

      // Calculate word timing for this sentence
      const totalDuration = audio.duration * 1000; // Convert to ms
      const totalCharacters = sentence.length;
      const msPerCharacter = totalDuration / totalCharacters;

      console.log(
        `Sentence timing: ${msPerCharacter.toFixed(2)}ms per character`
      );

      // Calculate individual word durations for this sentence
      const wordDurations = sentenceWords.map((word, index) => {
        const wordLength = word.length;
        const wordDuration = wordLength * msPerCharacter;
        let finalDuration = Math.max(wordDuration, 200); // Minimum 200ms per word

        // Add visual pause for fullstop (।) - pause highlighting after the word containing ।
        if (word.includes("।")) {
          finalDuration += 800; // Add 800ms pause to highlighting after sentence end
          console.log(`Added highlighting pause for word: "${word}"`);
        }

        return finalDuration;
      });

      // Start word highlighting animation for this sentence
      let currentWordIdx = 0;

      const highlightNextWord = () => {
        if (
          isStoppedRef.current ||
          currentWordIdx >= sentenceWords.length ||
          audio.ended
        ) {
          return;
        }

        // Set global word index for highlighting
        const globalWordIndex = globalWordStartIndex + currentWordIdx;
        setCurrentWordIndex(globalWordIndex);

        // Calculate approximate character index for current word in original text
        let charIndex = 0;
        const allWords = wordsRef.current;
        for (let i = 0; i < globalWordIndex; i++) {
          charIndex += allWords[i].length + 1; // +1 for space
        }
        setCurrentCharIndex(charIndex);

        console.log(
          `Highlighting word ${globalWordIndex + 1}/${allWords.length}: "${
            sentenceWords[currentWordIdx]
          }" (${wordDurations[currentWordIdx].toFixed(0)}ms)`
        );

        currentWordIdx++;

        // Schedule next word highlight
        if (currentWordIdx < sentenceWords.length) {
          setTimeout(highlightNextWord, wordDurations[currentWordIdx - 1]);
        }
      };

      // Start the word highlighting sequence
      highlightNextWord();

      // Wait for audio to finish
      await new Promise((resolve, reject) => {
        audio.addEventListener("ended", () => {
          console.log(`Sentence audio playback completed`);
          resolve();
        });

        audio.addEventListener("error", (e) => {
          reject(new Error(`Audio error: ${e.message}`));
        });
      });

      currentAudioRef.current = null;
    } catch (error) {
      if (!isStoppedRef.current) {
        console.error("Error playing sentence audio:", error);
        // Don't throw error, just log it
      }
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

    // Stop audio playback (gTTS)
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
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
  };
};
