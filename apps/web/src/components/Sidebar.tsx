'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/useAuthStore';
import {
  LayoutDashboard,
  CheckSquare,
  Folder,
  Users,
  Settings,
  Activity,
  File,
  Sparkles,
  Layers,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, color: 'var(--lavender)' },
  { name: 'Projects', href: '/dashboard/projects', icon: Folder, color: 'var(--sky)' },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare, color: 'var(--mint)' },
  { name: 'Members', href: '/dashboard/members', icon: Users, color: 'var(--pink-pastel)' },
  { name: 'Files', href: '/dashboard/files', icon: File, color: 'var(--yellow-pastel)' },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity, color: 'var(--orange-pastel)' },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, color: 'var(--lavender)' },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <aside className="w-72 h-screen flex flex-col bg-cream border-r-[3px] border-ink overflow-hidden shrink-0 relative z-20">

      {/* Logo */}
      <div className="p-6 pb-4 border-b-[3px] border-ink">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl border-[3px] border-ink bg-lavender flex items-center justify-center shadow-neo-sm group-hover:-translate-y-0.5 group-hover:shadow-neo-md transition-all">
            <Layers className="w-5 h-5 text-ink" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-ink tracking-tight leading-none">Omnistack</h1>
            <p className="text-xs font-medium text-ink/40 mt-0.5">Workspace</p>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="text-[10px] font-bold text-ink/30 uppercase tracking-[0.15em] px-3 mb-2">Navigation</p>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} className="block relative">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl border-[3px] border-ink shadow-neo-sm"
                  style={{ backgroundColor: item.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
              <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 group ${isActive
                    ? 'text-ink'
                    : 'text-ink/50 hover:text-ink hover:bg-white hover:shadow-neo-xs hover:border-[2px] hover:border-ink'
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-white/70 border-[2px] border-ink' : 'bg-transparent group-hover:bg-white/50'
                    }`}
                >
                  <item.icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-sm font-bold tracking-tight ${isActive ? 'text-ink' : ''}`}>
                  {item.name}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-40" strokeWidth={3} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="p-4 border-t-[3px] border-ink">
        {/* We can hide this if they are already on Pro, but for now we'll just link it to plans page */}
        <Link href="/dashboard/plans" className="block rounded-xl border-[3px] border-ink bg-lavender p-4 shadow-neo-sm group hover:-translate-y-0.5 hover:shadow-neo-md transition-all cursor-pointer">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-ink flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-lavender" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-ink">Go Pro</span>
          </div>
          <p className="text-xs font-medium text-ink/60 leading-snug mb-3">
            Unlock unlimited projects, members, and storage.
          </p>
          <div className="w-full py-2 rounded-lg bg-ink text-lavender text-xs font-bold text-center tracking-wide">
            Upgrade Now ✨
          </div>
        </Link>
      </div>


    </aside>
  );
}
