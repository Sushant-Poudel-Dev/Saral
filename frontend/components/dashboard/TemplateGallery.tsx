"use client";

import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight } from "lucide-react";
import { STUDIO_TEMPLATES, type StudioTemplate } from "@/constants/studioTemplates";
import { setPendingTemplate } from "@/services/trackingService";

interface TemplateGalleryProps {
  compact?: boolean;
  onExplore?: () => void;
}

function TemplateCard({
  template,
  onApply,
}: {
  template: StudioTemplate;
  onApply: (template: StudioTemplate) => void;
}) {
  const isDark =
    template.previewBg.startsWith("#0") || template.previewBg.startsWith("#1");

  return (
    <button
      type="button"
      onClick={() => onApply(template)}
      className="group text-left bg-white rounded-2xl border border-[var(--darkblue)]/10 hover:border-honey hover:shadow-md transition-all cursor-pointer overflow-hidden flex flex-col"
    >
      <div
        className="h-28 px-4 py-3 flex items-end border-b border-[var(--darkblue)]/5"
        style={{ backgroundColor: template.previewBg }}
      >
        <p
          className={`text-lg font-semibold truncate ${
            isDark ? "text-white" : "text-[var(--darkblue)]"
          }`}
          style={{ fontFamily: template.previewFont }}
        >
          {template.previewText}
        </p>
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-[var(--darkblue)] group-hover:text-amber-700 transition-colors">
            {template.name}
          </h3>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-[var(--darkblue)]/45 shrink-0">
            {template.category}
          </span>
        </div>
        <p className="text-xs text-[var(--darkblue)]/60 leading-relaxed line-clamp-2 mb-3">
          {template.description}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {template.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--background)] text-[var(--darkblue)]/70 border border-[var(--darkblue)]/10"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-honey opacity-0 group-hover:opacity-100 transition-opacity">
          Apply in Studio
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </button>
  );
}

export default function TemplateGallery({
  compact = false,
  onExplore,
}: TemplateGalleryProps) {
  const router = useRouter();

  const applyTemplate = (template: StudioTemplate) => {
    setPendingTemplate(template.settings);
    router.push("/feature");
  };

  if (compact) {
    return (
      <div className="bg-[var(--darkblue)] rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
        <div className="max-w-xl z-10 relative">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/15 text-white px-2.5 py-1 rounded-full border border-white/20">
            Accessibility Templates
          </span>
          <h3 className="text-lg font-bold mt-2">
            Pre-built Studio reading profiles
          </h3>
          <p className="text-xs text-white/80 mt-1 leading-relaxed">
            Dyslexia-friendly fonts, high-contrast themes, audio learning modes,
            and more — apply instantly in the editor.
          </p>
          <button
            onClick={onExplore}
            className="mt-4 px-4 py-2 bg-white text-[var(--darkblue)] rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer shadow-sm inline-flex items-center gap-2"
          >
            Explore Templates
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <Sparkles className="absolute right-6 bottom-4 w-32 h-32 text-white/5 pointer-events-none" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-[var(--darkblue)]/60 max-w-2xl">
          Pick a preset to open Studio with typography, display, and audio
          settings already configured. Click any card to apply it directly in
          the editor.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {STUDIO_TEMPLATES.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onApply={applyTemplate}
          />
        ))}
      </div>
    </div>
  );
}
