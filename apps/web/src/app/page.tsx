'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Layout, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';

export default function Home() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-50 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6D28D9] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-white font-bold text-sm">O</span>
            </div>
            Omnistack
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition">Sign in</Link>
            <Link href="/register">
              <Button className="bg-[#6D28D9] hover:bg-[#7C3AED] text-white border-0 shadow-lg shadow-indigo-900/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#6D28D9]/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
            v2.0 is now live
          </motion.div>
          
          <motion.h1 initial="hidden" animate="visible" variants={fadeIn} className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            The workspace for <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              modern product teams
            </span>
          </motion.h1>
          
          <motion.p initial="hidden" animate="visible" variants={fadeIn} className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
            Bring your organization's projects, tasks, files, and communication together in one unified, blazingly fast platform.
          </motion.p>
          
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-14 px-8 text-lg bg-[#6D28D9] hover:bg-[#7C3AED] text-white border-0 shadow-lg shadow-indigo-900/20 w-full sm:w-auto">
                Start for free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg bg-white/5 border-white/10 hover:bg-white/10 text-white w-full sm:w-auto">
                Book a demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-black/20 border-y border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to ship faster</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Designed with extreme attention to detail, performance, and collaboration.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Layout, title: "Kanban & Lists", desc: "Organize your workflow perfectly with real-time syncing boards." },
              { icon: Users, title: "Multi-Tenant Isolation", desc: "Enterprise-grade data separation. Your data never touches another organization's." },
              { icon: Zap, title: "Real-time Engine", desc: "Built on WebSockets for instant updates, typing indicators, and presence." },
              { icon: Shield, title: "Role-Based Access", desc: "Fine-grained permissions for Owners, Admins, Members, and Viewers." },
              { icon: CheckCircle2, title: "Activity Audit Logs", desc: "Track every action, login, and change for compliance and transparency." },
              { icon: ArrowRight, title: "Extensible APIs", desc: "Connect your custom tools via our thoroughly documented REST endpoints." },
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="bg-[#111827] border-white/10 hover:border-indigo-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Start for free, upgrade when you need more power.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free */}
            <Card className="bg-[#111827] border-white/10 flex flex-col">
              <CardContent className="p-8 flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$0</span>
                  <span className="text-slate-400">/mo</span>
                </div>
                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Up to 5 members</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> 3 Projects</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Basic Support</li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white mt-auto">Get Started</Button>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="bg-gradient-to-b from-[#6D28D9]/20 to-[#111827] border-indigo-500/30 flex flex-col relative transform md:-translate-y-4 shadow-2xl shadow-indigo-900/20">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl" />
              <CardContent className="p-8 flex-1">
                <div className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-semibold rounded-full mb-4">MOST POPULAR</div>
                <h3 className="text-xl font-bold text-white mb-2">Professional</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$29</span>
                  <span className="text-slate-400">/mo per user</span>
                </div>
                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Unlimited members</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Unlimited Projects</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> 100GB Storage</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Priority Support</li>
                </ul>
                <Button className="w-full bg-[#6D28D9] hover:bg-[#7C3AED] text-white mt-auto">Start Free Trial</Button>
              </CardContent>
            </Card>

            {/* Enterprise */}
            <Card className="bg-[#111827] border-white/10 flex flex-col">
              <CardContent className="p-8 flex-1">
                <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">Custom</span>
                </div>
                <ul className="space-y-4 mb-8 text-sm text-slate-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Custom limits</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Advanced Security</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Dedicated Success Manager</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400"/> Single Sign-On (SSO)</li>
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white mt-auto">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6 relative z-10 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400 text-sm">
            © 2026 Omnistack. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <Link href="#" className="hover:text-white transition">Twitter</Link>
            <Link href="#" className="hover:text-white transition">GitHub</Link>
            <Link href="#" className="hover:text-white transition">Terms</Link>
            <Link href="#" className="hover:text-white transition">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
