'use client';

import { Card, StatusIndicator, ProgressBar } from '../ui/Card';
import { Settings, Bot, Zap, Server } from 'lucide-react';

interface FrankStatus {
  status: 'active' | 'idle' | 'maintenance';
  uptime: number;
  tasksToday: number;
  queueDepth: number;
}

interface Automation {
  name: string;
  status: 'running' | 'stopped' | 'error';
  detail: string;
}

interface SystemHealth {
  cpu: number;
  memory: number;
  storage: number;
  networkStatus: 'stable' | 'degraded' | 'down';
  latency: number;
}

interface OperationsData {
  frank: FrankStatus;
  automations: Automation[];
  system: SystemHealth;
}

interface OperationsDashboardProps {
  data?: OperationsData;
}

const defaultData: OperationsData = {
  frank: {
    status: 'active',
    uptime: 99.7,
    tasksToday: 47,
    queueDepth: 2
  },
  automations: [
    { name: 'Email Monitor', status: 'running', detail: 'Monitoring inbox' },
    { name: 'Data Sync', status: 'running', detail: 'Indexed' },
    { name: 'Health Check', status: 'running', detail: 'Every 1h' },
    { name: 'Plugin Monitor', status: 'running', detail: '12 active' }
  ],
  system: {
    cpu: 18,
    memory: 42,
    storage: 45,
    networkStatus: 'stable',
    latency: 32
  }
};

export function OperationsDashboard({ data = defaultData }: OperationsDashboardProps) {
  const statusColors = {
    active: 'green',
    idle: 'yellow',
    maintenance: 'red',
    running: 'green',
    stopped: 'yellow',
    error: 'red',
    stable: 'green',
    degraded: 'yellow',
    down: 'red'
  } as const;

  return (
    <Card 
      title="Operations Dashboard" 
      icon={<Settings className="w-4 h-4" />}
      className="h-full"
    >
      <div className="space-y-6">
        {/* Frank Status */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Agent Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Status</span>
              <div className="flex items-center gap-2">
                <span className={`status-dot status-${statusColors[data.frank.status]}`} />
                <span className="text-sm font-medium text-green-400 uppercase">{data.frank.status}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Uptime</span>
              <span className="text-sm text-white">{data.frank.uptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Tasks Today</span>
              <span className="text-sm text-white">{data.frank.tasksToday} Completed</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Queue</span>
              <span className="text-sm text-white">{data.frank.queueDepth} Pending</span>
            </div>
          </div>
        </div>

        {/* Automations */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Automations</span>
          </div>
          <div className="space-y-2">
            {data.automations.map((auto, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className={`status-dot status-${statusColors[auto.status]}`} />
                  <span className="text-sm text-white">{auto.name}</span>
                </div>
                <span className="text-xs text-[#71717a]">{auto.detail}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">System Health</span>
          </div>
          <div className="space-y-3">
            <ProgressBar 
              label="CPU Usage" 
              value={data.system.cpu} 
              color={data.system.cpu > 80 ? 'red' : data.system.cpu > 60 ? 'yellow' : 'green'}
            />
            <ProgressBar 
              label="Memory" 
              value={data.system.memory} 
              color={data.system.memory > 80 ? 'red' : data.system.memory > 60 ? 'yellow' : 'blue'}
            />
            <ProgressBar 
              label="Storage" 
              value={data.system.storage} 
              color={data.system.storage > 80 ? 'red' : data.system.storage > 60 ? 'yellow' : 'blue'}
            />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-[#71717a]">Network</span>
              <div className="flex items-center gap-2">
                <span className={`status-dot status-${statusColors[data.system.networkStatus]}`} />
                <span className="text-xs text-[#a1a1aa]">{data.system.networkStatus} ({data.system.latency}ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
