"use client";

import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  Image as ImageIcon,
  Clock,
  Star,
  MoreHorizontal,
  Search,
  Upload,
  Sparkles,
} from "lucide-react";

// ── Placeholder data (will come from DB later) ──────────────────────────
const recentDocuments = [
  {
    id: "1",
    title: "Chapter 3 — The Solar System",
    preview:
      "The solar system consists of the Sun and everything that orbits around it, including eight planets...",
    lastEdited: "2 hours ago",
    starred: true,
    color: "#bbedc2",
  },
  {
    id: "2",
    title: "History Notes — World War II",
    preview:
      "World War II was a global conflict that lasted from 1939 to 1945, involving most of the world's nations...",
    lastEdited: "Yesterday",
    starred: false,
    color: "#a6e5f2",
  },
  {
    id: "3",
    title: "Reading Practice — The Little Prince",
    preview:
      "Once when I was six years old I saw a magnificent picture in a book about the primeval forest...",
    lastEdited: "3 days ago",
    starred: true,
    color: "#f2c969",
  },
  {
    id: "4",
    title: "Science — Photosynthesis",
    preview:
      "Photosynthesis is the process by which green plants and certain other organisms transform light energy...",
    lastEdited: "Last week",
    starred: false,
    color: "#fba69d",
  },
  {
    id: "5",
    title: "English Essay — My Summer Vacation",
    preview:
      "Last summer, my family and I went on a wonderful trip to the mountains. The air was fresh and cool...",
    lastEdited: "Last week",
    starred: false,
    color: "#e9d8fd",
  },
  {
    id: "6",
    title: "Math Word Problems",
    preview:
      "A train leaves station A at 9:00 AM traveling at 60 km/h. Another train leaves station B at 10:00 AM...",
    lastEdited: "2 weeks ago",
    starred: false,
    color: "#a6e5f2",
  },
];

const quickStats = [
  { label: "Documents", value: "12", icon: FileText },
  { label: "This Week", value: "4", icon: Clock },
  { label: "Favorites", value: "3", icon: Star },
  { label: "Images Scanned", value: "7", icon: ImageIcon },
];

export default function Home() {
  const router = useRouter();

  return (
    <div className='min-h-[calc(100vh-80px)] bg-(--background)'>
      {/* ── Hero / Welcome ─────────────────────────────────────── */}
      <div className='px-6 md:px-12 lg:px-20 pt-8 pb-6'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-3xl! md:text-4xl! font-bold! text-(--primary) tracking-tight leading-tight!'>
            Welcome back!
          </h1>
          <p className='text-sm md:text-base text-slate-500 mt-1.5 max-w-lg'>
            Pick up where you left off or start something new.
          </p>

          {/* ── Search bar ───────────────────────────────────── */}
          <div className='mt-5 max-w-xl'>
            <div className='relative'>
              <Search className='absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
              <input
                type='text'
                placeholder='Search your documents...'
                className='w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-(--primary) placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--honey)/40 focus:border-(--honey) transition-all'
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ──────────────────────────────────────── */}
      <div className='px-6 md:px-12 lg:px-20 pb-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            <button
              onClick={() => router.push("/feature")}
              className='group flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-(--honey)/40 transition-all duration-200 cursor-pointer'
            >
              <div className='w-10 h-10 rounded-lg bg-(--honey)/15 flex items-center justify-center shrink-0 group-hover:bg-(--honey)/25 transition-colors'>
                <Plus className='w-5 h-5 text-(--honey)' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-semibold text-(--primary)'>
                  New Document
                </p>
                <p className='text-[11px] text-slate-400'>Start fresh</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/feature")}
              className='group flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-(--honey)/40 transition-all duration-200 cursor-pointer'
            >
              <div className='w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors'>
                <Upload className='w-5 h-5 text-blue-500' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-semibold text-(--primary)'>
                  Upload File
                </p>
                <p className='text-[11px] text-slate-400'>PDF, DOCX, TXT</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/feature")}
              className='group flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-(--honey)/40 transition-all duration-200 cursor-pointer'
            >
              <div className='w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors'>
                <ImageIcon className='w-5 h-5 text-purple-500' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-semibold text-(--primary)'>
                  Scan Image
                </p>
                <p className='text-[11px] text-slate-400'>OCR text extract</p>
              </div>
            </button>

            <button
              onClick={() => router.push("/feature")}
              className='group flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-200/60 shadow-sm hover:shadow-md hover:border-(--honey)/40 transition-all duration-200 cursor-pointer'
            >
              <div className='w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors'>
                <Sparkles className='w-5 h-5 text-green-500' />
              </div>
              <div className='text-left'>
                <p className='text-sm font-semibold text-(--primary)'>
                  Quick Read
                </p>
                <p className='text-[11px] text-slate-400'>Paste & go</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats Row ──────────────────────────────────────────── */}
      <div className='px-6 md:px-12 lg:px-20 pb-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
            {quickStats.map((stat) => (
              <div
                key={stat.label}
                className='flex items-center gap-3 p-3.5 rounded-xl bg-white/60 border border-slate-100'
              >
                <stat.icon className='w-4 h-4 text-slate-400' />
                <div>
                  <p className='text-lg font-bold text-(--primary) leading-none'>
                    {stat.value}
                  </p>
                  <p className='text-[11px] text-slate-400 mt-0.5'>
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Recent Documents ───────────────────────────────────── */}
      <div className='px-6 md:px-12 lg:px-20 pb-12'>
        <div className='max-w-6xl mx-auto'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg! font-semibold! text-(--primary)'>
              Recent Documents
            </h2>
            <button className='text-xs text-slate-400 hover:text-(--honey) transition-colors cursor-pointer'>
              View all
            </button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {recentDocuments.map((doc) => (
              <button
                key={doc.id}
                onClick={() => router.push("/feature")}
                className='group text-left bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-(--honey)/30 transition-all duration-200 overflow-hidden cursor-pointer'
              >
                {/* Color accent bar */}
                <div
                  className='h-1.5 w-full'
                  style={{ backgroundColor: doc.color }}
                />

                <div className='p-4'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='flex items-center gap-2 min-w-0'>
                      <FileText className='w-4 h-4 text-slate-400 shrink-0' />
                      <h3 className='text-sm font-semibold text-(--primary) truncate'>
                        {doc.title}
                      </h3>
                    </div>
                    <div className='flex items-center gap-1 shrink-0'>
                      {doc.starred && (
                        <Star className='w-3.5 h-3.5 text-(--honey) fill-(--honey)' />
                      )}
                      <MoreHorizontal className='w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors' />
                    </div>
                  </div>

                  <p className='text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed'>
                    {doc.preview}
                  </p>

                  <div className='flex items-center gap-1.5 mt-3'>
                    <Clock className='w-3 h-3 text-slate-300' />
                    <span className='text-[11px] text-slate-400'>
                      {doc.lastEdited}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* ── Empty state hint ─────────────────────────────── */}
          <div className='mt-6 text-center'>
            <p className='text-xs text-slate-400'>
              Documents will be saved here once the database is connected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
