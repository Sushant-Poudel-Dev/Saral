"use client";

import { useRouter } from "next/navigation";
import type { Document } from "@/types/database";
import {
  FileText,
  Star,
  Loader2,
  Trash2,
  HardDrive,
  MonitorSmartphone,
  Folder,
  Grid,
  List as ListIcon,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export type SortField = "title" | "type" | "updated_at" | "size";
export type TabType = "all" | "temporary" | "permanent" | "favorites";

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

function getFileSize(content: string): string {
  const bytes = new Blob([content]).size;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export interface CombinedDocument {
  id: string;
  title: string;
  content: string;
  is_favorite: boolean;
  updated_at: string;
  type: "temporary" | "permanent";
  size: number;
}

interface FileListProps {
  displayedDocs: CombinedDocument[];
  allCombinedDocsCount: number;
  tempDocsCount: number;
  permanentDocsCount: number;
  docsLoading: boolean;
  authLoading: boolean;
  searchQuery: string;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  sortField: SortField;
  sortOrder: "asc" | "desc";
  handleSort: (field: SortField) => void;
  openDocument: (content: string) => void;
  handleToggleTempFavorite: (id: string) => void;
  handleTogglePermanentFavorite: (doc: Document) => void;
  handleRemoveTempDoc: (id: string) => void;
  handleDeletePermanentDoc: (docId: string) => void;
  documents: Document[];
}

export default function FileList({
  displayedDocs,
  allCombinedDocsCount,
  tempDocsCount,
  permanentDocsCount,
  docsLoading,
  authLoading,
  searchQuery,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  sortField,
  sortOrder,
  handleSort,
  openDocument,
  handleToggleTempFavorite,
  handleTogglePermanentFavorite,
  handleRemoveTempDoc,
  handleDeletePermanentDoc,
  documents,
}: FileListProps) {
  const router = useRouter();

  return (
    <div className='bg-white rounded-2xl border border-[var(--darkblue)]/10 shadow-sm overflow-hidden'>
      {/* Table Filter Header Tabs */}
      <div className='px-4 md:px-6 py-3 md:py-4 border-b border-[var(--darkblue)]/10 flex flex-wrap items-center justify-between gap-3'>
        {/* Filter Pills */}
        <div className='flex items-center gap-1.5 md:gap-2 bg-[var(--background)] p-1 rounded-xl overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-2.5 md:px-4 py-1.5 rounded-lg text-[11px] md:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "all"
                ? "bg-honey text-white shadow-sm"
                : "text-[var(--darkblue)]/70 hover:bg-white hover:text-[var(--darkblue)]"
            }`}
          >
            All ({allCombinedDocsCount})
          </button>
          <button
            onClick={() => setActiveTab("temporary")}
            className={`px-2.5 md:px-4 py-1.5 rounded-lg text-[11px] md:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 md:gap-1.5 whitespace-nowrap ${
              activeTab === "temporary"
                ? "bg-honey text-white shadow-sm"
                : "text-[var(--darkblue)]/70 hover:bg-white hover:text-[var(--darkblue)]"
            }`}
          >
            <MonitorSmartphone
              className={`hidden md:inline w-3.5 h-3.5 ${activeTab === "temporary" ? "text-white" : "text-black"}`}
            />
            <span className='md:hidden'>Temp</span>
            <span className='hidden md:inline'>Temporary</span>
            <span>({tempDocsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("permanent")}
            className={`px-2.5 md:px-4 py-1.5 rounded-lg text-[11px] md:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 md:gap-1.5 whitespace-nowrap ${
              activeTab === "permanent"
                ? "bg-honey text-white shadow-sm"
                : "text-[var(--darkblue)]/70 hover:bg-white hover:text-[var(--darkblue)]"
            }`}
          >
            <HardDrive
              className={`hidden md:inline w-3.5 h-3.5 ${activeTab === "permanent" ? "text-white" : "text-black"}`}
            />
            <span className='md:hidden'>Cloud</span>
            <span className='hidden md:inline'>Cloud Saved</span>
            <span>({permanentDocsCount})</span>
          </button>
          <button
            onClick={() => setActiveTab("favorites")}
            className={`px-2.5 md:px-4 py-1.5 rounded-lg text-[11px] md:text-xs font-bold transition-all cursor-pointer flex items-center gap-1 md:gap-1.5 whitespace-nowrap ${
              activeTab === "favorites"
                ? "bg-honey text-white shadow-sm"
                : "text-[var(--darkblue)]/70 hover:bg-white hover:text-[var(--darkblue)]"
            }`}
          >
            <Star
              className={`hidden md:inline w-3.5 h-3.5 ${activeTab === "favorites" ? "text-white fill-white" : "text-black"}`}
            />
            Starred
          </button>
        </div>

        {/* View Switches (List vs Grid) — hidden on mobile */}
        <div className='hidden md:flex items-center gap-2'>
          <div className='flex items-center bg-[var(--background)] p-1 rounded-lg'>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[var(--darkblue)] shadow-sm"
                  : "text-[var(--darkblue)]/50 hover:text-[var(--darkblue)]"
              }`}
              title='List View'
            >
              <ListIcon className='w-4 h-4 text-black' />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-[var(--darkblue)] shadow-sm"
                  : "text-[var(--darkblue)]/50 hover:text-[var(--darkblue)]"
              }`}
              title='Grid View'
            >
              <Grid className='w-4 h-4 text-black' />
            </button>
          </div>
        </div>
      </div>

      {/* Content Display */}
      {docsLoading || authLoading ? (
        <div className='flex items-center justify-center py-24'>
          <Loader2 className='w-6 h-6 animate-spin text-[var(--darkblue)]' />
        </div>
      ) : displayedDocs.length === 0 ? (
        <div className='py-20 text-center flex flex-col items-center justify-center'>
          <div className='w-16 h-16 rounded-2xl bg-[var(--background)] flex items-center justify-center mb-3 text-black'>
            <Folder className='w-8 h-8 text-black' />
          </div>
          <h3 className='text-sm font-extrabold text-[var(--primary)]'>
            No documents found
          </h3>
          <p className='text-xs text-[var(--darkblue)]/60 mt-1 max-w-sm'>
            {searchQuery
              ? `No results matching "${searchQuery}"`
              : "Create a document or perform an OCR scan to populate your files."}
          </p>
          <button
            onClick={() => router.push("/feature")}
            className='mt-4 px-5 py-2.5 bg-honey text-white rounded-xl text-xs font-bold hover:opacity-90 transition-colors cursor-pointer shadow-sm'
          >
            Open Studio
          </button>
        </div>
      ) : (
        <>
        {/* ── TABLE VIEW ── desktop only ──────────────────────────────────── */}
        {viewMode === "list" && (
        <div className='hidden md:block overflow-x-auto'>
          <table className='w-full text-left border-collapse'>
            <thead>
              <tr className='bg-[var(--cream)]/80 text-[11px] font-extrabold text-[var(--primary)] uppercase tracking-wider border-b border-[var(--darkblue)]/10 select-none'>
                <th
                  onClick={() => handleSort("title")}
                  className='py-3.5 px-6 cursor-pointer hover:text-black transition-colors'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>Document Name</span>
                    {sortField === "title" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className='w-3 h-3 text-black' />
                      ) : (
                        <ArrowDown className='w-3 h-3 text-black' />
                      )
                    ) : (
                      <ArrowUpDown className='w-3 h-3 opacity-40' />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("type")}
                  className='hidden md:table-cell py-3.5 px-4 cursor-pointer hover:text-black transition-colors'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>Storage Location</span>
                    {sortField === "type" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className='w-3 h-3 text-black' />
                      ) : (
                        <ArrowDown className='w-3 h-3 text-black' />
                      )
                    ) : (
                      <ArrowUpDown className='w-3 h-3 opacity-40' />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("updated_at")}
                  className='hidden md:table-cell py-3.5 px-4 cursor-pointer hover:text-black transition-colors'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>Last Modified</span>
                    {sortField === "updated_at" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className='w-3 h-3 text-black' />
                      ) : (
                        <ArrowDown className='w-3 h-3 text-black' />
                      )
                    ) : (
                      <ArrowUpDown className='w-3 h-3 opacity-40' />
                    )}
                  </div>
                </th>
                <th
                  onClick={() => handleSort("size")}
                  className='hidden md:table-cell py-3.5 px-4 cursor-pointer hover:text-black transition-colors'
                >
                  <div className='flex items-center gap-1.5'>
                    <span>File Size</span>
                    {sortField === "size" ? (
                      sortOrder === "asc" ? (
                        <ArrowUp className='w-3 h-3 text-black' />
                      ) : (
                        <ArrowDown className='w-3 h-3 text-black' />
                      )
                    ) : (
                      <ArrowUpDown className='w-3 h-3 opacity-40' />
                    )}
                  </div>
                </th>
                <th className='py-3.5 px-4 text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-[var(--darkblue)]/10 text-sm'>
              {displayedDocs.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => openDocument(doc.content)}
                  className='hover:bg-[var(--background)]/50 transition-colors cursor-pointer group'
                >
                  {/* Name Column (Ultra Bold Title for List View) */}
                  <td className='py-3.5 px-6'>
                    <div className='flex items-center gap-3'>
                      <div className='w-8.5 h-8.5 rounded-lg bg-[var(--cream)] text-black flex items-center justify-center shrink-0 font-bold border border-[var(--darkblue)]/10'>
                        <FileText className='w-4.5 h-4.5 text-black' />
                      </div>
                      <div className='min-w-0 max-w-md'>
                        <div className='flex items-center gap-2'>
                          <p className='font-black text-base text-[var(--primary)] group-hover:text-amber-700 transition-colors truncate'>
                            {doc.title || "Untitled Document"}
                          </p>
                          <span className={`md:hidden inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${doc.type === "temporary" ? "bg-[var(--yellow)]/30 border border-slate-300" : "bg-[var(--blue)]/30 border border-blue-200"}`}>
                            {doc.type === "temporary" ? "Local" : "Cloud"}
                          </span>
                        </div>
                        <p className='text-xs text-[var(--darkblue)]/60 font-normal truncate mt-0.5'>
                          {doc.content.slice(0, 70)}...
                        </p>
                        <div className='md:hidden flex items-center gap-2 mt-1'>
                          <span className='text-[10px] text-[var(--darkblue)]/50 font-mono'>{getFileSize(doc.content)}</span>
                          <span className='text-[10px] text-[var(--darkblue)]/40'>•</span>
                          <span className='text-[10px] text-[var(--darkblue)]/50'>{timeAgo(doc.updated_at)}</span>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Location Badge Column */}
                  <td className='hidden md:table-cell py-3.5 px-4'>
                    {doc.type === "temporary" ? (
                      <span className='inline-flex items-center gap-1 text-[11px] font-medium text-[var(--darkblue)] bg-[var(--yellow)]/30 border border-slate-300 px-2.5 py-0.5 rounded-full'>
                        <MonitorSmartphone className='w-3 h-3 text-black' />{" "}
                        Local Draft
                      </span>
                    ) : (
                      <span className='inline-flex items-center gap-1 text-[11px] font-medium text-[var(--darkblue)] bg-[var(--blue)]/30 border border-blue-200 px-2.5 py-0.5 rounded-full'>
                        <HardDrive className='w-3 h-3 text-black' /> Cloud Saved
                      </span>
                    )}
                  </td>

                  {/* Last Modified Column */}
                  <td className='hidden md:table-cell py-3.5 px-4 text-xs text-[var(--darkblue)]/70 font-medium'>
                    {timeAgo(doc.updated_at)}
                  </td>

                  {/* File Size Column */}
                  <td className='hidden md:table-cell py-3.5 px-4 text-xs font-mono text-[var(--darkblue)]/70'>
                    {getFileSize(doc.content)}
                  </td>

                  {/* Actions Column */}
                  <td className='py-3.5 px-4 text-right'>
                    <div
                      className='flex items-center justify-end gap-1'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => {
                          if (doc.type === "temporary")
                            handleToggleTempFavorite(doc.id);
                          else
                            handleTogglePermanentFavorite(
                              documents.find((d) => d.id === doc.id)!,
                            );
                        }}
                        className='p-1.5 rounded-lg hover:bg-slate-200 text-black transition-colors cursor-pointer'
                        title='Favorite'
                      >
                        <Star
                          className={`w-4 h-4 text-black ${doc.is_favorite ? "fill-black" : ""}`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          if (doc.type === "temporary")
                            handleRemoveTempDoc(doc.id);
                          else handleDeletePermanentDoc(doc.id);
                        }}
                        className='p-1.5 rounded-lg hover:bg-red-50 text-black hover:text-red-600 transition-colors cursor-pointer'
                        title='Delete'
                      >
                        <Trash2 className='w-4 h-4 text-black' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
        {/* ── GRID VIEW ── always on mobile, on desktop only in grid mode ── */}
        <div className={`${viewMode === "grid" ? "" : "md:hidden"} p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4`}>
          {displayedDocs.map((doc) => (
            <div
              key={doc.id}
              onClick={() => openDocument(doc.content)}
              className='bg-white rounded-2xl border border-[var(--darkblue)]/10 hover:border-honey hover:shadow-md transition-all cursor-pointer group p-5 flex flex-col justify-between'
            >
              <div>
                {/* Grid Header: Icon + Normal Weight Title + Star */}
                <div className='flex items-start justify-between gap-3 mb-3'>
                  <div className='flex items-center gap-2.5 min-w-0'>
                    <div className='w-8.5 h-8.5 rounded-lg bg-[var(--cream)] flex items-center justify-center shrink-0 border border-[var(--darkblue)]/10'>
                      <FileText className='w-4.5 h-4.5 text-black' />
                    </div>
                    <h4 className='font-normal text-sm text-[var(--primary)] group-hover:text-amber-700 transition-colors truncate'>
                      {doc.title || "Untitled Document"}
                    </h4>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (doc.type === "temporary")
                        handleToggleTempFavorite(doc.id);
                      else
                        handleTogglePermanentFavorite(
                          documents.find((d) => d.id === doc.id)!,
                        );
                    }}
                    className='text-black cursor-pointer p-1 rounded-lg hover:bg-slate-100 shrink-0'
                  >
                    <Star
                      className={`w-4 h-4 text-black ${doc.is_favorite ? "fill-black" : ""}`}
                    />
                  </button>
                </div>

                {/* Snippet Preview */}
                <p className='text-xs text-[var(--darkblue)]/60 font-normal line-clamp-3 leading-relaxed mb-4'>
                  {doc.content}
                </p>
              </div>

              {/* Minimal Grid Footer */}
              <div className='flex items-center justify-between text-[11px] text-[var(--darkblue)]/50 pt-3 border-t border-[var(--darkblue)]/5'>
                <div className='flex items-center gap-2'>
                  <span className='font-mono text-[10px] text-[var(--darkblue)]/70 font-medium'>
                    {getFileSize(doc.content)}
                  </span>
                  <span>•</span>
                  <span>{timeAgo(doc.updated_at)}</span>
                </div>
                <span
                  className={`font-medium px-2.5 py-0.5 rounded-full text-[10px] ${doc.type === "temporary" ? "bg-[var(--yellow)]/30 text-[var(--darkblue)] border border-slate-300" : "bg-[var(--blue)]/30 text-[var(--darkblue)] border border-blue-200"}`}
                >
                  {doc.type === "temporary" ? "Local" : "Cloud"}
                </span>
              </div>
            </div>
          ))}
        </div>
        </>
      )}
    </div>
  );
}
