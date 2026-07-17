'use client';

import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { File as FileIcon, Upload, Image as ImageIcon, FileText, Music, Film, Download, Trash2, Grid, List } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

const fileTypeFilters = ['All', 'Images', 'Documents', 'Audio', 'Video', 'Other'];

const fileTypeConfig: Record<string, { color: string; icon: any; badge: any }> = {
  'Images':    { color: 'var(--sky)', icon: ImageIcon, badge: 'sky' },
  'Documents': { color: 'var(--lavender)', icon: FileText,  badge: 'lavender' },
  'Audio':     { color: 'var(--orange-pastel)', icon: Music,      badge: 'orange' },
  'Video':     { color: 'var(--pink-pastel)', icon: Film,       badge: 'pink' },
  'Other':     { color: 'var(--yellow-pastel)', icon: FileIcon,   badge: 'yellow' },
};

export default function FilesPage() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async () => { const res = await api.get('/files'); return res.data.files; }
  });

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/files/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      return res.data;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['files'] }); },
    onSettled: () => { setIsUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  });

  const deleteFile = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    }
  });

  const getFileType = (mimetype?: string) => {
    if (!mimetype) return 'Other';
    if (mimetype.startsWith('image/')) return 'Images';
    if (mimetype.includes('pdf') || mimetype.includes('doc') || mimetype.includes('text')) return 'Documents';
    if (mimetype.startsWith('audio/')) return 'Audio';
    if (mimetype.startsWith('video/')) return 'Video';
    return 'Other';
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((acc: number, f: any) => acc + (f.size || 0), 0);
  const filtered = files.filter((f: any) => filter === 'All' || getFileType(f.mimetype) === filter);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-ink tracking-tight">Files</h1>
          <p className="text-sm font-medium text-ink/40 mt-1">
            {files.length} files · {formatSize(totalSize)} used
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border-[3px] border-ink overflow-hidden shadow-neo-sm">
            <button onClick={() => setView('grid')} className={`p-2.5 transition-colors ${view === 'grid' ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-cream'}`}>
              <Grid className="w-4 h-4" strokeWidth={2} />
            </button>
            <button onClick={() => setView('list')} className={`p-2.5 border-l-[2px] border-ink transition-colors ${view === 'list' ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-cream'}`}>
              <List className="w-4 h-4" strokeWidth={2} />
            </button>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadFile.mutate(e.target.files[0]); }} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="yellow">
            <Upload className="w-4 h-4 mr-2" strokeWidth={2.5} />
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {fileTypeFilters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl border-[3px] border-ink text-sm font-bold transition-all shadow-neo-xs hover:-translate-y-0.5 hover:shadow-neo-sm ${
              filter === f ? 'bg-ink text-white' : 'bg-white text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="aspect-square rounded-2xl border-[3px] border-ink bg-cream animate-pulse" />)}
        </div>
      ) : files.length === 0 ? (
        <EmptyState
          icon={FileIcon}
          title="No files yet"
          description="Upload your first file to get started."
          accentColor='var(--yellow-pastel)'
          primaryAction={{ label: 'Upload File', onClick: () => fileInputRef.current?.click() }}
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          <AnimatePresence>
            {filtered.map((file: any, idx: number) => {
              const ft = getFileType(file.mimetype);
              const cfg = fileTypeConfig[ft];
              return (
                <motion.div
                  key={file._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="rounded-2xl border-[3px] border-ink bg-white shadow-neo-sm hover:-translate-y-1 hover:shadow-neo-lg transition-all group overflow-hidden"
                >
                  {/* Thumbnail */}
                  <div className="aspect-square relative" style={{ backgroundColor: cfg.color }}>
                    {file.mimetype?.startsWith('image/') ? (
                      <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <cfg.icon className="w-12 h-12 text-ink/40" strokeWidth={1.5} />
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-ink/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 focus-within:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <a href={file.url} download target="_blank" rel="noreferrer" className="w-9 h-9 rounded-lg border-[2px] border-white bg-white flex items-center justify-center hover:bg-mint transition-colors">
                        <Download className="w-4 h-4 text-ink" strokeWidth={2.5} />
                      </a>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this file?')) {
                            deleteFile.mutate(file._id);
                          }
                        }}
                        className="w-9 h-9 rounded-lg border-[2px] border-white bg-white flex items-center justify-center hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-xs font-bold text-ink truncate leading-tight">{file.name}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <Badge variant={cfg.badge as any} className="text-[10px] px-2 py-0.5">{file.mimetype?.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>
                      <span className="text-[10px] font-medium text-ink/30">{formatSize(file.size)}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* List view */
        <div className="rounded-2xl border-[3px] border-ink overflow-hidden shadow-neo-md">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-5 px-6 py-3.5 bg-ink text-white text-xs font-bold uppercase tracking-wide">
            <span className="w-8">#</span>
            <span>File</span>
            <span className="w-20 text-center">Type</span>
            <span className="w-16 text-right">Size</span>
            <span className="w-16 text-right">Actions</span>
          </div>
          <div className="divide-y-[2px] divide-[#1A1A1A]/10">
            {filtered.map((file: any, idx: number) => {
              const ft = getFileType(file.mimetype);
              const cfg = fileTypeConfig[ft];
              return (
                <div key={file._id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-5 px-6 py-4 bg-white hover:bg-cream items-center transition-colors group">
                  <span className="w-8 text-xs font-bold text-ink/20">#{idx + 1}</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl border-[2px] border-ink flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.color }}>
                      {file.mimetype?.startsWith('image/') ? (
                        <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <cfg.icon className="w-4 h-4 text-ink/60" strokeWidth={1.5} />
                      )}
                    </div>
                    <p className="text-sm font-bold text-ink truncate">{file.name}</p>
                  </div>
                  <div className="w-20 flex justify-center">
                    <Badge variant={cfg.badge as any} className="text-[10px]">{file.mimetype?.split('/')[1]?.toUpperCase() || 'FILE'}</Badge>
                  </div>
                  <span className="w-16 text-right text-xs font-medium text-ink/30">{formatSize(file.size)}</span>
                  <div className="w-16 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a href={file.url} download target="_blank" rel="noreferrer" className="p-1.5 rounded-lg border-[2px] border-ink hover:bg-mint transition-colors">
                      <Download className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </a>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this file?')) {
                          deleteFile.mutate(file._id);
                        }
                      }}
                      className="p-1.5 rounded-lg border-[2px] border-ink hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {filtered.length === 0 && files.length > 0 && (
        <div className="py-16 text-center">
          <p className="text-sm font-medium text-ink/40">No {filter.toLowerCase()} files uploaded yet</p>
        </div>
      )}
    </div>
  );
}
