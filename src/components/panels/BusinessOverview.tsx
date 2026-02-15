'use client';

import { Card, Metric, ProgressBar } from '../ui/Card';
import { DollarSign, Target, TrendingUp, CheckCircle } from 'lucide-react';

interface BusinessData {
  revenue: {
    today: number;
    mtd: number;
    ytd: number;
  };
  metrics: {
    activeProjects: number;
    pipelineValue: number;
    conversion: number;
    customerHealth: number;
  };
  milestones: Array<{
    name: string;
    progress: number;
    completed: boolean;
  }>;
}

interface BusinessOverviewProps {
  data?: BusinessData;
}

const defaultData: BusinessData = {
  revenue: {
    today: 0,
    mtd: 0,
    ytd: 0
  },
  metrics: {
    activeProjects: 1,
    pipelineValue: 0,
    conversion: 0,
    customerHealth: 100
  },
  milestones: [
    { name: 'Product Launch', progress: 65, completed: false },
    { name: 'First 100 Users', progress: 40, completed: false },
    { name: 'Infrastructure Setup', progress: 85, completed: false },
    { name: 'Automation Pipeline', progress: 30, completed: false }
  ]
};

export function BusinessOverview({ data = defaultData }: BusinessOverviewProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card 
      title="Business Overview" 
      icon={<DollarSign className="w-4 h-4" />}
      className="h-full"
    >
      <div className="space-y-6">
        {/* Revenue Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">💰</span>
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Revenue</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Metric 
              label="Today" 
              value={formatCurrency(data.revenue.today)} 
              trend={data.revenue.today > 0 ? 'up' : 'neutral'}
              size="sm"
            />
            <Metric 
              label="MTD" 
              value={formatCurrency(data.revenue.mtd)} 
              trend={data.revenue.mtd > 0 ? 'up' : 'neutral'}
              size="sm"
            />
            <Metric 
              label="YTD" 
              value={formatCurrency(data.revenue.ytd)} 
              trend={data.revenue.ytd > 0 ? 'up' : 'neutral'}
              size="sm"
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📊</span>
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Key Metrics</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Active Projects</span>
              <span className="text-lg font-bold text-white">{data.metrics.activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Pipeline Value</span>
              <span className="text-lg font-bold text-white">{formatCurrency(data.metrics.pipelineValue)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Conversion</span>
              <span className="text-lg font-bold text-white">{data.metrics.conversion}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Customer Health</span>
              <span className="text-lg font-bold text-green-400">{data.metrics.customerHealth}%</span>
            </div>
          </div>
        </div>

        {/* Milestones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎯</span>
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Milestones</span>
          </div>
          <div className="space-y-3">
            {data.milestones.map((milestone, i) => (
              <div key={i} className="flex items-center gap-3">
                {milestone.completed ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 border border-[#71717a] rounded flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm ${milestone.completed ? 'text-green-400 line-through' : 'text-white'}`}>
                      {milestone.name}
                    </span>
                    <span className="text-xs text-[#71717a]">{milestone.progress}%</span>
                  </div>
                  <ProgressBar 
                    value={milestone.progress} 
                    color={milestone.completed ? 'green' : milestone.progress > 50 ? 'blue' : 'yellow'}
                    showLabel={false}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
