"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  getTempDocuments,
  removeTempDocument,
  toggleTempFavorite,
  setPendingText,
  setStudioMode,
  clearPendingText,
  clearDraft,
  type TempDocument,
} from "@/services/trackingService";
import type { Document } from "@/types/database";
import Sidebar, { NavType, TabType } from "@/components/dashboard/Sidebar";
import FileList, { SortField } from "@/components/dashboard/FileList";
import { Search, Sparkles, Zap, Image as ImageIcon } from "lucide-react";
import ResizableSidebar from "@/components/dashboard/ResizableSidebar";
import TemplateGallery from "@/components/dashboard/TemplateGallery";

const NAV_TITLES: Record<NavType, string> = {
  home: "All Documents",
  recent: "Recent Files",
  favorites: "Favorites",
  cloud: "My Cloud Space",
  templates: "Template Store",
  tools: "OCR & Audio Tools",
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, isLoading: authLoading } = useAuth();
  const supabase = createClient();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [tempDocs, setTempDocs] = useState<TempDocument[]>([]);
  const [docsLoading, setDocsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Navigation sidebar & tab state
  const [activeNav, setActiveNav] = useState<NavType>("home");
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Sorting state for documents table
  const [sortField, setSortField] = useState<SortField>("updated_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  /* ── Sync nav state from URL ───────────────────────────────────────── */
  useEffect(() => {
    const navParam = searchParams.get("nav") as NavType | null;
    const validNav: NavType[] = [
      "home",
      "recent",
      "favorites",
      "cloud",
      "templates",
      "tools",
    ];
    if (navParam && validNav.includes(navParam)) {
      setActiveNav(navParam);
      if (navParam === "home" || navParam === "recent") setActiveTab("all");
      else if (navParam === "favorites") setActiveTab("favorites");
      else if (navParam === "cloud") setActiveTab("permanent");
      if (navParam === "recent") {
        setSortField("updated_at");
        setSortOrder("desc");
      }
    }
  }, [searchParams]);

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
      .limit(20);
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

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const allCombinedDocs = [
    ...tempDocs.map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      is_favorite: d.isFavorite,
      updated_at: d.createdAt,
      type: "temporary" as const,
      size: new Blob([d.content]).size,
    })),
    ...documents.map((d) => ({
      id: d.id,
      title: d.title,
      content: d.content,
      is_favorite: d.is_favorite,
      updated_at: d.updated_at,
      type: "permanent" as const,
      size: new Blob([d.content]).size,
    })),
  ];

  const getFilteredAndSortedDocs = () => {
    let list = allCombinedDocs;
    if (activeNav === "favorites" || activeTab === "favorites") {
      list = list.filter((d) => d.is_favorite);
    } else if (activeNav === "cloud" || activeTab === "permanent") {
      list = list.filter((d) => d.type === "permanent");
    } else if (activeTab === "temporary") {
      list = list.filter((d) => d.type === "temporary");
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) => d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q)
      );
    }

    const sorted = [...list].sort((a, b) => {
      let comparison = 0;
      if (sortField === "title") {
        comparison = (a.title || "").localeCompare(b.title || "");
      } else if (sortField === "type") {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === "size") {
        comparison = a.size - b.size;
      } else if (sortField === "updated_at") {
        comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    if (activeNav === "recent") {
      return sorted.slice(0, 20);
    }

    return sorted;
  };

  const goToTemplates = () => {
    setActiveNav("templates");
    router.replace("/?nav=templates", { scroll: false });
  };

  const displayedDocs = getFilteredAndSortedDocs();

  return (
    <div className="flex h-screen bg-[var(--background)] overflow-hidden font-sans text-[var(--darkblue)]">
      {/* 1. SIDEBAR */}
      <ResizableSidebar>
        {({ collapsed }) => (
          <Sidebar
            activeNav={activeNav}
            setActiveNav={setActiveNav}
            setActiveTab={setActiveTab}
            user={user}
            profile={profile}
            authLoading={authLoading}
            collapsed={collapsed}
          />
        )}
      </ResizableSidebar>

      {/* 2. MAIN WORKSPACE CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[var(--background)]">
        <div className="flex-1 overflow-y-auto p-8 space-y-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

          {/* Global Search Bar */}
          <div className="relative max-w-2xl w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents, cloud files, OCR scans, or templates..."
              className="w-full pl-11 pr-4 py-3 bg-white border border-[var(--darkblue)]/15 focus:border-honey rounded-2xl text-sm text-[var(--darkblue)] placeholder:text-[var(--darkblue)]/50 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Section heading */}
          <div>
            <h2 className="text-xl font-bold text-[var(--darkblue)]">
              {NAV_TITLES[activeNav]}
            </h2>
            {activeNav === "recent" && (
              <p className="text-xs text-[var(--darkblue)]/60 mt-1">
                Your 20 most recently modified documents
              </p>
            )}
          </div>

          {/* FILE LIST — hidden on templates/tools views */}
          {(activeNav === "home" ||
            activeNav === "recent" ||
            activeNav === "favorites" ||
            activeNav === "cloud") && (
          <FileList
            displayedDocs={displayedDocs}
            allCombinedDocsCount={allCombinedDocs.length}
            tempDocsCount={tempDocs.length}
            permanentDocsCount={documents.length}
            docsLoading={docsLoading}
            authLoading={authLoading}
            searchQuery={searchQuery}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortField={sortField}
            sortOrder={sortOrder}
            handleSort={handleSort}
            openDocument={openDocument}
            handleToggleTempFavorite={handleToggleTempFavorite}
            handleTogglePermanentFavorite={handleTogglePermanentFavorite}
            handleRemoveTempDoc={handleRemoveTempDoc}
            handleDeletePermanentDoc={handleDeletePermanentDoc}
            documents={documents}
          />
          )}

          {/* TOOLS VIEW */}
          {activeNav === "tools" && (
            <div className="bg-white rounded-2xl border border-[var(--darkblue)]/10 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-honey/15 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-honey" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--darkblue)]">OCR &amp; Audio Tools</h3>
                  <p className="text-xs text-[var(--darkblue)]/60">
                    Scan images and listen to your documents in Studio
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                <button
                  onClick={() => {
                    clearPendingText();
                    clearDraft();
                    setStudioMode("ocr");
                    router.push("/feature");
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--darkblue)]/10 hover:border-honey hover:shadow-sm transition-all cursor-pointer text-left"
                >
                  <ImageIcon className="w-5 h-5 text-black shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[var(--darkblue)]">OCR Image Scan</p>
                    <p className="text-xs text-[var(--darkblue)]/60 mt-0.5">
                      Extract text from photos and scanned images
                    </p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    clearPendingText();
                    clearDraft();
                    setStudioMode("blank");
                    router.push("/feature");
                  }}
                  className="flex items-center gap-3 p-4 rounded-xl border border-[var(--darkblue)]/10 hover:border-honey hover:shadow-sm transition-all cursor-pointer text-left"
                >
                  <Sparkles className="w-5 h-5 text-black shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-[var(--darkblue)]">Text-to-Speech Studio</p>
                    <p className="text-xs text-[var(--darkblue)]/60 mt-0.5">
                      Open Studio to listen, highlight, and export audio
                    </p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* TEMPLATE STORE — single gallery view */}
          {activeNav === "templates" && <TemplateGallery />}

          {/* Home promo → links to template store */}
          {activeNav === "home" && (
            <TemplateGallery compact onExplore={goToTemplates} />
          )}

        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[var(--background)]">
        <div className="w-6 h-6 border-2 border-honey border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
