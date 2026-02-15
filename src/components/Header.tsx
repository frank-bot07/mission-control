'use client';

import { useEffect, useState } from 'react';
import { Rocket, Zap, Clock, Bell } from 'lucide-react';
import { format } from 'date-fns';

interface HeaderProps {
  alerts?: number;
}

export function Header({ alerts = 0 }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-[#0d0d12] border-b border-[#27272a] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{(process.env.NEXT_PUBLIC_APP_TITLE || 'MISSION CONTROL').toUpperCase()}</h1>
            <p className="text-xs text-[#71717a]">Executive Operations Command Center</p>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-6">
          {/* Live Indicator */}
          <div className="flex items-center gap-2">
            <span className="status-dot status-green animate-pulse-slow" />
            <span className="text-sm font-medium text-green-400">LIVE</span>
          </div>

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

      {/* Quick Status Bar */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-[#27272a]">
        <QuickStatus icon="🤖" label="Agent" status="green" value="Active" />
        <QuickStatus icon="📧" label="Email" status="yellow" value="3 Pending" />
        <QuickStatus icon="⚡" label="Automations" status="green" value="5 Running" />
        <QuickStatus icon="🔔" label="Alerts" status={alerts > 0 ? 'red' : 'green'} value={alerts > 0 ? `${alerts} Active` : 'None'} />
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
