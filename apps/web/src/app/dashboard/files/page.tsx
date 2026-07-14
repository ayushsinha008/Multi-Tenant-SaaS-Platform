'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { File as FileIcon, Upload, Image as ImageIcon, FileText, Download, MoreVertical } from 'lucide-react';
import * as React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function FilesPage() {
  const queryClient = useQueryClient();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const res = await api.get('/files');
      return res.data.files;
    }
  });

  const uploadFile = useMutation({
    mutationFn: async (file: File) => {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
    },
    onSettled: () => {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  });

  const getIcon = (type: string) => {
    if (type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Files</h1>
          <p className="text-slate-400 mt-1">Manage and share workspace documents.</p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files?.[0]) uploadFile.mutate(e.target.files[0]);
            }} 
          />
          <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="animate-pulse flex gap-6">Loading files...</div>
      ) : files.length === 0 ? (
        <EmptyState
          icon={FileIcon}
          title="No files uploaded"
          description="Drag and drop files here, or click the upload button to add your first file."
          primaryAction={{ label: 'Upload File', onClick: () => {} }}
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {files.map((file: any) => {
            const Icon = getIcon(file.mimetype);
            return (
              <div key={file._id} className="group relative bg-[#111827] border border-white/10 rounded-xl p-4 hover:border-indigo-500/30 hover:bg-white/5 transition-all cursor-pointer">
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <a href={file.url} download target="_blank" rel="noreferrer" className="p-1.5 bg-black/50 text-white rounded-md hover:bg-indigo-500 transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </a>
                  <button className="p-1.5 bg-black/50 text-white rounded-md hover:bg-red-500 transition-colors">
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-full aspect-square bg-[#0F172A] rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                  {file.mimetype.startsWith('image/') ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <Icon className="w-8 h-8 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />
                  )}
                </div>

                <h3 className="text-sm font-medium text-white truncate mb-1" title={file.name}>{file.name}</h3>
                <p className="text-xs text-slate-500">{formatSize(file.size)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
