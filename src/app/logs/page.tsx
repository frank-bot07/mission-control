'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter,
  MessageSquare,
  FileText,
  Settings,
  AlertTriangle,
  Trophy,
  Calendar
} from 'lucide-react';
import { format, subDays, addDays } from 'date-fns';

interface LogEntry {
  id: string;
  time: string;
  type: 'conversation' | 'document' | 'config' | 'error' | 'win';
  icon: string;
  message: string;
  details?: string;
}

const typeIcons = {
  conversation: MessageSquare,
  document: FileText,
  config: Settings,
  error: AlertTriangle,
  win: Trophy
};

const typeColors = {
  conversation: 'text-blue-400',
  document: 'text-purple-400',
  config: 'text-cyan-400',
  error: 'text-red-400',
  win: 'text-green-400'
};

// Sample data for today
const sampleLogs: LogEntry[] = [
  { id: '1', time: '02:20', type: 'config', icon: '🔧', message: 'Memory flush and session memory search enabled' },
  { id: '2', time: '02:18', type: 'document', icon: '📄', message: 'MISSION_CONTROL_DESIGN.md specification completed' },
  { id: '3', time: '02:16', type: 'conversation', icon: '💬', message: 'Chad requested dashboard build' },
  { id: '4', time: '02:15', type: 'win', icon: '🏆', message: 'Dashboard design approved by Chad' },
  { id: '5', time: '02:03', type: 'document', icon: '📄', message: 'SKILLS_RESEARCH.md created' },
  { id: '6', time: '01:58', type: 'config', icon: '🔧', message: 'AgentMail API key configured' },
  { id: '7', time: '01:46', type: 'win', icon: '🐦', message: 'X account created successfully (slow roll strategy)' },
  { id: '8', time: '01:30', type: 'error', icon: '⚠️', message: 'Twilio voice calling blocked - 10DLC compliance required', details: 'Account status shows voice calling disabled. Recommendation: Use Vapi instead.' },
  { id: '9', time: '00:28', type: 'conversation', icon: '💬', message: 'Attempted Twilio voice call test' },
  { id: '10', time: '23:22', type: 'config', icon: '🔧', message: 'Dashboard connection fixed (token + session URL)' },
  { id: '11', time: '21:14', type: 'conversation', icon: '💬', message: 'Session started - Chad returned' },
];

export default function LogsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredLogs = sampleLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !activeFilter || log.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const daySummary = {
    conversations: sampleLogs.filter(l => l.type === 'conversation').length,
    documents: sampleLogs.filter(l => l.type === 'document').length,
    tasks: 12,
    issues: sampleLogs.filter(l => l.type === 'error').length,
    wins: sampleLogs.filter(l => l.type === 'win').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📜</span>
            Daily Log Center
          </h1>
          <p className="text-[#71717a] mt-1">Complete activity archive with full readability</p>
        </div>
      </div>

      {/* Date Navigation */}
      <Card>
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setCurrentDate(subDays(currentDate, 1))}
            className="p-2 hover:bg-[#27272a] rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-[#a1a1aa]" />
          </button>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="text-xl font-semibold text-white">
              {format(currentDate, 'MMMM d, yyyy')}
            </span>
          </div>

          <button 
            onClick={() => setCurrentDate(addDays(currentDate, 1))}
            className="p-2 hover:bg-[#27272a] rounded-lg transition-colors"
            disabled={currentDate >= new Date()}
          >
            <ChevronRight className="w-5 h-5 text-[#a1a1aa]" />
          </button>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-3">
          <Card title="Timeline View" icon={<Search className="w-4 h-4" />}>
            {/* Search & Filters */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#27272a]">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#1e1e26] border border-[#27272a] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#71717a]" />
                {['conversation', 'document', 'config', 'error', 'win'].map((type) => {
                  const Icon = typeIcons[type as keyof typeof typeIcons];
                  return (
                    <button
                      key={type}
                      onClick={() => setActiveFilter(activeFilter === type ? null : type)}
                      className={`p-2 rounded-lg transition-colors ${
                        activeFilter === type 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'hover:bg-[#27272a] text-[#71717a]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Log Entries */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {filteredLogs.map((log) => {
                const Icon = typeIcons[log.type];
                return (
                  <div 
                    key={log.id}
                    className={`flex items-start gap-4 p-3 rounded-lg hover:bg-[#1e1e26] transition-colors ${
                      log.type === 'error' ? 'bg-red-500/10 border border-red-500/30' : ''
                    }`}
                  >
                    <span className="text-lg flex-shrink-0">{log.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${log.type === 'error' ? 'text-red-400' : 'text-white'}`}>
                        {log.message}
                      </p>
                      {log.details && (
                        <p className="text-xs text-[#71717a] mt-1">{log.details}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Icon className={`w-4 h-4 ${typeColors[log.type]}`} />
                      <span className="text-xs text-[#71717a] font-mono">{log.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Day Summary */}
        <div className="lg:col-span-1">
          <Card title="Day Summary" icon={<span className="text-lg">📊</span>}>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[#27272a]">
                <span className="text-sm text-[#71717a]">Total Entries</span>
                <span className="text-lg font-bold text-white">{sampleLogs.length}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-[#a1a1aa]">Conversations</span>
                  </div>
                  <span className="text-sm text-white">{daySummary.conversations}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-[#a1a1aa]">Documents</span>
                  </div>
                  <span className="text-sm text-white">{daySummary.documents}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm text-[#a1a1aa]">Config Changes</span>
                  </div>
                  <span className="text-sm text-white">4</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-sm text-[#a1a1aa]">Issues</span>
                  </div>
                  <span className="text-sm text-white">{daySummary.issues}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-[#a1a1aa]">Wins</span>
                  </div>
                  <span className="text-sm text-white">{daySummary.wins}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#27272a] space-y-2">
                <button className="w-full py-2 text-sm text-blue-400 hover:bg-blue-600/20 rounded-lg transition-colors">
                  Export Day
                </button>
                <button className="w-full py-2 text-sm text-[#a1a1aa] hover:bg-[#27272a] rounded-lg transition-colors">
                  Compare to Yesterday
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
