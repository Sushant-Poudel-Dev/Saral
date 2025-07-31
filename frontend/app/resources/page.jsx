"use client";

import { useState } from "react";

const pdfFiles = [
  {
    label:
      "Educational Insights on Dyslexia by D. R. Rahul & R. Joseph Ponniah",
    url: "/Pdf1.pdf",
  },
  {
    label: "Accessibility Features Overview",
    url: "/accessibility-features.pdf",
  },
  { label: "Saral User Manual", url: "/saral-user-manual.pdf" },
];

export default function PdfSelector() {
  const [selectedPdf, setSelectedPdf] = useState(pdfFiles[0].url);

  return (
    <div className='py-10 px-4 flex flex-col items-center'>
      <div className='w-[90rem]'>
        <div className='mb-8 text-center'>
          <h1 className='text-3xl md:text-4xl font-bold text-[#2d3748] mb-2 tracking-tight'>
            Resources
          </h1>
          <p className='text-base md:text-lg text-[#4a5568]'>
            Explore helpful guides, articles, and manuals to make your reading
            experience with Saral even better.
          </p>
        </div>
        <div className='bg-white rounded-2xl shadow-lg p-6 mb-8 border border-[#e2e8f0]'>
          <label
            htmlFor='pdf-select'
            className='block text-lg font-medium text-[#2d3748] mb-3'
          >
            Select a PDF to view
          </label>
          <select
            id='pdf-select'
            className='border border-[#cbd5e0] rounded-lg px-4 py-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-[#3182ce] transition'
            onChange={(e) => setSelectedPdf(e.target.value)}
            value={selectedPdf}
          >
            {pdfFiles.map(({ label, url }) => (
              <option
                key={url}
                value={url}
                className='text-base'
              >
                {label}
              </option>
            ))}
          </select>
          <div className='w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-[#e2e8f0] bg-[#f7fafc] flex items-center justify-center'>
            <iframe
              src={selectedPdf}
              title='PDF Viewer'
              className='w-full h-full'
              frameBorder='0'
            />
          </div>
        </div>
      </div>
    </div>
  );
}
