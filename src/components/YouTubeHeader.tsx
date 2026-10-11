import React, { useState } from 'react';
import { Search, Mic, Bell, Video, Menu, Sparkles, ShieldCheck } from 'lucide-react';
import { sound } from '../utils/audio';

interface YouTubeHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  unreadCount?: number;
  activeTab: 'watch' | 'create' | 'arcade' | 'community' | 'stickers' | 'calendar';
  onTabChange: (tab: 'watch' | 'create' | 'arcade' | 'community' | 'stickers' | 'calendar') => void;
  kidSafeMode: boolean;
  onToggleKidSafe: () => void;
}

export const YouTubeHeader: React.FC<YouTubeHeaderProps> = ({
  searchQuery,
  onSearchChange,
  unreadCount = 1,
  activeTab,
  onTabChange,
  kidSafeMode,
  onToggleKidSafe,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'MP uploaded a new episode!',
      time: '3 hours ago',
      desc: 'MP learns good habits with sweet machine - Useful stories for kids',
      unread: true,
    },
    {
      id: 2,
      title: 'Milestone Celebration! 🏆',
      time: '2 days ago',
      desc: 'MP just reached 3.67M subscribers! Thank you friends!',
      unread: false,
    },
  ]);

  const handleClearUnread = () => {
    sound.playSfx('pop');
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0f0f0f] border-b border-white/10 px-4 py-2.5 flex items-center justify-between gap-4">
      {/* Left: Hamburger & YouTube Logo with Premium badge matching screenshot */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          className="p-2 hover:bg-neutral-800 rounded-full text-slate-200 transition-colors cursor-pointer"
          title="Guide Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* YouTube Brand Lockup */}
        <div
          onClick={() => onTabChange('watch')}
          className="flex items-center gap-1.5 cursor-pointer select-none group"
        >
          {/* Red Play Pill */}
          <div className="w-7 h-5 bg-red-600 rounded-md flex items-center justify-center shadow">
            <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
          </div>
          <span className="font-bold text-lg text-white tracking-tighter">
            YouTube
          </span>
          <span className="text-[10px] font-bold text-slate-400 self-start -ml-0.5 mt-0.5 tracking-tight uppercase">
            Kids
          </span>
        </div>
      </div>

      {/* Center: Search Bar (Pre-filled or customized) */}
      <div className="flex-1 max-w-xl mx-2 hidden sm:flex items-center">
        <div className="flex-1 flex items-center bg-[#121212] border border-neutral-700 focus-within:border-sky-500 rounded-l-full px-4 py-1.5 shadow-inner">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search episodes on YouTube (e.g. MP sweet machine, good habits)"
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
          />
        </div>
        <button
          onClick={() => sound.playSfx('pop')}
          className="bg-neutral-800 hover:bg-neutral-700 text-slate-200 px-5 py-2 rounded-r-full border border-l-0 border-neutral-700 transition-colors cursor-pointer"
          title="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Voice Search Button */}
        <button
          onClick={() => {
            sound.playSfx('sparkle');
            sound.speak("Listening! Say: MP sweet machine!");
          }}
          className="ml-3 p-2 bg-neutral-800 hover:bg-neutral-700 rounded-full text-slate-200 transition-colors cursor-pointer"
          title="Search with your voice"
        >
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Right: Feature Tabs & Kid-Safe Mode & Notifications & Profile Avatar */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900 p-1 rounded-full border border-white/10">
          <button
            onClick={() => {
              sound.playSfx('pop');
              onTabChange('watch');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'watch' ? 'bg-sky-500 text-sky-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            📺 Watch Show
          </button>
          <button
            onClick={() => {
              sound.playSfx('pop');
              onTabChange('arcade');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'arcade' ? 'bg-yellow-400 text-yellow-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            🍬 Sweet Machine
          </button>
          <button
            onClick={() => {
              sound.playSfx('pop');
              onTabChange('create');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'create' ? 'bg-emerald-400 text-emerald-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            ✨ Create Episode
          </button>
          <button
            onClick={() => {
              sound.playSfx('pop');
              onTabChange('calendar');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'calendar' ? 'bg-blue-500 text-white shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            📅 Calendar
          </button>
          <button
            onClick={() => {
              sound.playSfx('pop');
              onTabChange('stickers');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'stickers' ? 'bg-purple-400 text-purple-950 shadow' : 'text-slate-300 hover:text-white'
            }`}
          >
            ⭐ Stickers
          </button>
        </div>

        {/* Kid-Safe Mode Toggle */}
        <button
          onClick={onToggleKidSafe}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer border ${
            kidSafeMode
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-neutral-800 text-slate-300 hover:text-white border-white/10'
          }`}
          title="Kid Safe Mode: Enlarged controls & no distractions"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Kid Mode: {kidSafeMode ? 'ON' : 'OFF'}</span>
        </button>

        {/* Notification Bell (Matches screenshot's unread indicator: 1) */}
        <div className="relative">
          <button
            onClick={() => {
              sound.playSfx('bell');
              setShowNotifications(!showNotifications);
            }}
            className="relative p-2 hover:bg-neutral-800 rounded-full text-slate-200 transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => n.unread) && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-neutral-900 border border-white/15 rounded-2xl shadow-2xl p-4 text-white z-50 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
                <span className="font-bold text-sm">Notifications</span>
                <button
                  onClick={handleClearUnread}
                  className="text-xs text-sky-400 hover:underline cursor-pointer"
                >
                  Mark as read
                </button>
              </div>

              <div className="space-y-3">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer ${
                      n.unread ? 'bg-sky-500/15 border border-sky-400/30' : 'bg-neutral-800/60'
                    }`}
                  >
                    <div className="font-bold text-white mb-0.5">{n.title}</div>
                    <div className="text-slate-300 text-[11px] leading-tight mb-1">{n.desc}</div>
                    <div className="text-[10px] text-slate-400">{n.time}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-500 text-sky-950 font-black text-xs flex items-center justify-center shadow border border-yellow-200">
          ⭐
        </div>
      </div>
    </header>
  );
};
