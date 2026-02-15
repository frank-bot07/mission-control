'use client';

import { PageHeader } from '@/components/PageHeader';
import { 
  BusinessOverview, 
  OperationsDashboard, 
  CommunicationHub, 
  IntelligencePanel,
  ActivityFeed,
  CommandCenter 
} from '@/components/panels';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <PageHeader alerts={1} />
      
      <div className="p-6">
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🚀</span>
            {process.env.NEXT_PUBLIC_APP_TITLE || 'Mission Control'}
          </h1>
          <p className="text-[#71717a] mt-1">Executive Operations Command Center</p>
        </div>

        {/* Main Grid - 4 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {/* Business Overview */}
          <div>
            <BusinessOverview />
          </div>
          
          {/* Operations Dashboard */}
          <div>
            <OperationsDashboard />
          </div>
          
          {/* Communication Hub */}
          <div>
            <CommunicationHub />
          </div>
          
          {/* Intelligence Panel */}
          <div>
            <IntelligencePanel />
          </div>
        </div>

        {/* Command Center - Full width */}
        <div className="mt-6">
          <CommandCenter />
        </div>

        {/* Activity Feed - Full width */}
        <div className="mt-6">
          <ActivityFeed />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#27272a] px-6 py-4 mt-6">
        <div className="flex items-center justify-between text-xs text-[#71717a]">
          <span>Mission Control v1.0</span>
          <span>Last updated: just now</span>
        </div>
      </footer>
    </div>
  );
}
