"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase/client";
import {
  LogOut,
  FileText,
  Headphones,
  Image as ImageIcon,
  Clock,
  Star,
  Download,
  Loader2,
  ChevronRight,
  X,
  Check,
  Sparkles,
  Type,
  Palette,
  Volume2,
  Settings,
  Save,
  RotateCcw,
  Paintbrush,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
} from "lucide-react";

function formatTime(seconds: number): string {
  if (!seconds) return "0m";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const TIERS = [
  {
    name: "Free",
    price: "Rs 0",
    period: "/forever",
    color: "var(--green)",
    features: [
      "Upload Document",
      "Word Dictionary",
      "Text to Speech",
      "Word Splitting",
      "Color Coding",
      "Background Color",
      "Lined Texture",
      "5 Permanent Documents",
    ],
    cta: "Current Plan",
    current: true,
  },
  {
    name: "Pro",
    price: "Rs 799",
    period: "/month",
    color: "var(--honey)",
    features: [
      "Everything in Free",
      "Limited Image to Text (20)",
      "Limited Audio Export (20)",
      "Text Highlighting",
      "Heatmap",
      "Word Highlighting on TTS",
      "10 Permanent Documents",
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    name: "Ultra",
    price: "Rs 1499",
    period: "/month",
    color: "var(--blue)",
    features: [
      "Everything in Pro",
      "Top End TTS API",
      "Better OCR",
      "Unlimited Permanent Documents",
      "Customizable App",
      "Extension",
      "AI Summary & Paraphrase",
    ],
    cta: "Upgrade to Ultra",
  },
];

export default function ProfilePage() {
  const router = useRouter();
  const {
    user,
    profile,
    settings,
    subscription,
    stats,
    isLoading,
    signOut,
    refreshSettings,
  } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  if (isLoading || !user) {
    return (
      <div className='min-h-[calc(100vh-80px)] flex items-center justify-center bg-(--background)'>
        <Loader2 className='w-6 h-6 animate-spin text-(--honey)' />
      </div>
    );
  }

  const name = profile?.full_name || user.user_metadata?.name || "User";
  const email = user.email || "";
  const avatar = profile?.avatar_url || user.user_metadata?.avatar_url || null;
  const initials = name
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const plan = profile?.plan || "free";
  const joined = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className='min-h-[calc(100vh-80px)] bg-(--background)'>
      <div className='max-w-3xl mx-auto px-5 py-10'>
        {/* ── Avatar + Info ─────────────────────────────────── */}
        <div className='flex flex-col items-center text-center mb-10'>
          <div className='w-20 h-20 rounded-full bg-(--honey)/10 ring-[3px] ring-(--honey)/20 flex items-center justify-center text-(--honey) text-2xl font-bold overflow-hidden mb-4'>
            {avatar ? (
              <img
                src={avatar}
                alt=''
                className='w-full h-full object-cover'
                referrerPolicy='no-referrer'
              />
            ) : (
              initials
            )}
          </div>
          <h1 className='text-xl font-semibold text-(--primary)'>{name}</h1>
          <p className='text-sm text-slate-400 mt-0.5'>{email}</p>
          <div className='flex items-center gap-2 mt-3'>
            <span className='text-[11px] font-semibold uppercase tracking-wider bg-(--honey)/12 text-(--honey) px-2.5 py-0.5 rounded-full'>
              {plan}
            </span>
            {joined && (
              <>
                <span className='text-slate-300'>·</span>
                <span className='text-xs text-slate-400'>
                  Member since {joined}
                </span>
              </>
            )}
          </div>
        </div>

        {/* ── Usage stats ───────────────────────────────────── */}
        <div className='grid grid-cols-3 sm:grid-cols-6 gap-px bg-slate-200/60 rounded-2xl overflow-hidden mb-8'>
          {[
            {
              icon: FileText,
              val: stats?.total_documents ?? 0,
              label: "Docs",
            },
            {
              icon: ImageIcon,
              val: stats?.total_images_scanned ?? 0,
              label: "Scans",
            },
            {
              icon: Download,
              val: stats?.total_downloads ?? 0,
              label: "Downloads",
            },
            {
              icon: Headphones,
              val: stats?.total_audio_exports ?? 0,
              label: "Audio",
            },
            {
              icon: Star,
              val: stats?.favorite_documents ?? 0,
              label: "Favorites",
            },
            {
              icon: Clock,
              val: formatTime(stats?.total_time_seconds ?? 0),
              label: "Time",
            },
          ].map(({ icon: Icon, val, label }) => (
            <div
              key={label}
              className='bg-white flex flex-col items-center py-4 px-2'
            >
              <Icon className='w-4 h-4 text-slate-300 mb-1.5' />
              <span className='text-lg font-semibold text-(--primary) leading-none'>
                {val}
              </span>
              <span className='text-[10px] text-slate-400 mt-1'>{label}</span>
            </div>
          ))}
        </div>

        {/* ── Studio config ─────────────────────────────────── */}
        {settings && (
          <div className='bg-white rounded-2xl border border-slate-200/60 mb-4 overflow-hidden'>
            <button
              onClick={() => setShowSettings(true)}
              className='w-full flex items-center justify-between px-5 py-4 cursor-pointer group'
            >
              <div>
                <p className='text-sm font-medium text-(--primary) text-left'>
                  Studio Settings
                </p>
                <p className='text-xs text-slate-400 mt-0.5 text-left'>
                  {settings.font_family} · {settings.font_size}px · TTS{" "}
                  {settings.tts_speed}x
                </p>
              </div>
              <ChevronRight className='w-4 h-4 text-slate-300 group-hover:translate-x-0.5 transition-transform' />
            </button>
            <div className='px-5 pb-4 flex flex-wrap gap-1.5'>
              {[
                {
                  label: "Color Coding",
                  on: settings.color_coding_enabled,
                },
                { label: "Heatmap", on: settings.heatmap_enabled },
                {
                  label: "Syllables",
                  on: settings.syllable_splitting_enabled,
                },
                {
                  label: "Auto Highlight",
                  on: settings.auto_highlight,
                },
              ].map(({ label, on }) => (
                <span
                  key={label}
                  className={`text-[11px] px-2 py-0.5 rounded-full ${
                    on
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-50 text-slate-400"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Subscription ──────────────────────────────────── */}
        <div className='bg-white rounded-2xl border border-slate-200/60 mb-4 overflow-hidden'>
          <div className='flex items-center justify-between px-5 py-4'>
            <div>
              <p className='text-sm font-medium text-(--primary) capitalize'>
                {plan} Plan
              </p>
              <p className='text-xs text-slate-400 mt-0.5'>
                {plan === "free"
                  ? "Upgrade for full access"
                  : `${subscription?.billing_cycle ?? "monthly"} · ${subscription?.status ?? "active"}`}
              </p>
            </div>
            {plan === "free" && (
              <button
                onClick={() => setShowUpgrade(true)}
                className='text-xs font-medium bg-(--honey) text-white px-3.5 py-1.5 rounded-lg hover:opacity-90 transition-opacity cursor-pointer'
              >
                Upgrade
              </button>
            )}
          </div>
        </div>

        {/* ── Sign Out ──────────────────────────────────────── */}
        <button
          onClick={handleSignOut}
          className='w-full flex items-center justify-center gap-2 py-3 text-sm text-slate-400 hover:text-red-500 transition-colors cursor-pointer mt-6'
        >
          <LogOut className='w-4 h-4' />
          Sign Out
        </button>

        <p className='text-center text-[10px] text-slate-300 mt-8'>
          SARAL v2.0
        </p>
      </div>

      {/* ── Upgrade Modal ──────────────────────────────────── */}
      {showUpgrade && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
          onClick={() => setShowUpgrade(false)}
        >
          <div
            className='relative bg-(--background) rounded-2xl shadow-xl w-full max-w-3xl p-6 md:p-8 animate-fade-in'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowUpgrade(false)}
              className='absolute top-4 right-4 p-1 rounded-lg hover:bg-white/60 transition-colors cursor-pointer'
            >
              <X className='w-5 h-5 text-(--primary)' />
            </button>

            <div className='text-center mb-6'>
              <h2 className='text-xl font-bold text-(--primary)'>
                Choose your plan
              </h2>
              <p className='text-sm text-slate-400 mt-1'>
                Pick the tier that fits your needs.
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              {TIERS.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative bg-white rounded-xl border-2 p-5 flex flex-col transition-all ${
                    tier.popular
                      ? "border-(--honey) shadow-md scale-[1.02]"
                      : "border-slate-200/60"
                  }`}
                >
                  {tier.popular && (
                    <span className='absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 text-[11px] font-semibold text-white bg-(--honey) px-3 py-0.5 rounded-full'>
                      <Sparkles className='w-3 h-3' /> Popular
                    </span>
                  )}

                  <div className='mb-4'>
                    <div
                      className='w-8 h-8 rounded-lg flex items-center justify-center mb-2'
                      style={{ backgroundColor: tier.color, opacity: 0.2 }}
                    >
                      <div
                        className='w-3 h-3 rounded-full'
                        style={{ backgroundColor: tier.color }}
                      />
                    </div>
                    <h3 className='text-base font-semibold text-(--primary)'>
                      {tier.name}
                    </h3>
                    <div className='flex items-baseline gap-0.5 mt-1'>
                      <span className='text-2xl font-bold text-(--primary)'>
                        {tier.price}
                      </span>
                      <span className='text-xs text-slate-400'>
                        {tier.period}
                      </span>
                    </div>
                  </div>

                  <ul className='flex-1 space-y-2 mb-5'>
                    {tier.features.map((f) => (
                      <li
                        key={f}
                        className='flex items-start gap-2 text-xs text-(--primary)'
                      >
                        <Check
                          className='w-3.5 h-3.5 shrink-0 mt-0.5'
                          style={{ color: tier.color }}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    disabled={tier.current}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-opacity cursor-pointer ${
                      tier.current
                        ? "bg-slate-100 text-slate-400 cursor-default"
                        : tier.popular
                          ? "bg-(--honey) text-white hover:opacity-90"
                          : "bg-slate-100 text-(--primary) hover:bg-slate-200"
                    }`}
                  >
                    {tier.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Studio Settings Modal ──────────────────────────── */}
      {showSettings && settings && (
        <StudioSettingsModal
          settings={settings}
          onClose={() => setShowSettings(false)}
          onSaved={() => {
            refreshSettings();
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
}

/* ── Studio Settings Modal ──────────────────────────────────────────────── */

const FONT_OPTIONS = [
  { value: "Roboto", label: "Roboto" },
  { value: "Lexend", label: "Lexend" },
  { value: "Inter", label: "Inter" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "OpenDyslexic", label: "OpenDyslexic" },
  { value: "system-ui", label: "System UI" },
  { value: "Arial", label: "Arial" },
  { value: "Verdana", label: "Verdana" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier New" },
];

function StudioSettingsModal({
  settings,
  onClose,
  onSaved,
}: {
  settings: import("@/types/database").UserSettings;
  onClose: () => void;
  onSaved: () => void;
}) {
  const supabase = createClient();
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  // Local draft state — initialised from settings
  const [fontSize, setFontSize] = useState(settings.font_size);
  const [fontFamily, setFontFamily] = useState(settings.font_family);
  const [lineHeight, setLineHeight] = useState(settings.line_height);
  const [letterSpacing, setLetterSpacing] = useState(settings.letter_spacing);
  const [wordSpacing, setWordSpacing] = useState(settings.word_spacing);
  const [ttsSpeed, setTtsSpeed] = useState(settings.tts_speed);
  const [autoHighlight, setAutoHighlight] = useState(settings.auto_highlight);
  const [colorCoding, setColorCoding] = useState(settings.color_coding_enabled);
  const [heatmap, setHeatmap] = useState(settings.heatmap_enabled);
  const [syllableSplit, setSyllableSplit] = useState(
    settings.syllable_splitting_enabled,
  );
  const [backgroundColor, setBackgroundColor] = useState(
    settings.background_color ?? "#ffffff",
  );
  const [backgroundTexture, setBackgroundTexture] = useState(
    settings.background_texture ?? "none",
  );
  const [textAlign, setTextAlign] = useState(settings.text_align ?? "left");
  const [syllableThreshold, setSyllableThreshold] = useState(
    settings.syllable_split_threshold ?? 8,
  );

  const resetToDefaults = () => {
    setFontSize(16);
    setFontFamily("Lexend");
    setLineHeight(1.5);
    setLetterSpacing(0);
    setWordSpacing(0);
    setTtsSpeed(1.0);
    setAutoHighlight(false);
    setColorCoding(false);
    setHeatmap(false);
    setSyllableSplit(false);
    setBackgroundColor("#ffffff");
    setBackgroundTexture("none");
    setTextAlign("left");
    setSyllableThreshold(8);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from("user_settings")
      .update({
        font_size: fontSize,
        font_family: fontFamily,
        line_height: lineHeight,
        letter_spacing: letterSpacing,
        word_spacing: wordSpacing,
        tts_speed: ttsSpeed,
        auto_highlight: autoHighlight,
        color_coding_enabled: colorCoding,
        heatmap_enabled: heatmap,
        syllable_splitting_enabled: syllableSplit,
        background_color: backgroundColor,
        background_texture: backgroundTexture,
        text_align: textAlign,
        syllable_split_threshold: syllableThreshold,
      })
      .eq("user_id", user.id);
    setSaving(false);
    onSaved();
  };

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4'
      onClick={onClose}
    >
      <div
        className='relative bg-(--background) rounded-2xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 animate-fade-in'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 p-1 rounded-lg hover:bg-white/60 transition-colors cursor-pointer'
        >
          <X className='w-5 h-5 text-(--primary)' />
        </button>

        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2'>
            <Settings className='w-5 h-5 text-gray-400' />
            <h2 className='text-lg font-bold text-(--primary)'>
              Studio Settings
            </h2>
          </div>
          <button
            onClick={resetToDefaults}
            className='flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer mr-8'
          >
            <RotateCcw className='w-3.5 h-3.5' />
            Reset
          </button>
        </div>

        {/* ── Typography ────────────────────────────────────── */}
        <section className='mb-6'>
          <div className='flex items-center gap-1.5 mb-3'>
            <Type className='w-4 h-4 text-gray-400' />
            <h3 className='text-sm font-semibold text-(--primary)'>
              Typography
            </h3>
          </div>
          <div className='space-y-4 bg-white rounded-xl border border-slate-200/60 p-4'>
            {/* Font Family */}
            <div>
              <label className='text-xs text-slate-400 mb-1 block'>
                Font Family
              </label>
              <div className='flex flex-wrap gap-1.5'>
                {FONT_OPTIONS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setFontFamily(f.value)}
                    className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      fontFamily === f.value
                        ? "border-(--honey) bg-(--honey)/10 text-(--primary) font-medium"
                        : "border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Font Size */}
            <div>
              <div className='flex items-center justify-between mb-1'>
                <label className='text-xs text-slate-400'>Font Size</label>
                <span className='text-xs font-medium text-(--primary)'>
                  {fontSize}px
                </span>
              </div>
              <input
                type='range'
                min={12}
                max={24}
                step={1}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className='w-full h-1.5 bg-slate-200 rounded-full appearance-none slider cursor-pointer'
              />
            </div>
            {/* Line Height */}
            <div>
              <div className='flex items-center justify-between mb-1'>
                <label className='text-xs text-slate-400'>Line Height</label>
                <span className='text-xs font-medium text-(--primary)'>
                  {lineHeight.toFixed(1)}
                </span>
              </div>
              <input
                type='range'
                min={1}
                max={3}
                step={0.1}
                value={lineHeight}
                onChange={(e) => setLineHeight(Number(e.target.value))}
                className='w-full h-1.5 bg-slate-200 rounded-full appearance-none slider cursor-pointer'
              />
            </div>
            {/* Letter Spacing */}
            <div>
              <div className='flex items-center justify-between mb-1'>
                <label className='text-xs text-slate-400'>Letter Spacing</label>
                <span className='text-xs font-medium text-(--primary)'>
                  {letterSpacing > 0 ? "+" : ""}
                  {letterSpacing.toFixed(2)}em
                </span>
              </div>
              <input
                type='range'
                min={-0.1}
                max={0.2}
                step={0.01}
                value={letterSpacing}
                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                className='w-full h-1.5 bg-slate-200 rounded-full appearance-none slider cursor-pointer'
              />
            </div>
            {/* Word Spacing */}
            <div>
              <div className='flex items-center justify-between mb-1'>
                <label className='text-xs text-slate-400'>Word Spacing</label>
                <span className='text-xs font-medium text-(--primary)'>
                  {wordSpacing > 0 ? "+" : ""}
                  {wordSpacing.toFixed(2)}em
                </span>
              </div>
              <input
                type='range'
                min={-0.05}
                max={0.5}
                step={0.01}
                value={wordSpacing}
                onChange={(e) => setWordSpacing(Number(e.target.value))}
                className='w-full h-1.5 bg-slate-200 rounded-full appearance-none slider cursor-pointer'
              />
            </div>
          </div>
        </section>

        {/* ── TTS ───────────────────────────────────────────── */}
        <section className='mb-6'>
          <div className='flex items-center gap-1.5 mb-3'>
            <Volume2 className='w-4 h-4 text-gray-400' />
            <h3 className='text-sm font-semibold text-(--primary)'>
              Text-to-Speech
            </h3>
          </div>
          <div className='bg-white rounded-xl border border-slate-200/60 p-4'>
            <div className='flex items-center justify-between mb-1'>
              <label className='text-xs text-slate-400'>Speed</label>
              <span className='text-xs font-medium text-(--primary)'>
                {ttsSpeed <= 0.7 ? "Slow" : ttsSpeed >= 1.3 ? "Fast" : "Normal"}
              </span>
            </div>
            <input
              type='range'
              min={0}
              max={2}
              step={1}
              value={ttsSpeed <= 0.7 ? 0 : ttsSpeed >= 1.3 ? 2 : 1}
              onChange={(e) => {
                const v = Number(e.target.value);
                setTtsSpeed(v === 0 ? 0.5 : v === 1 ? 1.0 : 1.5);
              }}
              className='w-full h-1.5 bg-slate-200 rounded-full appearance-none slider cursor-pointer'
            />
            <div className='flex justify-between text-[10px] text-slate-400 mt-1'>
              <span>Slow</span>
              <span>Normal</span>
              <span>Fast</span>
            </div>
          </div>
        </section>

        {/* ── Feature Toggles ───────────────────────────────── */}
        <section className='mb-6'>
          <div className='flex items-center gap-1.5 mb-3'>
            <Palette className='w-4 h-4 text-gray-400' />
            <h3 className='text-sm font-semibold text-(--primary)'>Features</h3>
          </div>
          <div className='space-y-1 bg-white rounded-xl border border-slate-200/60 p-4'>
            {[
              {
                label: "Auto Highlight",
                value: autoHighlight,
                set: setAutoHighlight,
                desc: "Highlight words as TTS reads",
              },
              {
                label: "Color Coding",
                value: colorCoding,
                set: setColorCoding,
                desc: "Color confusing letter pairs (b/d, p/q)",
              },
              {
                label: "Heatmap",
                value: heatmap,
                set: setHeatmap,
                desc: "Show letter difficulty heatmap",
              },
              {
                label: "Syllable Splitting",
                value: syllableSplit,
                set: setSyllableSplit,
                desc: "Break long words into syllables",
              },
            ].map(({ label, value, set, desc }) => (
              <div
                key={label}
                className='flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0'
              >
                <div>
                  <p className='text-sm text-(--primary)'>{label}</p>
                  <p className='text-[11px] text-slate-400'>{desc}</p>
                </div>
                <button
                  onClick={() => set(!value)}
                  className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
                    value ? "bg-(--honey)" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                      value ? "translate-x-[18px]" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Background ────────────────────────────────────── */}
        <section className='mb-6'>
          <div className='flex items-center gap-1.5 mb-3'>
            <Paintbrush className='w-4 h-4 text-gray-400' />
            <h3 className='text-sm font-semibold text-(--primary)'>
              Background
            </h3>
          </div>
          <div className='space-y-4 bg-white rounded-xl border border-slate-200/60 p-4'>
            {/* Background Color */}
            <div>
              <label className='text-xs text-slate-400 mb-2 block'>
                Background Color
              </label>
              <div className='flex flex-wrap gap-2'>
                {[
                  { color: "#ffffff", title: "White" },
                  { color: "#fff5ee", title: "Seashell" },
                  { color: "#f8fd98", title: "Light Yellow" },
                  { color: "#eddd63", title: "Yellow" },
                  { color: "#edd1b0", title: "Peach" },
                  { color: "#a5f7e1", title: "Turquoise" },
                ].map(({ color, title }) => (
                  <button
                    key={color}
                    onClick={() => setBackgroundColor(color)}
                    className={`w-7 h-7 rounded-lg border-2 transition-all cursor-pointer ${
                      backgroundColor === color
                        ? "border-(--honey) scale-110"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                    style={{ backgroundColor: color }}
                    title={title}
                  />
                ))}
              </div>
            </div>
            {/* Lined Texture */}
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-(--primary)'>Lined Texture</p>
                <p className='text-[11px] text-slate-400'>
                  Notebook-style ruled lines
                </p>
              </div>
              <button
                onClick={() =>
                  setBackgroundTexture(
                    backgroundTexture === "lined" ? "none" : "lined",
                  )
                }
                className={`relative w-10 h-5.5 rounded-full transition-colors cursor-pointer ${
                  backgroundTexture === "lined"
                    ? "bg-(--honey)"
                    : "bg-slate-200"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform ${
                    backgroundTexture === "lined" ? "translate-x-[18px]" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* ── Alignment ─────────────────────────────────────── */}
        <section className='mb-6'>
          <div className='flex items-center gap-1.5 mb-3'>
            <AlignLeft className='w-4 h-4 text-gray-400' />
            <h3 className='text-sm font-semibold text-(--primary)'>
              Text Alignment
            </h3>
          </div>
          <div className='flex gap-1.5 bg-white rounded-xl border border-slate-200/60 p-4'>
            {[
              { value: "left", icon: AlignLeft, label: "Left" },
              { value: "center", icon: AlignCenter, label: "Center" },
              { value: "right", icon: AlignRight, label: "Right" },
              { value: "justify", icon: AlignJustify, label: "Justify" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTextAlign(value)}
                className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  textAlign === value
                    ? "bg-(--honey)/15 text-(--primary) border border-(--honey)"
                    : "bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent"
                }`}
              >
                <Icon className='w-4 h-4' />
                {label}
              </button>
            ))}
          </div>
        </section>

        {/* ── Syllable Threshold ────────────────────────────── */}
        <section className='mb-6'>
          <div className='bg-white rounded-xl border border-slate-200/60 p-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-(--primary)'>
                  Syllable Split Min. Characters
                </p>
                <p className='text-[11px] text-slate-400'>
                  Words shorter than this won&apos;t be split
                </p>
              </div>
              <input
                type='number'
                min={4}
                max={20}
                value={syllableThreshold}
                onChange={(e) =>
                  setSyllableThreshold(
                    Math.max(4, Math.min(20, parseInt(e.target.value) || 8)),
                  )
                }
                className='w-14 p-1.5 text-sm text-center bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-(--honey)/30 focus:border-(--honey)'
              />
            </div>
          </div>
        </section>

        {/* ── Save ──────────────────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={saving}
          className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white bg-(--honey) hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50'
        >
          {saving ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Save className='w-4 h-4' />
          )}
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
