'use client';

import { Card } from '../ui/Card';
import { TrendingUp, Lightbulb, BarChart3, Target } from 'lucide-react';

interface IntelligenceData {
  marketNews: {
    newArticles: number;
    status: 'active' | 'scanning' | 'error';
  };
  competitors: {
    alerts: number;
    status: 'watching' | 'alert' | 'quiet';
  };
  opportunities: {
    qualifiedLeads: number;
    potential: number;
  };
  trends: Array<{
    topic: string;
    change: number;
  }>;
  pipeline: {
    hotLeads: { value: number; count: number };
    warmLeads: { value: number; count: number };
    followUps: number;
    pendingProposals: number;
  };
  competitive: {
    mentions: number;
    mentionChange: number;
    shareOfVoice: number;
    sentiment: number;
  };
}

interface IntelligencePanelProps {
  data?: IntelligenceData;
}

const defaultData: IntelligenceData = {
  marketNews: {
    newArticles: 0,
    status: 'active'
  },
  competitors: {
    alerts: 0,
    status: 'quiet'
  },
  opportunities: {
    qualifiedLeads: 0,
    potential: 0
  },
  trends: [
    { topic: 'AI Automation', change: 34 },
    { topic: 'Business Tools', change: 18 },
    { topic: 'Productivity', change: 12 }
  ],
  pipeline: {
    hotLeads: { value: 0, count: 0 },
    warmLeads: { value: 0, count: 0 },
    followUps: 0,
    pendingProposals: 0
  },
  competitive: {
    mentions: 0,
    mentionChange: 0,
    shareOfVoice: 0,
    sentiment: 0
  }
};

export function IntelligencePanel({ data = defaultData }: IntelligencePanelProps) {
  const formatCurrency = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  return (
    <Card 
      title="Intelligence & Research" 
      icon={<TrendingUp className="w-4 h-4" />}
      className="h-full"
    >
      <div className="space-y-6">
        {/* Market Intelligence */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">📈</span>
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Market Intelligence</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Industry News</span>
              <div className="flex items-center gap-2">
                <span className={`status-dot status-${data.marketNews.status === 'active' ? 'green' : 'yellow'}`} />
                <span className="text-sm text-white">{data.marketNews.newArticles} new articles</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Competitor Alerts</span>
              <div className="flex items-center gap-2">
                <span className={`status-dot status-${data.competitors.alerts > 0 ? 'yellow' : 'green'}`} />
                <span className="text-sm text-white">{data.competitors.alerts} alerts</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Opportunities</span>
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white">{data.opportunities.qualifiedLeads} qualified</span>
              </div>
            </div>
          </div>
          
          {/* Trends */}
          <div className="mt-3 pt-3 border-t border-[#27272a]">
            <span className="text-xs text-[#71717a]">Trending Topics</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {data.trends.map((trend, i) => (
                <span key={i} className="px-2 py-1 bg-[#1e1e26] rounded text-xs text-[#a1a1aa]">
                  {trend.topic} <span className="text-green-400">↑{trend.change}%</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Opportunity Pipeline */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Opportunity Pipeline</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Hot Leads</span>
              <span className="text-sm text-white">
                {formatCurrency(data.pipeline.hotLeads.value)} ({data.pipeline.hotLeads.count} prospects)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Warm Leads</span>
              <span className="text-sm text-white">
                {formatCurrency(data.pipeline.warmLeads.value)} ({data.pipeline.warmLeads.count} prospects)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Follow-ups</span>
              <span className="text-sm text-white">📅 {data.pipeline.followUps} scheduled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Proposals</span>
              <span className="text-sm text-white">💼 {data.pipeline.pendingProposals} pending</span>
            </div>
          </div>
        </div>

        {/* Competitive Analysis */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Competitive Analysis</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Mentions</span>
              <span className="text-sm text-white">
                📊 {data.competitive.mentionChange >= 0 ? '+' : ''}{data.competitive.mentionChange}% this week
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Share of Voice</span>
              <span className="text-sm text-white">🎯 {data.competitive.shareOfVoice}% in niche</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#71717a]">Sentiment</span>
              <span className="text-sm text-white">
                {data.competitive.sentiment >= 70 ? '😊' : data.competitive.sentiment >= 40 ? '😐' : '😟'} {data.competitive.sentiment}% positive
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
