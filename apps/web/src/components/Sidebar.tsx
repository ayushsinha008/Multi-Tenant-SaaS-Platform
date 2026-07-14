'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Folder, Users, Settings, Activity } from 'lucide-react';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: Folder },
  { name: 'Tasks', href: '/dashboard/tasks', icon: CheckSquare },
  { name: 'Members', href: '/dashboard/members', icon: Users },
  { name: 'Files', href: '/dashboard/files', icon: Folder },
  { name: 'Activity', href: '/dashboard/activity', icon: Activity },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-[calc(100vh-32px)] my-4 ml-4 hidden md:flex flex-col bg-[#111827] rounded-2xl border border-white/10 shadow-2xl shadow-black/50 overflow-hidden relative z-20 shrink-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center">
          <span className="text-white font-bold text-sm">O</span>
        </div>
        <span className="text-white font-semibold text-lg tracking-tight">Omnistack</span>
      </div>

      <div className="px-4 py-2 flex-1 overflow-y-auto space-y-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href} className="relative block">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto">
        <div className="p-4 rounded-xl bg-gradient-to-tr from-[#6D28D9]/20 to-[#8B5CF6]/20 border border-indigo-500/20">
          <h4 className="text-sm font-medium text-white mb-1">Upgrade to Pro</h4>
          <p className="text-xs text-indigo-200 mb-3">Get unlimited projects and team members.</p>
          <button className="w-full py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
