'use client';

import { Card } from '../ui/Card';
import { Target, Clock, Ban, Trophy, AlertTriangle, CheckCircle } from 'lucide-react';

interface PriorityAction {
  id: string;
  title: string;
  urgent: boolean;
  completed: boolean;
}

interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  type: 'meeting' | 'task' | 'reminder';
}

interface BlockedItem {
  id: string;
  title: string;
  reason: string;
}

interface Win {
  id: string;
  title: string;
  timestamp: string;
}

interface CommandCenterData {
  priorities: PriorityAction[];
  schedule: ScheduleItem[];
  blocked: BlockedItem[];
  wins: Win[];
}

interface CommandCenterProps {
  data?: CommandCenterData;
}

const defaultData: CommandCenterData = {
  priorities: [
    { id: '1', title: 'Finalize Q1 roadmap', urgent: true, completed: false },
    { id: '2', title: 'Deploy staging environment', urgent: false, completed: false },
    { id: '3', title: 'Team standup notes', urgent: false, completed: true },
    { id: '4', title: 'Review analytics integration', urgent: false, completed: false }
  ],
  schedule: [
    { id: '1', time: '09:00', title: 'Morning strategy review', type: 'task' },
    { id: '2', time: '14:00', title: 'Test Mission Control', type: 'task' },
    { id: '3', time: 'Ongoing', title: 'Business building', type: 'task' }
  ],
  blocked: [
    { id: '1', title: 'SMS notifications', reason: 'Awaiting vendor approval' }
  ],
  wins: [
    { id: '1', title: 'Email integration live', timestamp: 'Today' },
    { id: '2', title: 'Dashboard v1.0 shipped', timestamp: 'Today' },
    { id: '3', title: 'CI/CD pipeline configured', timestamp: 'Today' },
    { id: '4', title: 'Team onboarding complete', timestamp: 'Today' }
  ]
};

export function CommandCenter({ data = defaultData }: CommandCenterProps) {
  return (
    <Card 
      title="Mission Control - Today's Command Center" 
      icon={<Target className="w-4 h-4" />}
      className="col-span-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Priority Actions */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🔥</span>
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Priority Actions</span>
          </div>
          <div className="space-y-2">
            {data.priorities.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                {item.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                ) : item.urgent ? (
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 border border-[#71717a] rounded flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${item.completed ? 'text-green-400 line-through' : item.urgent ? 'text-red-400' : 'text-white'}`}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Schedule</span>
          </div>
          <div className="space-y-2">
            {data.schedule.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="text-xs text-blue-400 font-mono w-14">{item.time}</span>
                <span className="text-sm text-white">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Items */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Ban className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Blocked</span>
          </div>
          <div className="space-y-2">
            {data.blocked.length === 0 ? (
              <p className="text-sm text-[#71717a]">Nothing blocked! 🎉</p>
            ) : (
              data.blocked.map((item) => (
                <div key={item.id} className="p-2 bg-red-500/10 border border-red-500/30 rounded">
                  <p className="text-sm text-red-400">{item.title}</p>
                  <p className="text-xs text-[#71717a] mt-1">{item.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Today's Wins */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Today&apos;s Wins</span>
          </div>
          <div className="space-y-2">
            {data.wins.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-sm text-green-400">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
