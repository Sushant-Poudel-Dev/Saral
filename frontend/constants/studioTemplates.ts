export interface StudioTemplateSettings {
  speed: "slow" | "normal" | "fast";
  letterSpacing: number;
  lineHeight: number;
  fontSize: number;
  fontFamily: string;
  enableHighlighting: boolean;
  enableColorCoding: boolean;
  colorCodedLetters: string[];
  backgroundColor: string;
  backgroundTexture: string;
  wordSpacing: number;
  textAlign: string;
  enableSyllableSplit: boolean;
  syllableSplitThreshold: number;
  enableHeatmap: boolean;
  enableParagraphIsolation: boolean;
  enableSentenceIsolation: boolean;
}

export interface StudioTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  previewBg: string;
  previewText: string;
  previewFont: string;
  tags: string[];
  settings: StudioTemplateSettings;
}

export const STUDIO_TEMPLATES: StudioTemplate[] = [
  {
    id: "dyslexia-friendly",
    name: "Dyslexia Friendly",
    description:
      "OpenDyslexic font, wider spacing, lined paper, and slower read-aloud for easier decoding.",
    category: "Reading",
    previewBg: "#fffef5",
    previewText: "Comfortable reading",
    previewFont: "var(--font-opendyslexic)",
    tags: ["OpenDyslexic", "Lined", "Slow TTS"],
    settings: {
      speed: "slow",
      letterSpacing: 1.5,
      lineHeight: 2,
      fontSize: 20,
      fontFamily: "var(--font-opendyslexic)",
      enableHighlighting: true,
      enableColorCoding: false,
      colorCodedLetters: [],
      backgroundColor: "#fffef5",
      backgroundTexture: "lined",
      wordSpacing: 2,
      textAlign: "left",
      enableSyllableSplit: true,
      syllableSplitThreshold: 6,
      enableHeatmap: false,
      enableParagraphIsolation: false,
      enableSentenceIsolation: true,
    },
  },
  {
    id: "high-contrast",
    name: "High Contrast",
    description:
      "Bright yellow background with large text and word highlighting for low-vision readers.",
    category: "Vision",
    previewBg: "#fef08a",
    previewText: "High contrast",
    previewFont: "var(--font-lexend)",
    tags: ["Bright", "Large text", "Highlight"],
    settings: {
      speed: "normal",
      letterSpacing: 0.5,
      lineHeight: 1.8,
      fontSize: 22,
      fontFamily: "var(--font-lexend)",
      enableHighlighting: true,
      enableColorCoding: false,
      colorCodedLetters: [],
      backgroundColor: "#fef08a",
      backgroundTexture: "none",
      wordSpacing: 1,
      textAlign: "left",
      enableSyllableSplit: false,
      syllableSplitThreshold: 8,
      enableHeatmap: false,
      enableParagraphIsolation: true,
      enableSentenceIsolation: false,
    },
  },
  {
    id: "focus-reader",
    name: "Focus Reader",
    description:
      "Sentence-by-sentence isolation with word highlighting to keep attention on one line at a time.",
    category: "Focus",
    previewBg: "#f8fafc",
    previewText: "One sentence",
    previewFont: "var(--font-inter)",
    tags: ["Highlight", "Sentence mode", "Clean"],
    settings: {
      speed: "normal",
      letterSpacing: 0,
      lineHeight: 1.75,
      fontSize: 18,
      fontFamily: "var(--font-inter)",
      enableHighlighting: true,
      enableColorCoding: false,
      colorCodedLetters: [],
      backgroundColor: "#f8fafc",
      backgroundTexture: "none",
      wordSpacing: 0,
      textAlign: "left",
      enableSyllableSplit: false,
      syllableSplitThreshold: 8,
      enableHeatmap: false,
      enableParagraphIsolation: false,
      enableSentenceIsolation: true,
    },
  },
  {
    id: "audio-learning",
    name: "Audio Learning",
    description:
      "Paragraph isolation with highlighting — ideal for listening while following along.",
    category: "Audio",
    previewBg: "#fff7ed",
    previewText: "Listen & read",
    previewFont: "var(--font-lexend)",
    tags: ["TTS", "Paragraph mode", "Highlight"],
    settings: {
      speed: "normal",
      letterSpacing: 0,
      lineHeight: 1.6,
      fontSize: 17,
      fontFamily: "var(--font-lexend)",
      enableHighlighting: true,
      enableColorCoding: false,
      colorCodedLetters: [],
      backgroundColor: "#fff7ed",
      backgroundTexture: "none",
      wordSpacing: 0,
      textAlign: "left",
      enableSyllableSplit: false,
      syllableSplitThreshold: 8,
      enableHeatmap: false,
      enableParagraphIsolation: true,
      enableSentenceIsolation: false,
    },
  },
  {
    id: "nepali-reader",
    name: "Nepali Reader",
    description:
      "Color-coded Devanagari letters with comfortable line height for bilingual reading.",
    category: "Language",
    previewBg: "#ffffff",
    previewText: "नेपाली पढाइ",
    previewFont: "var(--font-lexend)",
    tags: ["Devanagari", "Color coding", "Nepali"],
    settings: {
      speed: "normal",
      letterSpacing: 0.5,
      lineHeight: 1.9,
      fontSize: 19,
      fontFamily: "var(--font-lexend)",
      enableHighlighting: true,
      enableColorCoding: true,
      colorCodedLetters: ["क", "ख", "ग", "च", "ज", "त", "द", "न", "प", "ब", "म", "य", "र", "ल", "स", "ह"],
      backgroundColor: "#ffffff",
      backgroundTexture: "none",
      wordSpacing: 1,
      textAlign: "left",
      enableSyllableSplit: false,
      syllableSplitThreshold: 8,
      enableHeatmap: false,
      enableParagraphIsolation: false,
      enableSentenceIsolation: true,
    },
  },
  {
    id: "exam-prep",
    name: "Exam Prep",
    description:
      "Heatmap syllable emphasis and syllable splitting for studying dense academic text.",
    category: "Study",
    previewBg: "#fefce8",
    previewText: "Study mode",
    previewFont: "var(--font-montserrat)",
    tags: ["Heatmap", "Syllables", "Montserrat"],
    settings: {
      speed: "slow",
      letterSpacing: 0,
      lineHeight: 1.65,
      fontSize: 16,
      fontFamily: "var(--font-montserrat)",
      enableHighlighting: false,
      enableColorCoding: false,
      colorCodedLetters: [],
      backgroundColor: "#fefce8",
      backgroundTexture: "lined",
      wordSpacing: 0,
      textAlign: "justify",
      enableSyllableSplit: true,
      syllableSplitThreshold: 5,
      enableHeatmap: true,
      enableParagraphIsolation: false,
      enableSentenceIsolation: false,
    },
  },
];
