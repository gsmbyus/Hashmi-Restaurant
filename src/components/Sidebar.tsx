import React from 'react';
import { 
  LayoutDashboard, 
  DoorClosed, 
  CalendarCheck, 
  Users, 
  Receipt, 
  Wallet, 
  FileSpreadsheet, 
  ShieldAlert, 
  Settings, 
  Code2,
  LogOut,
  Sparkles,
  Crown,
  Edit2,
  Phone,
  UtensilsCrossed,
  ExternalLink
} from 'lucide-react';
import { User, HotelSettings } from '../types';
import { DEFAULT_LOGO_URL, DEFAULT_PORTRAIT_URL } from '../data/initialData';
import { playClickSound } from '../utils/audio';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: User | null;
  hotelSettings: HotelSettings;
  onLogout: () => void;
  onOpenLogoEditor: () => void;
  availableRoomsCount: number;
  activeBookingsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  hotelSettings,
  onLogout,
  onOpenLogoEditor,
  availableRoomsCount,
  activeBookingsCount
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      labelEn: 'Dashboard & Overview',
      labelUrdu: 'ڈیش بورڈ اور جائزہ',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'rooms',
      labelEn: 'Tables & Rooms Matrix',
      labelUrdu: 'ڈائننگ ٹیبلز اور کمرے',
      icon: DoorClosed,
      badge: `${availableRoomsCount} Available`
    },
    {
      id: 'bookings',
      labelEn: 'Bookings & Orders',
      labelUrdu: 'بکنگ، ریزرویشن و آرڈرز',
      icon: CalendarCheck,
      badge: `${activeBookingsCount} Active`
    },
    {
      id: 'customers',
      labelEn: 'Guest Directory',
      labelUrdu: 'معزز مہمان ڈائریکٹری',
      icon: Users,
      badge: null
    },
    {
      id: 'invoices',
      labelEn: 'Invoices & POS Billing',
      labelUrdu: 'انوائس، بلنگ اور رسیدیں',
      icon: Receipt,
      badge: null
    },
    {
      id: 'finance',
      labelEn: 'Financial Accounts',
      labelUrdu: 'آمدنی و اخراجات کا کھاتہ',
      icon: Wallet,
      badge: null
    },
    {
      id: 'reports',
      labelEn: 'Analytics & Reports',
      labelUrdu: 'رپورٹس اور تفصیلی تجزیات',
      icon: FileSpreadsheet,
      badge: null
    },
    {
      id: 'python-code',
      labelEn: 'Python main.py & EXE',
      labelUrdu: 'پائیتھن کوڈ اور EXE میکر',
      icon: Code2,
      badge: 'v2.1',
      highlight: true
    },
    {
      id: 'admin',
      labelEn: 'Admin Control Panel',
      labelUrdu: 'ایڈمن کنٹرول و سیکیورٹی',
      icon: ShieldAlert,
      badge: currentUser?.role === 'admin' ? 'Owner' : null
    },
    {
      id: 'settings',
      labelEn: 'System Settings',
      labelUrdu: 'سسٹم و ہوٹل سیٹنگز',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside className="w-64 md:w-72 bg-[#0E1015] border-r border-amber-500/20 flex flex-col h-screen shrink-0 text-white z-30 select-none shadow-2xl relative">
      {/* Brand Header */}
      <div className="p-4 md:p-5 border-b border-amber-500/20 bg-[#12141A] relative">
        <div className="flex items-center gap-3">
          {/* Circular Gold Medallion Logo Frame with Edit trigger */}
          <div className="relative group">
            <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 shadow-lg cursor-pointer">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0B0E] p-0.5 border border-amber-400/80 flex items-center justify-center">
                <img
                  src={hotelSettings.logoUrl || DEFAULT_LOGO_URL}
                  alt={hotelSettings.hotelNameEn || 'Hashmi Restaurant'}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Quick Edit Overlay Button */}
            <button
              onClick={() => {
                playClickSound();
                onOpenLogoEditor();
              }}
              title="Change / Edit Logo"
              className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-md transition-transform transform hover:scale-110"
            >
              <Edit2 className="w-2.5 h-2.5 stroke-[2.5]" />
            </button>
          </div>

          <div className="overflow-hidden flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-sm md:text-base font-black font-cinzel text-gold-gradient tracking-wide uppercase truncate">
                {hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'}
              </span>
            </div>
            <div className="text-[11px] text-amber-200/70 font-serif truncate">
              {hotelSettings.hotelNameUrdu || 'ہاشمی ریسٹورنٹ اینڈ ہوٹل'}
            </div>
          </div>
        </div>

        {/* Developer Attribution Tag */}
        <div className="mt-3 flex items-center justify-between px-2.5 py-1 rounded-xl bg-[#0A0B0E] border border-amber-500/30 text-[11px] text-amber-300">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate font-semibold">GSM_BY_US • Usama Saif</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">v2.1</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => {
                playClickSound();
                setCurrentTab(item.id);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 text-left group ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent text-amber-300 font-bold border-l-4 border-amber-400 shadow-md'
                  : item.highlight
                  ? 'bg-[#1A1D24] text-amber-200 hover:bg-[#222733] border border-amber-500/20'
                  : 'text-gray-300 hover:bg-[#16181F] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive
                      ? 'text-amber-400 scale-110'
                      : item.highlight
                      ? 'text-amber-300'
                      : 'text-gray-400 group-hover:text-amber-400'
                  }`}
                />
                <div className="truncate">
                  <div className="leading-tight truncate">{item.labelEn}</div>
                  <div className="text-[10px] text-gray-500 font-serif truncate font-normal">{item.labelUrdu}</div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-md font-medium shrink-0 ml-1 ${
                    isActive
                      ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                      : item.highlight
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Executive Developer Portrait & Location Card */}
      <div className="p-3 mx-3 mb-2 rounded-2xl bg-[#12141A] border border-amber-500/20 text-xs space-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0B0E]">
              <img
                src={hotelSettings.portraitUrl || DEFAULT_PORTRAIT_URL}
                alt="Usama Saif"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-[11px] font-bold text-white leading-tight truncate">
              {hotelSettings.developer.name}
            </p>
            <p className="text-[10px] text-amber-400/80 truncate">
              Lead Architect • {hotelSettings.developer.brand}
            </p>
          </div>
        </div>

        <div className="text-[10px] text-gray-400 flex items-center justify-between pt-1 border-t border-amber-500/10">
          <span className="truncate">Haveli Bahadur Shah, Jhang</span>
          <span className="font-mono text-amber-300">{hotelSettings.phone}</span>
        </div>
      </div>

      {/* User Session Footer */}
      <div className="p-3.5 border-t border-amber-500/20 bg-[#12141A] flex items-center justify-between">
        <div className="flex items-center gap-2.5 truncate">
          <div className="w-8 h-8 rounded-full bg-[#1A1D24] border border-amber-500/30 flex items-center justify-center text-xs font-bold text-amber-300">
            {currentUser ? currentUser.fullName.charAt(0) : 'H'}
          </div>
          <div className="truncate">
            <p className="text-xs font-bold text-gray-200 truncate leading-tight">
              {currentUser ? currentUser.fullName : 'Salar Khan'}
            </p>
            <p className="text-[10px] text-amber-400 capitalize flex items-center gap-1">
              <Crown className="w-2.5 h-2.5" />
              <span>{currentUser ? currentUser.role : 'Admin'}</span>
            </p>
          </div>
        </div>

        <button
          id="btn-sidebar-logout"
          onClick={() => {
            playClickSound();
            onLogout();
          }}
          title="Sign Out"
          className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
