import type { StudioTemplateSettings } from "@/constants/studioTemplates";

export interface StudioTemplateActions {
  setSpeed: (v: "slow" | "normal" | "fast") => void;
  setLetterSpacing: (v: number) => void;
  setLineHeight: (v: number) => void;
  setFontSize: (v: number) => void;
  setFontFamily: (v: string) => void;
  setEnableHighlighting: (v: boolean) => void;
  setEnableColorCoding: (v: boolean) => void;
  setColorCodedLetters: (v: string[]) => void;
  setBackgroundColor: (v: string) => void;
  setBackgroundTexture: (v: string) => void;
  setWordSpacing: (v: number) => void;
  setTextAlign: (v: string) => void;
  setEnableSyllableSplit: (v: boolean) => void;
  setSyllableSplitThreshold: (v: number) => void;
  setEnableHeatmap: (v: boolean) => void;
  setEnableParagraphIsolation: (v: boolean) => void;
  setEnableSentenceIsolation: (v: boolean) => void;
}

export function applyStudioTemplateSettings(
  settings: StudioTemplateSettings,
  actions: StudioTemplateActions,
): void {
  actions.setSpeed(settings.speed);
  actions.setLetterSpacing(settings.letterSpacing);
  actions.setLineHeight(settings.lineHeight);
  actions.setFontSize(settings.fontSize);
  actions.setFontFamily(settings.fontFamily);
  actions.setEnableHighlighting(settings.enableHighlighting);
  actions.setEnableColorCoding(settings.enableColorCoding);
  actions.setColorCodedLetters([...settings.colorCodedLetters]);
  actions.setBackgroundColor(settings.backgroundColor);
  actions.setBackgroundTexture(settings.backgroundTexture);
  actions.setWordSpacing(settings.wordSpacing);
  actions.setTextAlign(settings.textAlign);
  actions.setEnableSyllableSplit(settings.enableSyllableSplit);
  actions.setSyllableSplitThreshold(settings.syllableSplitThreshold);
  actions.setEnableHeatmap(settings.enableHeatmap);
  actions.setEnableParagraphIsolation(settings.enableParagraphIsolation);
  actions.setEnableSentenceIsolation(settings.enableSentenceIsolation);
}
