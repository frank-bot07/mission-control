'use client';

import { Card } from '../ui/Card';
import { Activity } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityItem {
  id: string;
  timestamp: Date;
  type: 'message' | 'payment' | 'email' | 'system' | 'lead' | 'task' | 'alert';
  icon: string;
  message: string;
  highlight?: boolean;
}

interface ActivityFeedProps {
  items?: ActivityItem[];
  maxItems?: number;
}

const defaultItems: ActivityItem[] = [
  {
    id: '1',
    timestamp: new Date(),
    type: 'system',
    icon: '🔧',
    message: 'System configuration updated successfully'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    type: 'task',
    icon: '📄',
    message: 'Project specification document completed'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    type: 'system',
    icon: '🛠️',
    message: 'Dashboard build initiated'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    type: 'task',
    icon: '📋',
    message: 'Plugin audit completed — 12 integrations active'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    type: 'email',
    icon: '📧',
    message: 'Email integration configured and verified'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    type: 'alert',
    icon: '⚠️',
    message: 'SMS notifications blocked — vendor approval pending',
    highlight: true
  }
];

export function ActivityFeed({ items = defaultItems, maxItems = 8 }: ActivityFeedProps) {
  const displayItems = items.slice(0, maxItems);

  const typeColors = {
    message: 'text-blue-400',
    payment: 'text-green-400',
    email: 'text-purple-400',
    system: 'text-[#71717a]',
    lead: 'text-yellow-400',
    task: 'text-cyan-400',
    alert: 'text-red-400'
  };

  return (
    <Card 
      title="Activity Feed" 
      icon={<Activity className="w-4 h-4" />}
      headerAction={
        <span className="text-xs text-[#71717a]">Live Updates</span>
      }
    >
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {displayItems.map((item) => (
          <div 
            key={item.id}
            className={`flex items-start gap-3 py-2 px-2 rounded ${item.highlight ? 'bg-red-500/10 border border-red-500/30' : ''}`}
          >
            <span className="text-base flex-shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${item.highlight ? 'text-red-400' : 'text-[#e4e4e7]'} truncate`}>
                {item.message}
              </p>
            </div>
            <span className="text-xs text-[#71717a] flex-shrink-0">
              {format(item.timestamp, 'HH:mm')}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
