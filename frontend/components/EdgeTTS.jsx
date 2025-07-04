"use client";
import { useRef, useEffect, useState } from "react";
import EdgeTTSForm from "./EdgeTTSForm";
import { useEdgeTTS } from "../hooks/useEdgeTTS";

export default function EdgeTTS() {
  const {
    voices,
    isLoading,
    isLoadingVoices,
    error,
    audioUrl,
    settings,
    generateSpeech,
    updateSettings,
    resetSettings,
    cleanup,
  } = useEdgeTTS();

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    audio.currentTime = newTime;
  };

  const handleDownload = () => {
    if (audioUrl) {
      const link = document.createElement("a");
      link.href = audioUrl;
      link.download = `edge-tts-speech-${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <EdgeTTSForm
        onSubmit={generateSpeech}
        isLoading={isLoading}
        error={error}
        settings={settings}
        onSettingsChange={updateSettings}
        voices={voices}
        isLoadingVoices={isLoadingVoices}
      />

      {audioUrl && (
        <div>
          <div>
            <h3>Generated Speech</h3>
            <p>
              Voice:{" "}
              {voices.find((v) => v.name === settings.voice)?.friendly_name ||
                settings.voice}
            </p>
          </div>

          <audio
            ref={audioRef}
            src={audioUrl}
            preload='metadata'
          />

          {/* Player Controls */}
          <div>
            {/* Progress Bar */}
            <div>
              <div onClick={handleSeek}>
                <div style={{ width: `${progressPercentage}%` }} />
              </div>
              <div>
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div>
              <button
                onClick={handlePlayPause}
                className='flex items-center justify-center w-16 h-16 bg-gradient-to-r from-mint-500 to-sky-500 text-white rounded-full hover:from-mint-600 hover:to-sky-600 transition-all duration-200 hover:scale-105 shadow-lg'
              >
                {isPlaying ? (
                  <svg
                    className='w-8 h-8'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M6 4h4v16H6V4zm8 0h4v16h-4V4z' />
                  </svg>
                ) : (
                  <svg
                    className='w-8 h-8 ml-1'
                    fill='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path d='M8 5v14l11-7z' />
                  </svg>
                )}
              </button>

              <button
                onClick={handleDownload}
                title='Download audio'
              >
                <svg
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </button>

              <button
                onClick={cleanup}
                title='Clear audio'
              >
                <svg
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                  />
                </svg>
              </button>

              <button
                onClick={resetSettings}
                title='Reset settings'
              >
                <svg
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Audio Info */}
          <div className='mt-6 p-4 bg-cream-50 rounded-xl border border-mint-100'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
              <div>
                <span className='font-semibold text-plum-700'>Voice:</span>
                <p className='text-plum-600 truncate'>{settings.voice}</p>
              </div>
              <div>
                <span className='font-semibold text-plum-700'>Speed:</span>
                <p className='text-plum-600'>{settings.rate}</p>
              </div>
              <div>
                <span className='font-semibold text-plum-700'>Pitch:</span>
                <p className='text-plum-600'>{settings.pitch}</p>
              </div>
              <div>
                <span className='font-semibold text-plum-700'>Duration:</span>
                <p className='text-plum-600'>{formatTime(duration)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
