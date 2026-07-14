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
    <aside className="w-72 h-screen flex flex-col bg-black border-r-[4px] border-black overflow-hidden relative z-20 shrink-0">
      <div className="p-8 flex items-center gap-4 bg-[#00FF4C] border-b-[4px] border-black">
        <div className="w-12 h-12 bg-black flex items-center justify-center">
          <span className="text-[#00FF4C] font-black text-2xl uppercase">O</span>
        </div>
        <span className="text-black font-black text-3xl uppercase tracking-tighter">Omnistack</span>
      </div>

      <div className="py-6 flex-1 overflow-y-auto flex flex-col gap-1">
        <div className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4 px-8">Menu</div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link key={item.name} href={item.href} className="relative block group">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-y-0 left-0 right-4 bg-[#00FF4C] border-[3px] border-black border-l-0 shadow-[4px_4px_0_0_#000000]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className={`relative flex items-center gap-4 px-8 py-4 transition-colors ${isActive ? 'text-black' : 'text-white hover:bg-white/10'}`}>
                <item.icon className="w-7 h-7" strokeWidth={2.5} />
                <span className="font-black text-lg uppercase tracking-wider">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-auto border-t-[4px] border-black bg-white">
        <div className="p-6">
          <h4 className="text-2xl font-black text-black uppercase tracking-tighter mb-2">Pro Max</h4>
          <p className="text-sm font-bold text-black/70 mb-4 uppercase leading-tight">Unlimited power.<br/>Zero limits.</p>
          <button className="w-full py-4 bg-black text-[#00FF4C] font-black uppercase tracking-widest border-[3px] border-black hover:bg-[#00FF4C] hover:text-black transition-colors shadow-[4px_4px_0_0_#000000] hover:shadow-none hover:translate-x-1 hover:translate-y-1">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}
