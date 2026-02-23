"use client";

import { useState, useEffect } from "react";
import { Volume2, Type, Palette } from "lucide-react";
import TTSSection from "@/components/feature/controls/TTSSection";
import TypographySection from "@/components/feature/controls/TypographySection";
import ColorsSection from "@/components/feature/controls/ColorsSection";

type TabId = "audio" | "typography" | "display";

interface TTSControlsProps {
  text: string;
  onSubmit: () => void;
  onStop: () => void;
  isLoading?: boolean;
  isPlaying?: boolean;
  speed: string;
  setSpeed: (speed: string) => void;
  enableParagraphIsolation: boolean;
  setEnableParagraphIsolation: (v: boolean) => void;
  enableSentenceIsolation: boolean;
  setEnableSentenceIsolation: (v: boolean) => void;
  letterSpacing: number;
  setLetterSpacing: (v: number) => void;
  lineHeight: number;
  setLineHeight: (v: number) => void;
  fontSize?: number;
  setFontSize: (v: number) => void;
  fontFamily: string;
  setFontFamily: (v: string) => void;
  hasText?: boolean;
  className?: string;
  enableHighlighting?: boolean;
  setEnableHighlighting: (v: boolean) => void;
  enableColorCoding?: boolean;
  setEnableColorCoding: (v: boolean) => void;
  colorCodedLetters?: string[];
  setColorCodedLetters: (v: string[]) => void;
  backgroundColor?: string;
  setBackgroundColor?: (v: string) => void;
  backgroundTexture?: string;
  setBackgroundTexture?: (v: string) => void;
  wordSpacing?: number;
  setWordSpacing?: (v: number) => void;
  textAlign?: string;
  setTextAlign?: (v: string) => void;
  enableSyllableSplit?: boolean;
  setEnableSyllableSplit?: (v: boolean) => void;
  syllableSplitThreshold?: number;
  setSyllableSplitThreshold?: (v: number) => void;
  enableHeatmap?: boolean;
  setEnableHeatmap?: (v: boolean) => void;
}

const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "audio", label: "Audio", icon: Volume2 },
  { id: "typography", label: "Type", icon: Type },
  { id: "display", label: "Display", icon: Palette },
];

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
  wordSpacing = 0,
  setWordSpacing,
  textAlign = "left",
  setTextAlign,
  enableSyllableSplit = false,
  setEnableSyllableSplit,
  syllableSplitThreshold = 8,
  setSyllableSplitThreshold,
  enableHeatmap = false,
  setEnableHeatmap,
}: TTSControlsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("audio");

  const [localBackgroundColor, setLocalBackgroundColor] =
    useState(backgroundColor);
  const [localBackgroundTexture, setLocalBackgroundTexture] =
    useState(backgroundTexture);

  const handleBackgroundColorChange = (value: string) => {
    if (setBackgroundColor) {
      setBackgroundColor(value);
    } else {
      setLocalBackgroundColor(value);
    }
  };

  const handleBackgroundTextureChange = (value: string) => {
    if (setBackgroundTexture) {
      setBackgroundTexture(value);
    } else {
      setLocalBackgroundTexture(value);
    }
  };

  const displayBackgroundColor = setBackgroundColor
    ? backgroundColor
    : localBackgroundColor;
  const displayBackgroundTexture = setBackgroundTexture
    ? backgroundTexture
    : localBackgroundTexture;

  useEffect(() => {
    if (typeof document !== "undefined") {
      const styleEl = document.createElement("style");
      styleEl.textContent = `
        select option:hover,
        select option:focus,
        select option:active,
        select option:checked {
          background: #475569 !important;
          color: #ffffff !important;
        }
      `;

      if (!document.head.querySelector("[data-custom-select-styles]")) {
        styleEl.setAttribute("data-custom-select-styles", "true");
        document.head.appendChild(styleEl);
      }

      return () => {
        const existingStyle = document.head.querySelector(
          "[data-custom-select-styles]",
        );
        if (existingStyle) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, []);

  return (
    <div
      className='w-full rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] border border-slate-200/60 flex flex-col overflow-hidden'
      style={{ height: "calc(100vh - 180px)", minHeight: "480px" }}
    >
      {/* ── Tab bar ──────────────────────────────────────────── */}
      <div className='flex border-b border-slate-100 bg-slate-50/60 backdrop-blur-sm shrink-0'>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold tracking-wide uppercase transition-all duration-200 relative ${
                isActive
                  ? "text-(--primary)"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className='w-3.5 h-3.5' />
              {tab.label}
              {isActive && (
                <span className='absolute bottom-0 left-3 right-3 h-0.5 bg-(--honey) rounded-full' />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab content ──────────────────────────────────────── */}
      <div
        className='flex-1 overflow-y-auto p-1'
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#cbd5e1 transparent",
        }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
              select {
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 0.5rem center;
                background-size: 1em 1em;
                padding-right: 2rem;
              }
            `,
          }}
        />

        {activeTab === "audio" && (
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
        )}

        {activeTab === "typography" && (
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
            wordSpacing={wordSpacing}
            setWordSpacing={setWordSpacing}
            textAlign={textAlign}
            setTextAlign={setTextAlign}
          />
        )}

        {activeTab === "display" && (
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
            enableSyllableSplit={enableSyllableSplit}
            setEnableSyllableSplit={setEnableSyllableSplit}
            syllableSplitThreshold={syllableSplitThreshold}
            setSyllableSplitThreshold={setSyllableSplitThreshold}
            enableHeatmap={enableHeatmap}
            setEnableHeatmap={setEnableHeatmap}
          />
        )}
      </div>
    </div>
  );
}
