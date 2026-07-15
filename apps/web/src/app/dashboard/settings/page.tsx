'use client';

import { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import Link from 'next/link';
import { Shield, Building2, Bell, CreditCard, User, AlertTriangle, CheckSquare } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, color: '#DDD6FE' },
  { id: 'workspace', label: 'Workspace', icon: Building2, color: '#BAE6FD' },
  { id: 'notifications', label: 'Notifications', icon: Bell, color: '#FEF08A' },
  { id: 'security', label: 'Security', icon: Shield, color: '#FBCFE8' },
  { id: 'billing', label: 'Billing', icon: CreditCard, color: '#BBF7D0' }
];

export default function SettingsPage() {
  const { user, setUser, activeWorkspaceId, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      alert(`Payment successful! You are now on the ${params.get('plan')} plan.`);
      window.history.replaceState(null, '', '/dashboard/settings');
    } else if (params.get('payment') === 'failure') {
      alert('Payment failed. Please try again.');
      window.history.replaceState(null, '', '/dashboard/settings');
    }
  }, []);

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
      
      const fields = { key, txnid, amount, productinfo: plan, firstname: user?.name || 'User', email: user?.email || '', phone: '9999999999', surl, furl, hash, udf1: activeWorkspaceId };
      
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
      console.error('Payment initiation failed', error);
      alert('Failed to initiate payment.');
    }
  };


  const updateProfile = useMutation({
    mutationFn: async (data: { name?: string; avatar?: string }) => {
      const res = await api.patch('/auth/profile', data);
      return res.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    }
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/files/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: (data) => {
      updateProfile.mutate({ avatar: data.file.url });
    },
    onSettled: () => {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
  const { data: files = [] } = useQuery({
    queryKey: ['files', activeWorkspaceId],
    queryFn: async () => {
      const res = await api.get('/files');
      return res.data.files;
    },
    enabled: !!activeWorkspaceId
  });

  const { data: projectsData = [] } = useQuery({
    queryKey: ['projects', activeWorkspaceId],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data.projects;
    },
    enabled: !!activeWorkspaceId
  });

  const totalStorageBytes = files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(1);
  const maxStorageMB = activeOrg?.plan === 'FREE' ? 5 : activeOrg?.plan === 'PRO' ? 100 : 1024;
  const storagePercentage = Math.min((totalStorageBytes / (maxStorageMB * 1024 * 1024)) * 100, 100);

  const totalProjects = projectsData.length || 0;
  const maxProjects = activeOrg?.plan === 'FREE' ? 3 : Infinity;
  const projectsPercentage = maxProjects === Infinity ? (totalProjects > 0 ? 5 : 0) : Math.min((totalProjects / maxProjects) * 100, 100);

  return (
    <div className="flex min-h-[calc(100vh-72px)] flex-col md:flex-row bg-[#FFFDF5]">

      {/* Settings Left Nav */}
      <div className="w-full md:w-64 border-b-[3px] md:border-b-0 md:border-r-[3px] border-[#1A1A1A] bg-white p-4 space-y-1.5">
        <p className="text-[10px] font-bold text-[#1A1A1A]/30 uppercase tracking-[0.15em] px-3 mb-2">Settings Menu</p>
        <nav className="space-y-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-[3px] text-left transition-all duration-150 ${
                  isActive
                    ? 'border-[#1A1A1A] shadow-[3px_3px_0px_#1A1A1A]'
                    : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#FFFDF5]'
                }`}
                style={{ backgroundColor: isActive ? tab.color : 'transparent' }}
              >
                <tab.icon className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-2xl mx-auto space-y-10">

          {/* Profile Section */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Profile Settings</h2>
                <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">Manage your personal information and contact details</p>
              </div>

              <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-6 md:p-8 shadow-[4px_4px_0px_#1A1A1A]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    updateProfile.mutate({ name: fd.get('name') as string });
                  }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-5 pb-6 border-b-[2px] border-[#1A1A1A]/10">
                    <Avatar src={user?.avatar} fallback={user?.name || 'U'} size="xl" />
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">{user?.name}</p>
                      <p className="text-xs font-medium text-[#1A1A1A]/40 mt-0.5">{user?.email}</p>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            uploadAvatar.mutate(e.target.files[0]);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-3"
                        disabled={isUploading}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isUploading ? 'Uploading...' : 'Change Picture'}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Display Name</label>
                    <Input name="name" defaultValue={user?.name} required placeholder="Full Name" />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Email Address</label>
                    <Input defaultValue={user?.email} disabled className="opacity-50 cursor-not-allowed bg-slate-50" />
                    <p className="text-xs font-medium text-[#1A1A1A]/30 mt-1.5">Email address cannot be updated</p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {updateProfile.isSuccess && (
                      <span className="text-xs font-bold text-[#1A1A1A] bg-[#BBF7D0] border-[2px] border-[#1A1A1A] px-3 py-1.5 rounded-xl">
                        Profile Saved!
                      </span>
                    )}
                    <Button type="submit" disabled={updateProfile.isPending} variant="primary">
                      {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </div>
                </form>
              </div>

              {/* Danger Zone */}
              <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-6 shadow-[4px_4px_0px_#1A1A1A]">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl border-[2px] border-[#1A1A1A] bg-[#FBCFE8] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5 text-red-600" strokeWidth={2.5} />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-bold text-[#1A1A1A]">Danger Zone</h3>
                      <p className="text-xs font-medium text-[#1A1A1A]/40 mt-1">
                        Deleting your account will wipe all data across your workspaces permanently.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete your account? This is irreversible.')) {
                          logout();
                          window.location.href = '/login';
                        }
                      }}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Workspace Section */}
          {activeTab === 'workspace' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Workspace Settings</h2>
                <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">Update parameters for {activeOrg?.name || 'this workspace'}</p>
              </div>

              <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-6 md:p-8 shadow-[4px_4px_0px_#1A1A1A]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const fd = new FormData(e.currentTarget);
                    updateWorkspace.mutate({ name: fd.get('name') as string });
                  }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#1A1A1A] mb-2">Workspace Name</label>
                    <Input name="name" defaultValue={activeOrg?.name} required placeholder="My Workspace" />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    {updateWorkspace.isSuccess && (
                      <span className="text-xs font-bold text-[#1A1A1A] bg-[#BBF7D0] border-[2px] border-[#1A1A1A] px-3 py-1.5 rounded-xl">
                        Workspace Saved!
                      </span>
                    )}
                    <Button type="submit" disabled={updateWorkspace.isPending} variant="sky">
                      {updateWorkspace.isPending ? 'Saving...' : 'Save Workspace'}
                    </Button>
                  </div>
                </form>
              </div>

              <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-6 shadow-[4px_4px_0px_#1A1A1A] space-y-4">
                <h3 className="text-sm font-bold text-[#1A1A1A]">Workspace Metadata</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border-[2px] border-[#1A1A1A]/10 bg-[#FFFDF5]">
                    <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-wider mb-1">Workspace ID</p>
                    <p className="text-xs font-bold text-[#1A1A1A] truncate">{activeWorkspaceId || '—'}</p>
                  </div>
                  <div className="p-4 rounded-xl border-[2px] border-[#1A1A1A]/10 bg-[#FFFDF5]">
                    <p className="text-[10px] font-bold text-[#1A1A1A]/40 uppercase tracking-wider mb-1">Plan Level</p>
                    <p className="text-xs font-bold text-[#1A1A1A]">Free Tier</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Section */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Notifications</h2>
                <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">Configure how you receive updates and alerts</p>
              </div>
              <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-6 md:p-8 shadow-[4px_4px_0px_#1A1A1A] space-y-6">
                {[
                  {
                    id: 'emailNotifications',
                    label: 'Email Notifications',
                    desc: 'Receive a daily digest and important alerts via email.',
                    value: (user as any)?.preferences?.emailNotifications ?? true
                  },
                  {
                    id: 'pushNotifications',
                    label: 'In-App Push Notifications',
                    desc: 'Receive real-time alerts inside the application.',
                    value: (user as any)?.preferences?.pushNotifications ?? true
                  },
                  {
                    id: 'marketingEmails',
                    label: 'Marketing & Updates',
                    desc: 'Receive feature updates, tips, and promotional offers.',
                    value: (user as any)?.preferences?.marketingEmails ?? false
                  }
                ].map((pref) => (
                  <div key={pref.id} className="flex items-center justify-between pb-6 border-b-[2px] border-[#1A1A1A]/10 last:pb-0 last:border-b-0">
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">{pref.label}</p>
                      <p className="text-xs font-medium text-[#1A1A1A]/50 mt-1">{pref.desc}</p>
                    </div>
                    <button
                      onClick={() => {
                        api.patch('/auth/preferences', { [pref.id]: !pref.value }).then((res) => {
                          setUser(res.data.user);
                        });
                      }}
                      className={`relative w-12 h-6 rounded-full border-[3px] border-[#1A1A1A] transition-colors ${pref.value ? 'bg-[#BBF7D0]' : 'bg-[#1A1A1A]/10'}`}
                    >
                      <div className={`absolute top-0.5 w-3.5 h-3.5 bg-white border-[2px] border-[#1A1A1A] rounded-full transition-transform ${pref.value ? 'left-7' : 'left-0.5'}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Security</h2>
                <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">Manage your account security and authentication</p>
              </div>

              {/* Connected Accounts */}
              <div className="rounded-2xl border-[3px] border-[#1A1A1A] bg-white p-6 md:p-8 shadow-[4px_4px_0px_#1A1A1A]">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-4">Connected Accounts</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border-[2px] border-[#1A1A1A]/10 bg-[#FFFDF5] gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-[2px] border-[#1A1A1A] bg-white flex items-center justify-center p-2.5">
                      <svg viewBox="0 0 24 24" className="w-full h-full">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#1A1A1A]">Google</p>
                      <p className="text-xs font-medium text-[#1A1A1A]/40 mt-0.5">Connected as {user?.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-[#BBF7D0] border-[2px] border-[#1A1A1A] rounded-full text-xs font-bold text-[#1A1A1A]">
                    Active
                  </span>
                </div>
                <p className="text-[11px] font-medium text-[#1A1A1A]/40 mt-4">
                  Your account security, including two-factor authentication and passwords, is managed by your Google account.
                </p>
              </div>

            </div>
          )}

          {/* Billing Section */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">Billing & Plans</h2>
                <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">Manage your workspace subscription and limits</p>
              </div>

              <div className="p-6 md:p-8 rounded-2xl border-[3px] border-[#1A1A1A] bg-white max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#1A1A1A]">Current Plan</h3>
                    <p className="text-sm font-bold text-[#1A1A1A]/40 mt-1">{activeOrg?.plan} Tier</p>
                  </div>
                  <Link href="/dashboard/plans">
                    <Button variant="primary">
                      Change Plan
                    </Button>
                  </Link>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm font-bold text-[#1A1A1A] mb-2">
                      <span>Storage Used</span>
                      <span>{totalStorageMB} MB / {maxStorageMB === 1024 ? '1 GB' : `${maxStorageMB} MB`}</span>
                    </div>
                    <div className="h-3 w-full bg-[#1A1A1A]/5 rounded-full overflow-hidden border-[2px] border-[#1A1A1A]">
                      <div className="h-full bg-[#BBF7D0] border-r-[2px] border-[#1A1A1A]" style={{ width: `${storagePercentage}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm font-bold text-[#1A1A1A] mb-2">
                      <span>Projects Used</span>
                      <span>{totalProjects} / {activeOrg?.plan === 'FREE' ? '3' : 'Unlimited'}</span>
                    </div>
                    <div className="h-3 w-full bg-[#1A1A1A]/5 rounded-full overflow-hidden border-[2px] border-[#1A1A1A]">
                      <div className="h-full bg-[#BAE6FD] border-r-[2px] border-[#1A1A1A]" style={{ width: `${projectsPercentage}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
