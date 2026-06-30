"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SIDEBAR_WIDTH_KEY = "saral_sidebar_width";
const DEFAULT_WIDTH = 256;
const MIN_WIDTH = 56;
const MAX_WIDTH = 420;
const COLLAPSED_THRESHOLD = 112;

interface ResizableSidebarProps {
  children: (props: { width: number; collapsed: boolean }) => React.ReactNode;
}

function readStoredWidth(): number {
  if (typeof window === "undefined") return DEFAULT_WIDTH;
  try {
    const raw = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    const parsed = raw ? Number.parseInt(raw, 10) : DEFAULT_WIDTH;
    if (Number.isNaN(parsed)) return DEFAULT_WIDTH;
    return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, parsed));
  } catch {
    return DEFAULT_WIDTH;
  }
}

export default function ResizableSidebar({ children }: ResizableSidebarProps) {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_WIDTH);

  useEffect(() => {
    setWidth(readStoredWidth());
  }, []);

  const collapsed = width < COLLAPSED_THRESHOLD;

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      dragStartX.current = e.clientX;
      dragStartWidth.current = width;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [width],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      const delta = e.clientX - dragStartX.current;
      const next = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, dragStartWidth.current + delta),
      );
      setWidth(next);
    },
    [isDragging],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      setWidth((current) => {
        localStorage.setItem(SIDEBAR_WIDTH_KEY, String(current));
        return current;
      });
    },
    [isDragging],
  );

  return (
    <div
      className="relative flex shrink-0 h-full"
      style={{ width }}
    >
      {children({ width, collapsed })}

      {/* Drag handle on right border */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sidebar"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className={`absolute top-0 right-0 h-full w-1.5 z-30 cursor-col-resize group touch-none ${
          isDragging ? "bg-honey/40" : "hover:bg-honey/25"
        }`}
      >
        <div
          className={`absolute top-1/2 -translate-y-1/2 right-0 w-1 h-12 rounded-full transition-colors ${
            isDragging ? "bg-honey" : "bg-[var(--darkblue)]/15 group-hover:bg-honey/70"
          }`}
        />
      </div>
    </div>
  );
}
