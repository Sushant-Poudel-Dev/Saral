import { useState } from "react";
import ArrowDown from "@/media/ArrowDown.svg";
import Volume from "@/media/Volume.svg";
import Play from "@/media/Play.svg";
import Stop from "@/media/Stop.svg";

export default function TTSSection({
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
  enableHighlighting = false,
  setEnableHighlighting,
  hasText = false,
}) {
  const [isTTSExpanded, setIsTTSExpanded] = useState(true);
  const [subheadingState, setSubheadingState] = useState({
    focus: true,
    highlight: true,
  });

  // Toggle subheading expansion
  const toggleSubheading = (section) => {
    setSubheadingState((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
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
                <span className='text-slate-700 text-sm font-medium'>Stop</span>
              </button>
            )}
          </div>

          {/* Speed Control */}
          <div className='mb-4'>
            <div className='flex justify-between items-center mb-2'>
              <label className='text-sm font-medium text-gray-700'>Speed</label>
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
                value={speed === "slow" ? 0 : speed === "normal" ? 1 : 2}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setSpeed(
                    value === 0 ? "slow" : value === 1 ? "normal" : "fast"
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
              <h4 className='text-sm font-semibold text-slate-700'>Focus</h4>
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
                      enableParagraphIsolation ? "bg-slate-600" : "bg-gray-300"
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
                      enableSentenceIsolation ? "bg-slate-600" : "bg-gray-300"
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
                      enableHighlighting ? "bg-slate-600" : "bg-gray-300"
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
  );
}
