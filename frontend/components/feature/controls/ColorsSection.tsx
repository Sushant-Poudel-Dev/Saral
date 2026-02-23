"use client";

import { useState } from "react";
import { ChevronDown, Paintbrush, Scissors, Flame } from "lucide-react";
import Multiselect from "@/components/ui/Multiselect";
import HelpTooltip from "@/components/ui/HelpTooltip";

interface ColorsSectionProps {
  isLoading?: boolean;
  enableColorCoding?: boolean;
  setEnableColorCoding?: (v: boolean) => void;
  colorCodedLetters?: string[];
  setColorCodedLetters?: (v: string[]) => void;
  backgroundColor?: string;
  setBackgroundColor?: (v: string) => void;
  backgroundTexture?: string;
  setBackgroundTexture?: (v: string) => void;
  enableSyllableSplit?: boolean;
  setEnableSyllableSplit?: (v: boolean) => void;
  syllableSplitThreshold?: number;
  setSyllableSplitThreshold?: (v: number) => void;
  enableHeatmap?: boolean;
  setEnableHeatmap?: (v: boolean) => void;
}

export default function ColorsSection({
  isLoading = false,
  enableColorCoding = false,
  setEnableColorCoding,
  colorCodedLetters = [],
  setColorCodedLetters,
  backgroundColor = "#ffffff",
  setBackgroundColor,
  backgroundTexture = "none",
  setBackgroundTexture,
  enableSyllableSplit = false,
  setEnableSyllableSplit,
  syllableSplitThreshold = 8,
  setSyllableSplitThreshold,
  enableHeatmap = false,
  setEnableHeatmap,
}: ColorsSectionProps) {
  const [isColorsExpanded, setIsColorsExpanded] = useState(true);
  const [subheadingState, setSubheadingState] = useState({
    colorCode: true,
    background: true,
    texture: true,
    englishCombos: false,
    devConsonants: false,
    devVowels: false,
    syllableSplit: true,
    heatmap: true,
  });

  const toggleSubheading = (section: keyof typeof subheadingState) => {
    setSubheadingState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className='backdrop-blur-md border border-slate-200/80 rounded-xl transition-all duration-200 hover:border-slate-300'>
      <button
        onClick={() => setIsColorsExpanded(!isColorsExpanded)}
        className='rounded-t-xl w-full p-4 flex justify-between hover:cursor-pointer items-center transition-all duration-200'
      >
        <div className='flex items-center gap-3'>
          <Paintbrush className='w-5 h-5' />
          <h3 className='text-lg font-semibold text-slate-800'>Colors</h3>
        </div>
        <ChevronDown
          className={`w-4 h-4 transform transition-transform duration-200 ${
            isColorsExpanded ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isColorsExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className='p-4 pt-0'>
          {/* Color Coding Section */}
          <div className='mb-4'>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer'
              onClick={() => toggleSubheading("colorCode")}
            >
              <h4 className='text-sm font-semibold text-slate-700'>
                Color Coding
              </h4>
              <ChevronDown
                className={`w-3 h-3 transform transition-transform duration-200 ${
                  subheadingState.colorCode ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
                subheadingState.colorCode
                  ? "max-h-[1000px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-700 flex items-center gap-1'>
                  Enable Color Coding
                  <HelpTooltip text='Highlights letters that are commonly confused (e.g. b/d, p/q) with distinct background colors to aid recognition.' />
                </span>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={enableColorCoding}
                    onChange={(e) =>
                      setEnableColorCoding &&
                      setEnableColorCoding(e.target.checked)
                    }
                    disabled={isLoading}
                    className='sr-only'
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                      enableColorCoding ? "bg-slate-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                        enableColorCoding
                          ? "translate-x-5 ml-0.5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>

              <div
                className={`space-y-3 ${
                  enableColorCoding
                    ? "opacity-100"
                    : "opacity-50 pointer-events-none"
                }`}
              >
                {/* English Letter Combinations */}
                <div className='border border-slate-100 rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => toggleSubheading("englishCombos")}
                    className='w-full flex justify-between items-center px-3 py-2 bg-slate-50/80 hover:bg-slate-100/80 transition-colors'
                  >
                    <span className='text-sm font-medium text-gray-700'>
                      English Letter Combinations
                      <HelpTooltip text='Select pairs of English letters that look similar and are often confused. Matched letters will be color-highlighted in the text.' />
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${subheadingState.englishCombos ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${subheadingState.englishCombos ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className='p-3'>
                      <Multiselect
                        options={[
                          { value: "bd", label: "b ↔ d (Mirror Confusion)" },
                          { value: "pq", label: "p ↔ q (Mirror Confusion)" },
                          { value: "mw", label: "m ↔ w (Mirror Confusion)" },
                          { value: "nu", label: "n ↔ u (Mirror Confusion)" },
                          { value: "sz", label: "s ↔ z (Mirror Confusion)" },
                          { value: "ao", label: "a ↔ o (Mirror Confusion)" },
                          { value: "bpdq", label: "b → p, d, q (Rotation)" },
                          { value: "hn", label: "h ↔ n (Rotation)" },
                          { value: "tf", label: "t → f (Rotation)" },
                          { value: "rn", label: "r ↔ n (Rotation)" },
                          { value: "gq", label: "g ↔ q (Rotation)" },
                          { value: "vy", label: "v ↔ y (Rotation)" },
                          { value: "ilj", label: "i → l, j (Rotation)" },
                          { value: "xk", label: "x ↔ k (Rotation)" },
                          { value: "ceo", label: "c → e, o (Rotation)" },
                          { value: "vuw", label: "v → u, w (Rotation)" },
                        ]}
                        selected={colorCodedLetters.filter(
                          (item) => !item.startsWith("dev-"),
                        )}
                        onChange={(selected) => {
                          const devanagariSelections = colorCodedLetters.filter(
                            (item) => item.startsWith("dev-"),
                          );
                          if (setColorCodedLetters)
                            setColorCodedLetters([
                              ...devanagariSelections,
                              ...selected,
                            ]);
                        }}
                        placeholder='Select letter combinations'
                        disabled={isLoading || !enableColorCoding}
                      />
                    </div>
                  </div>
                </div>

                {/* Devanagari Consonant Combinations */}
                <div className='border border-slate-100 rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => toggleSubheading("devConsonants")}
                    className='w-full flex justify-between items-center px-3 py-2 bg-slate-50/80 hover:bg-slate-100/80 transition-colors'
                  >
                    <span className='text-sm font-medium text-gray-700'>
                      Devanagari Consonant Combinations
                      <HelpTooltip text='Select pairs of Devanagari consonants that look visually similar. Matched consonants will be highlighted to prevent mix-ups.' />
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${subheadingState.devConsonants ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${subheadingState.devConsonants ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className='p-3'>
                      <Multiselect
                        options={[
                          { value: "dev-bv", label: "ब and व" },
                          { value: "dev-np", label: "ण (ṇa) & प (pa)" },
                          { value: "dev-ghd", label: "घ and ध" },
                          { value: "dev-nda", label: "न, द, अ" },
                          { value: "dev-np2", label: "न and प" },
                          { value: "dev-gg", label: "ग (ga) vs. घ (gha)" },
                          { value: "dev-dhb", label: "ढ and भ" },
                          { value: "dev-dhd", label: "ध (dha) vs. द (da)" },
                          { value: "dev-pb", label: "फ and ब" },
                          { value: "dev-pp", label: "प (pa) vs. फ (pha)" },
                          { value: "dev-cc", label: "च and छ" },
                          { value: "dev-cj", label: "च and ज" },
                          { value: "dev-tt", label: "ट and ठ" },
                          { value: "dev-cj2", label: "छ (cha) vs. झ (jha)" },
                          { value: "dev-kk", label: "क and ख" },
                          { value: "dev-kg", label: "क (ka) vs. घ (gha)" },
                          { value: "dev-ss", label: "ष and श" },
                          { value: "dev-ss2", label: "ष (ṣa) vs. स (sa)" },
                          { value: "dev-dd", label: "द and ड" },
                          { value: "dev-yg", label: "य (ya) vs. ग (ga)" },
                          { value: "dev-jj", label: "ज and झ" },
                          { value: "dev-ng", label: "न and ग" },
                          { value: "dev-rn", label: "र and ङ" },
                          { value: "dev-nm", label: "न and म" },
                          { value: "dev-ms", label: "म and स" },
                        ]}
                        selected={colorCodedLetters.filter(
                          (item) =>
                            item.startsWith("dev-") &&
                            !item.startsWith("dev-v-"),
                        )}
                        onChange={(selected) => {
                          const otherSelections = colorCodedLetters.filter(
                            (item) =>
                              !item.startsWith("dev-") ||
                              item.startsWith("dev-v-"),
                          );
                          if (setColorCodedLetters)
                            setColorCodedLetters([
                              ...otherSelections,
                              ...selected,
                            ]);
                        }}
                        placeholder='Select letter combinations'
                        disabled={isLoading || !enableColorCoding}
                      />
                    </div>
                  </div>
                </div>

                {/* Devanagari Vowel Combinations */}
                <div className='border border-slate-100 rounded-lg overflow-hidden'>
                  <button
                    type='button'
                    onClick={() => toggleSubheading("devVowels")}
                    className='w-full flex justify-between items-center px-3 py-2 bg-slate-50/80 hover:bg-slate-100/80 transition-colors'
                  >
                    <span className='text-sm font-medium text-gray-700'>
                      Devanagari Vowel Combinations
                      <HelpTooltip text='Select pairs of Devanagari vowels that are commonly confused. These will be highlighted in the text.' />
                    </span>
                    <ChevronDown
                      className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${subheadingState.devVowels ? "rotate-180" : "rotate-0"}`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${subheadingState.devVowels ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                  >
                    <div className='p-3'>
                      <Multiselect
                        options={[
                          { value: "dev-v-ii", label: "इ vs ई" },
                          { value: "dev-v-uu", label: "उ vs ऊ" },
                          { value: "dev-v-oo", label: "ओ vs औ" },
                          { value: "dev-v-ee", label: "ए vs ऐ" },
                          { value: "dev-v-ri", label: "ऋ vs रि" },
                          { value: "dev-v-aha", label: "अं (am) vs अः (aha)" },
                          {
                            value: "dev-v-aa",
                            label: "अ (a) vs आ (aa), अः (aha)",
                          },
                        ]}
                        selected={colorCodedLetters.filter((item) =>
                          item.startsWith("dev-v-"),
                        )}
                        onChange={(selected) => {
                          const otherSelections = colorCodedLetters.filter(
                            (item) => !item.startsWith("dev-v-"),
                          );
                          if (setColorCodedLetters)
                            setColorCodedLetters([
                              ...otherSelections,
                              ...selected,
                            ]);
                        }}
                        placeholder='Select vowel combinations'
                        disabled={isLoading || !enableColorCoding}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Syllable Splitting Section */}
          <div className='mb-4'>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer'
              onClick={() => toggleSubheading("syllableSplit")}
            >
              <h4 className='text-sm font-semibold text-slate-700 flex items-center gap-1.5'>
                Word Splitting
              </h4>
              <ChevronDown
                className={`w-3 h-3 transform transition-transform duration-200 ${
                  subheadingState.syllableSplit ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                subheadingState.syllableSplit
                  ? "max-h-[200px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-700 flex items-center gap-1'>
                  Split Long Words
                  <HelpTooltip text='Breaks long words into smaller 2-3 letter chunks separated by a dot (·) to make them easier to read and decode.' />
                </span>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={enableSyllableSplit}
                    onChange={(e) =>
                      setEnableSyllableSplit &&
                      setEnableSyllableSplit(e.target.checked)
                    }
                    disabled={isLoading}
                    className='sr-only'
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                      enableSyllableSplit ? "bg-slate-600" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                        enableSyllableSplit
                          ? "translate-x-5 ml-0.5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>

              <div
                className={`${enableSyllableSplit ? "opacity-100" : "opacity-50 pointer-events-none"}`}
              >
                <div className='flex justify-between items-center mb-2'>
                  <label className='text-sm font-medium text-gray-700 flex items-center gap-1'>
                    Min. Characters
                    <HelpTooltip text='Words shorter than this number of characters will not be split. Default is 8.' />
                  </label>
                  <input
                    type='number'
                    min={4}
                    max={20}
                    value={syllableSplitThreshold}
                    onChange={(e) =>
                      setSyllableSplitThreshold &&
                      setSyllableSplitThreshold(
                        Math.max(
                          4,
                          Math.min(20, parseInt(e.target.value) || 8),
                        ),
                      )
                    }
                    disabled={isLoading || !enableSyllableSplit}
                    className='w-16 p-1.5 text-sm text-center bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300'
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Difficulty Heatmap Section */}
          <div className='mb-4'>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer'
              onClick={() => toggleSubheading("heatmap")}
            >
              <h4 className='text-sm font-semibold text-slate-700 flex items-center gap-1.5'>
                Difficulty Heatmap
              </h4>
              <ChevronDown
                className={`w-3 h-3 transform transition-transform duration-200 ${
                  subheadingState.heatmap ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`space-y-3 overflow-hidden transition-all duration-300 ease-in-out ${
                subheadingState.heatmap
                  ? "max-h-[200px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className='flex items-center justify-between'>
                <span className='text-sm text-gray-700 flex items-center gap-1'>
                  Show Heatmap
                  <HelpTooltip text='Overlays large red squares on difficult words (6+ letters), creating a visual heatmap of reading complexity.' />
                </span>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={enableHeatmap}
                    onChange={(e) =>
                      setEnableHeatmap && setEnableHeatmap(e.target.checked)
                    }
                    disabled={isLoading}
                    className='sr-only'
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                      enableHeatmap ? "bg-red-400" : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                        enableHeatmap
                          ? "translate-x-5 ml-0.5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Background Section */}
          <div className='mb-4'>
            <div
              className='flex justify-between items-center mb-2 cursor-pointer'
              onClick={() => toggleSubheading("background")}
            >
              <h4 className='text-sm font-semibold text-slate-700'>
                Background
              </h4>
              <ChevronDown
                className={`w-3 h-3 transform transition-transform duration-200 ${
                  subheadingState.background ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>
            <div
              className={`space-y-4 overflow-hidden transition-all duration-300 ease-in-out ${
                subheadingState.background
                  ? "max-h-[200px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div>
                <label className='text-sm font-medium text-gray-700 mb-2 block'>
                  Background Color
                  <HelpTooltip text='Choose a background tint for the editor. Warm tones like peach or yellow can reduce eye strain while reading.' />
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {[
                    { color: "#edd1b0", title: "Peach" },
                    { color: "#eddd63", title: "Yellow" },
                    { color: "#f8fd98", title: "Light Yellow" },
                    { color: "#a5f7e1", title: "Turquoise" },
                    { color: "#fff5ee", title: "Seashell" },
                    { color: "#ffffff", title: "White" },
                  ].map(({ color, title }) => (
                    <button
                      key={color}
                      onClick={() =>
                        setBackgroundColor && setBackgroundColor(color)
                      }
                      className={`w-8 h-8 rounded border ${
                        backgroundColor === color
                          ? "border-slate-800 border-2"
                          : "border-gray-200"
                      }`}
                      style={{ backgroundColor: color }}
                      title={title}
                      disabled={isLoading}
                    />
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between mt-2'>
                <span className='text-sm text-gray-700 flex items-center gap-1'>
                  Enable Lined Texture
                  <HelpTooltip text='Adds horizontal ruled lines behind the text, like notebook paper, to help track lines while reading.' />
                </span>
                <label className='relative inline-flex items-center cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={backgroundTexture === "lined"}
                    onChange={(e) =>
                      setBackgroundTexture &&
                      setBackgroundTexture(e.target.checked ? "lined" : "none")
                    }
                    disabled={isLoading}
                    className='sr-only'
                  />
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 ${
                      backgroundTexture === "lined"
                        ? "bg-slate-600"
                        : "bg-gray-300"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 mt-0.5 ${
                        backgroundTexture === "lined"
                          ? "translate-x-5 ml-0.5"
                          : "translate-x-0.5"
                      }`}
                    />
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
