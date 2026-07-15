'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';
import { Activity as ActivityIcon, Folder, CheckSquare, Users, Settings, Clock, FileText } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { EmptyState } from '@/components/ui/EmptyState';
import { motion } from 'framer-motion';

const getActionIcon = (action: string) => {
  if (action.includes('PROJECT')) return Folder;
  if (action.includes('TASK')) return CheckSquare;
  if (action.includes('MEMBER') || action.includes('USER')) return Users;
  if (action.includes('SETTING')) return Settings;
  if (action.includes('FILE')) return FileText;
  return ActivityIcon;
};

const getActionColors = (action: string): { bg: string; iconBg: string } => {
  if (action.includes('DELETE')) return { bg: '#FBCFE8', iconBg: '#F9A8D4' }; // pink
  if (action.includes('CREATE')) return { bg: '#BBF7D0', iconBg: '#86EFAC' }; // mint
  if (action.includes('UPDATE')) return { bg: '#FEF08A', iconBg: '#FDE047' }; // yellow
  return { bg: '#BAE6FD', iconBg: '#7DD3FC' }; // sky
};

function groupByDate(activities: any[]) {
  const groups: Record<string, any[]> = {};
  for (const a of activities) {
    const d = new Date(a.createdAt);
    const key = format(d, 'yyyy-MM-dd');
    if (!groups[key]) groups[key] = [];
    groups[key].push(a);
  }
  return Object.entries(groups).sort((a, b) => b[0].localeCompare(a[0]));
}

function getDateLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
}

export default function ActivityPage() {
  const activeWorkspaceId = useAuthStore((state) => state.activeWorkspaceId);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['activity', activeWorkspaceId],
    queryFn: async () => {
      const res = await api.get('/activity');
      return res.data.logs || res.data.activities || [];
    },
    enabled: !!activeWorkspaceId
  });

  const grouped = groupByDate(activities);

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight">Activity Log</h1>
          <p className="text-sm font-medium text-[#1A1A1A]/40 mt-1">
            A chronological timeline of updates in this workspace
          </p>
        </div>
        {activities.length > 0 && (
          <span className="px-3.5 py-1.5 rounded-full border-[2px] border-[#1A1A1A] bg-[#BAE6FD] text-xs font-bold shadow-[2px_2px_0px_#1A1A1A]">
            {activities.length} Events
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="h-8 w-32 bg-[#FFFDF5] border-[3px] border-[#1A1A1A] rounded-xl animate-pulse" />
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-[#FFFDF5] border-[3px] border-[#1A1A1A] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : activities.length === 0 ? (
        <EmptyState
          icon={ActivityIcon}
          title="No activity yet"
          description="System is idle. Activity events will appear here as your team works."
          accentColor="#FED7AA"
        />
      ) : (
        /* Timeline */
        <div className="space-y-10">
          {grouped.map(([dateKey, dayActivities], groupIdx) => (
            <div key={dateKey} className="space-y-4">
              {/* Date Header */}
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-bold text-[#1A1A1A] tracking-tight">
                    {getDateLabel(dateKey)}
                  </span>
                  <span className="text-xs font-medium text-[#1A1A1A]/30">
                    {format(new Date(dateKey), 'MMMM yyyy')}
                  </span>
                </div>
                <div className="flex-1 h-[2px] bg-[#1A1A1A]/10" />
              </div>

              {/* Day's events */}
              <div className="relative pl-6 space-y-4 border-l-[3px] border-[#1A1A1A]/10 ml-4">
                {dayActivities.map((activity: any, idx: number) => {
                  const Icon = getActionIcon(activity.action);
                  const { bg, iconBg } = getActionColors(activity.action);

                  return (
                    <motion.div
                      key={activity._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (groupIdx * 0.1) + idx * 0.04 }}
                      className="relative group"
                    >
                      {/* Timeline dot bubble */}
                      <div className="absolute -left-[35px] top-4 w-5 h-5 rounded-full border-[2px] border-[#1A1A1A] bg-white flex items-center justify-center shadow-[1px_1px_0px_#1A1A1A]">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: iconBg }} />
                      </div>

                      {/* Event Card */}
                      <div
                        className="rounded-2xl border-[3px] border-[#1A1A1A] p-5 shadow-[3px_3px_0px_#1A1A1A] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#1A1A1A] transition-all flex items-start justify-between gap-4"
                        style={{ backgroundColor: bg }}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-9 h-9 rounded-xl border-[2px] border-[#1A1A1A] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#1A1A1A]"
                            style={{ backgroundColor: iconBg }}
                          >
                            <Icon className="w-4 h-4 text-[#1A1A1A]" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1A1A1A] leading-tight">
                              {typeof activity.details === 'object' && activity.details !== null 
                                ? (activity.details.filename || activity.details.title || activity.details.name || JSON.stringify(activity.details))
                                : activity.details || activity.action.replace(/_/g, ' ')}
                            </p>
                            {activity.userId?.name && (
                              <p className="text-xs font-semibold text-[#1A1A1A]/40 mt-1">
                                By {activity.userId.name}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-[10px] font-bold text-[#1A1A1A]/40 bg-white/50 border-[1px] border-[#1A1A1A]/10 px-2 py-0.5 rounded-full">
                                {activity.action}
                              </span>
                              {activity.ipAddress && (
                                <span className="text-[10px] font-medium text-[#1A1A1A]/30">
                                  {activity.ipAddress}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-[#1A1A1A]/40 shrink-0">
                          <Clock className="w-3.5 h-3.5" strokeWidth={2} />
                          <span className="text-xs font-bold">
                            {format(new Date(activity.createdAt), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
