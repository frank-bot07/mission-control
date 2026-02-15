'use client';

import { useEffect, useState } from 'react';
import { Zap, Clock, Bell } from 'lucide-react';
import { format } from 'date-fns';

interface PageHeaderProps {
  alerts?: number;
}

export function PageHeader({ alerts = 0 }: PageHeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0d0d12] border-b border-[#27272a] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Status Indicators */}
        <div className="flex items-center gap-6">
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <span className="status-dot status-green animate-pulse-slow" />
            <span className="text-sm font-medium text-green-400">LIVE</span>
          </div>

          {/* Quick Status */}
          <QuickStatus icon="🤖" label="Frank" status="green" value="Active" />
          <QuickStatus icon="📧" label="Email" status="yellow" value="3 Pending" />
          <QuickStatus icon="⚡" label="Automations" status="green" value="5 Running" />
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {/* Time */}
          <div className="flex items-center gap-2 text-[#a1a1aa]">
            <Clock className="w-4 h-4" />
            <span className="text-sm font-mono">
              {format(time, 'MMM dd, yyyy HH:mm:ss')} CST
            </span>
          </div>

          {/* System Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#111118] rounded-lg border border-[#27272a]">
            <Zap className="w-4 h-4 text-green-400" />
            <span className="text-sm text-[#a1a1aa]">OPERATIONAL</span>
          </div>

          {/* Alerts */}
          {alerts > 0 && (
            <button className="relative p-2 hover:bg-[#27272a] rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-[#a1a1aa]" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {alerts}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

interface QuickStatusProps {
  icon: string;
  label: string;
  status: 'green' | 'yellow' | 'red';
  value: string;
}

function QuickStatus({ icon, label, status, value }: QuickStatusProps) {
  return (
    <div className="flex items-center gap-2">
      <span>{icon}</span>
      <span className="text-sm text-[#71717a]">{label}:</span>
      <span className={`status-dot status-${status}`} />
      <span className="text-sm text-white">{value}</span>
    </div>
  );
}
