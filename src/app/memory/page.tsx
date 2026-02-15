'use client';

import { useState } from 'react';
import { Card, ProgressBar } from '@/components/ui/Card';
import { 
  Search, 
  Database,
  MessageSquare,
  FileText,
  Clock,
  Shield,
  Cloud,
  Download,
  RefreshCw,
  Settings,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface SessionArchive {
  id: string;
  date: Date;
  sessions: Array<{
    id: string;
    name: string;
    type: 'telegram' | 'subagent';
    messages?: number;
    tokens?: number;
  }>;
}

interface SearchResult {
  id: string;
  query: string;
  resultCount: number;
  sessions: number;
}

const storageStats = {
  sessionTranscripts: { files: 156, size: '1.8 GB' },
  dailyLogs: { files: 34, size: '420 KB' },
  documents: { files: 24, size: '180 KB' },
  systemLogs: { files: 89, size: '45 MB' },
  archived: { bundles: 12, size: '890 MB' },
  total: { used: 2.4, max: 10 }
};

const healthStatus = {
  lastBackup: new Date(Date.now() - 2 * 60 * 60 * 1000),
  compression: 'None active (full retention)',
  searchIndex: 'Up to date',
  cloudSync: true
};

const sessionArchives: SessionArchive[] = [
  {
    id: '1',
    date: new Date(),
    sessions: [
      { id: 's1', name: 'telegram:dm:8528277478 (Chad)', type: 'telegram', messages: 47 },
      { id: 's2', name: 'subagent:skills-research', type: 'subagent', tokens: 34900 },
      { id: 's3', name: 'subagent:mission-control', type: 'subagent', tokens: 25800 },
    ]
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000),
    sessions: [
      { id: 's4', name: 'telegram:dm:8528277478 (Chad)', type: 'telegram', messages: 89 },
      { id: 's5', name: 'telegram:dm:8212390197 (Chad-2)', type: 'telegram', messages: 12 },
    ]
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000),
    sessions: [
      { id: 's6', name: 'telegram:dm:8528277478 (Chad)', type: 'telegram', messages: 156 },
    ]
  },
];

const recentSearches: SearchResult[] = [
  { id: '1', query: 'Twilio setup', resultCount: 12, sessions: 3 },
  { id: '2', query: 'dashboard requirements', resultCount: 8, sessions: 2 },
  { id: '3', query: 'business goals', resultCount: 23, sessions: 5 },
];

