"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, UserSettings, Subscription } from "@/types/database";

// ── Types ───────────────────────────────────────────────────────────────────

interface UserStats {
  total_documents: number;
  favorite_documents: number;
  total_downloads: number;
  total_audio_exports: number;
  total_images_scanned: number;
  total_time_seconds: number;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  settings: UserSettings | null;
  subscription: Subscription | null;
  stats: UserStats | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  settings: null,
  subscription: null,
  stats: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
  refreshSettings: async () => {},
  refreshStats: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// ── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Fetch helpers ─────────────────────────────────────────────────────

  const fetchProfile = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      setProfile(data);
    },
    [supabase],
  );

  const fetchSettings = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .single();
      setSettings(data);
    },
    [supabase],
  );

  const fetchSubscription = useCallback(
    async (userId: string) => {
      const { data } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();
      setSubscription(data);
    },
    [supabase],
  );

  const fetchStats = useCallback(
    async (userId: string) => {
      // user_stats is a view — use untyped query
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase as any)
        .from("user_stats")
        .select("*")
        .eq("user_id", userId)
        .single();
      if (data) {
        setStats({
          total_documents: Number(data.total_documents) || 0,
          favorite_documents: Number(data.favorite_documents) || 0,
          total_downloads: Number(data.total_downloads) || 0,
          total_audio_exports: Number(data.total_audio_exports) || 0,
          total_images_scanned: Number(data.total_images_scanned) || 0,
          total_time_seconds: Number(data.total_time_seconds) || 0,
        });
      }
    },
    [supabase],
  );

  const loadUserData = useCallback(
    async (userId: string) => {
      await Promise.all([
        fetchProfile(userId),
        fetchSettings(userId),
        fetchSubscription(userId),
        fetchStats(userId),
      ]);
    },
    [fetchProfile, fetchSettings, fetchSubscription, fetchStats],
  );

  // ── Auth state listener ───────────────────────────────────────────────

  useEffect(() => {
    // Get initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        loadUserData(user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        loadUserData(currentUser.id);
      } else {
        setProfile(null);
        setSettings(null);
        setSubscription(null);
        setStats(null);
      }
    });

    return () => authSub.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ───────────────────────────────────────────────────────────

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSettings(null);
    setSubscription(null);
    setStats(null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  const refreshSettings = useCallback(async () => {
    if (user) await fetchSettings(user.id);
  }, [user, fetchSettings]);

  const refreshStats = useCallback(async () => {
    if (user) await fetchStats(user.id);
  }, [user, fetchStats]);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        settings,
        subscription,
        stats,
        isLoading,
        signOut,
        refreshProfile,
        refreshSettings,
        refreshStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
