"use client";

import { useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";

/**
 * Tracks user session time in the database.
 * Creates a session row on mount, updates ended_at on unmount / tab close.
 */
export function useSessionTracker() {
  const { user } = useAuth();
  const sessionIdRef = useRef<string | null>(null);
  const supabase = createClient();

  const endSession = useCallback(async () => {
    if (!sessionIdRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = supabase.from("user_sessions") as any;
    await query
      .update({ ended_at: new Date().toISOString() })
      .eq("id", sessionIdRef.current);

    sessionIdRef.current = null;
  }, [supabase]);

  useEffect(() => {
    if (!user) return;

    // Start a new session
    const startSession = async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const query = supabase.from("user_sessions") as any;
      const { data } = await query
        .insert({ user_id: user.id })
        .select("id")
        .single();

      if (data) {
        sessionIdRef.current = data.id;
      }
    };

    startSession();

    // End session on tab close / navigation
    const handleBeforeUnload = () => {
      if (!sessionIdRef.current) return;
      // Use sendBeacon for reliability on page unload
      const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/user_sessions?id=eq.${sessionIdRef.current}`;
      const body = JSON.stringify({ ended_at: new Date().toISOString() });
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
    };

    // Also handle visibility change (mobile tab switching)
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        endSession();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      endSession();
    };
  }, [user, supabase, endSession]);
}
