"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import html2canvas from "html2canvas-pro";
import { useWordDefinition } from "@/hooks/useWordDefinition";
import WordDefinitionTooltip from "@/components/feature/WordDefinitionTooltip";
import DocumentUpload from "@/components/feature/DocumentUpload";
import ImageUpload from "@/components/feature/ImageUpload";
import { X, Camera, BookOpen, Volume2, Loader2 } from "lucide-react";

interface TextAreaProps {
  text: string;
  setText: (text: string) => void;
  onClear: () => void;
  onTextExtracted: (text: string) => void;
  isLoading?: boolean;
  isPlaying?: boolean;
  currentText?: string;
  currentWordIndex?: number;
  currentCharIndex?: number;
  enableParagraphIsolation?: boolean;
  enableSentenceIsolation?: boolean;
  letterSpacing?: number;
  lineHeight?: number;
  fontSize?: number;
  fontFamily?: string;
  language?: string;
  className?: string;
  enableHighlighting?: boolean;
  enableColorCoding?: boolean;
  colorCodedLetters?: string[];
  backgroundColor?: string;
  backgroundTexture?: string;
  wordSpacing?: number;
  textAlign?: string;
  enableSyllableSplit?: boolean;
  syllableSplitThreshold?: number;
  enableHeatmap?: boolean;
}

interface Word {
  text: string;
  start: number;
  end: number;
  index: number;
}

interface Paragraph {
  index: number;
  start: number;
  end: number;
  text: string;
}

interface Sentence {
  index: number;
  start: number;
  end: number;
  text: string;
}

interface LetterColor {
  bg: string;
  text: string;
}

