"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamically import PDF.js to avoid SSR issues
let pdfjsLib = null;

export default function DocumentUpload({
  onTextExtracted,
  className = "",
  compact = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isPdfJsReady, setIsPdfJsReady] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // Only load PDF.js on the client side
    const loadPdfJs = async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjsLib = pdfjs.default || pdfjs;

        // Use local worker file - this will work in both development and production
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

        setIsPdfJsReady(true);
      } catch (error) {
        console.error("Failed to load PDF.js:", error);
        setIsPdfJsReady(true); // Set to true anyway to allow other file types
      }
    };

    loadPdfJs();
  }, []);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const extractTextFromPDF = async (file) => {
    if (!pdfjsLib || !isPdfJsReady) {
      throw new Error("PDF.js is not ready. Please try again.");
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => item.str)
          .join(" ")
          .replace(/\s+/g, " ");
        fullText += pageText + "\n\n";
      }

      return fullText.trim();
    } catch (error) {
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  };

  const extractTextFromDoc = async (file) => {
    try {
      // Dynamically import mammoth to avoid SSR issues
      const mammoth = await import("mammoth");
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } catch (error) {
      throw new Error(`Failed to extract text from document: ${error.message}`);
    }
  };

  const extractTextFromTxt = async (file) => {
    try {
      const text = await file.text();
      return text;
    } catch (error) {
      throw new Error(`Failed to read text file: ${error.message}`);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadStatus("");

    try {
      let extractedText = "";
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();

      if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
        setUploadStatus("Extracting text from PDF...");
        extractedText = await extractTextFromPDF(file);
      } else if (
        fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        fileName.endsWith(".docx")
      ) {
        setUploadStatus("Extracting text from Word document...");
        extractedText = await extractTextFromDoc(file);
      } else if (
        fileType === "application/msword" ||
        fileName.endsWith(".doc")
      ) {
        setUploadStatus("Extracting text from Word document...");
        extractedText = await extractTextFromDoc(file);
      } else if (fileType === "text/plain" || fileName.endsWith(".txt")) {
        setUploadStatus("Reading text file...");
        extractedText = await extractTextFromTxt(file);
      } else {
        throw new Error(
          "Unsupported file format. Please upload PDF, DOC, DOCX, or TXT files."
        );
      }

      if (!extractedText.trim()) {
        throw new Error("No text could be extracted from the document.");
      }

      setUploadStatus(`Successfully extracted text from ${file.name}`);
      onTextExtracted(extractedText.trim());

      // Clear the status after 3 seconds
      setTimeout(() => {
        setUploadStatus("");
      }, 3000);
    } catch (error) {
      setUploadStatus(`Error: ${error.message}`);
      setTimeout(() => {
        setUploadStatus("");
      }, 5000);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`${className}`}>
      <input
        ref={fileInputRef}
        type='file'
        accept='.pdf,.doc,.docx,.txt'
        onChange={handleFileChange}
        className='hidden'
        disabled={isUploading}
      />

      {compact ? (
        // Compact button matching clear button style
        <button
          onClick={handleFileSelect}
          disabled={isUploading || !isPdfJsReady}
          className='p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 bg-white shadow-sm border border-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
          title={isPdfJsReady ? "Upload Document" : "Loading..."}
        >
          {isUploading ? (
            <div className='animate-spin w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full'></div>
          ) : (
            <svg
              className='w-4 h-4 text-slate-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
              />
            </svg>
          )}
        </button>
      ) : (
        // Full-size button
        <button
          onClick={handleFileSelect}
          disabled={isUploading || !isPdfJsReady}
          className='w-full flex items-center justify-center gap-3 p-4 border-2 border-dashed border-slate-300 rounded-xl hover:border-slate-400 hover:bg-slate-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isUploading ? (
            <>
              <div className='animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full'></div>
              <span className='text-slate-600'>Processing...</span>
            </>
          ) : !isPdfJsReady ? (
            <>
              <div className='animate-spin w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full'></div>
              <span className='text-slate-600'>Loading...</span>
            </>
          ) : (
            <>
              <svg
                className='w-6 h-6 text-slate-500'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                />
              </svg>
              <div className='text-center'>
                <p className='text-slate-700 font-medium'>Upload Document</p>
                <p className='text-sm text-slate-500'>
                  PDF, DOC, DOCX, or TXT files
                </p>
              </div>
            </>
          )}
        </button>
      )}

      {uploadStatus && !compact && (
        <div
          className={`mt-3 p-3 rounded-lg text-sm ${
            uploadStatus.startsWith("Error")
              ? "bg-red-50 text-red-700 border border-red-200"
              : uploadStatus.startsWith("Successfully")
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}
        >
          {uploadStatus}
        </div>
      )}
    </div>
  );
}
