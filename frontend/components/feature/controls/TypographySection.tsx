"use client";

import { useState } from "react";
import {
  ChevronDown,
  Ruler,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";
import HelpTooltip from "@/components/ui/HelpTooltip";

interface TypographySectionProps {
  isLoading?: boolean;
  letterSpacing: number;
  setLetterSpacing: (v: number) => void;
  lineHeight: number;
  setLineHeight: (v: number) => void;
  fontSize?: number;
  setFontSize?: (v: number) => void;
  fontFamily?: string;
  setFontFamily?: (v: string) => void;
  wordSpacing?: number;
  setWordSpacing?: (v: number) => void;
  textAlign?: string;
  setTextAlign?: (v: string) => void;
}

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
  wordSpacing = 0,
  setWordSpacing,
  textAlign = "left",
  setTextAlign,
}: TypographySectionProps) {
  const [isTypographyExpanded, setIsTypographyExpanded] = useState(true);
  const [subheadingState, setSubheadingState] = useState({
    text: true,
    spacing: true,
    alignment: true,
  });

  const toggleSubheading = (section: keyof typeof subheadingState) => {
    setSubheadingState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const [localFontFamily, setLocalFontFamily] = useState(
    fontFamily || "var(--font-roboto)",
  );
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [localWordSpacing, setLocalWordSpacing] = useState(wordSpacing);
  const [localTextAlign, setLocalTextAlign] = useState(textAlign);

  const handleFontFamilyChange = (value: string) => {
    if (setFontFamily) {
      setFontFamily(value);
    } else {
      setLocalFontFamily(value);
    }
  };
  const handleFontSizeChange = (value: number) => {
    if (setFontSize) {
      setFontSize(value);
    } else {
      setLocalFontSize(value);
    }
  };

  const displayFontFamily = setFontFamily ? fontFamily : localFontFamily;
  const displayFontSize = setFontSize ? fontSize : localFontSize;

  const handleWordSpacingChange = (value: number) => {
    if (setWordSpacing) {
      setWordSpacing(value);
    } else {
      setLocalWordSpacing(value);
    }
  };
  const handleTextAlignChange = (value: string) => {
    if (setTextAlign) {
      setTextAlign(value);
    } else {
      setLocalTextAlign(value);
    }
  };

  const displayWordSpacing = setWordSpacing ? wordSpacing : localWordSpacing;
  const displayTextAlign = setTextAlign ? textAlign : localTextAlign;

  return (
    <div className='backdrop-blur-md border border-slate-200/80 rounded-xl transition-all duration-200 hover:border-slate-300'>
      <button
        onClick={() => setIsTypographyExpanded(!isTypographyExpanded)}
        className='rounded-t-xl w-full p-4 flex justify-between hover:cursor-pointer items-center transition-all duration-200'
      >
        <div className='flex items-center gap-3'>
          <Ruler className='w-5 h-5' />
          <h3 className='text-lg font-semibold text-slate-800'>Typography</h3>
        </div>
        <ChevronDown
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isTypographyExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isTypographyExpanded
            ? "max-h-[800px] opacity-100"
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
              <h4 className='text-sm font-semibold text-slate-700'>Text</h4>
              <ChevronDown
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
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    Font Size
                    <HelpTooltip text='Adjust the text size. Larger text is easier to read for those with visual difficulties.' />
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
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    Font Family
                    <HelpTooltip text='Choose a typeface. Fonts like Lexend and Verdana are designed for improved readability.' />
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
                    value='var(--font-roboto)'
                    style={{ fontFamily: "var(--font-roboto)" }}
                  >
                    Roboto
                  </option>
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
              <ChevronDown
                className={`w-3 h-3 transform transition-transform duration-200 ${
                  subheadingState.spacing ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                subheadingState.spacing
                  ? "max-h-80 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              {/* Letter Spacing */}
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    Letter Spacing
                    <HelpTooltip text='Increases or decreases space between individual letters. More spacing can help distinguish similar-looking characters.' />
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

              {/* Line Height */}
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    Line Height
                    <HelpTooltip text='Controls vertical spacing between lines. More space makes it easier to track from one line to the next.' />
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

              {/* Word Spacing */}
              <div>
                <div className='flex justify-between items-center mb-2'>
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    Word Spacing
                    <HelpTooltip text='Adjust the amount of space between words. Wider spacing helps separate words visually.' />
                  </label>
                  <span className='text-sm text-gray-600 font-medium'>
                    {displayWordSpacing > 0 ? "+" : ""}
                    {displayWordSpacing.toFixed(2)}em
                  </span>
                </div>
                <input
                  type='range'
                  min='-0.05'
                  max='0.5'
                  step='0.01'
                  value={displayWordSpacing}
                  onChange={(e) =>
                    handleWordSpacingChange(parseFloat(e.target.value))
                  }
                  disabled={isLoading}
                  className='w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider'
                />
              </div>
            </div>
          </div>

          {/* Alignment Section */}
          <div className='mb-4'>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer'
              onClick={() => toggleSubheading("alignment")}
            >
              <h4 className='text-sm font-semibold text-slate-700'>
                Alignment
              </h4>
              <ChevronDown
                className={`w-3 h-3 transform transition-transform duration-200 ${
                  subheadingState.alignment ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                subheadingState.alignment
                  ? "max-h-24 opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className='flex gap-1.5'>
                {[
                  { value: "left", icon: AlignLeft, label: "Left" },
                  { value: "center", icon: AlignCenter, label: "Center" },
                  { value: "right", icon: AlignRight, label: "Right" },
                  { value: "justify", icon: AlignJustify, label: "Justify" },
                ].map(({ value, icon: Icon, label }) => (
                  <button
                    key={value}
                    onClick={() => handleTextAlignChange(value)}
                    disabled={isLoading}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      displayTextAlign === value
                        ? "bg-slate-700 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                    title={label}
                  >
                    <Icon className='w-4 h-4' />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
