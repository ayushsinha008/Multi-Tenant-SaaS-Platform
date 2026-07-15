'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Folder, CheckSquare, Users, File as FileIcon, X } from 'lucide-react';
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
          const res = await api.get(`/search/global?q=${encodeURIComponent(query)}`);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[#FFFDF5]/80 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white border-[3px] border-[#1A1A1A] rounded-2xl shadow-[6px_6px_0px_#1A1A1A] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Search Header */}
              <div className="flex items-center px-4 py-3 border-b-[3px] border-[#1A1A1A] bg-[#BAE6FD]">
                <Search className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2.5} />
                <input
                  autoFocus
                  className="flex-1 bg-transparent border-none focus:outline-none text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 px-4 py-2 text-lg font-bold"
                  placeholder="Search projects, tasks, files..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg border-[2px] border-[#1A1A1A] bg-white hover:bg-[#FFFDF5] text-[#1A1A1A] shadow-[2px_2px_0px_#1A1A1A] active:translate-y-[1px] active:shadow-none transition-all"
                >
                  <X className="w-4 h-4" strokeWidth={2.5} />
                </button>
              </div>

              {/* Search Results */}
              <div className="max-h-[60vh] overflow-y-auto p-4 bg-[#FFFDF5] space-y-4">
                {query.length > 1 && Object.values(results).every(arr => arr.length === 0) && (
                  <div className="p-10 text-center flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-xl border-[2px] border-[#1A1A1A] bg-[#FBCFE8] flex items-center justify-center mb-3">
                      <Search className="w-6 h-6 text-[#1A1A1A]" strokeWidth={2.5} />
                    </div>
                    <p className="text-sm font-bold text-[#1A1A1A]">No results found for "{query}"</p>
                    <p className="text-xs font-medium text-[#1A1A1A]/40 mt-1">Try searching for something else</p>
                  </div>
                )}
                
                {query.length <= 1 && (
                  <div className="p-8 text-center text-[#1A1A1A]/40 text-sm font-bold">
                    Start typing to search across your workspace
                  </div>
                )}

                {results.projects.length > 0 && (
                  <div>
                    <div className="px-3 mb-2 text-[10px] font-bold text-[#1A1A1A]/30 uppercase tracking-[0.1em]">Projects</div>
                    <div className="space-y-1.5">
                      {results.projects.map(p => (
                        <button key={p._id} onClick={() => handleSelect('/dashboard/projects')} className="w-full text-left px-3 py-2 flex items-center gap-3 rounded-xl hover:bg-[#BAE6FD] text-[#1A1A1A] transition-colors border-[2px] border-transparent hover:border-[#1A1A1A]">
                          <Folder className="w-4 h-4" strokeWidth={2.5} />
                          <span className="font-bold text-sm">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {results.tasks.length > 0 && (
                  <div>
                    <div className="px-3 mb-2 text-[10px] font-bold text-[#1A1A1A]/30 uppercase tracking-[0.1em]">Tasks</div>
                    <div className="space-y-1.5">
                      {results.tasks.map(t => (
                        <button key={t._id} onClick={() => handleSelect('/dashboard/tasks')} className="w-full text-left px-3 py-2 flex items-center gap-3 rounded-xl hover:bg-[#FEF08A] text-[#1A1A1A] transition-colors border-[2px] border-transparent hover:border-[#1A1A1A]">
                          <CheckSquare className="w-4 h-4" strokeWidth={2.5} />
                          <span className="font-bold text-sm">{t.title}</span>
                        </button>
                      ))}
                    </div>
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
