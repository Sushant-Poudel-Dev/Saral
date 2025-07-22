"use client";

import { useState, useEffect } from "react";
import CollapseButton from "@/media/CollapseButton.svg";
import Volume from "@/media/Volume.svg";
import Rular from "@/media/Rular.svg";
import Paint from "@/media/Paint.svg";
import TTSSection from "@/components/controls/TTSSection";
import TypographySection from "@/components/controls/TypographySection";
import ColorsSection from "@/components/controls/ColorsSection";

export default function TTSControls({
  onSubmit,
  onStop,
  isLoading = false,
  isPlaying = false,
  speed,
  setSpeed,
  enableParagraphIsolation,
  setEnableParagraphIsolation,
  enableSentenceIsolation,
  setEnableSentenceIsolation,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  fontSize = 16,
  setFontSize,
  fontFamily,
  setFontFamily,
  hasText = false,
  className = "",
  enableHighlighting = false,
  setEnableHighlighting,
  enableColorCoding = false,
  setEnableColorCoding,
  colorCodedLetters = [],
  setColorCodedLetters,
  backgroundColor = "#ffffff",
  setBackgroundColor,
  backgroundTexture = "none",
  setBackgroundTexture,
}) {
  // State for collapsed view
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Local background color state if not provided via props
  const [localBackgroundColor, setLocalBackgroundColor] =
    useState(backgroundColor);
  // Local texture state if not provided via props
  const [localBackgroundTexture, setLocalBackgroundTexture] =
    useState(backgroundTexture);

  // Use either the prop setter or local setter for color
  const handleBackgroundColorChange = (value) => {
    if (setBackgroundColor) {
      setBackgroundColor(value);
    } else {
      setLocalBackgroundColor(value);
    }
  };

  // Use either the prop setter or local setter for texture
  const handleBackgroundTextureChange = (value) => {
    if (setBackgroundTexture) {
      setBackgroundTexture(value);
    } else {
      setLocalBackgroundTexture(value);
    }
  };

  // Display background color/texture from props if available, otherwise from local state
  const displayBackgroundColor = setBackgroundColor
    ? backgroundColor
    : localBackgroundColor;
  const displayBackgroundTexture = setBackgroundTexture
    ? backgroundTexture
    : localBackgroundTexture;

  // Add custom styles for select options
  useEffect(() => {
    if (typeof document !== "undefined") {
      // Only run in browser environment
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        select option:hover,
        select option:focus,
        select option:active,
        select option:checked,
        select option:hover:not([disabled]),
        select option:focus:not([disabled]),
        select option:active:not([disabled]),
        option:hover,
        option:focus,
        option:active {
          background: #475569 !important;
          background-color: #475569 !important;
          color: #ffffff !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
      `;

      // Append once
      if (!document.head.querySelector("[data-custom-select-styles]")) {
        styleEl.setAttribute("data-custom-select-styles", "true");
        document.head.appendChild(styleEl);
      }

      // Cleanup on unmount
      return () => {
        const existingStyle = document.head.querySelector(
          "[data-custom-select-styles]"
        );
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  return (
    <div
      className={`${className} rounded-2xl transition-all duration-300 ease-in-out overflow-hidden ${
        isCollapsed ? "w-16 min-w-16" : "w-80 min-w-80"
      } h-full flex flex-col`}
    >
      {isCollapsed ? (
        // Collapsed view - only icons
        <div className='flex flex-col gap-3 items-center py-4 transition-all duration-300 ease-in-out h-full'>
          <button
            onClick={() => setIsCollapsed(false)}
            className='backdrop-blur-md border border-slate-200/80 rounded-xl p-3 transition-all duration-300 cursor-pointer flex items-center justify-center hover:border-slate-300'
            title='Expand Controls'
          >
            <img
              src={CollapseButton.src}
              alt='Expand'
              className='w-6 h-6'
            />
          </button>

          <button
            onClick={() => setIsCollapsed(false)}
            className='backdrop-blur-md border border-slate-200/80 rounded-xl p-3 transition-all duration-300 cursor-pointer flex items-center justify-center hover:border-slate-300'
            title='Text-to-Speech'
          >
            <img
              src={Volume.src}
              alt='TTS'
              className='w-6 h-6'
            />
          </button>

          <button
            onClick={() => setIsCollapsed(false)}
            className='backdrop-blur-md border border-slate-200/80 rounded-xl p-3 transition-all duration-300 cursor-pointer flex items-center justify-center hover:border-slate-300'
            title='Typography'
          >
            <img
              src={Rular.src}
              alt='Typography'
              className='w-6 h-6'
            />
          </button>

          <button
            onClick={() => setIsCollapsed(false)}
            className='backdrop-blur-md border border-slate-200/80 rounded-xl p-3 transition-all duration-300 cursor-pointer flex items-center justify-center hover:border-slate-300'
            title='Colors'
          >
            <img
              src={Paint.src}
              alt='Colors'
              className='w-6 h-6'
            />
          </button>
        </div>
      ) : (
        // Expanded view - full controls
        <div className='transition-all duration-300 ease-in-out h-full flex flex-col overflow-hidden p-4'>
          {/* Header with Controls title and Collapse button */}
          <div className='flex justify-between items-center mb-6 flex-shrink-0'>
            <h2 className='text-2xl font-bold text-slate-800 tracking-tight'>
              Controls
            </h2>
            <button
              onClick={() => setIsCollapsed(true)}
              className='backdrop-blur-md border border-slate-200/80 rounded-xl p-2 transition-all duration-300 cursor-pointer hover:border-slate-300'
              title='Collapse Controls'
            >
              <img
                src={CollapseButton.src}
                alt='Collapse'
                className='w-5 h-5 transform rotate-180'
              />
            </button>
          </div>

          {/* Sections Container - Scrollable without scrollbar */}
          <div
            className='flex-1 space-y-4 overflow-y-auto scrollbar-hide'
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }

              /* Custom select styling */
              select option {
                padding: 8px;
                font-size: 14px;
              }

              select option:checked,
              select option:hover,
              select option:active,
              select option:focus,
              option:hover,
              option:focus,
              option:active {
                background: #475569 !important;
                background-color: #475569 !important;
                color: #ffffff !important;
                -webkit-appearance: none !important;
                -moz-appearance: none !important;
                appearance: none !important;
              }

              /* Improve select appearance */
              select {
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 0.5rem center;
                background-size: 1em 1em;
                padding-right: 2rem;
              }
            `}</style>

            {/* Text-to-Speech Section */}
            <TTSSection
              onSubmit={onSubmit}
              onStop={onStop}
              isLoading={isLoading}
              isPlaying={isPlaying}
              speed={speed}
              setSpeed={setSpeed}
              enableParagraphIsolation={enableParagraphIsolation}
              setEnableParagraphIsolation={setEnableParagraphIsolation}
              enableSentenceIsolation={enableSentenceIsolation}
              setEnableSentenceIsolation={setEnableSentenceIsolation}
              enableHighlighting={enableHighlighting}
              setEnableHighlighting={setEnableHighlighting}
              hasText={hasText}
            />

            {/* Typography Section */}
            <TypographySection
              isLoading={isLoading}
              letterSpacing={letterSpacing}
              setLetterSpacing={setLetterSpacing}
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
              fontSize={fontSize}
              setFontSize={setFontSize}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
            />

            {/* Colors & Texture Section */}
            <ColorsSection
              isLoading={isLoading}
              enableColorCoding={enableColorCoding}
              setEnableColorCoding={setEnableColorCoding}
              colorCodedLetters={colorCodedLetters}
              setColorCodedLetters={setColorCodedLetters}
              backgroundColor={displayBackgroundColor}
              setBackgroundColor={handleBackgroundColorChange}
              backgroundTexture={displayBackgroundTexture}
              setBackgroundTexture={handleBackgroundTextureChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
