"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  CreditCard,
  Sun,
  Moon,
  HelpCircle,
  Mail,
  Shield,
  Bell,
  Globe,
  LogOut,
  ChevronRight,
  Pencil,
  Camera,
  Check,
} from "lucide-react";

// ── Hardcoded user data (will come from API later) ──────────────────
const userData = {
  name: "Sushant Aryal",
  email: "sushant@saral.app",
  avatar: null as string | null,
  plan: "Free",
  joinedDate: "January 2026",
  documentsCreated: 12,
  totalReadingTime: "4h 32m",
};

type ThemeOption = "light" | "dark" | "system";

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
}

function SettingItem({
  icon,
  label,
  description,
  action,
  onClick,
  danger = false,
}: SettingItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 text-left ${
        danger
          ? "hover:bg-red-50 group"
          : "hover:bg-slate-50 group cursor-pointer"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          danger ? "bg-red-50 text-red-500" : "bg-slate-100 text-slate-500"
        }`}
      >
        {icon}
      </div>
      <div className='flex-1 min-w-0'>
        <p
          className={`text-sm font-medium ${danger ? "text-red-600" : "text-(--primary)"}`}
        >
          {label}
        </p>
        {description && (
          <p className='text-xs text-slate-400 mt-0.5'>{description}</p>
        )}
      </div>
      {action || (
        <ChevronRight
          className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
            danger ? "text-red-300" : "text-slate-300"
          }`}
        />
      )}
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [theme, setTheme] = useState<ThemeOption>("light");
  const [notifications, setNotifications] = useState(true);

  return (
    <div className='min-h-[calc(100vh-80px)] bg-(--background)'>
      <div className='max-w-2xl mx-auto px-6 py-8'>
        {/* ── Profile Header ─────────────────────────────────── */}
        <div className='bg-white rounded-2xl border border-slate-200/60 shadow-sm p-6 mb-6'>
          <div className='flex items-center gap-5'>
            {/* Avatar */}
            <div className='relative group'>
              <div className='w-20 h-20 rounded-full bg-(--honey)/15 flex items-center justify-center text-(--honey) text-2xl font-bold border-2 border-(--honey)/20'>
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt='Avatar'
                    className='w-full h-full rounded-full object-cover'
                  />
                ) : (
                  userData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>
              <button
                className='absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-(--honey) transition-colors cursor-pointer'
                title='Change avatar'
              >
                <Camera className='w-3.5 h-3.5' />
              </button>
            </div>

            {/* Name & email */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center gap-2'>
                <h1 className='text-xl! font-bold! text-(--primary) truncate'>
                  {userData.name}
                </h1>
                <button
                  className='p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-(--honey) transition-colors cursor-pointer'
                  title='Edit name'
                >
                  <Pencil className='w-3.5 h-3.5' />
                </button>
              </div>
              <p className='text-sm text-slate-400 truncate'>
                {userData.email}
              </p>
              <div className='flex items-center gap-3 mt-2'>
                <span className='inline-flex items-center gap-1 text-xs font-semibold bg-(--honey)/15 text-(--honey) px-2.5 py-1 rounded-full'>
                  {userData.plan} Plan
                </span>
                <span className='text-xs text-slate-400'>
                  Joined {userData.joinedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className='grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-slate-100'>
            <div className='p-3 rounded-xl bg-slate-50/80'>
              <p className='text-lg font-bold text-(--primary)'>
                {userData.documentsCreated}
              </p>
              <p className='text-[11px] text-slate-400'>Documents Created</p>
            </div>
            <div className='p-3 rounded-xl bg-slate-50/80'>
              <p className='text-lg font-bold text-(--primary)'>
                {userData.totalReadingTime}
              </p>
              <p className='text-[11px] text-slate-400'>Total Reading Time</p>
            </div>
          </div>
        </div>

        {/* ── Subscription ──────────────────────────────────── */}
        <div className='bg-white rounded-2xl border border-slate-200/60 shadow-sm mb-6 overflow-hidden'>
          <div className='px-5 pt-4 pb-2'>
            <h2 className='text-xs! font-semibold! text-slate-400 tracking-wide uppercase'>
              Subscription
            </h2>
          </div>
          <div className='px-1 pb-1'>
            <SettingItem
              icon={<CreditCard className='w-5 h-5' />}
              label='Upgrade Plan'
              description='You are on the Free plan. Upgrade for unlimited features.'
              action={
                <span className='text-xs font-semibold text-(--honey) bg-(--honey)/10 px-3 py-1.5 rounded-lg'>
                  Upgrade
                </span>
              }
            />
            <SettingItem
              icon={<Shield className='w-5 h-5' />}
              label='Billing & Invoices'
              description='Manage payment methods and view history'
            />
          </div>
        </div>

        {/* ── Preferences ──────────────────────────────────── */}
        <div className='bg-white rounded-2xl border border-slate-200/60 shadow-sm mb-6 overflow-hidden'>
          <div className='px-5 pt-4 pb-2'>
            <h2 className='text-xs! font-semibold! text-slate-400 tracking-wide uppercase'>
              Preferences
            </h2>
          </div>
          <div className='px-1 pb-1'>
            <SettingItem
              icon={
                theme === "dark" ? (
                  <Moon className='w-5 h-5' />
                ) : (
                  <Sun className='w-5 h-5' />
                )
              }
              label='Theme'
              description={`Currently: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
              action={
                <div className='flex items-center gap-1 bg-slate-100 rounded-lg p-0.5'>
                  {(["light", "dark", "system"] as ThemeOption[]).map((t) => (
                    <button
                      key={t}
                      onClick={(e) => {
                        e.stopPropagation();
                        setTheme(t);
                      }}
                      className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer ${
                        theme === t
                          ? "bg-white text-(--primary) shadow-sm"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                  ))}
                </div>
              }
            />
            <SettingItem
              icon={<Bell className='w-5 h-5' />}
              label='Notifications'
              description='Email & in-app notifications'
              action={
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setNotifications(!notifications);
                  }}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                    notifications ? "bg-(--honey)" : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      notifications ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              }
            />
            <SettingItem
              icon={<Globe className='w-5 h-5' />}
              label='Language'
              description='English (United States)'
            />
          </div>
        </div>

        {/* ── Support ──────────────────────────────────────── */}
        <div className='bg-white rounded-2xl border border-slate-200/60 shadow-sm mb-6 overflow-hidden'>
          <div className='px-5 pt-4 pb-2'>
            <h2 className='text-xs! font-semibold! text-slate-400 tracking-wide uppercase'>
              Support
            </h2>
          </div>
          <div className='px-1 pb-1'>
            <SettingItem
              icon={<HelpCircle className='w-5 h-5' />}
              label='Help Center'
              description='FAQs, guides, and tutorials'
            />
            <SettingItem
              icon={<Mail className='w-5 h-5' />}
              label='Contact Support'
              description='Get help from our team'
            />
            <SettingItem
              icon={
                <svg
                  viewBox='0 0 24 24'
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'
                >
                  <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' />
                </svg>
              }
              label='Send Feedback'
              description='Help us improve SARAL'
            />
          </div>
        </div>

        {/* ── Account ──────────────────────────────────────── */}
        <div className='bg-white rounded-2xl border border-slate-200/60 shadow-sm mb-8 overflow-hidden'>
          <div className='px-5 pt-4 pb-2'>
            <h2 className='text-xs! font-semibold! text-slate-400 tracking-wide uppercase'>
              Account
            </h2>
          </div>
          <div className='px-1 pb-1'>
            <SettingItem
              icon={<User className='w-5 h-5' />}
              label='Edit Profile'
              description='Update your personal information'
            />
            <SettingItem
              icon={<LogOut className='w-5 h-5' />}
              label='Sign Out'
              description='Sign out of your account'
              danger
            />
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────── */}
        <div className='text-center pb-8'>
          <p className='text-[11px] text-slate-300'>
            SARAL v1.0.0 &middot; Made with care for accessible reading
          </p>
        </div>
      </div>
    </div>
  );
}
