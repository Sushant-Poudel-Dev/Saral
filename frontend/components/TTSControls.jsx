"use client";

import { useState } from "react";
import Play from "@/media/Play.svg";
import Stop from "@/media/Stop.svg";
import ArrowDown from "@/media/ArrowDown.svg";
import Speed from "@/media/Speed.svg";
import Volume from "@/media/Volume.svg";
import Rular from "@/media/Rular.svg";
import Paint from "@/media/Paint.svg";
import Hamburger from "@/media/Hamburger.svg";

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
  hasText = false,
  className = "",
}) {
  // State for collapsible sections
  const [isTTSExpanded, setIsTTSExpanded] = useState(true);
  const [isTypographyExpanded, setIsTypographyExpanded] = useState(true);
  const [isColorsExpanded, setIsColorsExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
              src={Hamburger.src}
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
                src={Hamburger.src}
                alt='Collapse'
                className='w-5 h-5'
              />
            </button>
          </div>

          {/* Sections Container */}
          <div className='flex-1 overflow-y-auto space-y-4'>
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
                  isTTSExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className='p-4 pt-0'>
                  {/* Main Controls Row - Play and Stop buttons */}
                  <div className='flex gap-3 mb-3'>
                    <button
                      type='submit'
                      onClick={onSubmit}
                      disabled={isLoading || !hasText}
                      className='flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300'
                    >
                      {isLoading ? (
                        <>
                          <span className='animate-spin'>⏳</span>
                          <span className='text-sm text-slate-700'>
                            Processing...
                          </span>
                        </>
                      ) : (
                        <img
                          src={Play.src}
                          alt='Play'
                          className='w-5 h-5'
                        />
                      )}
                    </button>

                    <button
                      type='button'
                      onClick={onStop}
                      disabled={!isPlaying}
                      className='flex-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-3 transition-all duration-200 flex items-center justify-center gap-2 border border-slate-200 hover:border-slate-300'
                    >
                      <img
                        src={Stop.src}
                        alt='Stop'
                        className='w-5 h-5'
                      />
                    </button>
                  </div>

                  {/* Speed Control */}
                  <div className='space-y-3'>
                    <label className='flex items-center gap-2 text-sm'>
                      <span className='w-16 text-gray-700'>Speed:</span>
                      <div className='flex items-center gap-3 flex-1'>
                        <img
                          src={Speed.src}
                          alt='Speed'
                          className='w-4 h-4 flex-shrink-0'
                        />
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
                          className='flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                        />
                        <span className='text-xs text-gray-600 w-12 font-medium'>
                          {speed === "slow"
                            ? "Slow"
                            : speed === "normal"
                            ? "Normal"
                            : "Fast"}
                        </span>
                      </div>
                    </label>
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
                    ? "max-h-80 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className='p-4 pt-0'>
                  {/* Spacing Section */}
                  <div className='mb-6'>
                    <h4 className='text-sm font-semibold text-slate-700 mb-4'>
                      Spacing
                    </h4>
                    <div className='space-y-3'>
                      <label className='flex items-center gap-2 text-sm'>
                        <span className='w-24 text-gray-600'>
                          Letter Space:
                        </span>
                        <div className='flex items-center gap-3 flex-1'>
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
                            className='flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                          />
                          <span className='text-xs text-gray-600 w-12 font-medium text-right'>
                            {letterSpacing > 0 ? "+" : ""}
                            {letterSpacing.toFixed(2)}em
                          </span>
                        </div>
                      </label>

                      <label className='flex items-center gap-2 text-sm'>
                        <span className='w-24 text-gray-600'>Line Height:</span>
                        <div className='flex items-center gap-3 flex-1'>
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
                            className='flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                          />
                          <span className='text-xs text-gray-600 w-8 font-medium text-right'>
                            {lineHeight.toFixed(1)}
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Focus Section */}
                  <div>
                    <h4 className='text-sm font-semibold text-slate-700 mb-4'>
                      Focus
                    </h4>
                    <div className='flex gap-4'>
                      <label className='flex items-center gap-2 text-sm cursor-pointer'>
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
                          className='w-4 h-4 text-slate-600 bg-white border-2 border-slate-300 rounded focus:ring-slate-500 focus:ring-2'
                        />
                        <span className='text-gray-600'>Paragraph</span>
                      </label>

                      <label className='flex items-center gap-2 text-sm cursor-pointer'>
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
                          className='w-4 h-4 text-slate-600 bg-white border-2 border-slate-300 rounded focus:ring-slate-500 focus:ring-2'
                        />
                        <span className='text-gray-600'>Sentence</span>
                      </label>
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
