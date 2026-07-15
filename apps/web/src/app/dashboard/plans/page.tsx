'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { CheckSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useQuery, useMutation } from '@tanstack/react-query';

export default function PlansPage() {
  const { user, activeWorkspaceId } = useAuthStore();

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
  const organizations = orgsData?.data || [];
  const activeOrg = organizations.find((org: any) => org._id === activeWorkspaceId);

  const handleUpgrade = async (plan: 'PRO_PLAN' | 'BUSINESS_PLAN', amount: string) => {
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

      const fields = {
        key,
        txnid,
        amount,
        productinfo: plan,
        firstname: user?.name || 'User',
        email: user?.email || '',
        phone: '9999999999',
        surl,
        furl,
        hash,
        udf1: activeWorkspaceId
      };

      for (const [k, v] of Object.entries(fields)) {
        if (v) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = k;
          input.value = v as string;
          form.appendChild(input);
        }
      }

      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      alert('Failed to initiate payment. Please try again later.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#FFFDF5] p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12 pb-12">

        <div className="flex items-center gap-4">
          <Link href="/dashboard/settings" className="p-3 bg-white border-[3px] border-[#1A1A1A] hover:bg-[#FEF08A] hover:-translate-y-1 shadow-[4px_4px_0px_#1A1A1A] rounded-xl transition-all">
            <ArrowLeft className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2.5} />
          </Link>
          <div>
            <h1 className="text-4xl font-black text-[#1A1A1A] tracking-tight uppercase">Plans & Pricing</h1>
            <p className="text-sm font-bold text-[#1A1A1A]/60 mt-1 uppercase tracking-widest">Choose the right plan for your team's needs.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Free Tier */}
          <div className={`relative p-8 rounded-3xl border-[4px] border-[#1A1A1A] flex flex-col transition-all duration-300 ${activeOrg?.plan === 'FREE' ? 'bg-[#FEF08A] shadow-[8px_8px_0px_#1A1A1A] -translate-y-2' : 'bg-white hover:shadow-[8px_8px_0px_#1A1A1A] hover:-translate-y-1'}`}>
            {activeOrg?.plan === 'FREE' && (
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-[#BBF7D0] border-[3px] border-[#1A1A1A] rounded-xl text-sm font-black text-[#1A1A1A] transform rotate-6 shadow-[4px_4px_0px_#1A1A1A]">
                ACTIVE PLAN
              </div>
            )}
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-4">Starter</div>
              <h3 className="text-3xl font-black text-[#1A1A1A] uppercase">Free</h3>
              <div className="mt-2 mb-8 flex items-end gap-1">
                <span className="text-5xl font-black text-[#1A1A1A]">₹0</span>
                <span className="text-lg font-bold text-[#1A1A1A]/50 mb-1">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Up to 3 Projects', 'Basic Kanban Boards', 'Standard Support', '5MB File Upload Limit'].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-[#1A1A1A]">
                    <div className="w-5 h-5 rounded-md bg-[#BBF7D0] border-[2px] border-[#1A1A1A] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckSquare className="w-3 h-3 text-[#1A1A1A]" strokeWidth={3} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            {activeOrg?.plan !== 'FREE' ? (
              <button
                onClick={() => updateWorkspace.mutate({ plan: 'FREE' } as any)}
                className="w-full py-4 bg-white border-[3px] border-[#1A1A1A] rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#FEF08A] transition-colors"
              >
                Downgrade to Free
              </button>
            ) : (
              <button className="w-full py-4 bg-white/50 border-[3px] border-[#1A1A1A]/20 rounded-xl text-sm font-black uppercase tracking-wider text-[#1A1A1A]/40 cursor-not-allowed">
                Current Plan
              </button>
            )}
          </div>

          {/* Pro Tier */}
          <div className={`relative p-8 rounded-3xl border-[4px] border-[#1A1A1A] flex flex-col transition-all duration-300 ${activeOrg?.plan === 'PRO' ? 'bg-[#BAE6FD] shadow-[8px_8px_0px_#1A1A1A] -translate-y-2' : 'bg-[#FDF4FF] hover:bg-[#FCE7F3] hover:shadow-[8px_8px_0px_#1A1A1A] hover:-translate-y-1'}`}>
            {activeOrg?.plan === 'PRO' && (
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-[#FBCFE8] border-[3px] border-[#1A1A1A] rounded-xl text-sm font-black text-[#1A1A1A] transform rotate-6 shadow-[4px_4px_0px_#1A1A1A]">
                ACTIVE PLAN
              </div>
            )}
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-[#8B5CF6] text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-4">Most Popular</div>
              <h3 className="text-3xl font-black text-[#1A1A1A] uppercase">Pro</h3>
              <div className="mt-2 mb-8 flex items-end gap-1">
                <span className="text-5xl font-black text-[#1A1A1A]">₹999</span>
                <span className="text-lg font-bold text-[#1A1A1A]/50 mb-1">/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Unlimited Projects', 'Advanced Analytics', 'Priority 24/7 Support', '100MB File Upload Limit'].map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm font-bold text-[#1A1A1A]">
                    <div className="w-5 h-5 rounded-md bg-[#BAE6FD] border-[2px] border-[#1A1A1A] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckSquare className="w-3 h-3 text-[#1A1A1A]" strokeWidth={3} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            {activeOrg?.plan !== 'PRO' ? (
              <button
                onClick={() => handleUpgrade('PRO_PLAN', '999.00')}
                className="w-full py-4 bg-[#8B5CF6] text-white border-[3px] border-[#1A1A1A] rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#7C3AED] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1A1A1A] transition-all"
              >
                Upgrade to Pro
              </button>
            ) : (
              <button className="w-full py-4 bg-white/50 border-[3px] border-[#1A1A1A]/20 rounded-xl text-sm font-black uppercase tracking-wider text-[#1A1A1A]/40 cursor-not-allowed">
                Current Plan
              </button>
            )}
          </div>

          {/* Business Tier */}
          <div className={`relative p-8 rounded-3xl border-[4px] border-[#1A1A1A] flex flex-col transition-all duration-300 ${activeOrg?.plan === 'BUSINESS' ? 'bg-[#DDD6FE] shadow-[8px_8px_0px_#1A1A1A] -translate-y-2' : 'bg-[#1A1A1A] text-white hover:shadow-[8px_8px_0px_#8B5CF6] hover:-translate-y-1'}`}>
            {activeOrg?.plan === 'BUSINESS' && (
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-[#FEF08A] border-[3px] border-[#1A1A1A] rounded-xl text-sm font-black text-[#1A1A1A] transform rotate-6 shadow-[4px_4px_0px_#1A1A1A]">
                ACTIVE PLAN
              </div>
            )}
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-white text-[#1A1A1A] text-xs font-bold uppercase tracking-wider rounded-lg mb-4">Enterprise</div>
              <h3 className={`text-3xl font-black uppercase ${activeOrg?.plan === 'BUSINESS' ? 'text-[#1A1A1A]' : 'text-white'}`}>Business</h3>
              <div className="mt-2 mb-8 flex items-end gap-1">
                <span className={`text-5xl font-black ${activeOrg?.plan === 'BUSINESS' ? 'text-[#1A1A1A]' : 'text-white'}`}>₹1999</span>
                <span className={`text-lg font-bold mb-1 ${activeOrg?.plan === 'BUSINESS' ? 'text-[#1A1A1A]/50' : 'text-white/50'}`}>/mo</span>
              </div>
              <ul className="space-y-4 mb-8">
                {['Everything in Pro', 'Custom Domain', 'Dedicated Account Manager', '1GB File Upload Limit'].map((feat, i) => (
                  <li key={i} className={`flex items-start gap-3 text-sm font-bold ${activeOrg?.plan === 'BUSINESS' ? 'text-[#1A1A1A]' : 'text-white/90'}`}>
                    <div className="w-5 h-5 rounded-md bg-[#DDD6FE] border-[2px] border-[#1A1A1A] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckSquare className="w-3 h-3 text-[#1A1A1A]" strokeWidth={3} />
                    </div>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
            {activeOrg?.plan !== 'BUSINESS' ? (
              <button
                onClick={() => handleUpgrade('BUSINESS_PLAN', '1999.00')}
                className="w-full py-4 bg-white text-[#1A1A1A] border-[3px] border-[#1A1A1A] rounded-xl text-sm font-black uppercase tracking-wider hover:bg-[#FEF08A] hover:-translate-y-1 hover:shadow-[4px_4px_0px_#1A1A1A] transition-all"
              >
                Upgrade to Business
              </button>
            ) : (
              <button className="w-full py-4 bg-white/50 border-[3px] border-[#1A1A1A]/20 rounded-xl text-sm font-black uppercase tracking-wider text-[#1A1A1A]/40 cursor-not-allowed">
                Current Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
