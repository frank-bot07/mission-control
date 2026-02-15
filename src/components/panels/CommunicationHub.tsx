'use client';

import { Card } from '../ui/Card';
import { MessageSquare, Mail, Send, Twitter } from 'lucide-react';

interface CommunicationData {
  email: {
    total: number;
    unread: number;
    urgent: number;
    respondedToday: number;
    avgResponseTime: string;
  };
  telegram: {
    messagesToday: number;
    pendingMentions: number;
    activeGroups: number;
    lastMessage: string;
  };
  social: {
    xActive: boolean;
    followers: number;
    followerChange: number;
    engagement: number;
    scheduledPosts: number;
  };
}

interface CommunicationHubProps {
  data?: CommunicationData;
}

const defaultData: CommunicationData = {
  email: {
    total: 12,
    unread: 3,
    urgent: 0,
    respondedToday: 5,
    avgResponseTime: '2.1h'
  },
  telegram: {
    messagesToday: 48,
    pendingMentions: 0,
    activeGroups: 0,
    lastMessage: '5m ago'
  },
  social: {
    xActive: true,
    followers: 2,
    followerChange: 2,
    engagement: 0,
    scheduledPosts: 0
  }
};

export function CommunicationHub({ data = defaultData }: CommunicationHubProps) {
  return (
    <Card 
      title="Communication Hub" 
      icon={<MessageSquare className="w-4 h-4" />}
      className="h-full"
    >
      <div className="space-y-6">
        {/* Email Status */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Mail className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Email Status</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <div>
              <span className="text-xs text-[#71717a]">Inbox</span>
              <p className="text-lg font-bold text-white">{data.email.total} total</p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Unread</span>
              <p className="text-lg font-bold text-white">
                {data.email.unread}
                {data.email.urgent > 0 && (
                  <span className="text-red-400 text-sm ml-1">({data.email.urgent} urgent)</span>
                )}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Responded Today</span>
              <p className="text-sm text-white">{data.email.respondedToday}</p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Avg Response</span>
              <p className="text-sm text-white">{data.email.avgResponseTime}</p>
            </div>
          </div>
        </div>

        {/* Telegram Activity */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Send className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Telegram Activity</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <div>
              <span className="text-xs text-[#71717a]">Messages Today</span>
              <p className="text-lg font-bold text-white">{data.telegram.messagesToday}</p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Pending Mentions</span>
              <p className="text-lg font-bold text-white">{data.telegram.pendingMentions}</p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Active Groups</span>
              <p className="text-sm text-white">{data.telegram.activeGroups}</p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Last Message</span>
              <p className="text-sm text-white">{data.telegram.lastMessage}</p>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Twitter className="w-4 h-4 text-[#71717a]" />
            <span className="text-sm font-medium text-[#a1a1aa] uppercase">Social Media</span>
          </div>
          <div className="grid grid-cols-2 gap-y-2">
            <div>
              <span className="text-xs text-[#71717a]">X Account</span>
              <div className="flex items-center gap-2">
                <span className={`status-dot status-${data.social.xActive ? 'green' : 'red'}`} />
                <span className="text-sm text-white">{data.social.xActive ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Followers</span>
              <p className="text-lg font-bold text-white">
                {data.social.followers.toLocaleString()}
                {data.social.followerChange !== 0 && (
                  <span className={`text-sm ml-1 ${data.social.followerChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ({data.social.followerChange > 0 ? '+' : ''}{data.social.followerChange})
                  </span>
                )}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Engagement</span>
              <p className="text-sm text-white">{data.social.engagement}%</p>
            </div>
            <div>
              <span className="text-xs text-[#71717a]">Scheduled Posts</span>
              <p className="text-sm text-white">{data.social.scheduledPosts}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
