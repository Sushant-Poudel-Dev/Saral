"use client";

import { useState, useEffect } from "react";

export default function VoiceSettings({ onSettingsChange, isLoading }) {
  const [language, setLanguage] = useState("en");
  const [accent, setAccent] = useState("com");
  const [speed, setSpeed] = useState(false);
  const [voices, setVoices] = useState(null);

  // Fetch available voices from backend
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch("http://localhost:8000/tts/voices");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVoices(data);
      } catch (error) {
        console.error("Failed to fetch voices:", error);
        // Fallback to default voices if backend is not available
        setVoices({
          languages: [
            { code: "en", name: "English" },
            { code: "ne", name: "Nepali" },
            { code: "hi", name: "Hindi" },
            { code: "es", name: "Spanish" },
            { code: "fr", name: "French" },
            { code: "de", name: "German" },
            { code: "it", name: "Italian" },
            { code: "pt", name: "Portuguese" },
          ],
          accents: [
            { tld: "com", name: "US English", lang: "en" },
            { tld: "co.uk", name: "British English", lang: "en" },
            { tld: "ca", name: "Canadian English", lang: "en" },
            { tld: "co.in", name: "Indian English", lang: "en" },
            { tld: "com.au", name: "Australian English", lang: "en" },
          ],
          speeds: [
            { value: false, name: "Normal Speed" },
            { value: true, name: "Slow Speed" },
          ],
        });
      }
    };
    fetchVoices();
  }, []);

  // Update settings when any option changes
  useEffect(() => {
    onSettingsChange({ language, accent, speed });
  }, [language, accent, speed, onSettingsChange]);

  if (!voices) {
    return (
      <div className='text-plum font-roboto'>Loading voice options...</div>
    );
  }

  const availableAccents = voices.accents.filter(
    (acc) => acc.lang === language
  );

  return (
    <div>
      <h3>Voice Settings</h3>

      <div className='flex flex-col gap-5'>
        <div>
          <label>Language</label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              if (e.target.value === "en") {
                setAccent("com");
              } else {
                setAccent("com");
              }
            }}
            disabled={isLoading}
            className='border-2'
          >
            {voices.languages.map((lang) => (
              <option
                key={lang.code}
                value={lang.code}
              >
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        {/* 
        {language === "en" && (
          <div>
            <label>Accent</label>
            <select
              value={accent}
              onChange={(e) => setAccent(e.target.value)}
              disabled={isLoading}
              className='border-2'
            >
              {availableAccents.map((acc) => (
                <option
                  key={acc.tld}
                  value={acc.tld}
                >
                  {acc.name}
                </option>
              ))}
            </select>
          </div>
        )} */}
        {/* <div>
          <label>Speed</label>
          <select
            value={speed.toString()}
            onChange={(e) => setSpeed(e.target.value === "true")}
            disabled={isLoading}
            className='border-2'
          >
            {voices.speeds.map((spd) => (
              <option
                key={spd.value.toString()}
                value={spd.value.toString()}
              >
                {spd.name}
              </option>
            ))}
          </select>
        </div> */}
      </div>
    </div>
  );
}
