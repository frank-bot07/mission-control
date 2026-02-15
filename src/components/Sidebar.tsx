'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { 
  LayoutDashboard, 
  ScrollText, 
  FileText, 
  Brain,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/logs', icon: ScrollText, label: 'Daily Logs' },
  { href: '/documents', icon: FileText, label: 'Documents' },
  { href: '/memory', icon: Brain, label: 'Memory' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={clsx(
      'bg-[#0d0d12] border-r border-[#27272a] flex flex-col transition-all duration-300',
      collapsed ? 'w-16' : 'w-56'
    )}>
      {/* Logo */}
      <div className="p-4 border-b border-[#27272a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🚀</span>
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-white truncate">MISSION CONTROL</h1>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'text-[#a1a1aa] hover:bg-[#1e1e26] hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-[#27272a]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-[#71717a] hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm ml-2">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
