import { useState, useCallback, useEffect } from "react";

const API_BASE = "http://localhost:8000";

export const useEdgeTTS = () => {
  const [voices, setVoices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [error, setError] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [settings, setSettings] = useState({
    voice: "en-US-AriaNeural",
    rate: "+0%",
    pitch: "+0Hz",
  });
  // Voice management
  const fetchVoices = useCallback(async () => {
    setIsLoadingVoices(true);
    setError(null);

    try {
      // Use the English-only endpoint
      const response = await fetch(`${API_BASE}/edge-tts/voices/english`);
      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.status}`);
      }

      const voicesData = await response.json();
      setVoices(voicesData);

      // Set default voice if none selected
      if (!settings.voice && voicesData.length > 0) {
        setSettings((prev) => ({
          ...prev,
          voice: voicesData[0].name,
        }));
      }
    } catch (err) {
      console.error("Error fetching voices:", err);
      setError(`Failed to load voices: ${err.message}`);
      // Fallback US English voices
      setVoices([
        {
          name: "en-US-AriaNeural",
          short_name: "en-US-AriaNeural",
          gender: "Female",
          locale: "en-US",
          friendly_name: "Aria (US English)",
        },
        {
          name: "en-US-DavisNeural",
          short_name: "en-US-DavisNeural",
          gender: "Male",
          locale: "en-US",
          friendly_name: "Davis (US English)",
        },
        {
          name: "en-US-JennyNeural",
          short_name: "en-US-JennyNeural",
          gender: "Female",
          locale: "en-US",
          friendly_name: "Jenny (US English)",
        },
        {
          name: "en-US-GuyNeural",
          short_name: "en-US-GuyNeural",
          gender: "Male",
          locale: "en-US",
          friendly_name: "Guy (US English)",
        },
      ]);
    } finally {
      setIsLoadingVoices(false);
    }
  }, [settings.voice]);

  // Fetch voices by language
  const fetchVoicesByLanguage = useCallback(
    async (language) => {
      setIsLoadingVoices(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_BASE}/edge-tts/voices/by-language/${language}`
        );
        if (!response.ok) {
          throw new Error(
            `Failed to fetch voices for ${language}: ${response.status}`
          );
        }

        const voicesData = await response.json();

        // Filter for English voices only
        const englishVoices = voicesData.filter(
          (voice) =>
            voice.locale.startsWith("en-") ||
            voice.locale.toLowerCase().includes("english")
        );

        setVoices(englishVoices);

        // Update voice selection if current voice is not in the new list
        if (
          englishVoices.length > 0 &&
          !englishVoices.find((v) => v.name === settings.voice)
        ) {
          setSettings((prev) => ({
            ...prev,
            voice: englishVoices[0].name,
          }));
        }
      } catch (err) {
        console.error("Error fetching voices by language:", err);
        setError(`Failed to load voices for ${language}: ${err.message}`);
      } finally {
        setIsLoadingVoices(false);
      }
    },
    [settings.voice]
  );

  // Text-to-speech generation
  const generateSpeech = useCallback(
    async (text) => {
      if (!text?.trim()) {
        setError("Please enter some text to convert to speech");
        return;
      }

      const cleanText = text.trim();
      console.log("Sending text to Edge-TTS:", cleanText);
      console.log("Voice settings:", settings);

      setIsLoading(true);
      setError(null);

      // Clean up previous audio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }

      try {
        const requestBody = {
          text: cleanText,
          voice: settings.voice,
          rate: settings.rate,
          pitch: settings.pitch,
        };

        console.log("Request payload:", requestBody);

        const response = await fetch(`${API_BASE}/edge-tts/speak`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.detail || `Server error: ${response.status}`
          );
        }

        const audioBlob = await response.blob();
        if (audioBlob.size === 0) {
          throw new Error("Received empty audio data");
        }

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
      } catch (err) {
        console.error("Error generating speech:", err);
        setError(`Speech generation failed: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [settings, audioUrl]
  );

  // Settings management
  const updateSettings = useCallback((newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings({
      voice: "en-US-AriaNeural",
      rate: "+0%",
      pitch: "+0Hz",
    });
  }, []);

  // Cleanup
  const cleanup = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setError(null);
  }, [audioUrl]);

  // Load voices on mount
  useEffect(() => {
    fetchVoices();

    // Cleanup on unmount
    return cleanup;
  }, [fetchVoices, cleanup]);

  return {
    // State
    voices,
    isLoading,
    isLoadingVoices,
    error,
    audioUrl,
    settings,

    // Actions
    generateSpeech,
    updateSettings,
    resetSettings,
    cleanup,
    fetchVoices,
  };
};
