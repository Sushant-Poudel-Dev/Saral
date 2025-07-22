import { useState } from "react";
import ArrowDown from "@/media/ArrowDown.svg";
import Rular from "@/media/Rular.svg";

export default function TypographySection({
  isLoading = false,
  letterSpacing,
  setLetterSpacing,
  lineHeight,
  setLineHeight,
  fontSize = 16,
  setFontSize,
  fontFamily,
  setFontFamily,
}) {
  const [isTypographyExpanded, setIsTypographyExpanded] = useState(true);

  // State for subheadings
  const [subheadingState, setSubheadingState] = useState({
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

  return (
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
          <h3 className='text-lg font-semibold text-slate-800'>Typography</h3>
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
          isTypographyExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className='p-4 pt-0'>
          {/* Text Section */}
          <div className='mb-4'>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer'
              onClick={() => toggleSubheading("text")}
            >
              <h4 className='text-sm font-semibold text-slate-700'>Text</h4>
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
                  onChange={(e) => handleFontFamilyChange(e.target.value)}
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
              <h4 className='text-sm font-semibold text-slate-700'>Spacing</h4>
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
                  onChange={(e) => setLetterSpacing(parseFloat(e.target.value))}
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
                  onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                  disabled={isLoading}
                  className='w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