export default function TextArea({
  text,
  setText,
  onClear,
  onTextExtracted,
  isLoading = false,
  isPlaying = false,
  currentText = "",
  currentWordIndex = -1,
  enableParagraphIsolation = false,
  enableSentenceIsolation = false,
  letterSpacing = 0,
  lineHeight = 1.5,
  fontSize = 16,
  fontFamily = "var(--font-lexend)",
  language = "en",
  enableHighlighting = false,
  enableColorCoding = false,
  colorCodedLetters = [],
  backgroundColor = "#ffffff",
  backgroundTexture = "none",
  wordSpacing = 0,
  textAlign = "left",
  enableSyllableSplit = false,
  syllableSplitThreshold = 8,
  enableHeatmap = false,
}: TextAreaProps) {
  // Definitions mode toggle
  const [definitionsMode, setDefinitionsMode] = useState(false);

  // For lined background scroll sync in both modes
  const [normalScrollTop, setNormalScrollTop] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [readingScrollTop, setReadingScrollTop] = useState(0);
  const readingContainerRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isExportingAudio, setIsExportingAudio] = useState(false);

  // Detect language helper
  const detectLang = (input: string): string => {
    const nepaliRegex = /[\u0900-\u097F]/;
    for (const char of input) {
      if (/[\s.,!?;:()\[\]{}"'-]/.test(char)) continue;
      if (nepaliRegex.test(char)) return "ne";
      if (/[a-zA-Z0-9]/.test(char)) return "en";
    }
    return "en";
  };

  // Export audio — calls /api/tts and downloads the MP3
  const exportAudio = useCallback(async () => {
    if (!text.trim()) return;
    setIsExportingAudio(true);
    try {
      const lang = detectLang(text);
      const params = new URLSearchParams({
        text: text.trim(),
        lang,
        slow: "false",
      });
      const res = await fetch(`/api/tts?${params.toString()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "saral-audio.mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export audio failed:", err);
      alert("Failed to export audio. Please try again.");
    } finally {
      setIsExportingAudio(false);
    }
  }, [text]);

  // Pre-calculate text structure when text changes
  const textStructure = useMemo(() => {
    if (!currentText)
      return {
        words: [] as Word[],
        paragraphs: [] as Paragraph[],
        sentences: [] as Sentence[],
        wordToParagraph: new Map<number, number>(),
        wordToSentence: new Map<number, number>(),
      };

    console.log("Recalculating text structure...");

    // Split text into words with positions
    const words: Word[] = [];
    const wordMatches = currentText.matchAll(/\S+/g);

    for (const match of wordMatches) {
      words.push({
        text: match[0],
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
        index: words.length,
      });
    }

    // Calculate paragraph boundaries
    const paragraphTexts = currentText.split(/\n\s*\n/);
    const paragraphs: Paragraph[] = [];
    let currentPos = 0;

    for (let i = 0; i < paragraphTexts.length; i++) {
      const paragraphText = paragraphTexts[i];
      const start = currentText.indexOf(paragraphText, currentPos);
      const end = start + paragraphText.length;

      paragraphs.push({
        index: i,
        start: start,
        end: end,
        text: paragraphText,
      });

      currentPos = end;
    }

    // Calculate sentence boundaries
    const sentences: Sentence[] = [];
    const sentenceRegex = /[.!?]+/g;
    let sentenceMatch: RegExpExecArray | null;
    let lastEnd = 0;
    let sentenceIndex = 0;

    while ((sentenceMatch = sentenceRegex.exec(currentText)) !== null) {
      const end = sentenceMatch.index + sentenceMatch[0].length;
      const sentenceText = currentText.substring(lastEnd, end).trim();

      if (sentenceText.length > 0) {
        sentences.push({
          index: sentenceIndex,
          start: lastEnd,
          end: end,
          text: sentenceText,
        });
        sentenceIndex++;
      }

      lastEnd = end;
    }

    // Add the last sentence if there's remaining text
    if (lastEnd < currentText.length) {
      const lastSentenceText = currentText.substring(lastEnd).trim();
      if (lastSentenceText.length > 0) {
        sentences.push({
          index: sentenceIndex,
          start: lastEnd,
          end: currentText.length,
          text: lastSentenceText,
        });
      }
    }

    // Create mapping from word index to paragraph/sentence
    const wordToParagraph = new Map<number, number>();
    const wordToSentence = new Map<number, number>();

    words.forEach((word) => {
      const paragraph = paragraphs.find(
        (p) => word.start >= p.start && word.end <= p.end,
      );
      if (paragraph) {
        wordToParagraph.set(word.index, paragraph.index);
      }

      const sentence = sentences.find(
        (s) => word.start >= s.start && word.end <= s.end,
      );
      if (sentence) {
        wordToSentence.set(word.index, sentence.index);
      }
    });

    console.log(
      `Text structure: ${words.length} words, ${paragraphs.length} paragraphs, ${sentences.length} sentences`,
    );

    return {
      words,
      paragraphs,
      sentences,
      wordToParagraph,
      wordToSentence,
    };
  }, [currentText]);

  // Word definition hook
  const {
    definition,
    isLoading: definitionLoading,
    error: definitionError,
    isVisible: definitionVisible,
    position: mousePosition,
    handleWordHover,
    handleWordLeave,
    hideDefinition,
  } = useWordDefinition();

  // Helper functions to get style values
  const getLetterSpacingValue = () => {
    return `${letterSpacing}em`;
  };

  const getLineHeightValue = () => {
    return lineHeight;
  };

  // Function to get word at mouse position in textarea
  const getWordAtPosition = (
    textarea: HTMLTextAreaElement,
    clientX: number,
    clientY: number,
  ): string | null => {
    try {
      const rect = textarea.getBoundingClientRect();
      const x =
        clientX -
        rect.left -
        parseInt(window.getComputedStyle(textarea).paddingLeft || "0");
      const y =
        clientY -
        rect.top -
        parseInt(window.getComputedStyle(textarea).paddingTop || "0");

      const textValue = textarea.value;
      if (!textValue.trim()) return null;

      const style = window.getComputedStyle(textarea);
      const fontSizePx = parseFloat(style.fontSize) || 16;
      const lineHeightPx = parseFloat(style.lineHeight) || fontSizePx * 1.2;

      const lineIndex = Math.floor(y / lineHeightPx);
      const lines = textValue.split("\n");

      if (lineIndex < 0 || lineIndex >= lines.length) return null;

      const lineText = lines[lineIndex];
      if (!lineText || !lineText.trim()) return null;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.font = `${fontSizePx}px ${fontFamily}`;

      const lineWidth = ctx.measureText(lineText).width;
      if (x > lineWidth + 5) return null;

      let charIndex = 0;
      for (let i = 0; i <= lineText.length; i++) {
        const substring = lineText.substring(0, i);
        const measuredWidth = ctx.measureText(substring).width;
        if (measuredWidth > x) {
          charIndex = Math.max(0, i - 1);
          break;
        }
        charIndex = i;
      }

      if (charIndex >= lineText.length) charIndex = lineText.length - 1;
      if (charIndex < 0) return null;

      const charAtPosition = lineText[charIndex];
      if (!charAtPosition || !/\w/.test(charAtPosition)) return null;

      let wordStart = charIndex;
      while (wordStart > 0 && /\w/.test(lineText[wordStart - 1])) {
        wordStart--;
      }

      let wordEnd = charIndex;
      while (wordEnd < lineText.length && /\w/.test(lineText[wordEnd])) {
        wordEnd++;
      }

      const word = lineText.substring(wordStart, wordEnd);

      if (word.length > 1 && /[a-zA-Z]/.test(word)) {
        return word.toLowerCase();
      }

      return null;
    } catch (error) {
      console.error("Error getting word at position:", error);
      return null;
    }
  };

  // Handle textarea mouse events for word detection
  let lastDetectedWord: string | null = null;

  const handleTextareaMouseMove = (
    e: React.MouseEvent<HTMLTextAreaElement>,
  ) => {
    if (definitionVisible || language !== "en") return;

    const target = e.target as HTMLTextAreaElement;
    if (!target.value.trim()) return;

    const word = getWordAtPosition(target, e.clientX, e.clientY);
    console.log("Mouse position:", { x: e.clientX, y: e.clientY });
    console.log("Detected word:", word);

    if (word !== lastDetectedWord) {
      lastDetectedWord = word;

      if (word && word.length > 1) {
        target.title = "";
        console.log("Triggering hover for word:", word);
        handleWordHover(word, e);
      } else {
        target.title = "";
        handleWordLeave();
      }
    }
  };

  const handleTextareaMouseLeave = (
    e: React.MouseEvent<HTMLTextAreaElement>,
  ) => {
    if (definitionVisible || language !== "en") return;

    lastDetectedWord = null;
    (e.target as HTMLTextAreaElement).title = "";
    handleWordLeave();
  };

  // Function to determine if a character should be color-coded
  const getColorForLetter = (letter: string): LetterColor | null => {
    if (!enableColorCoding || colorCodedLetters.length === 0) return null;

    const englishConfusions = colorCodedLetters.filter(
      (item) => !item.startsWith("dev-"),
    );

    if (/[a-zA-Z]/.test(letter)) {
      for (const confusion of englishConfusions) {
        if (new RegExp(`[${confusion}]`, "i").test(letter)) {
          return {
            bg: "#FECACA",
            text: "#9B2C2C",
          };
        }
      }
      return null;
    }

    if (/[\u0900-\u097F]/.test(letter)) {
      const devanagariMap: Record<string, string[]> = {
        "dev-bv": ["ब", "व"],
        "dev-np": ["ण", "प"],
        "dev-ghd": ["घ", "ध"],
        "dev-nda": ["न", "द"],
        "dev-np2": ["न", "प"],
        "dev-gg": ["ग", "घ"],
        "dev-dhb": ["ढ", "भ"],
        "dev-dhd": ["ध", "द"],
        "dev-pb": ["फ", "ब"],
        "dev-pp": ["प", "फ"],
        "dev-cc": ["च", "छ"],
        "dev-cj": ["च", "ज"],
        "dev-tt": ["ट", "ठ"],
        "dev-cj2": ["छ", "झ"],
        "dev-kk": ["क", "ख"],
        "dev-kg": ["क", "घ"],
        "dev-ss": ["ष", "श"],
        "dev-ss2": ["ष", "स"],
        "dev-dd": ["द", "ड"],
        "dev-yg": ["य", "ग"],
        "dev-jj": ["ज", "झ"],
        "dev-ng": ["न", "ग"],
        "dev-rn": ["र", "न"],
        "dev-nm": ["न", "म"],
        "dev-ms": ["म", "स"],
        "dev-v-ii": ["इ", "ई"],
        "dev-v-uu": ["उ", "ऊ"],
        "dev-v-oo": ["ओ", "औ"],
        "dev-v-ee": ["ए", "ऐ"],
        "dev-v-ri": ["ऋ", "ऋृ"],
        "dev-v-aha": ["अं", "अः"],
        "dev-v-aa": ["अ", "आ"],
      };

      for (const code of colorCodedLetters) {
        if (code.startsWith("dev-") && devanagariMap[code]) {
          if (devanagariMap[code].includes(letter)) {
            return code.startsWith("dev-v-")
              ? { bg: "#BEE3F8", text: "#2A4365" }
              : { bg: "#E9D8FD", text: "#553C9A" };
          }
        }
      }
    }

    return null;
  };

  // Function to apply color coding to a word
  const applyColorCoding = (word: string): React.ReactNode => {
    if (!enableColorCoding || colorCodedLetters.length === 0) return word;

    const coloredChars: React.ReactNode[] = [];
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      const color = getColorForLetter(char);

      if (color) {
        coloredChars.push(
          <span
            key={i}
            style={{
              backgroundColor: color.bg,
              color: color.text,
              fontWeight: "bold",
              borderRadius: "2px",
              padding: "0 1px",
            }}
          >
            {char}
          </span>,
        );
      } else {
        coloredChars.push(char);
      }
    }

    return coloredChars;
  };

  // Pre-compute syllable splits once for stable rendering (no jitter)
  const splitCache = useMemo(() => {
    if (!enableSyllableSplit) return new Map<string, string>();
    const cache = new Map<string, string>();
    const allText = `${text} ${currentText}`;
    const words = allText.match(/\S+/g) || [];

    for (const word of words) {
      if (cache.has(word)) continue;

      const pureLetters = word.replace(/[^a-zA-Z\u0900-\u097F]/g, "");
      if (pureLetters.length < syllableSplitThreshold) {
        cache.set(word, word);
        continue;
      }

      // Deterministic hash so the same word always splits identically
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash + word.charCodeAt(i)) | 0;
      }

      const chunks: string[] = [];
      let remaining = word;
      let idx = 0;
      while (remaining.length > 0) {
        const chunkSize =
          remaining.length <= 4 ? remaining.length : (hash >>> idx) & 1 ? 3 : 2;
        chunks.push(remaining.slice(0, chunkSize));
        remaining = remaining.slice(chunkSize);
        idx++;
      }
      cache.set(word, chunks.join("\u00B7"));
    }

    return cache;
  }, [text, currentText, enableSyllableSplit, syllableSplitThreshold]);

  // Look up cached split — always deterministic
  const splitWord = (word: string): string => {
    if (!enableSyllableSplit) return word;
    return splitCache.get(word) ?? word;
  };

  // Apply syllable split + color coding to a word
  const renderWord = (word: string): React.ReactNode => {
    const display = splitWord(word);
    if (enableColorCoding && colorCodedLetters.length > 0) {
      return applyColorCoding(display);
    }
    return display;
  };

  // Heatmap: check if a word is "difficult" (6+ alphabetic characters)
  const isHeatmapWord = (word: string): boolean => {
    if (!enableHeatmap) return false;
    const letters = word.replace(/[^a-zA-Z\u0900-\u097F]/g, "");
    return letters.length >= 6;
  };

  // Wrap a word with a large heatmap square behind it
  const wrapWithHeatmap = (
    content: React.ReactNode,
    key: string,
  ): React.ReactNode => {
    return (
      <span
        key={key}
        style={{ position: "relative", display: "inline" }}
      >
        <span
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "20rem",
            height: "20rem",
            backgroundColor: "rgba(239, 68, 68, 0.04)",
            pointerEvents: "none",
            zIndex: -1,
          }}
        />
        {content}
      </span>
    );
  };

  // Optimized helper function to get opacity for a word based on isolation settings
  const getWordOpacity = (wordIdx: number): number => {
    if (!currentText || currentWordIndex < 0) return 1;
    if (!enableParagraphIsolation && !enableSentenceIsolation) return 1;
    if (wordIdx === currentWordIndex) return 1;

    const currentWordParagraph =
      textStructure.wordToParagraph.get(currentWordIndex);
    const currentWordSentence =
      textStructure.wordToSentence.get(currentWordIndex);

    const wordParagraph = textStructure.wordToParagraph.get(wordIdx);
    const wordSentence = textStructure.wordToSentence.get(wordIdx);

    if (enableSentenceIsolation) {
      if (currentWordSentence !== undefined && wordSentence !== undefined) {
        if (currentWordSentence === wordSentence) return 1;
        // Same paragraph but different sentence — keep semi-visible
        if (
          currentWordParagraph !== undefined &&
          wordParagraph !== undefined &&
          currentWordParagraph === wordParagraph
        ) {
          return 0.55;
        }
        return 0.15;
      }
    }

    if (enableParagraphIsolation) {
      if (currentWordParagraph !== undefined && wordParagraph !== undefined) {
        return currentWordParagraph === wordParagraph ? 1 : 0.15;
      }
    }

    return 1;
  };

  // Helper function to get opacity for non-word characters (whitespace, punctuation)
  const getCharOpacity = (charIndex: number): number => {
    if (!enableParagraphIsolation && !enableSentenceIsolation) return 1;

    const wordAtChar = textStructure.words.find(
      (w) => charIndex >= w.start && charIndex <= w.end,
    );

    if (wordAtChar) {
      return getWordOpacity(wordAtChar.index);
    }

    let nearestWord: Word | null = null;
    let minDistance = Infinity;

    for (const word of textStructure.words) {
      const distance = Math.min(
        Math.abs(charIndex - word.start),
        Math.abs(charIndex - word.end),
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestWord = word;
      }
    }

    return nearestWord ? getWordOpacity(nearestWord.index) : 1;
  };

  // Snapshot download — renders text into an off-screen container and captures as PNG
  const downloadSnapshot = useCallback(async () => {
    if (!text.trim()) return;

    setIsCapturing(true);
    try {
      // Create an off-screen container that replicates the editor content at full height
      const container = document.createElement("div");
      container.style.cssText = `
        position: fixed;
        left: -9999px;
        top: 0;
        width: 800px;
        padding: 32px;
        background-color: ${backgroundColor || "#ffffff"};
        font-size: ${fontSize}px;
        font-family: ${fontFamily};
        line-height: ${lineHeight};
        letter-spacing: ${letterSpacing}em;
        word-spacing: ${wordSpacing}em;
        text-align: ${textAlign};
        white-space: pre-wrap;
        overflow-wrap: break-word;
        word-break: break-word;
        color: #334155;
      `;

      // If there's an overlay active, clone the overlay content; otherwise render plain text
      const overlayEl = contentAreaRef.current?.querySelector(
        '[style*="pointer-events: none"][style*="z-index: 1"], [style*="pointerEvents: none"][style*="zIndex: 1"]',
      ) as HTMLElement | null;

      if (overlayEl) {
        // Clone the styled overlay content (color-coded / syllable-split text)
        const innerContent = overlayEl.querySelector("div");
        if (innerContent) {
          const clone = innerContent.cloneNode(true) as HTMLElement;
          // Remove the transform scroll offset
          clone.style.transform = "none";
          clone.style.position = "static";
          container.appendChild(clone);
        } else {
          container.textContent = text;
        }
      } else {
        // Plain text — just put the text in the container
        container.textContent = text;
      }

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: backgroundColor || "#ffffff",
      });

      document.body.removeChild(container);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "styled-text.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch {
      alert("Failed to capture snapshot. Please try again.");
    } finally {
      setIsCapturing(false);
    }
  }, [
    text,
    backgroundColor,
    fontSize,
    fontFamily,
    lineHeight,
    letterSpacing,
    wordSpacing,
    textAlign,
  ]);

  // Function to render normal mode (editable textarea)
  const renderNormalMode = () => {
    const lineHeightPx =
      typeof lineHeight === "number"
        ? fontSize * lineHeight
        : fontSize * parseFloat(String(lineHeight));

    const contentHeight = 640;
    const numLines = Math.floor(contentHeight / lineHeightPx);

    const handleTextareaScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
      setNormalScrollTop((e.target as HTMLTextAreaElement).scrollTop);
    };

    const renderLinedBackground = () => {
      if (backgroundTexture !== "lined") return null;
      return (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -normalScrollTop,
            width: "100%",
            height: `${contentHeight}px`,
            minHeight: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {Array.from({ length: numLines }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${i * lineHeightPx + 10}px`,
                height: "1px",
                background: "#d4c9be",
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      );
    };

    const needsColorOverlay =
      (enableColorCoding && colorCodedLetters.length > 0) ||
      enableSyllableSplit;

    const needsOverlay = needsColorOverlay || enableHeatmap;

    // Build styled overlay so color-coding, syllable splits & heatmap show while typing
    const renderStyledOverlay = () => {
      if (!(needsColorOverlay || enableHeatmap) || !text) return null;

      const parts: React.ReactNode[] = [];
      let wordIdx = 0;

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (/\S/.test(char) && (i === 0 || /\s/.test(text[i - 1]))) {
          let wordEnd = i;
          while (wordEnd < text.length && /\S/.test(text[wordEnd])) wordEnd++;
          const word = text.substring(i, wordEnd);
          const difficult = isHeatmapWord(word);
          const rendered = renderWord(word);
          if (difficult) {
            parts.push(wrapWithHeatmap(rendered, `w-${wordIdx}-${i}`));
          } else {
            parts.push(<span key={`w-${wordIdx}-${i}`}>{rendered}</span>);
          }
          wordIdx++;
          i = wordEnd - 1;
        } else {
          parts.push(char);
        }
      }

      return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <div
            className='text-lg p-6 md:p-8'
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              lineHeight: getLineHeightValue(),
              letterSpacing: getLetterSpacingValue(),
              wordSpacing: `${wordSpacing}em`,
              textAlign: textAlign as React.CSSProperties["textAlign"],
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily,
              color: "#334155",
              transform: `translateY(-${normalScrollTop}px)`,
            }}
          >
            {parts}
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: backgroundColor,
          overflow: "hidden",
          borderRadius: "0 0 1rem 1rem",
        }}
      >
        {renderLinedBackground()}
        {renderStyledOverlay()}
        {/* Hide selected text in textarea when overlay is active */}
        {needsOverlay && (
          <style>{`
            #textInput::selection { color: transparent; background: rgba(59,130,246,0.25); }
            #textInput::-moz-selection { color: transparent; background: rgba(59,130,246,0.25); }
          `}</style>
        )}
        <textarea
          ref={textareaRef}
          id='textInput'
          value={text}
          onChange={(e) => setText(e.target.value)}
          onScroll={handleTextareaScroll}
          onMouseMove={handleTextareaMouseMove}
          onMouseLeave={handleTextareaMouseLeave}
          placeholder='Start typing or paste your text here…'
          className={`text-lg w-full h-full resize-none focus:outline-none p-6 md:p-8 ${needsOverlay ? "placeholder:text-slate-400" : ""}`}
          style={{
            lineHeight: getLineHeightValue(),
            letterSpacing: getLetterSpacingValue(),
            wordSpacing: `${wordSpacing}em`,
            textAlign: textAlign as React.CSSProperties["textAlign"],
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            background: "transparent",
            position: "relative",
            zIndex: 4,
            color: needsOverlay ? "transparent" : "#334155",
            caretColor: "#334155",
          }}
          rows={4}
          disabled={isLoading}
        />
      </div>
    );
  };

  const renderTextWithWordHighlight = () => {
    const textToUse = isPlaying && currentText ? currentText : text;

    if (!textToUse) {
      return (
        <div
          className='overflow-auto h-full w-full p-6 md:p-8'
          style={{
            lineHeight: getLineHeightValue(),
            letterSpacing: getLetterSpacingValue(),
            fontSize: `${fontSize}px`,
            fontFamily: fontFamily,
            backgroundColor: backgroundColor,
            borderRadius: "0 0 1rem 1rem",
          }}
        ></div>
      );
    }

    const textParts: React.ReactNode[] = [];
    let wordIndex = 0;

    for (let i = 0; i < textToUse.length; i++) {
      const char = textToUse[i];

      if (/\S/.test(char) && (i === 0 || /\s/.test(textToUse[i - 1]))) {
        let wordEnd = i;
        while (wordEnd < textToUse.length && /\S/.test(textToUse[wordEnd])) {
          wordEnd++;
        }

        const word = textToUse.substring(i, wordEnd);
        const isCurrentWord = wordIndex === currentWordIndex;
        const shouldHighlight = enableHighlighting && isCurrentWord;

        let opacity = 1;
        if (enableParagraphIsolation || enableSentenceIsolation) {
          opacity = getWordOpacity(wordIndex);
        }

        const cleanWord = word.replace(/[^\w]/g, "").toLowerCase();
        const shouldEnableHover =
          language === "en" &&
          cleanWord.length > 1 &&
          /[a-zA-Z]/.test(cleanWord);

        const difficult = isHeatmapWord(word);

        const wordContent = renderWord(word);

        textParts.push(
          difficult ? (
            <span
              key={`word-${wordIndex}-${i}`}
              className={`transition-all duration-200 ease-in-out ${
                shouldHighlight ? "text-white" : "text-slate-700"
              } ${shouldEnableHover ? "hover:bg-(--honey)/20 cursor-help rounded" : ""}`}
              style={{
                position: "relative",
                display: "inline",
                backgroundColor: shouldHighlight
                  ? "var(--darkblue)"
                  : "transparent",
                borderRadius: shouldHighlight ? "4px" : "0",
                padding: shouldHighlight ? "1px 3px" : "0",
                opacity,
              }}
              onMouseEnter={
                shouldEnableHover
                  ? (e: React.MouseEvent<HTMLSpanElement>) =>
                      handleWordHover(cleanWord, e)
                  : undefined
              }
              onMouseLeave={shouldEnableHover ? handleWordLeave : undefined}
            >
              <span
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "20rem",
                  height: "20rem",
                  backgroundColor: "rgba(239, 68, 68, 0.04)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />
              <span style={{ position: "relative", zIndex: 1 }}>
                {wordContent}
              </span>
            </span>
          ) : (
            <span
              key={`word-${wordIndex}-${i}`}
              className={`transition-all duration-200 ease-in-out ${
                shouldHighlight ? "text-white" : "text-slate-700"
              } ${shouldEnableHover ? "hover:bg-(--honey)/20 cursor-help rounded" : ""}`}
              style={{
                backgroundColor: shouldHighlight
                  ? "var(--darkblue)"
                  : "transparent",
                borderRadius: shouldHighlight ? "4px" : "0",
                padding: shouldHighlight ? "1px 3px" : "0",
                opacity,
              }}
              onMouseEnter={
                shouldEnableHover
                  ? (e: React.MouseEvent<HTMLSpanElement>) =>
                      handleWordHover(cleanWord, e)
                  : undefined
              }
              onMouseLeave={shouldEnableHover ? handleWordLeave : undefined}
            >
              {wordContent}
            </span>
          ),
        );

        wordIndex++;
        i = wordEnd - 1;
      } else {
        let opacity = 1;
        if (enableParagraphIsolation || enableSentenceIsolation) {
          opacity = getCharOpacity(i);
        }

        textParts.push(
          <span
            key={`char-${i}`}
            style={{ opacity: opacity }}
          >
            {char}
          </span>,
        );
      }
    }

    const lineHeightPx =
      typeof lineHeight === "number"
        ? fontSize * lineHeight
        : fontSize * parseFloat(String(lineHeight));

    const contentHeight = 640;
    const numLines = Math.floor(contentHeight / lineHeightPx);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setReadingScrollTop((e.target as HTMLDivElement).scrollTop);
    };

    const renderLinedBackground = () => {
      if (backgroundTexture !== "lined") return null;
      return (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: -readingScrollTop,
            width: "100%",
            height: `${contentHeight}px`,
            minHeight: "100%",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {Array.from({ length: numLines }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${i * lineHeightPx + 10}px`,
                height: "1px",
                background: "#d4c9be",
                opacity: 0.5,
              }}
            />
          ))}
        </div>
      );
    };

    return (
      <div
        ref={readingContainerRef}
        className='text-lg overflow-auto w-full h-full'
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          backgroundColor: backgroundColor,
          overflow: "auto",
          borderRadius: "0 0 1rem 1rem",
        }}
        onScroll={handleScroll}
      >
        {renderLinedBackground()}
        <div
          className='p-6 md:p-8'
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: fontFamily,
            fontSize: `${fontSize}px`,
            lineHeight: getLineHeightValue(),
            letterSpacing: getLetterSpacingValue(),
            wordSpacing: `${wordSpacing}em`,
            textAlign: textAlign as React.CSSProperties["textAlign"],
            whiteSpace: "pre-wrap",
          }}
        >
          {textParts}
        </div>
      </div>
    );
  };

  const hasText = text.trim().length > 0;

  return (
    <div
      className='relative flex flex-col rounded-2xl overflow-hidden bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_6px_24px_rgba(0,0,0,0.06)] border border-slate-200/60'
      style={{ height: "calc(100vh - 180px)", minHeight: "480px" }}
    >
      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className='flex items-center justify-between gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50/60 backdrop-blur-sm shrink-0'>
        <span className='text-xs font-semibold text-slate-400 tracking-wide uppercase select-none'>
          Editor
        </span>

        <div className='flex items-center gap-1.5'>
          <ImageUpload
            onTextExtracted={onTextExtracted}
            compact={true}
          />

          <DocumentUpload
            onTextExtracted={onTextExtracted}
            compact={true}
          />

          <button
            onClick={downloadSnapshot}
            disabled={!hasText || isCapturing}
            className='p-2 hover:bg-white/80 rounded-lg transition-all duration-200 bg-white/50 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed group'
            title='Download as Image'
          >
            <Camera className='w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors' />
          </button>

          <button
            onClick={exportAudio}
            disabled={!hasText || isExportingAudio}
            className='p-2 hover:bg-white/80 rounded-lg transition-all duration-200 bg-white/50 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed group'
            title='Export Audio (MP3)'
          >
            {isExportingAudio ? (
              <Loader2 className='w-4 h-4 text-slate-500 animate-spin' />
            ) : (
              <Volume2 className='w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors' />
            )}
          </button>

          <button
            onClick={() => setDefinitionsMode((v) => !v)}
            className={`p-2 rounded-lg transition-all duration-200 backdrop-blur-sm border flex items-center justify-center group ${
              definitionsMode
                ? "bg-(--honey)/15 border-(--honey)/40 text-(--honey)"
                : "bg-white/50 border-slate-200/60 text-slate-500 hover:bg-white/80"
            }`}
            title={
              definitionsMode ? "Disable Definitions" : "Enable Definitions"
            }
          >
            <BookOpen className='w-4 h-4 group-hover:text-slate-700 transition-colors' />
          </button>

          {hasText && (
            <button
              onClick={onClear}
              disabled={isLoading}
              className='p-2 hover:bg-red-50 rounded-lg transition-all duration-200 bg-white/50 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center group disabled:opacity-40'
              title='Clear Text'
            >
              <X className='w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors' />
            </button>
          )}
        </div>
      </div>

      {/* ── Content area ─────────────────────────────────────── */}
      <div
        ref={contentAreaRef}
        className='flex-1 min-h-0'
      >
        {isPlaying || definitionsMode
          ? renderTextWithWordHighlight()
          : renderNormalMode()}
      </div>

      {/* Word Definition Tooltip (only in definitionsMode, not during playback) */}
      {definitionsMode && !isPlaying && (
        <WordDefinitionTooltip
          definition={definition}
          isLoading={definitionLoading}
          error={definitionError}
          isVisible={definitionVisible}
          position={mousePosition}
          onClose={hideDefinition}
        />
      )}
    </div>
  );
}
