'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Layout, Zap, Shield, Users, Sparkles, Folder, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-[#1A1A1A] selection:bg-[#DDD6FE] selection:text-[#1A1A1A] pb-16">
      
      {/* ─── Navigation ────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 w-full z-50 bg-[#FFFDF5]/90 backdrop-blur-md border-b-[3px] border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-lg flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DDD6FE] border-[2px] border-[#1A1A1A] flex items-center justify-center shadow-[2px_2px_0px_#1A1A1A]">
              <Sparkles className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-[#1A1A1A]">ReadyNest</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-[#1A1A1A] hover:underline">Sign in</Link>
            <Link href="/register">
              <Button size="sm" variant="primary">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ──────────────────────────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-[20%] left-[-5%] w-48 h-48 rounded-full border-[3px] border-[#1A1A1A] bg-[#BAE6FD] opacity-20 pointer-events-none -rotate-12" />
        <div className="absolute bottom-[10%] right-[-5%] w-64 h-64 rounded-3xl border-[3px] border-[#1A1A1A] bg-[#FBCFE8] opacity-20 pointer-events-none rotate-12" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-[2px] border-[#1A1A1A] bg-[#FEF08A] text-xs font-bold shadow-[2px_2px_0px_#1A1A1A]">
            <Sparkles className="w-3.5 h-3.5" strokeWidth={2.5} />
            Neo Brutalist Workspace v2.0 is Live
          </motion.div>
          
          <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-4xl md:text-6xl font-bold tracking-tight text-[#1A1A1A] leading-none">
            The playful workspace for <br/>
            <span className="underline decoration-[#DDD6FE] decoration-8 underline-offset-4">
              modern product teams
            </span>
          </motion.h1>
          
          <motion.p initial="hidden" animate="visible" variants={fadeIn} className="text-lg md:text-xl font-medium text-[#1A1A1A]/60 max-w-2xl mx-auto leading-relaxed">
            Bring your organization's projects, tasks, files, and updates together in one beautifully handcrafted dashboard.
          </motion.p>
          
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" variant="primary" className="w-full sm:w-auto">
                Start for free <ArrowRight className="ml-2 w-4 h-4" strokeWidth={3} />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explore Dashboard
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white border-y-[3px] border-[#1A1A1A] relative z-10 shadow-[0_8px_0_0_rgba(26,26,26,0.02)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Everything you need to ship faster</h2>
            <p className="text-base font-medium text-[#1A1A1A]/40 max-w-xl mx-auto">Designed with attention to performance, isolation, and collaboration.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Layout, title: "Kanban & Lists", desc: "Organize your workflow cleanly with real-time drag-and-drop boards.", color: '#BAE6FD' },
              { icon: Users, title: "Multi-Tenant Isolation", desc: "Solid data separation. Your data stays within your organization node.", color: '#DDD6FE' },
              { icon: Zap, title: "Real-time updates", desc: "Updates presence and activity feed automatically with zero refresh.", color: '#BBF7D0' },
              { icon: Shield, title: "Role Permissions", desc: "Assign custom operational roles: Owners, Admins, and Members.", color: '#FBCFE8' },
              { icon: CheckCircle2, title: "Activity Audit Logs", desc: "Audit logs document changes for complete operations visibility.", color: '#FEF08A' },
              { icon: Sparkles, title: "Lovely UI", desc: "A colorful Neo Brutalist system that makes daily coordination fun.", color: '#FED7AA' },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-2xl border-[3px] border-[#1A1A1A] bg-[#FFFDF5] p-6 shadow-[3px_3px_0px_#1A1A1A] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#1A1A1A] transition-all"
              >
                <div
                  className="w-11 h-11 rounded-xl border-[2px] border-[#1A1A1A] flex items-center justify-center mb-4 shadow-[2px_2px_0px_#1A1A1A]"
                  style={{ backgroundColor: feature.color }}
                >
                  <feature.icon className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] mb-2">{feature.title}</h3>
                <p className="text-sm font-medium text-[#1A1A1A]/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Simple, transparent pricing</h2>
            <p className="text-base font-medium text-[#1A1A1A]/40 max-w-xl mx-auto">Start free, upgrade as your team grows.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto items-stretch">
            {/* Free */}
            <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-8 flex flex-col justify-between shadow-[4px_4px_0px_#1A1A1A] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#1A1A1A] transition-all">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1A1A1A]">Starter</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">$0</span>
                  <span className="text-xs font-semibold text-[#1A1A1A]/40 uppercase">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm font-semibold text-[#1A1A1A]/60 pt-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={3} /> Up to 5 members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={3} /> 3 Projects limit</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={3} /> Basic ticket support</li>
                </ul>
              </div>
              <Link href="/register" className="block mt-8">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-[#DDD6FE] p-8 flex flex-col justify-between shadow-[6px_6px_0px_#1A1A1A] hover:-translate-y-1 hover:shadow-[8px_8px_0px_#1A1A1A] transition-all relative transform md:-translate-y-2">
              <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#1A1A1A] text-white text-[9px] font-bold rounded-full uppercase tracking-wider">
                Popular
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1A1A1A]">Professional</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">$29</span>
                  <span className="text-xs font-semibold text-[#1A1A1A]/40 uppercase">/month</span>
                </div>
                <ul className="space-y-3.5 text-sm font-semibold text-[#1A1A1A]/70 pt-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} /> Unlimited members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} /> Unlimited Projects</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} /> 100GB secure storage</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} /> Priority direct support</li>
                </ul>
              </div>
              <Link href="/register" className="block mt-8">
                <Button variant="default" className="w-full bg-[#1A1A1A] text-white">Start Free Trial</Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-8 flex flex-col justify-between shadow-[4px_4px_0px_#1A1A1A] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#1A1A1A] transition-all">
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#1A1A1A]">Enterprise</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-[#1A1A1A] tracking-tight">Custom</span>
                </div>
                <ul className="space-y-3.5 text-sm font-semibold text-[#1A1A1A]/60 pt-4">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={3} /> Custom seat parameters</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={3} /> Advanced security logs</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={3} /> Dedicated success manager</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" strokeWidth={3} /> Single Sign-On (SSO)</li>
                </ul>
              </div>
              <Link href="mailto:sales@readynest.com" className="block mt-8">
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer className="max-w-7xl mx-auto px-6 pt-12 border-t-[3px] border-[#1A1A1A]/10 flex justify-center items-center gap-4 text-sm font-medium text-[#1A1A1A]/40">
        <div>© 2026 Built by Ayush.</div>
      </footer>
    </div>
  );
}
