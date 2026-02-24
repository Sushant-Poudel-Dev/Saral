"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  getTempDocuments,
  removeTempDocument,
  toggleTempFavorite,
  setPendingText,
  type TempDocument,
} from "@/services/trackingService";
import type { Document } from "@/types/database";
import {
  FileText,
  Image as ImageIcon,
  Clock,
  Star,
  Search,
  Headphones,
  Download,
  Plus,
  Loader2,
  Trash2,
  HardDrive,
  MonitorSmartphone,
} from "lucide-react";

/* ── Accent colors for document cards ──────────────────────────────────── */
const COLORS = [
  "#bbedc2",
  "#a6e5f2",
  "#f2c969",
  "#fba69d",
  "#e9d8fd",
  "#c4e0f9",
];
function colorFor(index: number) {
  return COLORS[index % COLORS.length];
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function Home() {
  const router = useRouter();
  const { user, profile, stats, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [tempDocs, setTempDocs] = useState<TempDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"temporary" | "permanent">(
    "temporary",
  );

  /* ── Fetch permanent documents from Supabase ───────────────────────── */
  const fetchDocuments = useCallback(async () => {
    if (!user) {
      setDocuments([]);
      setDocsLoading(false);
      return;
    }
    setDocsLoading(true);
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(12);
    setDocuments(data ?? []);
    setDocsLoading(false);
  }, [user, supabase]);

  /* ── Load temporary documents from localStorage ────────────────────── */
  const loadTempDocs = useCallback(() => {
    setTempDocs(getTempDocuments());
  }, []);

  useEffect(() => {
    if (!authLoading) {
      fetchDocuments();
      loadTempDocs();
    }
  }, [authLoading, fetchDocuments, loadTempDocs]);

  const handleRemoveTempDoc = (id: string) => {
    removeTempDocument(id);
    loadTempDocs();
  };

  const handleDeletePermanentDoc = async (docId: string) => {
    await supabase.from("documents").delete().eq("id", docId);
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleToggleTempFavorite = (id: string) => {
    toggleTempFavorite(id);
    loadTempDocs();
  };

  const handleTogglePermanentFavorite = async (doc: Document) => {
    const newVal = !doc.is_favorite;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("documents")
      .update({ is_favorite: newVal })
      .eq("id", doc.id);
    setDocuments((prev) =>
      prev.map((d) => (d.id === doc.id ? { ...d, is_favorite: newVal } : d)),
    );
  };

  const openDocument = (content: string) => {
    setPendingText(content);
    router.push("/feature");
  };

  /* ── Derived ───────────────────────────────────────────────────────── */
  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user?.user_metadata?.name?.split(" ")[0] ||
    "";
  const greeting = firstName ? `Welcome back, ${firstName}` : "Welcome back";

  const filteredPermanentDocs = searchQuery
    ? documents.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : documents;

  const filteredTempDocs = searchQuery
    ? tempDocs.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : tempDocs;

  const statCards = [
    {
      icon: Download,
      value: stats?.total_downloads ?? 0,
      label: "Times Downloaded",
      color: "text-gray-400",
      bg: "bg-gray-100",
    },
    {
      icon: ImageIcon,
      value: stats?.total_images_scanned ?? 0,
      label: "Scans",
      color: "text-gray-400",
      bg: "bg-gray-100",
    },
    {
      icon: Headphones,
      value: stats?.total_audio_exports ?? 0,
      label: "Audio Downloaded",
      color: "text-gray-400",
      bg: "bg-gray-100",
    },
    {
      icon: FileText,
      value: stats?.total_documents ?? 0,
      label: "Documents Imported",
      color: "text-gray-400",
      bg: "bg-gray-100",
    },
  ];

  const hasAnyDocs = documents.length > 0 || tempDocs.length > 0;

  return (
    <div className='min-h-[calc(100vh-80px)] bg-(--background)'>
      <div className='max-w-6xl mx-auto px-5 md:px-10 py-8'>
        {/* ── Greeting ──────────────────────────────────────── */}
        <h1 className='text-2xl md:text-3xl font-bold text-(--primary) tracking-tight'>
          {greeting}
        </h1>
        <p className='text-sm text-slate-400 mt-1'>
          {hasAnyDocs
            ? "Pick up where you left off or start something new."
            : "Create your first document to get started."}
        </p>

        {/* ── Stats ─────────────────────────────────────────── */}
        {user && (
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6'>
            {statCards.map((s) => (
              <div
                key={s.label}
                className='flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-100'
              >
                <div
                  className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}
                >
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div>
                  <p className='text-lg font-bold text-(--primary) leading-none'>
                    {s.value}
                  </p>
                  <p className='text-[11px] text-slate-400 mt-0.5'>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Documents section ─────────────────────────────── */}
        <div className='mt-10'>
          <div className='flex items-center justify-between gap-4 mb-4'>
            <h2 className='text-lg font-semibold text-(--primary)'>
              Recent Documents
            </h2>
            {hasAnyDocs && (
              <div className='relative max-w-xs flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Search...'
                  className='w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-white text-sm text-(--primary) placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-(--honey)/30 focus:border-(--honey)/50 transition-all'
                />
              </div>
            )}
          </div>

          {/* ── Tab switcher ──────────────────────────────────── */}
          <div className='flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 w-fit mb-5'>
            <button
              onClick={() => setActiveTab("temporary")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeTab === "temporary"
                  ? "bg-white text-(--primary) shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <MonitorSmartphone className='w-3.5 h-3.5' />
              Temporary
              {tempDocs.length > 0 && (
                <span className='text-[10px] bg-slate-200 rounded-full px-1.5 py-0.5 leading-none'>
                  {tempDocs.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("permanent")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all cursor-pointer ${
                activeTab === "permanent"
                  ? "bg-white text-(--primary) shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <HardDrive className='w-3.5 h-3.5' />
              Permanent
              {documents.length > 0 && (
                <span className='text-[10px] bg-slate-200 rounded-full px-1.5 py-0.5 leading-none'>
                  {documents.length}
                </span>
              )}
            </button>
          </div>

          {docsLoading || authLoading ? (
            <div className='flex items-center justify-center py-20'>
              <Loader2 className='w-5 h-5 animate-spin text-slate-300' />
            </div>
          ) : activeTab === "temporary" ? (
            /* ── Temporary docs (localStorage) ────────────── */
            filteredTempDocs.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                {/* Go to Studio CTA */}
                <div
                  onClick={() => router.push("/feature")}
                  className='flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 hover:border-(--honey) hover:shadow-sm transition-all cursor-pointer p-5 text-center gap-2'
                >
                  <Plus className='w-6 h-6 text-(--honey)' />
                  <span className='text-sm font-medium text-(--primary)'>
                    New document
                  </span>
                  <span className='text-xs font-medium text-white bg-(--honey) px-3.5 py-1 rounded-lg'>
                    Go to Studio
                  </span>
                </div>
                {filteredTempDocs.map((doc, i) => (
                  <div
                    key={doc.id}
                    className='text-left bg-white rounded-xl border border-slate-200/60 hover:border-(--honey)/30 hover:shadow-sm transition-all group overflow-hidden cursor-pointer'
                    onClick={() => openDocument(doc.content)}
                  >
                    <div
                      className='h-1 w-full'
                      style={{ backgroundColor: colorFor(i) }}
                    />
                    <div className='p-4'>
                      {/* Filename / title on top */}
                      <div className='flex items-center justify-between gap-2 mb-2'>
                        <div className='flex items-center gap-1.5 min-w-0'>
                          <FileText className='w-3.5 h-3.5 text-slate-300 shrink-0' />
                          <span className='text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate'>
                            {doc.title}
                          </span>
                        </div>
                        <div className='flex items-center gap-0.5'>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleTempFavorite(doc.id);
                            }}
                            className='p-1 rounded-md hover:bg-amber-50 transition-colors cursor-pointer'
                            title={doc.isFavorite ? "Unfavorite" : "Favorite"}
                          >
                            <Star
                              className={`w-3.5 h-3.5 transition-colors ${
                                doc.isFavorite
                                  ? "text-(--honey) fill-(--honey)"
                                  : "text-slate-300 hover:text-(--honey)"
                              }`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTempDoc(doc.id);
                            }}
                            className='p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer'
                            title='Remove'
                          >
                            <Trash2 className='w-3.5 h-3.5 text-slate-300 hover:text-red-400' />
                          </button>
                        </div>
                      </div>
                      <p className='text-xs text-slate-400 line-clamp-2 leading-relaxed'>
                        {doc.content}
                      </p>
                      <div className='flex items-center gap-1.5 mt-3'>
                        <Clock className='w-3 h-3 text-slate-300' />
                        <span className='text-[11px] text-slate-400'>
                          {timeAgo(doc.createdAt)}
                        </span>
                        <span className='text-[10px] text-amber-500 bg-amber-50 rounded px-1.5 py-0.5 ml-auto font-medium'>
                          Local
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                message='No temporary documents'
                sub='Documents from image scans and file imports appear here temporarily.'
                onAction={() => router.push("/feature")}
              />
            )
          ) : /* ── Permanent docs (Supabase) ────────────────── */
          filteredPermanentDocs.length > 0 ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              {/* Go to Studio CTA */}
              <div
                onClick={() => router.push("/feature")}
                className='flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 hover:border-(--honey) hover:shadow-sm transition-all cursor-pointer p-5 text-center gap-2'
              >
                <Plus className='w-6 h-6 text-(--honey)' />
                <span className='text-sm font-medium text-(--primary)'>
                  New document
                </span>
                <span className='text-xs font-medium text-white bg-(--honey) px-3.5 py-1 rounded-lg'>
                  Go to Studio
                </span>
              </div>
              {filteredPermanentDocs.map((doc, i) => (
                <div
                  key={doc.id}
                  onClick={() => openDocument(doc.content)}
                  className='text-left bg-white rounded-xl border border-slate-200/60 hover:border-(--honey)/30 hover:shadow-sm transition-all cursor-pointer group overflow-hidden'
                >
                  <div
                    className='h-1 w-full'
                    style={{ backgroundColor: colorFor(i) }}
                  />
                  <div className='p-4'>
                    {/* Filename / title on top */}
                    <div className='flex items-center justify-between gap-2 mb-2'>
                      <div className='flex items-center gap-1.5 min-w-0'>
                        <FileText className='w-3.5 h-3.5 text-slate-300 shrink-0' />
                        <span className='text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate'>
                          {doc.title}
                        </span>
                      </div>
                      <div className='flex items-center gap-0.5'>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePermanentFavorite(doc);
                          }}
                          className='p-1 rounded-md hover:bg-amber-50 transition-colors cursor-pointer'
                          title={doc.is_favorite ? "Unfavorite" : "Favorite"}
                        >
                          <Star
                            className={`w-3.5 h-3.5 transition-colors ${
                              doc.is_favorite
                                ? "text-(--honey) fill-(--honey)"
                                : "text-slate-300 hover:text-(--honey)"
                            }`}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePermanentDoc(doc.id);
                          }}
                          className='p-1 rounded-md hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer'
                          title='Delete'
                        >
                          <Trash2 className='w-3.5 h-3.5 text-slate-300 hover:text-red-400' />
                        </button>
                      </div>
                    </div>
                    <p className='text-xs text-slate-400 line-clamp-2 leading-relaxed'>
                      {doc.content}
                    </p>
                    <div className='flex items-center gap-1.5 mt-3'>
                      <Clock className='w-3 h-3 text-slate-300' />
                      <span className='text-[11px] text-slate-400'>
                        {timeAgo(doc.updated_at)}
                      </span>
                      <span className='text-[10px] text-emerald-500 bg-emerald-50 rounded px-1.5 py-0.5 ml-auto font-medium'>
                        Cloud
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              searchQuery={searchQuery}
              message='No permanent documents'
              sub='Import a file in the Studio to save it to the cloud.'
              onAction={() => router.push("/feature")}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Empty state helper ─────────────────────────────────────────────────── */
function EmptyState({
  searchQuery,
  message,
  sub,
  onAction,
}: {
  searchQuery: string;
  message: string;
  sub: string;
  onAction: () => void;
}) {
  return (
    <div className='flex flex-col items-center py-16 text-center'>
      <div className='w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4'>
        <FileText className='w-6 h-6 text-slate-300' />
      </div>
      <p className='text-sm font-medium text-slate-500 mb-1'>
        {searchQuery ? "No documents match your search" : message}
      </p>
      <p className='text-xs text-slate-400 mb-5 max-w-xs'>
        {searchQuery ? "Try a different search term." : sub}
      </p>
      {!searchQuery && (
        <button
          onClick={onAction}
          className='flex items-center gap-2 text-sm font-medium text-white bg-(--honey) hover:opacity-90 px-5 py-2 rounded-lg transition-opacity cursor-pointer'
        >
          <Plus className='w-4 h-4' />
          Go to Studio
        </button>
      )}
    </div>
  );
}
