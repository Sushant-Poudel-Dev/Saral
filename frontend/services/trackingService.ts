import { SupabaseClient } from "@supabase/supabase-js";
import type { StudioTemplateSettings } from "@/constants/studioTemplates";

// ── Track a document/snapshot download ──────────────────────────────────────
export async function recordDownload(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  fileType: string = "png",
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("downloaded_documents").insert({
    user_id: userId,
    title,
    file_type: fileType,
  });
}

// ── Track an audio export ───────────────────────────────────────────────────
export async function recordAudioExport(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  language: string = "en",
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("downloaded_audio").insert({
    user_id: userId,
    title,
    language,
  });
}

// ── Track an image scan (OCR) ───────────────────────────────────────────────
export async function recordScan(
  supabase: SupabaseClient,
  userId: string,
  originalFilename: string,
  extractedText?: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("scanned_images").insert({
    user_id: userId,
    original_filename: originalFilename,
    extracted_text: extractedText ?? null,
  });
}

// ── Track a document import (PDF / DOCX / TXT upload) ───────────────────────
export async function recordDocumentImport(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  content: string,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from("documents").insert({
    user_id: userId,
    title,
    content,
  });
}

// ── LocalStorage temporary documents ────────────────────────────────────────

const TEMP_DOCS_KEY = "saral_temp_documents";
const MAX_TEMP_DOCS = 20;

export interface TempDocument {
  id: string;
  title: string;
  content: string;
  isFavorite: boolean;
  createdAt: string;
}

/**
 * Save a temporary document. If an existing doc has identical content,
 * just update its timestamp (and title if provided) instead of creating
 * a duplicate.
 */
export function saveTempDocument(title: string, content: string): void {
  const docs = getTempDocuments();
  const existingIdx = docs.findIndex(
    (d) => d.content.trim() === content.trim(),
  );

  if (existingIdx !== -1) {
    // Move to top and refresh timestamp; keep favourite state
    const existing = docs[existingIdx];
    docs.splice(existingIdx, 1);
    existing.createdAt = new Date().toISOString();
    // Update title only if the new one looks like a real filename
    if (title !== content.slice(0, 60) && title !== "Untitled") {
      existing.title = title;
    }
    const updated = [existing, ...docs].slice(0, MAX_TEMP_DOCS);
    localStorage.setItem(TEMP_DOCS_KEY, JSON.stringify(updated));
    return;
  }

  const newDoc: TempDocument = {
    id: crypto.randomUUID(),
    title,
    content,
    isFavorite: false,
    createdAt: new Date().toISOString(),
  };
  const updated = [newDoc, ...docs].slice(0, MAX_TEMP_DOCS);
  localStorage.setItem(TEMP_DOCS_KEY, JSON.stringify(updated));
}

export function toggleTempFavorite(id: string): void {
  const docs = getTempDocuments();
  const doc = docs.find((d) => d.id === id);
  if (doc) doc.isFavorite = !doc.isFavorite;
  localStorage.setItem(TEMP_DOCS_KEY, JSON.stringify(docs));
}

export function getTempDocuments(): TempDocument[] {
  try {
    const raw = localStorage.getItem(TEMP_DOCS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function removeTempDocument(id: string): void {
  const docs = getTempDocuments().filter((d) => d.id !== id);
  localStorage.setItem(TEMP_DOCS_KEY, JSON.stringify(docs));
}

// ── Pending document load (pass text between pages) ─────────────────────────

const PENDING_TEXT_KEY = "saral_pending_text";

export function setPendingText(text: string): void {
  localStorage.setItem(PENDING_TEXT_KEY, text);
}

export function clearPendingText(): void {
  localStorage.removeItem(PENDING_TEXT_KEY);
}

export function consumePendingText(): string | null {
  const text = localStorage.getItem(PENDING_TEXT_KEY);
  if (text !== null) localStorage.removeItem(PENDING_TEXT_KEY);
  return text;
}

// ── Studio entry mode (blank / ocr / import) ─────────────────────────────────

export type StudioMode = "blank" | "ocr" | "import";

const STUDIO_MODE_KEY = "saral_studio_mode";

export function setStudioMode(mode: StudioMode): void {
  localStorage.setItem(STUDIO_MODE_KEY, mode);
}

export function consumeStudioMode(): StudioMode | null {
  const mode = localStorage.getItem(STUDIO_MODE_KEY);
  if (mode !== null) localStorage.removeItem(STUDIO_MODE_KEY);
  if (mode === "blank" || mode === "ocr" || mode === "import") return mode;
  return null;
}

// ── Studio template preset (apply settings in editor) ───────────────────────

const PENDING_TEMPLATE_KEY = "saral_pending_template";

export function setPendingTemplate(settings: StudioTemplateSettings): void {
  localStorage.setItem(PENDING_TEMPLATE_KEY, JSON.stringify(settings));
}

export function consumePendingTemplate(): StudioTemplateSettings | null {
  try {
    const raw = localStorage.getItem(PENDING_TEMPLATE_KEY);
    if (raw === null) return null;
    localStorage.removeItem(PENDING_TEMPLATE_KEY);
    return JSON.parse(raw) as StudioTemplateSettings;
  } catch {
    localStorage.removeItem(PENDING_TEMPLATE_KEY);
    return null;
  }
}

// ── Auto-save draft (save text when leaving Studio) ─────────────────────────

const DRAFT_KEY = "saral_studio_draft";

export function saveDraft(text: string): void {
  localStorage.setItem(DRAFT_KEY, text);
}

export function consumeDraft(): string | null {
  const text = localStorage.getItem(DRAFT_KEY);
  if (text !== null) localStorage.removeItem(DRAFT_KEY);
  return text;
}

export function clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}
