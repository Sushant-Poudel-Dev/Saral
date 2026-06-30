"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import {
  FileText,
  Image as ImageIcon,
  Clock,
  Star,
  Plus,
  HardDrive,
  Sparkles,
  FileUp,
  Layers,
  Zap,
  LogIn,
  FolderOpen,
  Loader2,
} from "lucide-react";
import {
  setStudioMode,
  setPendingText,
  clearPendingText,
  clearDraft,
  saveTempDocument,
} from "@/services/trackingService";
import { extractTextFromFile, OPEN_FILE_ACCEPT } from "@/utils/fileExtract";

export type NavType = "home" | "recent" | "favorites" | "cloud" | "templates" | "tools";
export type TabType = "all" | "temporary" | "permanent" | "favorites";

interface SidebarProps {
  activeNav: NavType;
  setActiveNav: (nav: NavType) => void;
  setActiveTab: (tab: TabType) => void;
  user: any;
  profile: any;
  authLoading: boolean;
  collapsed?: boolean;
}

export default function Sidebar({
  activeNav,
  setActiveNav,
  setActiveTab,
  user,
  profile,
  authLoading,
  collapsed = false,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isDashboard = pathname === "/";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpening, setIsOpening] = useState(false);

  const displayName =
    profile?.full_name?.split(" ")[0] ||
    user?.user_metadata?.name?.split(" ")[0] ||
    "User";
  const initials = (profile?.full_name || user?.user_metadata?.name || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avatarUrl =
    profile?.avatar_url || user?.user_metadata?.avatar_url || null;

  const goToDashboard = (nav: NavType) => {
    if (nav === "home") setActiveTab("all");
    else if (nav === "favorites") setActiveTab("favorites");
    else if (nav === "cloud") setActiveTab("permanent");
    else if (nav === "recent") setActiveTab("all");

    setActiveNav(nav);

    if (!isDashboard) {
      router.push(`/?nav=${nav}`);
    } else {
      router.replace(`/?nav=${nav}`, { scroll: false });
    }
  };

  const goToStudio = (mode: "blank" | "ocr" | "import") => {
    clearPendingText();
    if (mode === "blank") clearDraft();
    setStudioMode(mode);
    router.push("/feature");
  };

  const handleOpenFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleOpenFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOpening(true);
    try {
      const text = await extractTextFromFile(file);
      if (!text.trim()) {
        throw new Error("No readable text found in the file.");
      }
      clearDraft();
      setPendingText(text);
      saveTempDocument(file.name, text);
      router.push("/feature");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to open file.");
    } finally {
      setIsOpening(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const navBtn = (
    nav: NavType,
    icon: React.ReactNode,
    label: string,
    onClick?: () => void
  ) => (
    <button
      key={nav}
      onClick={onClick ?? (() => goToDashboard(nav))}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg transition-colors cursor-pointer ${
        collapsed ? "justify-center" : ""
      } ${
        activeNav === nav && isDashboard
          ? "bg-[var(--darkblue)] text-white font-semibold"
          : "text-[var(--darkblue)] hover:bg-[var(--background)]"
      }`}
    >
      <span
        className={`shrink-0 ${
          activeNav === nav && isDashboard ? "text-white" : "text-black"
        }`}
      >
        {icon}
      </span>
      {!collapsed && <span>{label}</span>}
    </button>
  );

  const quickBtn = (
    icon: React.ReactNode,
    label: string,
    onClick: () => void
  ) => (
    <button
      key={label}
      onClick={onClick}
      title={collapsed ? label : undefined}
      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-[var(--darkblue)] hover:bg-[var(--background)] transition-colors cursor-pointer text-xs font-medium ${
        collapsed ? "justify-center" : ""
      }`}
    >
      <span className="shrink-0 text-black">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </button>
  );

  return (
    <aside
      className="w-full h-full bg-white border-r border-[var(--darkblue)]/10 flex flex-col justify-between shrink-0 select-none z-20 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <div>
        {/* SARAL Logo Header */}
        <div
          className={`h-20 flex items-center border-b border-[var(--darkblue)]/10 ${
            collapsed ? "justify-center px-2" : "justify-center px-4"
          }`}
        >
          {collapsed ? (
            <div
              className="w-8 h-8 rounded-lg bg-honey flex items-center justify-center cursor-pointer text-white font-extrabold text-sm"
              onClick={() => router.push("/?nav=home")}
              title="SARAL"
            >
              S
            </div>
          ) : (
            <Image
              src="/saralLogo.svg"
              alt="Saral Logo"
              width={120}
              height={50}
              className="h-11 w-auto cursor-pointer object-contain"
              onClick={() => router.push("/?nav=home")}
            />
          )}
        </div>

        {/* Action Buttons: Create & Open */}
        <div className={`p-4 flex gap-2 ${collapsed ? "flex-col items-center" : ""}`}>
          <button
            onClick={() => goToStudio("blank")}
            title={collapsed ? "Create" : undefined}
            className={`flex items-center justify-center gap-1.5 bg-honey text-white font-bold text-xs rounded-xl shadow-sm hover:opacity-90 transition-all cursor-pointer active:scale-95 ${
              collapsed ? "w-9 h-9 p-0 rounded-lg" : "flex-1 py-2.5 px-3"
            }`}
          >
            <Plus className="w-4 h-4 text-white" />
            {!collapsed && <span>Create</span>}
          </button>
          <button
            onClick={handleOpenFileClick}
            disabled={isOpening}
            title={collapsed ? "Open" : undefined}
            className={`flex items-center justify-center gap-1.5 bg-[var(--cream)] hover:bg-white text-[var(--darkblue)] font-medium text-xs rounded-xl border border-[var(--darkblue)]/15 transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60 ${
              collapsed ? "w-9 h-9 p-0 rounded-lg" : "flex-1 py-2.5 px-3"
            }`}
          >
            {isOpening ? (
              <Loader2 className="w-4 h-4 animate-spin text-black" />
            ) : (
              <FolderOpen className="w-4 h-4 text-black" />
            )}
            {!collapsed && <span>{isOpening ? "Opening…" : "Open"}</span>}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={OPEN_FILE_ACCEPT}
            className="hidden"
            onChange={handleOpenFileChange}
          />
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1 text-sm font-medium">
          {navBtn("home", <Layers className="w-4 h-4" />, "Home", () =>
            goToDashboard("home"),
          )}
          {navBtn("recent", <Clock className="w-4 h-4" />, "Recent Files", () =>
            goToDashboard("recent"),
          )}
          {navBtn("favorites", <Star className="w-4 h-4" />, "Favorites", () =>
            goToDashboard("favorites"),
          )}
          {navBtn("cloud", <HardDrive className="w-4 h-4" />, "My Cloud Space", () =>
            goToDashboard("cloud"),
          )}

          {/* QUICK START */}
          {!collapsed ? (
            <div className="pt-4 pb-1 px-3.5">
              <span className="text-[11px] font-bold text-[var(--darkblue)]/50 uppercase tracking-wider">
                Quick Start &amp; Create
              </span>
            </div>
          ) : (
            <div className="pt-3 pb-1 border-t border-[var(--darkblue)]/10 mx-1" />
          )}

          {quickBtn(
            <FileText className="w-4 h-4" />,
            "Blank Document",
            () => goToStudio("blank"),
          )}
          {quickBtn(
            <ImageIcon className="w-4 h-4" />,
            "OCR Image Scan",
            () => goToStudio("ocr"),
          )}
          {quickBtn(
            <FileUp className="w-4 h-4" />,
            "Import File",
            () => goToStudio("import"),
          )}

          {/* WORKSPACE & TOOLS */}
          {!collapsed ? (
            <div className="pt-4 pb-1 px-3.5">
              <span className="text-[11px] font-bold text-[var(--darkblue)]/50 uppercase tracking-wider">
                Workspace &amp; Tools
              </span>
            </div>
          ) : (
            <div className="pt-3 pb-1 border-t border-[var(--darkblue)]/10 mx-1" />
          )}

          {navBtn("tools", <Zap className="w-4 h-4" />, "OCR & Audio Tools", () =>
            goToDashboard("tools"),
          )}
          {navBtn("templates", <Sparkles className="w-4 h-4" />, "Template Store", () =>
            goToDashboard("templates"),
          )}
        </nav>
      </div>

      {/* User Profile Link Area */}
      <div
        className={`p-4 border-t border-[var(--darkblue)]/10 bg-[var(--cream)]/60 ${
          collapsed ? "flex justify-center" : ""
        }`}
      >
        {authLoading ? (
          <div className="w-8 h-8 rounded-full bg-slate-200 animate-pulse" />
        ) : user ? (
          <button
            onClick={() => router.push("/profile")}
            title={collapsed ? displayName : undefined}
            className={`flex items-center gap-3 p-2 rounded-xl border border-[var(--darkblue)]/15 bg-white hover:border-honey hover:shadow-sm transition-all cursor-pointer group ${
              collapsed ? "w-auto" : "w-full"
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-honey/20 text-[var(--darkblue)] text-xs font-bold flex items-center justify-center shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                initials
              )}
            </div>
            {!collapsed && (
              <span className="text-sm font-semibold text-[var(--darkblue)] truncate group-hover:text-amber-700 transition-colors">
                {displayName}
              </span>
            )}
          </button>
        ) : (
          <button
            onClick={() => router.push("/login")}
            title={collapsed ? "Sign In" : undefined}
            className={`flex items-center justify-center gap-2 rounded-xl bg-honey text-white text-sm font-bold hover:opacity-90 transition-all cursor-pointer shadow-sm ${
              collapsed ? "w-9 h-9 p-0 rounded-lg" : "w-full px-4 py-2.5"
            }`}
          >
            <LogIn className="w-4 h-4 text-white" />
            {!collapsed && <span>Sign In</span>}
          </button>
        )}
      </div>
    </aside>
  );
}
