"use client";

import { useState } from "react";

const pdfFiles = [
  { label: "Dyslexia Article", url: "/Pdf1.pdf" },
  {
    label: "Accessibility Features Overview",
    url: "/accessibility-features.pdf",
  },
  { label: "Saral User Manual", url: "/saral-user-manual.pdf" },
];

export default function PdfSelector() {
  const [selectedPdf, setSelectedPdf] = useState(pdfFiles[0].url);

  return (
    <div className='max-w-xl mx-auto p-4'>
      <h2 className='text-xl font-semibold mb-4'>Select a PDF to view</h2>
      <select
        className='border rounded px-3 py-2 mb-6 w-full'
        onChange={(e) => setSelectedPdf(e.target.value)}
        value={selectedPdf}
      >
        {pdfFiles.map(({ label, url }) => (
          <option
            key={url}
            value={url}
          >
            {label}
          </option>
        ))}
      </select>

      <iframe
        src={selectedPdf}
        title='PDF Viewer'
        className='w-full h-[600px] border rounded'
        frameBorder='0'
      />
    </div>
  );
}
