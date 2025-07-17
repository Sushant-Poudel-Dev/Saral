"use client";

import { useState, useRef, useCallback } from "react";

export const useWordDefinition = () => {
  const [definition, setDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const hoverTimeoutRef = useRef(null);
  const currentWordRef = useRef(null);

  const fetchDefinition = useCallback(async (word) => {
    if (!word || word.trim().length === 0) return;

    // Clean the word (remove punctuation, convert to lowercase)
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, "");

    console.log("Fetching definition for word:", cleanWord);

    // Don't fetch if it's the same word as current
    if (currentWordRef.current === cleanWord) return;

    setIsLoading(true);
    setError(null);
    currentWordRef.current = cleanWord;

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord}`
      );

      console.log("API response status:", response.status);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Word not found in dictionary");
        }
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      if (data && data.length > 0) {
        const entry = data[0];
        const meaning = entry.meanings?.[0];
        const firstDefinition = meaning?.definitions?.[0];

        const definitionData = {
          word: entry.word,
          phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "",
          partOfSpeech: meaning?.partOfSpeech || "",
          definition: firstDefinition?.definition || "No definition available",
          example: firstDefinition?.example || "",
          audio: entry.phonetics?.find((p) => p.audio)?.audio || "",
        };

        console.log("Setting definition:", definitionData);
        setDefinition(definitionData);
      } else {
        throw new Error("No definitions found");
      }
    } catch (err) {
      console.error("Error fetching definition:", err);
      setError(err.message);
      setDefinition(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleWordHover = useCallback(
    (word, event) => {
      console.log("handleWordHover called with word:", word);

      // Clear any existing timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

      // Set position immediately
      setPosition({ x: event.clientX, y: event.clientY });

      // Set a 2-second timeout to show definition
      hoverTimeoutRef.current = setTimeout(() => {
        console.log(
          "2-second timeout triggered, fetching definition for:",
          word
        );
        fetchDefinition(word);
        setIsVisible(true);
      }, 1000);
    },
    [fetchDefinition]
  );

  const handleWordLeave = useCallback(() => {
    // Clear the timeout when mouse leaves
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  const hideDefinition = useCallback(() => {
    setIsVisible(false);
    setDefinition(null);
    setError(null);
    currentWordRef.current = null;

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  }, []);

  return {
    definition,
    isLoading,
    error,
    isVisible,
    position,
    handleWordHover,
    handleWordLeave,
    hideDefinition,
    fetchDefinition,
  };
};
