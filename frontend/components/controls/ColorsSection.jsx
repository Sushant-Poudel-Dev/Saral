import { useState } from "react";
import ArrowDown from "@/media/ArrowDown.svg";
import Paint from "@/media/Paint.svg";
import Multiselect from "@/components/ui/Multiselect";

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
}) {
  const [isColorsExpanded, setIsColorsExpanded] = useState(true);
  const [subheadingState, setSubheadingState] = useState({
    colorCode: true,
    background: true,
    texture: true,
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
        onClick={() => setIsColorsExpanded(!isColorsExpanded)}
        className='rounded-t-xl w-full p-4 flex justify-between hover:cursor-pointer items-center transition-all duration-200'
      >
        <div className='flex items-center gap-3'>
          <img
            src={Paint.src}
            alt='Colors'
            className='w-5 h-5'
          />
          <h3 className='text-lg font-semibold text-slate-800'>Colors</h3>
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
              <img
                src={ArrowDown.src}
                alt='Toggle'
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
                <span className='text-sm text-gray-700'>
                  Enable Color Coding
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
                    ></div>
                  </div>
                </label>
              </div>

              <div
                className={`space-y-4 ${
                  enableColorCoding
                    ? "opacity-100"
                    : "opacity-50 pointer-events-none"
                }`}
              >
                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    English Letter Combinations
                  </label>
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
                      (item) => !item.startsWith("dev-")
                    )}
                    onChange={(selected) => {
                      // Keep the Devanagari selections and add the new English selections
                      const devanagariSelections = colorCodedLetters.filter(
                        (item) => item.startsWith("dev-")
                      );
                      setColorCodedLetters([
                        ...devanagariSelections,
                        ...selected,
                      ]);
                    }}
                    placeholder='Select letter combinations'
                    disabled={isLoading || !enableColorCoding}
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Devanagari Consonant Combinations
                  </label>
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
                        item.startsWith("dev-") && !item.startsWith("dev-v-")
                    )}
                    onChange={(selected) => {
                      // Keep the other selections and add the new Devanagari consonant selections
                      const otherSelections = colorCodedLetters.filter(
                        (item) =>
                          !item.startsWith("dev-") || item.startsWith("dev-v-")
                      );
                      setColorCodedLetters([...otherSelections, ...selected]);
                    }}
                    placeholder='Select letter combinations'
                    disabled={isLoading || !enableColorCoding}
                  />
                </div>

                <div>
                  <label className='text-sm font-medium text-gray-700 mb-2 block'>
                    Devanagari Vowel Combinations
                  </label>
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
                      item.startsWith("dev-v-")
                    )}
                    onChange={(selected) => {
                      // Keep the other selections and add the new Devanagari vowel selections
                      const otherSelections = colorCodedLetters.filter(
                        (item) => !item.startsWith("dev-v-")
                      );
                      setColorCodedLetters([...otherSelections, ...selected]);
                    }}
                    placeholder='Select vowel combinations'
                    disabled={isLoading || !enableColorCoding}
                  />
                </div>
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
              <img
                src={ArrowDown.src}
                alt='Toggle'
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
                </label>
                <div className='grid grid-cols-4 gap-2'>
                  {/* ...existing color buttons... */}
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#efe9e4")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#efe9e4"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#efe9e4" }}
                    title='Background'
                    disabled={isLoading}
                  ></button>
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#bbedc2")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#bbedc2"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#bbedc2" }}
                    title='Green/Mint'
                    disabled={isLoading}
                  ></button>
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#fba69d")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#fba69d"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#fba69d" }}
                    title='Pink/Coral'
                    disabled={isLoading}
                  ></button>
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#f2c969")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#f2c969"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#f2c969" }}
                    title='Yellow'
                    disabled={isLoading}
                  ></button>
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#a6e5f2")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#a6e5f2"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#a6e5f2" }}
                    title='Blue/Sky'
                    disabled={isLoading}
                  ></button>
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#dcb760")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#dcb760"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#dcb760" }}
                    title='Honey'
                    disabled={isLoading}
                  ></button>
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#f5f5f5")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#f5f5f5"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#f5f5f5" }}
                    title='Cream'
                    disabled={isLoading}
                  ></button>
                  <button
                    onClick={() =>
                      setBackgroundColor && setBackgroundColor("#ffffff")
                    }
                    className={`w-8 h-8 rounded border ${
                      backgroundColor === "#ffffff"
                        ? "border-slate-800 border-2"
                        : "border-gray-200"
                    }`}
                    style={{ backgroundColor: "#ffffff" }}
                    title='White'
                    disabled={isLoading}
                  ></button>
                </div>
              </div>

              {/* Lined texture toggle below bg colors, inside bg section */}
              <div className='flex items-center justify-between mt-2'>
                <span className='text-sm text-gray-700'>
                  Enable Lined Texture
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
                    ></div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Texture Section (Lined only, toggle) */}
        </div>
      </div>
    </div>
  );
}
