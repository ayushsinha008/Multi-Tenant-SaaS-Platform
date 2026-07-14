'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Folder, CheckSquare, Users, File as FileIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';

export function CommandPalette({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ projects: any[], tasks: any[], files: any[], members: any[] }>({
    projects: [], tasks: [], files: [], members: []
  });
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (query.length > 1) {
      const delay = setTimeout(async () => {
        try {
          const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
          setResults(res.data.results);
        } catch (e) { }
      }, 300);
      return () => clearTimeout(delay);
    } else {
      setResults({ projects: [], tasks: [], files: [], members: [] });
    }
  }, [query]);

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#0F172A]/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden pointer-events-auto"
            >
              <div className="flex items-center px-4 border-b border-white/10">
                <Search className="w-5 h-5 text-indigo-400" />
                <input
                  autoFocus
                  className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-500 px-4 py-4 text-lg"
                  placeholder="Search projects, tasks, files..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <kbd className="px-2 py-1 bg-white/5 rounded text-xs text-slate-400 font-mono">ESC</kbd>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-2">
                {query.length > 1 && Object.values(results).every(arr => arr.length === 0) && (
                  <div className="p-8 text-center text-slate-400">No results found for "{query}"</div>
                )}
                
                {query.length <= 1 && (
                  <div className="p-8 text-center text-slate-500 text-sm">Start typing to search across your workspace</div>
                )}

                {results.projects.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects</div>
                    {results.projects.map(p => (
                      <button key={p._id} onClick={() => handleSelect('/dashboard/projects')} className="w-full text-left px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white group transition-colors">
                        <Folder className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                        <span>{p.name}</span>
                      </button>
                    ))}
                  </div>
                )}

                {results.tasks.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks</div>
                    {results.tasks.map(t => (
                      <button key={t._id} onClick={() => handleSelect('/dashboard/tasks')} className="w-full text-left px-3 py-2 flex items-center gap-3 rounded-lg hover:bg-white/5 text-slate-300 hover:text-white group transition-colors">
                        <CheckSquare className="w-4 h-4 text-slate-500 group-hover:text-indigo-400" />
                        <span>{t.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