export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Simulate search
    setTimeout(() => setIsSearching(false), 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">🧠</span>
            Memory Depository
          </h1>
          <p className="text-[#71717a] mt-1">Persistent storage - Full context retention forever</p>
        </div>
        <div className="text-sm text-[#71717a]">
          Storage: {storageStats.total.used} GB / {storageStats.total.max} GB
        </div>
      </div>

      {/* Storage Overview */}
      <Card title="Memory Overview" icon={<Database className="w-4 h-4" />}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <StorageStat 
            label="Session Transcripts" 
            files={storageStats.sessionTranscripts.files} 
            size={storageStats.sessionTranscripts.size}
            icon={<MessageSquare className="w-4 h-4 text-blue-400" />}
          />
          <StorageStat 
            label="Daily Logs" 
            files={storageStats.dailyLogs.files} 
            size={storageStats.dailyLogs.size}
            icon={<FileText className="w-4 h-4 text-purple-400" />}
          />
          <StorageStat 
            label="Documents" 
            files={storageStats.documents.files} 
            size={storageStats.documents.size}
            icon={<FileText className="w-4 h-4 text-cyan-400" />}
          />
          <StorageStat 
            label="System Logs" 
            files={storageStats.systemLogs.files} 
            size={storageStats.systemLogs.size}
            icon={<Settings className="w-4 h-4 text-[#71717a]" />}
          />
          <StorageStat 
            label="Archived" 
            files={storageStats.archived.bundles} 
            size={storageStats.archived.size}
            icon={<Database className="w-4 h-4 text-yellow-400" />}
            unit="bundles"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Memory Health */}
        <div className="lg:col-span-1">
          <Card title="Memory Health" icon={<Shield className="w-4 h-4" />}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#71717a]">Last Backup</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">
                    {format(healthStatus.lastBackup, 'HH:mm')} ({Math.round((Date.now() - healthStatus.lastBackup.getTime()) / 3600000)}h ago)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#71717a]">Compression</span>
                <span className="text-sm text-green-400">{healthStatus.compression}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#71717a]">Search Index</span>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-white">{healthStatus.searchIndex}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#71717a]">Cloud Sync</span>
                <div className="flex items-center gap-2">
                  <Cloud className={`w-4 h-4 ${healthStatus.cloudSync ? 'text-green-400' : 'text-[#71717a]'}`} />
                  <span className="text-sm text-white">
                    {healthStatus.cloudSync ? 'Enabled (encrypted)' : 'Disabled'}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27272a]">
                <ProgressBar 
                  label="Storage Used"
                  value={Math.round((storageStats.total.used / storageStats.total.max) * 100)}
                  color={storageStats.total.used / storageStats.total.max > 0.8 ? 'red' : 'blue'}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button className="flex-1 py-2 text-sm text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Backup Now
                </button>
                <button className="flex-1 py-2 text-sm text-[#a1a1aa] hover:bg-[#27272a] rounded-lg transition-colors flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </Card>

          {/* Retention Settings */}
          <Card title="Retention Settings" icon={<Settings className="w-4 h-4" />} className="mt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#71717a]">Keep full transcripts</span>
                <span className="text-sm text-green-400 font-medium">Forever</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#71717a]">Auto-archive after</span>
                <span className="text-sm text-white">30 days</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-[#71717a]">Backup frequency</span>
                <span className="text-sm text-white">Every 6 hours</span>
              </div>
              <button className="w-full py-2 mt-2 text-sm text-[#a1a1aa] hover:bg-[#27272a] rounded-lg transition-colors">
                Configure Retention
              </button>
            </div>
          </Card>
        </div>

        {/* Session Archive */}
        <div className="lg:col-span-2">
          {/* Semantic Search */}
          <Card title="Semantic Search" icon={<Search className="w-4 h-4" />} className="mb-6">
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                  <input
                    type="text"
                    placeholder='Search across all memory: "What did we decide about X?"'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 bg-[#1e1e26] border border-[#27272a] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>

              <div>
                <p className="text-xs text-[#71717a] mb-2">Recent searches:</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search.id}
                      onClick={() => setSearchQuery(search.query)}
                      className="px-3 py-1.5 bg-[#1e1e26] hover:bg-[#27272a] rounded-lg text-xs text-[#a1a1aa] transition-colors"
                    >
                      &ldquo;{search.query}&rdquo; → {search.resultCount} results
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Session Archive */}
          <Card title="Session Archive (Full Transcripts)" icon={<Clock className="w-4 h-4" />}>
            <div className="space-y-4">
              {sessionArchives.map((archive) => (
                <div key={archive.id} className="border border-[#27272a] rounded-lg overflow-hidden">
                  <div className="px-4 py-3 bg-[#1e1e26] border-b border-[#27272a]">
                    <span className="text-sm font-medium text-white">
                      {format(archive.date, 'MMMM d, yyyy')}
                    </span>
                  </div>
                  <div className="divide-y divide-[#27272a]">
                    {archive.sessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1e1e26] transition-colors">
                        <div className="flex items-center gap-3">
                          {session.type === 'telegram' ? (
                            <MessageSquare className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Settings className="w-4 h-4 text-purple-400" />
                          )}
                          <span className="text-sm text-white">{session.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xs text-[#71717a]">
                            {session.messages ? `${session.messages} messages` : `${(session.tokens! / 1000).toFixed(1)}k tokens`}
                          </span>
                          <button className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                            Read Full <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StorageStat({ 
  label, 
  files, 
  size, 
  icon,
  unit = 'files'
}: { 
  label: string; 
  files: number; 
  size: string; 
  icon: React.ReactNode;
  unit?: string;
}) {
  return (
    <div className="p-3 bg-[#1e1e26] rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-[#71717a]">{label}</span>
      </div>
      <p className="text-lg font-bold text-white">{files} <span className="text-xs text-[#71717a] font-normal">{unit}</span></p>
      <p className="text-xs text-[#71717a]">{size}</p>
    </div>
  );
}
