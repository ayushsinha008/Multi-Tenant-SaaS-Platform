'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Check, ArrowLeft, Zap, Crown, Sparkles, Star } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useState } from 'react';

export default function PlansPage() {
  const { user, activeWorkspaceId } = useAuthStore();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const updateWorkspace = useMutation({
    mutationFn: async (data: { plan: string }) => {
      const res = await api.patch(`/organizations/${activeWorkspaceId}`, data);
      return res.data;
    }
  });

  const { data: orgsData } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => api.get('/organizations'),
  });
  const organizations = orgsData?.data?.organizations || orgsData?.data || [];
  const activeOrg = organizations.find((org: any) => org._id === activeWorkspaceId);

  const handleUpgrade = async (plan: 'PRO_PLAN' | 'BUSINESS_PLAN', amount: string) => {
    setLoadingPlan(plan);
    try {
      const res = await api.post('/payment/payu/hash', {
        amount,
        productinfo: plan,
        firstname: user?.name || 'User',
        email: user?.email || '',
        phone: '9999999999',
        udf1: activeWorkspaceId
      });

      const { key, txnid, hash, surl, furl } = res.data;
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://test.payu.in/_payment';
      const fields = { key, txnid, amount, productinfo: plan, firstname: user?.name || 'User', email: user?.email || '', phone: '9999999999', surl, furl, hash, udf1: activeWorkspaceId };
      for (const [k, v] of Object.entries(fields)) {
        if (v) { const input = document.createElement('input'); input.type = 'hidden'; input.name = k; input.value = v as string; form.appendChild(input); }
      }
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      alert('Failed to initiate payment. Please try again later.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const plans = [
    {
      id: 'FREE',
      name: 'Starter',
      price: '₹0',
      period: '/month',
      description: 'Perfect for individuals getting started',
      icon: Star,
      badge: null,
      color: 'from-slate-50 to-gray-100',
      accentColor: '#6B7280',
      badgeBg: 'bg-gray-100',
      badgeText: 'text-gray-600',
      borderColor: 'border-gray-200',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-500',
      features: ['Up to 3 Projects', 'Basic Kanban Boards', '5 MB File Upload Limit', 'Standard Support', 'Core Dashboard'],
      cta: 'Get Started Free',
      ctaStyle: 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50',
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: '₹999',
      period: '/month',
      description: 'For growing teams that need more power',
      icon: Zap,
      badge: 'Most Popular',
      color: 'from-violet-600 to-purple-700',
      accentColor: '#7C3AED',
      badgeBg: 'bg-yellow-400',
      badgeText: 'text-gray-900',
      borderColor: 'border-violet-500',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      features: ['Unlimited Projects', 'Advanced Analytics', '100 MB File Upload Limit', 'Priority 24/7 Support', 'Team Collaboration'],
      cta: 'Upgrade to Pro',
      ctaStyle: 'bg-white text-violet-700 font-bold hover:bg-violet-50',
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      price: '₹1,999',
      period: '/month',
      description: 'For enterprises that demand the best',
      icon: Crown,
      badge: 'Enterprise',
      color: 'from-amber-500 to-orange-600',
      accentColor: '#D97706',
      badgeBg: 'bg-white/20',
      badgeText: 'text-white',
      borderColor: 'border-amber-400',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      features: ['Everything in Pro', 'Custom Domain', '1 GB File Upload Limit', 'Dedicated Account Manager', 'White-label Options'],
      cta: 'Upgrade to Business',
      ctaStyle: 'bg-white text-amber-700 font-bold hover:bg-amber-50',
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] overflow-y-auto">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-amber-100 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-10 pb-20">

        {/* Header */}
        <div className="mb-12">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Settings
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-violet-100 rounded-full text-xs font-bold text-violet-700 uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Simple, Transparent Pricing
            </div>
            <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-3">
              Choose Your Plan
            </h1>
            <p className="text-lg text-gray-500 font-medium">
              Scale up as your team grows. Downgrade or cancel anytime.
            </p>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => {
            const isActive = activeOrg?.plan === plan.id;
            const Icon = plan.icon;
            const isPro = plan.id === 'PRO';
            const isBusiness = plan.id === 'BUSINESS';
            const isGradient = isPro || isBusiness;

            return (
              <div
                key={plan.id}
                className={`relative flex flex-col rounded-3xl overflow-hidden transition-all duration-300 ${
                  isGradient
                    ? 'shadow-2xl hover:shadow-3xl hover:-translate-y-1'
                    : 'shadow-md hover:shadow-xl border border-gray-200 hover:-translate-y-1 bg-white'
                }`}
              >
                {/* Active badge */}
                {isActive && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${isGradient ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'} border ${isGradient ? 'border-white/30' : 'border-green-200'}`}>
                      ✓ Current
                    </span>
                  </div>
                )}

                {/* Gradient header for Pro & Business */}
                {isGradient ? (
                  <div className={`bg-gradient-to-br ${plan.color} p-8 text-white`}>
                    {plan.badge && (
                      <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-5 ${plan.badgeBg} ${plan.badgeText}`}>
                        {isPro && <Zap className="w-3 h-3" />}
                        {isBusiness && <Crown className="w-3 h-3" />}
                        {plan.badge}
                      </div>
                    )}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.iconBg}`}>
                      <Icon className={`w-6 h-6 ${plan.iconColor}`} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1">{plan.name}</h2>
                    <p className="text-sm text-white/70 mb-5">{plan.description}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-black text-white">{plan.price}</span>
                      <span className="text-white/60 font-medium pb-1.5">{plan.period}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${plan.iconBg}`}>
                      <Icon className={`w-6 h-6 ${plan.iconColor}`} strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-1">{plan.name}</h2>
                    <p className="text-sm text-gray-500 mb-5">{plan.description}</p>
                    <div className="flex items-end gap-1">
                      <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                      <span className="text-gray-400 font-medium pb-1.5">{plan.period}</span>
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className={`flex-1 p-8 flex flex-col ${isGradient ? 'bg-white' : ''}`}>
                  <ul className="space-y-3.5 flex-1 mb-8">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isPro ? 'bg-violet-100' : isBusiness ? 'bg-amber-100' : 'bg-gray-100'
                        }`}>
                          <Check className={`w-3 h-3 font-bold ${
                            isPro ? 'text-violet-600' : isBusiness ? 'text-amber-600' : 'text-gray-500'
                          }`} strokeWidth={3} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  {isActive ? (
                    <div className={`w-full py-3.5 rounded-2xl text-center text-sm font-bold cursor-default ${
                      isGradient
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-gray-50 text-gray-400 border border-gray-200'
                    }`}>
                      Your Current Plan
                    </div>
                  ) : plan.id === 'FREE' ? (
                    <button
                      onClick={() => updateWorkspace.mutate({ plan: 'FREE' })}
                      className={`w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${plan.ctaStyle}`}
                    >
                      {plan.cta}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(
                        plan.id === 'PRO' ? 'PRO_PLAN' : 'BUSINESS_PLAN',
                        plan.id === 'PRO' ? '999.00' : '1999.00'
                      )}
                      disabled={loadingPlan === (plan.id === 'PRO' ? 'PRO_PLAN' : 'BUSINESS_PLAN')}
                      className={`w-full py-3.5 rounded-2xl text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed ${plan.ctaStyle} ${
                        isPro ? 'shadow-violet-200' : 'shadow-amber-200'
                      }`}
                    >
                      {loadingPlan === (plan.id === 'PRO' ? 'PRO_PLAN' : 'BUSINESS_PLAN')
                        ? 'Redirecting...'
                        : plan.cta}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className="text-center text-sm text-gray-400 mt-10 font-medium">
          All plans include a 7-day free trial. No credit card required to start. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
