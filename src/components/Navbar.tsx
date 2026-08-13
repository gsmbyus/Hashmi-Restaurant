import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PlusCircle, 
  Clock, 
  Calendar,
  Sparkles,
  Zap,
  Code2,
  Moon,
  Sun,
  Play,
  Edit3,
  Crown
} from 'lucide-react';
import { HotelSettings, User } from '../types';
import { playClickSound, playRoyalIntroSound } from '../utils/audio';

interface NavbarProps {
  currentUser: User | null;
  hotelSettings: HotelSettings;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onReplayIntro: () => void;
  onOpenQuickCheckIn: () => void;
  onOpenNewBooking: () => void;
  onOpenPythonCode: () => void;
  onOpenQuickSettings: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  hotelSettings,
  themeMode,
  onToggleTheme,
  onReplayIntro,
  onOpenQuickCheckIn,
  onOpenNewBooking,
  onOpenPythonCode,
  onOpenQuickSettings,
  onSearchChange,
  searchQuery,
}) => {
  const [time, setTime] = useState<string>('');
  const [dateStr, setDateStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }));
      setDateStr(now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-[#12141A] border-b border-amber-500/20 px-4 md:px-6 flex items-center justify-between gap-3 z-20 shrink-0 select-none">
      {/* Title & Quick Edit Badge */}
      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-[#0A0B0E] rounded-[6px] flex items-center justify-center">
              <Crown className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm font-black font-cinzel text-gold-gradient tracking-wide uppercase">
                {hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'}
              </h1>
              <button
                onClick={() => {
                  playClickSound();
                  onOpenQuickSettings();
                }}
                title="Edit Title Name & Settings"
                className="p-1 rounded text-amber-400/70 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
              >
                <Edit3 className="w-3 h-3" />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 font-serif">
              {hotelSettings.taglineEn ? hotelSettings.taglineEn.slice(0, 45) + '...' : 'Luxury Restaurant Management'}
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative w-48 sm:w-64 lg:w-80 ml-2">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-amber-400/60" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tables, rooms, bookings, guests..."
            className="w-full bg-[#0A0B0E] border border-amber-500/20 rounded-xl pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-400 font-medium"
          />
        </div>
      </div>

      {/* Center Live Clock */}
      <div className="hidden xl:flex items-center gap-3 px-3 py-1 rounded-xl bg-[#0A0B0E] border border-amber-500/20 text-xs">
        <div className="flex items-center gap-1.5 text-amber-300 font-mono font-semibold">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>{time || '12:00:00 PM'}</span>
        </div>
        <div className="w-px h-3 bg-amber-500/20" />
        <div className="flex items-center gap-1 text-gray-400 text-[11px]">
          <Calendar className="w-3 h-3 text-amber-400/80" />
          <span>{dateStr}</span>
        </div>
      </div>

      {/* Action Buttons Right */}
      <div className="flex items-center gap-2">
        {/* Replay Intro Screen */}
        <button
          id="btn-replay-intro"
          onClick={() => {
            playRoyalIntroSound();
            onReplayIntro();
          }}
          title="Replay Royal Intro Animation with Sound"
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#1A1D24] hover:bg-[#252A36] border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm transition-all"
        >
          <Play className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>Intro</span>
        </button>

        {/* Theme Mode Toggle (Dark / Light) */}
        <button
          id="btn-toggle-theme"
          onClick={() => {
            playClickSound();
            onToggleTheme();
          }}
          title={themeMode === 'dark' ? 'Switch to Light Gold Theme' : 'Switch to Dark Black & Gold Theme'}
          className="p-2 rounded-xl bg-[#1A1D24] hover:bg-[#252A36] border border-amber-500/30 text-amber-300 transition-colors"
        >
          {themeMode === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Python Exporter Quick Link */}
        <button
          id="btn-navbar-python-exporter"
          onClick={() => {
            playClickSound();
            onOpenPythonCode();
          }}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1D24] hover:bg-[#222733] border border-amber-500/30 text-amber-200 text-xs font-semibold shadow-sm transition-all"
        >
          <Code2 className="w-3.5 h-3.5 text-amber-400" />
          <span>main.py</span>
        </button>

        {/* Quick Check-in / Order */}
        <button
          id="btn-navbar-quick-checkin"
          onClick={() => {
            playClickSound();
            onOpenQuickCheckIn();
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1E222D] hover:bg-[#282E3D] border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-sm transition-all"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Quick Check-in</span>
        </button>

        {/* New Booking / Table Reservation */}
        <button
          id="btn-navbar-new-booking"
          onClick={() => {
            playClickSound();
            onOpenNewBooking();
          }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black shadow-lg shadow-amber-950/40 transition-all active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Booking</span>
        </button>
      </div>
    </header>
  );
};
