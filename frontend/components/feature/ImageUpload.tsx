"use client";

import React, { useState, useRef, useCallback } from "react";
import { Image as ImageIcon, Loader2 } from "lucide-react";
import { extractTextFromImage } from "@/services/ocrService";

interface ImageUploadProps {
  onTextExtracted: (text: string) => void;
  onImageScanned?: (filename: string, extractedText: string) => void;
  compact?: boolean;
}

export default function ImageUpload({
  onTextExtracted,
  onImageScanned,
  compact = false,
}: ImageUploadProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true);
      try {
        const result = await extractTextFromImage(file);
        if (result.isError) {
          alert(result.errorMessage || "Failed to extract text from image.");
        } else {
          onTextExtracted(result.text);
          onImageScanned?.(file.name, result.text);
        }
      } catch {
        alert("Failed to process image. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [onTextExtracted, onImageScanned],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processImage(file);
    if (inputRef.current) inputRef.current.value = "";
  };

  if (compact) {
    return (
      <label
        className='cursor-pointer p-2 hover:bg-white/80 rounded-lg transition-all duration-200 bg-white/50 backdrop-blur-sm border border-slate-200/60 flex items-center justify-center gap-1.5 group'
        title='Upload Image for OCR (PNG, JPG, BMP, GIF, TIFF)'
      >
        {isProcessing ? (
          <Loader2 className='w-4 h-4 text-slate-500 animate-spin' />
        ) : (
          <ImageIcon className='w-4 h-4 text-slate-500 group-hover:text-slate-700 transition-colors' />
        )}
        <input
          ref={inputRef}
          type='file'
          accept='image/png,image/jpeg,image/bmp,image/gif,image/tiff'
          className='hidden'
          onChange={handleFileChange}
        />
      </label>
    );
  }

  /* Full mode (not currently used, but available for future) */
  return (
    <div
      onClick={() => inputRef.current?.click()}
      className='relative cursor-pointer rounded-2xl border-2 border-dashed border-slate-300/80 hover:border-(--honey) hover:bg-(--honey)/5 transition-all duration-300 flex flex-col items-center justify-center gap-4 p-10 text-center'
    >
      <input
        ref={inputRef}
        type='file'
        accept='image/png,image/jpeg,image/bmp,image/gif,image/tiff'
        className='hidden'
        onChange={handleFileChange}
      />

      {isProcessing ? (
        <>
          <div className='w-14 h-14 rounded-2xl bg-(--honey)/20 flex items-center justify-center'>
            <Loader2 className='w-7 h-7 text-(--honey) animate-spin' />
          </div>
          <p className='text-sm font-medium text-slate-700'>
            Scanning image for text...
          </p>
        </>
      ) : (
        <>
          <div className='w-14 h-14 rounded-2xl bg-(--honey)/15 flex items-center justify-center'>
            <ImageIcon className='w-7 h-7 text-(--honey)' />
          </div>
          <div>
            <p className='text-base font-semibold text-slate-700'>
              Upload an image to scan text
            </p>
            <p className='text-sm text-slate-400 mt-1'>
              PNG, JPG, BMP, GIF, TIFF
            </p>
          </div>
        </>
      )}
    </div>
  );
}
