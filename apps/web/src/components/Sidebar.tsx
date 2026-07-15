'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  Users,
  Settings,
  Activity,
  File,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, color: '#DDD6FE' },
  { name: 'Projects', href: '/dashboard/projects', icon: Folder, color: '#BAE6FD' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare, color: '#BBF7D0' },
  { name: 'Members', href: '/dashboard/members', icon: Users, color: '#FBCFE8' },
  { name: 'Files', href: '/dashboard/files', icon: File, color: '#FEF08A' },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity, color: '#FED7AA' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, color: '#DDD6FE' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 h-screen flex flex-col bg-[#FFFDF5] border-r-[3px] border-[#1A1A1A] overflow-hidden shrink-0 relative z-20">

      {/* Logo */}
      <div className="p-6 pb-4 border-b-[3px] border-[#1A1A1A]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl border-[3px] border-[#1A1A1A] bg-[#DDD6FE] flex items-center justify-center shadow-[3px_3px_0px_#1A1A1A] group-hover:-translate-y-0.5 group-hover:shadow-[4px_4px_0px_#1A1A1A] transition-all">
            <Sparkles className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1A1A1A] tracking-tight leading-none">Omnistack</h1>
            <p className="text-xs font-medium text-[#1A1A1A]/40 mt-0.5">Workspace</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="text-[10px] font-bold text-[#1A1A1A]/30 uppercase tracking-[0.15em] px-3 mb-2">Navigation</p>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl border-[3px] border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]"
                  style={{ backgroundColor: item.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group ${isActive
                    ? 'text-[#1A1A1A]'
                    : 'text-[#1A1A1A]/50 hover:text-[#1A1A1A] hover:bg-white hover:shadow-[2px_2px_0px_#1A1A1A] hover:border-[2px] hover:border-[#1A1A1A]'
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-white/70 border-[2px] border-[#1A1A1A]' : 'bg-transparent group-hover:bg-white/50'
                    }`}
                >
                  <item.icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-[#1A1A1A]' : ''}`}>
                  {item.name}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" strokeWidth={3} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="p-4 border-t-[3px] border-[#1A1A1A]">
        {/* We can hide this if they are already on Pro, but for now we'll just link it to plans page */}
        <Link href="/dashboard/plans" className="block rounded-xl border-[3px] border-[#1A1A1A] bg-[#DDD6FE] p-4 shadow-[3px_3px_0px_#1A1A1A] group hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A1A] transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-[#1A1A1A] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#DDD6FE]" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-[#1A1A1A]">Go Pro</span>
          </div>
          <p className="text-xs font-medium text-[#1A1A1A]/60 leading-snug mb-3">
            Unlock unlimited projects, members, and storage.
          </p>
          <div className="w-full py-2 rounded-lg bg-[#1A1A1A] text-[#DDD6FE] text-xs font-bold text-center tracking-wide">
            Upgrade Now ✨
          </div>
        </Link>
      </div>

      {/* User + Logout */}
      <div className="p-4 border-t-[3px] border-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border-[2px] border-[#1A1A1A] bg-[#FBCFE8] flex items-center justify-center font-black text-sm text-[#1A1A1A] uppercase shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#1A1A1A] truncate">{user?.name}</p>
            <p className="text-[10px] font-medium text-[#1A1A1A]/40 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-8 h-8 rounded-lg border-[2px] border-[#1A1A1A]/20 flex items-center justify-center text-[#1A1A1A]/40 hover:border-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </aside>
  );
}
