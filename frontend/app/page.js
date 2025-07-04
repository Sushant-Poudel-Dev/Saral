"use client";
import { useState } from "react";
import TTS from "@/components/TTS";
import EdgeTTS from "@/components/EdgeTTS";

export default function Home() {
  const [activeTab, setActiveTab] = useState("edge-tts");

  return (
    <div className='min-h-screen bg-cream-100 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Tab Navigation */}
        <div className='flex justify-center mb-8'>
          <div>
            <div className='flex space-x-2'>
              <button
                onClick={() => setActiveTab("edge-tts")}
                className='border-2 p-2'
              >
                Edge-TTS (Premium)
              </button>
              <button
                onClick={() => setActiveTab("gtts")}
                className='border-2 p-2'
              >
                Google TTS (Basic)
              </button>
            </div>
          </div>
        </div>

        <div className='transition-all duration-300'>
          {activeTab === "edge-tts" ? <EdgeTTS /> : <TTS />}
        </div>
      </div>
    </div>
  );
}
