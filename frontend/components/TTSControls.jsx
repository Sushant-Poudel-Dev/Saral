"use client";

import { useState, useEffect } from "react";
import Play from "@/media/Play.svg";
import Stop from "@/media/Stop.svg";
import ArrowDown from "@/media/ArrowDown.svg";
import Speed from "@/media/Speed.svg";
import Volume from "@/media/Volume.svg";
import Rular from "@/media/Rular.svg";
import Paint from "@/media/Paint.svg";
import Hamburger from "@/media/Hamburger.svg";
import CollapseButton from "@/media/CollapseButton.svg";

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
}) {
  // State for collapsible sections
  const [isTTSExpanded, setIsTTSExpanded] = useState(true);
  const [isTypographyExpanded, setIsTypographyExpanded] = useState(true);
  const [isColorsExpanded, setIsColorsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State for font family
  const [localFontFamily, setLocalFontFamily] = useState(
    fontFamily || "var(--font-lexend)"
  );

  // Use prop setter or local setter for font family
  const handleFontFamilyChange = (value) => {
    if (setFontFamily) {
      setFontFamily(value);
    } else {
      setLocalFontFamily(value);
    }
  };

  // Display font family from props if available, otherwise from local state
  const displayFontFamily = setFontFamily ? fontFamily : localFontFamily;

  // State for subheadings
  const [subheadingState, setSubheadingState] = useState({
    focus: true,
    highlight: true,
    text: true,
    spacing: true,
  });

  // Toggle subheading expansion
  const toggleSubheading = (section) => {
    setSubheadingState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Local font size state if not provided via props
  const [localFontSize, setLocalFontSize] = useState(fontSize);

  // Use either the prop setter or local setter
  const handleFontSizeChange = (value) => {
    if (setFontSize) {
      setFontSize(value);
    } else {
      setLocalFontSize(value);
    }
  };

  // Display font size from props if available, otherwise from local state
  const displayFontSize = setFontSize ? fontSize : localFontSize;

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

  const availableSpeeds = [
    { value: "slow", name: "Slow", rate: 0.5 },
    { value: "normal", name: "Normal", rate: 1 },
    { value: "fast", name: "Fast", rate: 1.5 },
  ];

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
            onClick={() => {
              setIsCollapsed(false);
              setIsTTSExpanded(true);
            }}
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
            onClick={() => {
              setIsCollapsed(false);
              setIsTypographyExpanded(true);
            }}
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
            onClick={() => {
              setIsCollapsed(false);
              setIsColorsExpanded(true);
            }}
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
            {/* Section 1: Text-to-Speech */}
            <div className='backdrop-blur-md border border-slate-200/80 rounded-xl transition-all duration-200 hover:border-slate-300'>
              <button
                onClick={() => setIsTTSExpanded(!isTTSExpanded)}
                className='rounded-t-xl w-full p-4 flex justify-between items-center hover:cursor-pointer transition-all duration-200'
              >
                <div className='flex items-center gap-3'>
                  <img
                    src={Volume.src}
                    alt='TTS'
                    className='w-5 h-5'
                  />
                  <h3 className='text-lg font-semibold text-slate-800'>
                    Text-to-Speech
                  </h3>
                </div>
                <img
                  src={ArrowDown.src}
                  alt='Arrow Down'
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isTTSExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isTTSExpanded ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className='p-4 pt-0'>
                  {/* Single Play/Stop Button - Full Width */}
                  <div className='mb-4'>
                    {!isPlaying ? (
                      <button
                        type='submit'
                        onClick={onSubmit}
                        disabled={isLoading || !hasText}
                        className='w-full bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2 transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300'
                      >
                        {isLoading ? (
                          <>
                            <span className='animate-spin text-sm'>⏳</span>
                            <span className='text-slate-700 text-sm'>
                              Processing...
                            </span>
                          </>
                        ) : (
                          <>
                            <img
                              src={Play.src}
                              alt='Play'
                              className='w-4 h-4'
                            />
                            <span className='text-slate-700 text-sm font-medium'>
                              Play
                            </span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={onStop}
                        className='w-full bg-slate-100 hover:bg-slate-200 rounded-lg p-2 transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300'
                      >
                        <img
                          src={Stop.src}
                          alt='Stop'
                          className='w-4 h-4'
                        />
                        <span className='text-slate-700 text-sm font-medium'>
                          Stop
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Speed Control */}
                  <div className='mb-4'>
                    <div className='flex justify-between items-center mb-2'>
                      <label className='text-sm font-medium text-gray-700'>
                        Speed
                      </label>
                      <span className='text-sm text-gray-600 font-medium'>
                        {speed === "slow"
                          ? "Slow"
                          : speed === "normal"
                          ? "Normal"
                          : "Fast"}
                      </span>
                    </div>
                    <div className='relative'>
                      <input
                        type='range'
                        min='0'
                        max='2'
                        step='1'
                        value={
                          speed === "slow" ? 0 : speed === "normal" ? 1 : 2
                        }
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          setSpeed(
                            value === 0
                              ? "slow"
                              : value === 1
                              ? "normal"
                              : "fast"
                          );
                        }}
                        disabled={isLoading}
                        className='w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                      />
                      {/* Range indicators */}
                      <div className='flex justify-between text-xs text-gray-500 mt-1'>
                        <span>Slow</span>
                        <span>Normal</span>
                        <span>Fast</span>
                      </div>
                    </div>
                  </div>

                  {/* Focus Section */}
                  <div className='mb-4'>
                    <div
                      className='flex justify-between items-center mb-2 cursor-pointer'
                      onClick={() => toggleSubheading("focus")}
                    >
                      <h4 className='text-sm font-semibold text-slate-700'>
                        Focus
                      </h4>
                      <img
                        src={ArrowDown.src}
                        alt='Toggle'
                        className={`w-3 h-3 transform transition-transform duration-200 ${
                          subheadingState.focus ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                    <div
                      className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                        subheadingState.focus
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {/* Paragraph Toggle */}
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-700'>Paragraph</span>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={enableParagraphIsolation}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEnableParagraphIsolation(true);
                                setEnableSentenceIsolation(false);
                              } else {
                                setEnableParagraphIsolation(false);
                              }
                            }}
                            disabled={isLoading}
                            className='sr-only'
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                              enableParagraphIsolation
                                ? "bg-slate-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                                enableParagraphIsolation
                                  ? "translate-x-5 ml-0.5"
                                  : "translate-x-0.5"
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>

                      {/* Sentence Toggle */}
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-700'>Sentence</span>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={enableSentenceIsolation}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEnableSentenceIsolation(true);
                                setEnableParagraphIsolation(false);
                              } else {
                                setEnableSentenceIsolation(false);
                              }
                            }}
                            disabled={isLoading}
                            className='sr-only'
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                              enableSentenceIsolation
                                ? "bg-slate-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                                enableSentenceIsolation
                                  ? "translate-x-5 ml-0.5"
                                  : "translate-x-0.5"
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Highlight Section */}
                  <div className='mb-4'>
                    <div
                      className='flex justify-between items-center mb-2 cursor-pointer'
                      onClick={() => toggleSubheading("highlight")}
                    >
                      <h4 className='text-sm font-semibold text-slate-700'>
                        Highlight
                      </h4>
                      <img
                        src={ArrowDown.src}
                        alt='Toggle'
                        className={`w-3 h-3 transform transition-transform duration-200 ${
                          subheadingState.highlight ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        subheadingState.highlight
                          ? "max-h-20 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <span className='text-sm text-gray-700'>
                          Enable Text Highlighting
                        </span>
                        <label className='relative inline-flex items-center cursor-pointer'>
                          <input
                            type='checkbox'
                            checked={enableHighlighting}
                            onChange={(e) =>
                              setEnableHighlighting &&
                              setEnableHighlighting(e.target.checked)
                            }
                            disabled={isLoading}
                            className='sr-only'
                          />
                          <div
                            className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                              enableHighlighting
                                ? "bg-slate-600"
                                : "bg-gray-300"
                            }`}
                          >
                            <div
                              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                                enableHighlighting
                                  ? "translate-x-5 ml-0.5"
                                  : "translate-x-0.5"
                              }`}
                            ></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Typography */}
            <div className='backdrop-blur-md border border-slate-200/80 rounded-xl transition-all duration-200 hover:border-slate-300'>
              <button
                onClick={() => setIsTypographyExpanded(!isTypographyExpanded)}
                className='rounded-t-xl w-full p-4 flex justify-between hover:cursor-pointer items-center transition-all duration-200'
              >
                <div className='flex items-center gap-3'>
                  <img
                    src={Rular.src}
                    alt='Typography'
                    className='w-5 h-5'
                  />
                  <h3 className='text-lg font-semibold text-slate-800'>
                    Typography
                  </h3>
                </div>
                <img
                  src={ArrowDown.src}
                  alt='Arrow Down'
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isTypographyExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isTypographyExpanded
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className='p-4 pt-0'>
                  {/* Text Section */}
                  <div className='mb-4'>
                    <div
                      className='flex justify-between items-center mb-2 cursor-pointer'
                      onClick={() => toggleSubheading("text")}
                    >
                      <h4 className='text-sm font-semibold text-slate-700'>
                        Text
                      </h4>
                      <img
                        src={ArrowDown.src}
                        alt='Toggle'
                        className={`w-3 h-3 transform transition-transform duration-200 ${
                          subheadingState.text ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                    <div
                      className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                        subheadingState.text
                          ? "max-h-40 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {/* Font Size Control */}
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            Font Size
                          </label>
                          <span className='text-sm text-gray-600 font-medium'>
                            {displayFontSize}px
                          </span>
                        </div>
                        <input
                          type='range'
                          min='12'
                          max='24'
                          step='1'
                          value={displayFontSize}
                          onChange={(e) =>
                            handleFontSizeChange(parseInt(e.target.value))
                          }
                          disabled={isLoading}
                          className='w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                        />
                      </div>

                      {/* Font Family Selector */}
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            Font Family
                          </label>
                        </div>
                        <select
                          value={displayFontFamily}
                          onChange={(e) =>
                            handleFontFamilyChange(e.target.value)
                          }
                          className='w-full p-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all duration-200'
                          disabled={isLoading}
                          style={{ fontFamily: displayFontFamily }}
                        >
                          <option
                            value='var(--font-lexend)'
                            style={{ fontFamily: "var(--font-lexend)" }}
                          >
                            Lexend
                          </option>
                          <option
                            value='var(--font-inter)'
                            style={{ fontFamily: "var(--font-inter)" }}
                          >
                            Inter
                          </option>
                          <option
                            value='var(--font-roboto)'
                            style={{ fontFamily: "var(--font-roboto)" }}
                          >
                            Roboto
                          </option>
                          <option
                            value='var(--font-montserrat)'
                            style={{ fontFamily: "var(--font-montserrat)" }}
                          >
                            Montserrat
                          </option>
                          <option
                            value='system-ui'
                            style={{ fontFamily: "system-ui" }}
                          >
                            System UI
                          </option>
                          <option
                            value='Arial'
                            style={{ fontFamily: "Arial" }}
                          >
                            Arial
                          </option>
                          <option
                            value='Verdana'
                            style={{ fontFamily: "Verdana" }}
                          >
                            Verdana
                          </option>
                          <option
                            value='Helvetica'
                            style={{ fontFamily: "Helvetica" }}
                          >
                            Helvetica
                          </option>
                          <option
                            value='Times New Roman'
                            style={{ fontFamily: '"Times New Roman"' }}
                          >
                            Times New Roman
                          </option>
                          <option
                            value='Georgia'
                            style={{ fontFamily: "Georgia" }}
                          >
                            Georgia
                          </option>
                          <option
                            value='Courier New'
                            style={{ fontFamily: '"Courier New"' }}
                          >
                            Courier New
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Spacing Section */}
                  <div className='mb-4'>
                    <div
                      className='flex justify-between items-center mb-2 cursor-pointer'
                      onClick={() => toggleSubheading("spacing")}
                    >
                      <h4 className='text-sm font-semibold text-slate-700'>
                        Spacing
                      </h4>
                      <img
                        src={ArrowDown.src}
                        alt='Toggle'
                        className={`w-3 h-3 transform transition-transform duration-200 ${
                          subheadingState.spacing ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                    <div
                      className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                        subheadingState.spacing
                          ? "max-h-60 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {/* Letter Spacing Control */}
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            Letter Spacing
                          </label>
                          <span className='text-sm text-gray-600 font-medium'>
                            {letterSpacing > 0 ? "+" : ""}
                            {letterSpacing.toFixed(2)}em
                          </span>
                        </div>
                        <input
                          type='range'
                          min='-0.1'
                          max='0.2'
                          step='0.01'
                          value={letterSpacing}
                          onChange={(e) =>
                            setLetterSpacing(parseFloat(e.target.value))
                          }
                          disabled={isLoading}
                          className='w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                        />
                      </div>

                      {/* Line Height Control */}
                      <div>
                        <div className='flex justify-between items-center mb-2'>
                          <label className='text-sm font-medium text-gray-700'>
                            Line Height
                          </label>
                          <span className='text-sm text-gray-600 font-medium'>
                            {lineHeight.toFixed(1)}
                          </span>
                        </div>
                        <input
                          type='range'
                          min='1'
                          max='3'
                          step='0.1'
                          value={lineHeight}
                          onChange={(e) =>
                            setLineHeight(parseFloat(e.target.value))
                          }
                          disabled={isLoading}
                          className='w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Colors */}
            <div className='backdrop-blur-md border border-slate-200/80 rounded-xl transition-all duration-200 hover:border-slate-300'>
              <button
                onClick={() => setIsColorsExpanded(!isColorsExpanded)}
                className='rounded-t-xl w-full p-4 flex justify-between hover:cursor-pointer items-center transition-all duration-200'
              >
                <div className='flex items-center gap-3'>
                  <img
                    src={Paint.src}
                    alt='Colors'
                    className='w-5 h-5'
                  />
                  <h3 className='text-lg font-semibold text-slate-800'>
                    Colors
                  </h3>
                </div>
                <img
                  src={ArrowDown.src}
                  alt='Arrow Down'
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    isColorsExpanded ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isColorsExpanded
                    ? "max-h-20 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className='p-4 pt-0'>
                  <div className='text-center text-slate-500 text-sm'>
                    Coming soon...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
