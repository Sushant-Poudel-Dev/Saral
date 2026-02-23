"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { HelpCircle, X } from "lucide-react";

interface HelpTooltipProps {
  text: string;
}

export default function HelpTooltip({ text }: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setIsOpen(false), []);

  const recalc = useCallback(() => {
    if (!btnRef.current) return;
    const r = btnRef.current.getBoundingClientRect();
    setCoords({ x: r.left + r.width / 2, y: r.top });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      )
        close();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", recalc, true);
    window.addEventListener("resize", recalc);
    return () => {
      window.removeEventListener("scroll", recalc, true);
      window.removeEventListener("resize", recalc);
    };
  }, [isOpen, recalc]);

  return (
    <span className='inline-flex items-center'>
      <button
        ref={btnRef}
        type='button'
        onClick={(e) => {
          e.stopPropagation();
          if (!isOpen) recalc();
          setIsOpen((v) => !v);
        }}
        className='w-4 h-4 rounded-full inline-flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 shrink-0'
        aria-label='Help'
      >
        <HelpCircle className='w-3.5 h-3.5' />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={tooltipRef}
            style={{
              position: "fixed",
              top: coords.y - 6,
              left: coords.x,
              transform: "translate(-50%, -100%)",
              zIndex: 99999,
              width: 280,
            }}
            className='bg-white border border-slate-200 rounded-md shadow-lg px-3 py-1.5'
          >
            <div className='flex items-start justify-between gap-2'>
              <p
                style={{ fontSize: "12px", lineHeight: 1.35 }}
                className='text-slate-500'
              >
                {text}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  close();
                }}
                className='shrink-0 p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mt-px'
              >
                <X className='w-2.5 h-2.5' />
              </button>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -3,
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: 6,
                height: 6,
                background: "white",
                borderRight: "1px solid #e2e8f0",
                borderBottom: "1px solid #e2e8f0",
              }}
            />
          </div>,
          document.body,
        )}
    </span>
  );
}
