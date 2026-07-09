"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTTS } from "@/hooks/useTTS";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import { Menu, X } from "lucide-react";
import {
  recordDownload,
  recordAudioExport,
  recordScan,
  recordDocumentImport,
  saveTempDocument,
  consumePendingText,
  consumeStudioMode,
  consumePendingTemplate,
  saveDraft,
  clearDraft,
  type StudioMode,
} from "@/services/trackingService";
import { applyStudioTemplateSettings } from "@/utils/applyStudioTemplate";
import type { StudioTemplateSettings } from "@/constants/studioTemplates";
import Modal from "@/components/ui/Modal";
import TextArea from "@/components/feature/TextArea";
import TTSControls from "@/components/feature/TTSControls";
import DownloadSection from "@/components/feature/controls/DownloadSection";
import MobileBottomNavbar from "@/components/feature/MobileBottomNavbar";
import TypographySection from "@/components/feature/controls/TypographySection";
import ColorsSection from "@/components/feature/controls/ColorsSection";
import TTSSection from "@/components/feature/controls/TTSSection";
import Sidebar, { NavType, TabType } from "@/components/dashboard/Sidebar";
import ResizableSidebar from "@/components/dashboard/ResizableSidebar";

type ModalType = "typography" | "audio" | "display" | null;

export default function FeaturePage() {
  const {
    speak,
    stop,
    isLoading,
    isPlaying,
    currentText,
    currentWordIndex,
    currentCharIndex,
    error,
    clearError,
    enableParagraphIsolation,
    setEnableParagraphIsolation,
    enableSentenceIsolation,
    setEnableSentenceIsolation,
  } = useTTS();

  const [text, setText] = useState("");
  const textRef = useRef(text);
  const initialLoadDone = useRef(false);
  const lastSavedContent = useRef<string | null>(null);
  const [studioMode, setStudioModeState] = useState<StudioMode | null>(null);

  // Keep ref in sync so the cleanup can access the latest text
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  // On mount: load pending text or apply studio entry mode
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;

    const mode = consumeStudioMode();
    const pending = consumePendingText();

    if (pending) {
      setText(pending);
      clearDraft();
    } else if (mode === "blank") {
      setText("");
      clearDraft();
    }

    if (mode === "ocr" || mode === "import") {
      setStudioModeState(mode);
    }
  }, []);

  // Auto-save as temp doc when leaving the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      const t = textRef.current.trim();
      if (t) {
        saveDraft(t);
        // saveTempDocument deduplicates by content automatically
        const title = t.slice(0, 60) || "Untitled";
        saveTempDocument(title, t);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      // Save on SPA navigation — dedup by content prevents duplicates
      const t = textRef.current.trim();
      if (t) {
        const title = t.slice(0, 60) || "Untitled";
        saveTempDocument(title, t);
      }
    };
  }, []);

  const supabase = createClient();
  const { user, profile, refreshStats, settings: savedSettings, isLoading: authLoading } = useAuth();

  const [speed, setSpeed] = useState("normal");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.5);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("var(--font-lexend)");
  const [enableHighlighting, setEnableHighlighting] = useState(false);
  const [enableColorCoding, setEnableColorCoding] = useState(false);
  const [colorCodedLetters, setColorCodedLetters] = useState<string[]>([]);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [backgroundTexture, setBackgroundTexture] = useState("none");
  const [wordSpacing, setWordSpacing] = useState(0);
  const [textAlign, setTextAlign] = useState("left");
  const [enableSyllableSplit, setEnableSyllableSplit] = useState(false);
  const [syllableSplitThreshold, setSyllableSplitThreshold] = useState(8);
  const [enableHeatmap, setEnableHeatmap] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const settingsApplied = useRef(false);

  // Sidebar state for feature page
  const [activeNav, setActiveNav] = useState<NavType>("home");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Apply saved settings from profile on mount
  useEffect(() => {
    if (savedSettings && !settingsApplied.current) {
      settingsApplied.current = true;
      setFontSize(savedSettings.font_size);
      const fontMap: Record<string, string> = {
        Lexend: "var(--font-lexend)",
        Inter: "var(--font-inter)",
        Roboto: "var(--font-roboto)",
        Montserrat: "var(--font-montserrat)",
        OpenDyslexic: "var(--font-opendyslexic)",
      };
      setFontFamily(
        fontMap[savedSettings.font_family] || savedSettings.font_family,
      );
      setLineHeight(savedSettings.line_height);
      setLetterSpacing(savedSettings.letter_spacing);
      setWordSpacing(savedSettings.word_spacing);
      setEnableHighlighting(savedSettings.auto_highlight);
      setEnableColorCoding(savedSettings.color_coding_enabled);
      setEnableSyllableSplit(savedSettings.syllable_splitting_enabled);
      setEnableHeatmap(savedSettings.heatmap_enabled);
      if (savedSettings.background_color)
        setBackgroundColor(savedSettings.background_color);
      if (savedSettings.background_texture)
        setBackgroundTexture(savedSettings.background_texture);
      if (savedSettings.text_align) setTextAlign(savedSettings.text_align);
      if (savedSettings.syllable_split_threshold)
        setSyllableSplitThreshold(savedSettings.syllable_split_threshold);
      // Map tts_speed to speed preset
      if (savedSettings.tts_speed <= 0.7) setSpeed("slow");
      else if (savedSettings.tts_speed >= 1.3) setSpeed("fast");
      else setSpeed("normal");
    }
  }, [savedSettings]);

  const applyTemplate = useCallback((settings: StudioTemplateSettings) => {
      applyStudioTemplateSettings(settings, {
        setSpeed,
        setLetterSpacing,
        setLineHeight,
        setFontSize,
        setFontFamily,
        setEnableHighlighting,
        setEnableColorCoding,
        setColorCodedLetters,
        setBackgroundColor,
        setBackgroundTexture,
        setWordSpacing,
        setTextAlign,
        setEnableSyllableSplit,
        setSyllableSplitThreshold,
        setEnableHeatmap,
        setEnableParagraphIsolation,
        setEnableSentenceIsolation,
    });
  }, [
    setEnableParagraphIsolation,
    setEnableSentenceIsolation,
  ]);

  // Apply template preset passed from Template Store
  useEffect(() => {
    const template = consumePendingTemplate();
    if (template) {
      applyTemplate(template);
    }
  }, [applyTemplate]);

  const closeModal = () => setActiveModal(null);

  const availableSpeeds = [
    { value: "slow", name: "Slow", rate: 0.5 },
    { value: "normal", name: "Normal", rate: 1 },
    { value: "fast", name: "Fast", rate: 1.5 },
  ];

  const detectLanguage = (input: string): string => {
    const trimmedText = input.trim();
    const nepaliRegex = /[\u0900-\u097F]/;
    for (let i = 0; i < trimmedText.length; i++) {
      const char = trimmedText[i];
      if (char.match(/[\s.,!?;:()[\]{}"'-]/)) continue;
      if (nepaliRegex.test(char)) return "ne";
      if (char.match(/[a-zA-Z0-9]/)) return "en";
    }
    return "en";
  };

  const handleTextSubmit = () => {
    if (text.trim()) {
      const detectedLanguage = detectLanguage(text);
      const speedValue =
        availableSpeeds.find((s) => s.value === speed)?.rate || 1;
      speak(text, {
        language: detectedLanguage,
        speed: speedValue,
        enableParagraphIsolation,
        enableSentenceIsolation,
        primaryLanguage: detectedLanguage,
        filterByLanguage: true,
      });
    }
  };

  const handleClear = () => setText("");

  // ── Tracking callbacks ─────────────────────────────────────────────

  const handleSnapshotDownloaded = useCallback(async () => {
    if (!user) return;
    const title = text.trim().slice(0, 60) || "Untitled";
    await recordDownload(supabase, user.id, title, "png");
    refreshStats();
  }, [user, text, supabase, refreshStats]);

  const handleAudioExported = useCallback(async () => {
    if (!user) return;
    const title = text.trim().slice(0, 60) || "Untitled";
    const lang = detectLanguage(text);
    await recordAudioExport(supabase, user.id, title, lang);
    refreshStats();
  }, [user, text, supabase, refreshStats]);

  const handleImageScanned = useCallback(
    async (filename: string, extractedText: string) => {
      if (!user) return;
      await recordScan(supabase, user.id, filename, extractedText);
      refreshStats();
      // Save as temp document (dedup handles duplicates)
      saveTempDocument(filename, extractedText);
      // Mark as already saved so unmount won't duplicate
      lastSavedContent.current = extractedText.trim();
    },
    [user, supabase, refreshStats],
  );

  const handleFileImported = useCallback(
    async (filename: string, content: string) => {
      if (!user) return;
      await recordDocumentImport(supabase, user.id, filename, content);
      refreshStats();
      // Save as temp document (dedup handles duplicates)
      saveTempDocument(filename, content);
      // Mark as already saved so unmount won't duplicate
      lastSavedContent.current = content.trim();
    },
    [user, supabase, refreshStats],
  );

  const handleDocumentUpload = (extractedText: string) =>
    setText(extractedText);

  const hasText = text.trim().length > 0;

  return (
    <div className='flex h-screen bg-[var(--background)] overflow-hidden font-sans text-[var(--darkblue)]'>
      {/* ── Desktop Sidebar ──────────────────────────────── */}
      <ResizableSidebar hideOnMobile>
        {({ collapsed }) => (
          <Sidebar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            setActiveTab={setActiveTab}
            user={user}
            profile={profile}
            authLoading={authLoading}
            collapsed={collapsed}
          />
        )}
      </ResizableSidebar>

      {/* ── Mobile hamburger button ────────────────────────── */}
      <button
        onClick={() => setMobileSidebarOpen(true)}
        className='md:hidden fixed top-4 left-4 z-40 w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-md border border-[var(--darkblue)]/10 text-[var(--darkblue)] hover:bg-[var(--cream)] transition-all active:scale-95'
        aria-label='Open sidebar'
      >
        <Menu className='w-5 h-5' />
      </button>

      {/* ── Mobile sidebar overlay ──────────────────────────── */}
      {mobileSidebarOpen && (
        <div className='md:hidden fixed inset-0 z-50 flex'>
          <div
            className='fixed inset-0 bg-black/30'
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className='relative w-72 h-full bg-white shadow-xl animate-slide-in-left'>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className='absolute top-5 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[var(--cream)] hover:bg-[var(--darkblue)]/10 text-[var(--darkblue)] transition-all'
              aria-label='Close sidebar'
            >
              <X className='w-4 h-4' />
            </button>
            <Sidebar
              activeNav={activeNav}
              setActiveNav={setActiveNav}
              setActiveTab={setActiveTab}
              user={user}
              profile={profile}
              authLoading={authLoading}
              collapsed={false}
            />
          </div>
        </div>
      )}

      {/* ── Main content area ─────────────────────────────────── */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* ── Error banner ──────────────────────────────────────── */}
        {error && (
          <div className='mx-4 md:mx-8 my-2 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-xl text-sm animate-fade-in'>
            <span className='flex-1'>{error}</span>
            <button
              onClick={clearError}
              className='font-bold text-red-400 hover:text-red-600 transition-colors'
            >
              ✕
            </button>
          </div>
        )}

        {/* ── Main workspace ────────────────────────────────────── */}
        <div className='flex-1 overflow-y-auto px-4 md:px-8 pt-6 pb-20 md:pb-8 flex flex-col md:flex-row gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          {/* Text editor column */}
          <div className='flex-1 min-w-0'>
            <TextArea
              text={text}
              setText={setText}
              onClear={handleClear}
              onTextExtracted={handleDocumentUpload}
              isLoading={isLoading}
              isPlaying={isPlaying}
              currentText={currentText}
              currentWordIndex={currentWordIndex}
              currentCharIndex={currentCharIndex}
              enableParagraphIsolation={enableParagraphIsolation}
              enableSentenceIsolation={enableSentenceIsolation}
              letterSpacing={letterSpacing}
              lineHeight={lineHeight}
              fontSize={fontSize}
              fontFamily={fontFamily}
              enableHighlighting={enableHighlighting}
              enableColorCoding={enableColorCoding}
              colorCodedLetters={colorCodedLetters}
              backgroundColor={backgroundColor}
              backgroundTexture={backgroundTexture}
              wordSpacing={wordSpacing}
              textAlign={textAlign}
              enableSyllableSplit={enableSyllableSplit}
              syllableSplitThreshold={syllableSplitThreshold}
              enableHeatmap={enableHeatmap}
              onSnapshotDownloaded={handleSnapshotDownloaded}
              onAudioExported={handleAudioExported}
              onImageScanned={handleImageScanned}
              onFileImported={handleFileImported}
              autoOpenUpload={studioMode}
            />
          </div>

          {/* Controls column — desktop */}
          <div className='hidden md:flex w-85 shrink-0'>
            <TTSControls
              text={text}
              onSubmit={handleTextSubmit}
              onStop={stop}
              isLoading={isLoading}
              isPlaying={isPlaying}
              speed={speed}
              setSpeed={setSpeed}
              enableParagraphIsolation={enableParagraphIsolation}
              setEnableParagraphIsolation={setEnableParagraphIsolation}
              enableSentenceIsolation={enableSentenceIsolation}
              setEnableSentenceIsolation={setEnableSentenceIsolation}
              letterSpacing={letterSpacing}
              setLetterSpacing={setLetterSpacing}
              lineHeight={lineHeight}
              setLineHeight={setLineHeight}
              fontSize={fontSize}
              setFontSize={setFontSize}
              fontFamily={fontFamily}
              setFontFamily={setFontFamily}
              hasText={hasText}
              enableHighlighting={enableHighlighting}
              setEnableHighlighting={setEnableHighlighting}
              enableColorCoding={enableColorCoding}
              setEnableColorCoding={setEnableColorCoding}
              colorCodedLetters={colorCodedLetters}
              setColorCodedLetters={setColorCodedLetters}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              backgroundTexture={backgroundTexture}
              setBackgroundTexture={setBackgroundTexture}
              wordSpacing={wordSpacing}
              setWordSpacing={setWordSpacing}
              textAlign={textAlign}
              setTextAlign={setTextAlign}
              enableSyllableSplit={enableSyllableSplit}
              setEnableSyllableSplit={setEnableSyllableSplit}
              syllableSplitThreshold={syllableSplitThreshold}
              setSyllableSplitThreshold={setSyllableSplitThreshold}
              enableHeatmap={enableHeatmap}
              setEnableHeatmap={setEnableHeatmap}
            />
          </div>

          {/* Mobile controls ── bottom sheet modals */}
          <div className='md:hidden'>
            <MobileBottomNavbar
              onSelect={setActiveModal}
              onPlayStop={isPlaying ? stop : handleTextSubmit}
              isPlaying={isPlaying}
              isLoading={isLoading}
              hasText={hasText}
            />

            <Modal
              isOpen={activeModal === "typography"}
              onClose={closeModal}
              title='Typography Settings'
            >
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
            </Modal>

            <Modal
              isOpen={activeModal === "display"}
              onClose={closeModal}
              title='Display Settings'
            >
              <ColorsSection
                isLoading={isLoading}
                enableColorCoding={enableColorCoding}
                setEnableColorCoding={setEnableColorCoding}
                colorCodedLetters={colorCodedLetters}
                setColorCodedLetters={setColorCodedLetters}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                backgroundTexture={backgroundTexture}
                setBackgroundTexture={setBackgroundTexture}
                enableSyllableSplit={enableSyllableSplit}
                setEnableSyllableSplit={setEnableSyllableSplit}
                syllableSplitThreshold={syllableSplitThreshold}
                setSyllableSplitThreshold={setSyllableSplitThreshold}
                enableHeatmap={enableHeatmap}
                setEnableHeatmap={setEnableHeatmap}
              />
            </Modal>

            <Modal
              isOpen={activeModal === "audio"}
              onClose={closeModal}
              title='Audio Settings'
            >
              <TTSSection
                onSubmit={handleTextSubmit}
                onStop={stop}
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
            </Modal>
          </div>
        </div>

        {/* Hidden download section */}
        <DownloadSection
          text={text}
          lineHeight={lineHeight}
          letterSpacing={letterSpacing}
          fontSize={fontSize}
          fontFamily={fontFamily}
          backgroundColor={backgroundColor}
          backgroundTexture={backgroundTexture}
          colorCodedLetters={colorCodedLetters}
        />
      </div>
    </div>
  );
}
