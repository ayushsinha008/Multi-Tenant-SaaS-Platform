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
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your workspace and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-1">
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
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="md:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and public profile.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  updateProfile.mutate({ name: fd.get('name') as string });
                }} className="space-y-4">
                  <div className="flex items-center gap-6 pb-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg uppercase">
                      {user?.name?.[0] || 'U'}
                    </div>
                    <div className="space-y-2 flex-1">
                      <Button variant="outline" size="sm" type="button">Upload new avatar</Button>
                      <p className="text-xs text-slate-500">JPG, GIF or PNG. 1MB max.</p>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-300">Full Name</label>
                    <Input name="name" defaultValue={user?.name} required />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-300">Email Address</label>
                    <Input defaultValue={user?.email} disabled className="opacity-50 cursor-not-allowed" />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button type="submit" disabled={updateProfile.isPending}>
                      {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {updateProfile.isSuccess && (
                      <span className="text-sm text-green-400 flex items-center">Saved successfully!</span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === 'workspace' && (
            <Card>
              <CardHeader>
                <CardTitle>Workspace Settings</CardTitle>
                <CardDescription>Manage details for {activeOrg?.name || 'this workspace'}.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  updateWorkspace.mutate({ name: fd.get('name') as string });
                }} className="space-y-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-300">Workspace Name</label>
                    <Input name="name" defaultValue={activeOrg?.name} required />
                  </div>
                  <div className="pt-4 flex gap-3">
                    <Button type="submit" disabled={updateWorkspace.isPending}>
                      {updateWorkspace.isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                    {updateWorkspace.isSuccess && (
                      <span className="text-sm text-green-400 flex items-center">Saved successfully!</span>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {['security', 'notifications', 'billing'].includes(activeTab) && (
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{activeTab} Settings</CardTitle>
                <CardDescription>This section is under construction.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">More configuration options will be available here soon.</p>
              </CardContent>
            </Card>
          )}

          <Card className="border-red-500/20 bg-red-500/5">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </CardTitle>
              <CardDescription className="text-red-400/70">Permanently delete your account and all associated data.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="destructive"
                onClick={() => {
                  if (confirm('Are you absolutely sure you want to delete your account?')) {
                    // Quick sign out for now
                    logout();
                    window.location.href = '/login';
                  }
                }}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
