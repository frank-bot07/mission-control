'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { 
  Search, 
  FolderOpen,
  FileText,
  Clock,
  Download,
  Eye,
  X,
  ChevronRight
} from 'lucide-react';
import { format } from 'date-fns';

interface Document {
  id: string;
  name: string;
  description: string;
  category: string;
  size: string;
  createdAt: Date;
  modifiedAt: Date;
  content?: string;
}

const categories = [
  { id: 'strategy', name: 'Strategy & Planning', icon: '📋', count: 2 },
  { id: 'operations', name: 'Daily Operations', icon: '📅', count: 5 },
  { id: 'config', name: 'Configuration', icon: '⚙️', count: 4 },
  { id: 'research', name: 'Research & Analysis', icon: '🔬', count: 2 },
  { id: 'archive', name: 'Archive', icon: '📦', count: 0 },
];

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'MISSION_CONTROL_DESIGN.md',
    description: 'Executive dashboard specification',
    category: 'strategy',
    size: '15.2 KB',
    createdAt: new Date(),
    modifiedAt: new Date(),
    content: '# Chad\'s Mission Control Dashboard\n\nExecutive-Grade Business Operations Command Center...'
  },
  {
    id: '2',
    name: 'SKILLS_RESEARCH.md',
    description: 'OpenClaw skills analysis and recommendations',
    category: 'research',
    size: '12.8 KB',
    createdAt: new Date(),
    modifiedAt: new Date(),
    content: '# OpenClaw Skills Research Report\n\n53 skills analyzed, 23 HIGH priority...'
  },
  {
    id: '3',
    name: 'MEMORY.md',
    description: 'Long-term memory and context',
    category: 'config',
    size: '4.2 KB',
    createdAt: new Date(Date.now() - 86400000),
    modifiedAt: new Date(),
  },
  {
    id: '4',
    name: 'DAILY_BRIEF.md',
    description: 'Daily priorities and context',
    category: 'operations',
    size: '2.1 KB',
    createdAt: new Date(Date.now() - 86400000),
    modifiedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '5',
    name: 'AGENTS.md',
    description: 'Agent behavior configuration',
    category: 'config',
    size: '3.8 KB',
    createdAt: new Date(Date.now() - 172800000),
    modifiedAt: new Date(Date.now() - 86400000),
  },
  {
    id: '6',
    name: 'SOUL.md',
    description: 'Frank\'s personality and identity',
    category: 'config',
    size: '1.2 KB',
    createdAt: new Date(Date.now() - 172800000),
    modifiedAt: new Date(Date.now() - 172800000),
  },
  {
    id: '7',
    name: '2026-02-05.md',
    description: 'Today\'s daily log',
    category: 'operations',
    size: '8.4 KB',
    createdAt: new Date(),
    modifiedAt: new Date(),
  },
  {
    id: '8',
    name: '2026-02-04.md',
    description: 'Yesterday\'s daily log',
    category: 'operations',
    size: '12.1 KB',
    createdAt: new Date(Date.now() - 86400000),
    modifiedAt: new Date(Date.now() - 86400000),
  },
];

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const filteredDocuments = sampleDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const recentDocuments = [...sampleDocuments]
    .sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <span className="text-3xl">📚</span>
            Document Library
          </h1>
          <p className="text-[#71717a] mt-1">Central repository of all created documents</p>
        </div>
        <div className="text-sm text-[#71717a]">
          Total: {sampleDocuments.length} Documents
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card title="Categories" icon={<FolderOpen className="w-4 h-4" />}>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  !selectedCategory ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#1e1e26] text-[#a1a1aa]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>📁</span>
                  <span className="text-sm">All Documents</span>
                </div>
                <span className="text-xs">{sampleDocuments.length}</span>
              </button>
              
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === cat.id ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-[#1e1e26] text-[#a1a1aa]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="text-sm">{cat.name}</span>
                  </div>
                  <span className="text-xs">
                    {sampleDocuments.filter(d => d.category === cat.id).length}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71717a]" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#111118] border border-[#27272a] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Recent Documents */}
          {!searchQuery && !selectedCategory && (
            <Card title="Recent Documents" icon={<Clock className="w-4 h-4" />} className="mb-6">
              <div className="space-y-2">
                {recentDocuments.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#1e1e26] rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{doc.name}</p>
                        <p className="text-xs text-[#71717a]">{doc.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#71717a]">
                        {format(doc.modifiedAt, 'MMM d, HH:mm')}
                      </span>
                      <span className="text-xs text-[#71717a]">{doc.size}</span>
                      <ChevronRight className="w-4 h-4 text-[#71717a]" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* All Documents */}
          <Card 
            title={selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'All Documents'} 
            icon={<FileText className="w-4 h-4" />}
          >
            <div className="space-y-2">
              {filteredDocuments.length === 0 ? (
                <p className="text-center text-[#71717a] py-8">No documents found</p>
              ) : (
                filteredDocuments.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDocument(doc)}
                    className="w-full flex items-center justify-between p-3 hover:bg-[#1e1e26] rounded-lg transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm font-medium text-white">{doc.name}</p>
                        <p className="text-xs text-[#71717a]">{doc.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-[#71717a]">
                        {format(doc.modifiedAt, 'MMM d')}
                      </span>
                      <span className="text-xs text-[#71717a]">{doc.size}</span>
                      <Eye className="w-4 h-4 text-[#71717a]" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-[#111118] border border-[#27272a] rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272a]">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">{selectedDocument.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-[#27272a] rounded-lg transition-colors">
                  <Download className="w-4 h-4 text-[#a1a1aa]" />
                </button>
                <button 
                  onClick={() => setSelectedDocument(null)}
                  className="p-2 hover:bg-[#27272a] rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-[#a1a1aa]" />
                </button>
              </div>
            </div>
            
            <div className="px-6 py-2 text-xs text-[#71717a] border-b border-[#27272a]">
              Created: {format(selectedDocument.createdAt, 'MMM d, yyyy HH:mm')} | 
              Modified: {format(selectedDocument.modifiedAt, 'MMM d, yyyy HH:mm')} | 
              Size: {selectedDocument.size}
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <pre className="text-sm text-[#e4e4e7] whitespace-pre-wrap font-mono">
                {selectedDocument.content || 'Document content would be loaded here...'}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
