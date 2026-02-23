"use client";

import React, { useState, useRef, useCallback } from "react";
import { Upload, FileText, Loader2, AlertCircle } from "lucide-react";

interface DocumentUploadProps {
  onTextExtracted: (text: string) => void;
  compact?: boolean;
}

async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .filter((item) => "str" in item)
      .map((item) => (item as { str: string }).str);
    pages.push(strings.join(" "));
  }

  return pages.join("\n\n");
}

async function extractTextFromDOCX(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (file.type === "text/plain" || name.endsWith(".txt")) {
    return file.text();
  }

  if (file.type === "application/pdf" || name.endsWith(".pdf")) {
    return extractTextFromPDF(file);
  }

  if (
    name.endsWith(".docx") ||
    file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return extractTextFromDOCX(file);
  }

  if (name.endsWith(".doc") || file.type === "application/msword") {
    throw new Error(
      "Legacy .doc format is not supported. Please convert to .docx or .txt.",
    );
  }

  throw new Error(`Unsupported file type: ${file.name}`);
}

export default function DocumentUpload({
  onTextExtracted,
  compact = false,
}: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      setError(null);
      setFileName(file.name);

      try {
        const text = await extractText(file);
        if (!text.trim()) {
          throw new Error("No readable text found in the document.");
        }
        onTextExtracted(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to read file.");
        setFileName(null);
      } finally {
        setIsProcessing(false);
      }
    },
    [onTextExtracted],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) await processFile(file);
    },
    [processFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  /* ── Compact button mode (used inside the toolbar) ── */
  if (compact) {
    return (
      <label
        className='cursor-pointer p-2 hover:bg-white/80 rounded-lg transition-all duration-200 bg-white/50 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center gap-1.5 group'
        title='Upload Document (TXT, PDF, DOCX)'
      >
        {isProcessing ? (
          <Loader2 className='w-4 h-4 text-slate-500 animate-spin' />
        ) : (
          <Upload className='w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors' />
        )}
        <input
          ref={inputRef}
          type='file'
          accept='.txt,.pdf,.docx'
          className='hidden'
          onChange={handleFileChange}
        />
      </label>
    );
  }

  /* ── Full drop-zone mode (used as empty state) ── */
  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 p-10 text-center ${
        isDragging
          ? "border-(--honey) bg-(--honey)/10 scale-[1.01]"
          : "border-slate-300/80 hover:border-(--honey) hover:bg-(--honey)/5"
      }`}
    >
      <input
        ref={inputRef}
        type='file'
        accept='.txt,.pdf,.docx'
        className='hidden'
        onChange={handleFileChange}
      />

      {isProcessing ? (
        <>
          <div className='w-14 h-14 rounded-2xl bg-(--honey)/20 flex items-center justify-center'>
            <Loader2 className='w-7 h-7 text-(--honey) animate-spin' />
          </div>
          <div>
            <p className='text-sm font-medium text-slate-700'>
              Processing {fileName}...
            </p>
            <p className='text-xs text-slate-400 mt-1'>
              Extracting text from your document
            </p>
          </div>
        </>
      ) : error ? (
        <>
          <div className='w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center'>
            <AlertCircle className='w-7 h-7 text-red-400' />
          </div>
          <div>
            <p className='text-sm font-medium text-red-600'>{error}</p>
            <p className='text-xs text-slate-400 mt-1'>Click to try again</p>
          </div>
        </>
      ) : (
        <>
          <div className='w-14 h-14 rounded-2xl bg-(--honey)/15 flex items-center justify-center'>
            <FileText className='w-7 h-7 text-(--honey)' />
          </div>
          <div>
            <p className='text-base font-semibold text-slate-700'>
              Drop your document here
            </p>
            <p className='text-sm text-slate-400 mt-1'>
              or{" "}
              <span className='text-(--honey) font-medium underline underline-offset-2'>
                browse files
              </span>
            </p>
          </div>
          <div className='flex items-center gap-2 mt-1'>
            {["PDF", "DOCX", "TXT"].map((fmt) => (
              <span
                key={fmt}
                className='text-[10px] font-semibold tracking-wider text-slate-400 bg-slate-100 rounded-md px-2 py-0.5'
              >
                {fmt}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
