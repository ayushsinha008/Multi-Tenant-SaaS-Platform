'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Shield, Building2, Bell, CreditCard, User, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';

export default function SettingsPage() {
  const { user, setUser, activeWorkspaceId, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.patch('/auth/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    }
  });

  const { data: organizations = [] } = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await api.get('/organizations');
      return res.data.organizations || [];
    }
  });

  const activeOrg = organizations.find((org: any) => org._id === activeWorkspaceId);

  const updateWorkspace = useMutation({
    mutationFn: async (data: { name: string }) => {
      const res = await api.patch(`/organizations/${activeWorkspaceId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    }
  });

  return (
    <div className="space-y-12 pb-12">
      <div className="flex flex-col border-b-[4px] border-black pb-8">
        <h1 className="text-7xl font-black tracking-tighter text-black uppercase leading-none">
          System<br/><span className="text-white" style={{ WebkitTextStroke: '3px black' }}>Configuration</span>
        </h1>
        <p className="text-xl font-bold text-black/70 mt-4 uppercase">Manage your workspace and account protocols.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'workspace', label: 'Workspace', icon: Building2 },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'billing', label: 'Billing', icon: CreditCard },
          ].map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 font-black uppercase tracking-tighter text-xl transition-colors border-[4px] border-black ${activeTab === tab.id ? 'bg-[#00FF4C] text-black shadow-[6px_6px_0_0_#000000] -translate-y-1 -translate-x-1' : 'bg-white text-black hover:bg-black hover:text-[#00FF4C] shadow-[2px_2px_0_0_#000000]'}`}
            >
              <tab.icon className="w-6 h-6" strokeWidth={3} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-8 lg:col-span-9 space-y-12">
          {activeTab === 'profile' && (
            <div className="border-[4px] border-black bg-white shadow-[12px_12px_0_0_#000000]">
              <div className="p-8 border-b-[4px] border-black bg-black text-[#00FF4C]">
                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Profile Information</h2>
                <p className="text-lg font-bold text-white/70 uppercase tracking-widest mt-2">Update your personal data matrix.</p>
              </div>
              <div className="p-8">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  updateProfile.mutate({ name: fd.get('name') as string });
                }} className="space-y-8">
                  <div className="flex items-center gap-8 pb-8 border-b-[4px] border-black">
                    <div className="w-32 h-32 bg-black border-[4px] border-[#00FF4C] flex items-center justify-center text-6xl font-black text-[#00FF4C] shadow-[6px_6px_0_0_#00FF4C] uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div className="space-y-4 flex-1">
                      <Button variant="outline" size="sm" type="button" className="bg-white text-black border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:bg-black hover:text-[#00FF4C] text-lg font-black uppercase h-12">
                        Upload Avatar
                      </Button>
                      <p className="text-sm font-bold text-black/60 uppercase tracking-widest">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-2xl font-black text-black mb-4 uppercase tracking-tighter">Full Name</label>
                    <Input name="name" defaultValue={user?.name} required className="h-16 text-2xl" />
                  </div>
                  <div>
                    <label className="block text-2xl font-black text-black mb-4 uppercase tracking-tighter">Email Address</label>
                    <Input defaultValue={user?.email} disabled className="h-16 text-2xl opacity-50 cursor-not-allowed bg-[#ECECEC]" />
                  </div>
                  <div className="pt-8 flex items-center gap-6 border-t-[4px] border-black">
                    <Button type="submit" disabled={updateProfile.isPending} className="bg-[#00FF4C] text-black border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:bg-black hover:text-[#00FF4C] text-xl font-black uppercase h-16 px-8">
                      {updateProfile.isPending ? 'SAVING...' : 'SAVE CHANGES'}
                    </Button>
                    {updateProfile.isSuccess && (
                      <span className="text-xl font-black text-black bg-[#00FF4C] px-4 py-2 border-[2px] border-black uppercase tracking-tighter">Saved Successfully</span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="border-[4px] border-black bg-white shadow-[12px_12px_0_0_#000000]">
              <div className="p-8 border-b-[4px] border-black bg-[#00FF4C] text-black">
                <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Workspace Settings</h2>
                <p className="text-lg font-bold text-black/70 uppercase tracking-widest mt-2">Manage details for {activeOrg?.name || 'this workspace'}.</p>
              </div>
              <div className="p-8">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  updateWorkspace.mutate({ name: fd.get('name') as string });
                }} className="space-y-8">
                  <div>
                    <label className="block text-2xl font-black text-black mb-4 uppercase tracking-tighter">Workspace Name</label>
                    <Input name="name" defaultValue={activeOrg?.name} required className="h-16 text-2xl" />
                  </div>
                  <div className="pt-8 flex gap-6 border-t-[4px] border-black">
                    <Button type="submit" disabled={updateWorkspace.isPending} className="bg-black text-[#00FF4C] border-[3px] border-black shadow-[4px_4px_0_0_#000000] hover:bg-[#00FF4C] hover:text-black text-xl font-black uppercase h-16 px-8">
                      {updateWorkspace.isPending ? 'SAVING...' : 'SAVE CHANGES'}
                    </Button>
                    {updateWorkspace.isSuccess && (
                      <span className="text-xl font-black text-black bg-[#00FF4C] px-4 py-2 border-[2px] border-black uppercase tracking-tighter">Saved Successfully</span>
                    )}
                  </div>
                </form>
              </div>
            </div>
          )}

          {['security', 'notifications', 'billing'].includes(activeTab) && (
            <div className="border-[4px] border-black bg-[#ECECEC] shadow-[8px_8px_0_0_#000000] flex items-center justify-center h-64 relative overflow-hidden">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
              <div className="relative z-10 text-center">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-black">{activeTab}</h2>
                <p className="text-xl font-bold text-black/60 uppercase mt-4 bg-white border-[2px] border-black px-4 py-2 inline-block">Under Construction</p>
              </div>
            </div>
          )}

          <div className="border-[4px] border-black bg-[#FF0000] shadow-[12px_12px_0_0_#000000]">
            <div className="p-8 border-b-[4px] border-black bg-black text-[#FF0000] flex items-center gap-4">
              <AlertTriangle className="w-10 h-10" strokeWidth={3} />
              <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">Danger Zone</h2>
            </div>
            <div className="p-8 text-black">
              <p className="text-2xl font-black uppercase mb-8 leading-tight">Permanently delete your account and all associated data. This action is irreversible.</p>
              <Button 
                onClick={() => {
                  if (confirm('ARE YOU ABSOLUTELY SURE YOU WANT TO TERMINATE YOUR ACCOUNT?')) {
                    logout();
                    window.location.href = '/login';
                  }
                }}
                className="bg-black text-[#FF0000] border-[4px] border-black shadow-[6px_6px_0_0_#000000] hover:bg-white hover:text-[#FF0000] text-2xl font-black uppercase h-20 px-12"
              >
                TERMINATE ACCOUNT
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
