import React from 'react';
import { 
  DoorClosed, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Sparkles, 
  CalendarCheck, 
  ShieldCheck, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Code2,
  Phone,
  Crown,
  Edit2,
  UtensilsCrossed,
  Image as ImageIcon
} from 'lucide-react';
import { Room, Booking, Customer, Income, Expense, HotelSettings } from '../types';
import { DEFAULT_LOGO_URL } from '../data/initialData';
import { playClickSound } from '../utils/audio';

interface DashboardProps {
  rooms: Room[];
  bookings: Booking[];
  customers: Customer[];
  income: Income[];
  expenses: Expense[];
  hotelSettings: HotelSettings;
  onNavigateTab: (tab: string) => void;
  onOpenQuickCheckIn: () => void;
  onOpenNewBooking: () => void;
  onOpenAddExpense: () => void;
  onOpenLogoEditor: () => void;
  onToggleRoomStatus: (roomId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  rooms,
  bookings,
  customers,
  income,
  expenses,
  hotelSettings,
  onNavigateTab,
  onOpenQuickCheckIn,
  onOpenNewBooking,
  onOpenAddExpense,
  onOpenLogoEditor,
  onToggleRoomStatus,
}) => {
  // Calculations
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.status === 'available').length;
  const bookedRooms = rooms.filter(r => r.status === 'booked').length;
  const cleaningRooms = rooms.filter(r => r.status === 'cleaning' || r.cleaningStatus === 'in_progress').length;
  const maintenanceRooms = rooms.filter(r => r.status === 'maintenance').length;
  const occupancyRate = totalRooms > 0 ? Math.round((bookedRooms / totalRooms) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayIncome = income
    .filter(i => i.date === todayStr)
    .reduce((sum, i) => sum + i.amount, 0);

  const todayExpenses = expenses
    .filter(e => e.date === todayStr)
    .reduce((sum, e) => sum + e.amount, 0);

  const allTimeIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const allTimeExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = allTimeIncome - allTimeExpenses;

  const activeBookings = bookings.filter(b => b.status === 'checked_in' || b.status === 'reserved');

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Royal Welcome & Live Status Header */}
      <div className="bg-[#12141A] border border-amber-500/30 rounded-3xl p-6 sm:p-7 relative overflow-hidden shadow-2xl">
        {/* Top Gold Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* Medallion Logo with Edit Button */}
            <div className="relative group shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-xl cursor-pointer">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0B0E] p-0.5 border border-amber-400/80 flex items-center justify-center">
                  <img
                    src={hotelSettings.logoUrl || DEFAULT_LOGO_URL}
                    alt={hotelSettings.hotelNameEn}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  onOpenLogoEditor();
                }}
                title="Change Logo"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-400 text-black flex items-center justify-center shadow-lg transition-transform transform hover:scale-110"
              >
                <Edit2 className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1D24] border border-amber-500/40 text-amber-400 text-xs font-semibold mb-2 shadow-sm">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Executive Management Portal • Live</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-gradient tracking-wide uppercase">
                {hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200/80 font-serif mt-1 max-w-xl">
                {hotelSettings.taglineEn || 'Taste That Brings You Back • Luxury Management System'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="dash-btn-new-booking"
              onClick={() => {
                playClickSound();
                onOpenNewBooking();
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black shadow-lg shadow-amber-950/50 flex items-center gap-2 transition-all active:scale-95 uppercase tracking-wide"
            >
              <CalendarCheck className="w-4 h-4 stroke-[2.5]" />
              <span>New Reservation +</span>
            </button>

            <button
              id="dash-btn-quick-checkin"
              onClick={() => {
                playClickSound();
                onOpenQuickCheckIn();
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1A1D24] hover:bg-[#252A36] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <DoorClosed className="w-4 h-4 text-amber-400" />
              <span>Quick Walk-in</span>
            </button>

            <button
              id="dash-btn-edit-settings"
              onClick={() => {
                playClickSound();
                onNavigateTab('settings');
              }}
              className="px-4 py-2.5 rounded-xl bg-[#1A1D24] hover:bg-[#252A36] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <Edit2 className="w-4 h-4 text-amber-400" />
              <span>Edit Title / Brand</span>
            </button>
          </div>
        </div>
      </div>

      {/* Royal Statistics KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Rooms & Tables */}
        <div 
          onClick={() => {
            playClickSound();
            onNavigateTab('rooms');
          }}
          className="bg-[#12141A] p-5 rounded-2xl border border-amber-500/20 hover:border-amber-400/60 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="text-amber-200/70 text-xs mb-2 flex items-center justify-between">
            <span className="font-semibold">Available Units</span>
            <span className="text-[10px] text-gray-500">Out of {totalRooms} total</span>
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">{availableRooms}</div>
          <div className="text-emerald-400/90 text-[11px] mt-1.5 flex items-center gap-1 font-medium">
            <span>↑ {occupancyRate > 0 ? `${100 - occupancyRate}% Available Capacity` : '100% Vacant & Ready'}</span>
          </div>
        </div>

        {/* Booked / Occupied */}
        <div 
          onClick={() => {
            playClickSound();
            onNavigateTab('bookings');
          }}
          className="bg-[#12141A] p-5 rounded-2xl border border-amber-500/20 hover:border-amber-400/60 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="text-amber-200/70 text-xs mb-2 flex items-center justify-between">
            <span className="font-semibold">Occupied & Reserved</span>
            <span className="text-[10px] text-amber-400 font-mono font-bold">{occupancyRate}% Occupancy</span>
          </div>
          <div className="text-3xl font-black font-mono text-amber-300">{bookedRooms}</div>
          <div className="text-amber-400/80 text-[11px] mt-1.5 font-medium">
            {activeBookings.length} Active Reservations
          </div>
        </div>

        {/* Today's Revenue */}
        <div 
          onClick={() => {
            playClickSound();
            onNavigateTab('finance');
          }}
          className="bg-[#12141A] p-5 rounded-2xl border border-amber-500/20 hover:border-amber-400/60 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="text-amber-200/70 text-xs mb-2 flex items-center justify-between">
            <span className="font-semibold">Today's Revenue</span>
            <span className="text-[10px] text-amber-400">Live POS</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-gold-gradient">
            Rs. {(todayIncome || 0).toLocaleString()}
          </div>
          <div className="text-gray-400 text-[11px] mt-1.5">
            Expenses Today: Rs. {(todayExpenses || 0).toLocaleString()}
          </div>
        </div>

        {/* Net Profit */}
        <div 
          onClick={() => {
            playClickSound();
            onNavigateTab('finance');
          }}
          className="bg-[#12141A] p-5 rounded-2xl border border-amber-500/20 hover:border-amber-400/60 cursor-pointer transition-all hover:shadow-xl group"
        >
          <div className="text-amber-200/70 text-xs mb-2 flex items-center justify-between">
            <span className="font-semibold">Cumulative Net Profit</span>
            <span className="text-[10px] text-emerald-400 font-bold">Ledger Balance</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            Rs. {(netProfit || 0).toLocaleString()}
          </div>
          <div className="text-gray-400 text-[11px] mt-1.5">
            Gross Income: Rs. {(allTimeIncome || 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Two Column Layout for Table and Visuals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings Table (2 Cols) */}
        <div className="lg:col-span-2 bg-[#12141A] rounded-3xl border border-amber-500/20 flex flex-col overflow-hidden shadow-xl">
          <div className="p-5 border-b border-amber-500/20 flex justify-between items-center bg-[#16181F]">
            <div>
              <h2 className="font-bold text-sm text-white flex items-center gap-2 font-cinzel text-gold-gradient uppercase">
                <CalendarCheck className="w-4 h-4 text-amber-400" />
                <span>Recent Bookings & Guest Orders</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">Live verified reservation records</p>
            </div>
            <button 
              onClick={() => {
                playClickSound();
                onNavigateTab('bookings');
              }}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View All →
            </button>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#0A0B0E] text-amber-200/80 border-b border-amber-500/20">
                  <th className="p-3.5 font-semibold">Guest Name</th>
                  <th className="p-3.5 font-semibold">Unit / Room</th>
                  <th className="p-3.5 font-semibold">Date</th>
                  <th className="p-3.5 font-semibold">Deposit</th>
                  <th className="p-3.5 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-500/10">
                {activeBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">No active bookings recorded yet</td>
                  </tr>
                ) : (
                  activeBookings.slice(0, 6).map((b) => (
                    <tr key={b.id} className="hover:bg-[#1A1D24] transition-colors">
                      <td className="p-3.5 font-semibold text-white">
                        <div>{b.customerName}</div>
                        <div className="text-[10px] text-gray-400 font-normal">{b.customerPhone}</div>
                      </td>
                      <td className="p-3.5 font-mono text-amber-400 font-bold">Room {b.roomNumber}</td>
                      <td className="p-3.5 text-gray-300 font-mono">{b.checkInDate}</td>
                      <td className="p-3.5 text-gray-200 font-mono font-medium">Rs. {(b.advancePayment || 0).toLocaleString()}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'checked_in'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {b.status === 'checked_in' ? 'Checked In' : 'Reserved'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Summary / Visuals & Backup Card */}
        <div className="flex flex-col gap-6">
          {/* Room Availability Progress */}
          <div className="bg-[#12141A] p-6 rounded-3xl border border-amber-500/20 shadow-xl">
            <h2 className="font-bold text-sm text-white mb-4 flex items-center justify-between font-cinzel text-gold-gradient uppercase">
              <span>Category Capacity</span>
              <span className="text-xs text-amber-300 font-mono">{availableRooms} / {totalRooms} Units</span>
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>Royal Suites & Deluxe</span>
                  <span className="font-mono text-amber-400">
                    {Math.round((rooms.filter(r => r.type === 'suite' || r.type === 'deluxe').filter(r => r.status === 'available').length / Math.max(1, rooms.filter(r => r.type === 'suite' || r.type === 'deluxe').length)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#0A0B0E] h-2 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
                  <div 
                    className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 shadow-sm" 
                    style={{ width: `${Math.round((rooms.filter(r => r.type === 'suite' || r.type === 'deluxe').filter(r => r.status === 'available').length / Math.max(1, rooms.filter(r => r.type === 'suite' || r.type === 'deluxe').length)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>Executive & Dining Suites</span>
                  <span className="font-mono text-emerald-400">
                    {Math.round((rooms.filter(r => r.type === 'executive' || r.type === 'double').filter(r => r.status === 'available').length / Math.max(1, rooms.filter(r => r.type === 'executive' || r.type === 'double').length)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#0A0B0E] h-2 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round((rooms.filter(r => r.type === 'executive' || r.type === 'double').filter(r => r.status === 'available').length / Math.max(1, rooms.filter(r => r.type === 'executive' || r.type === 'double').length)) * 100)}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-gray-300 mb-1">
                  <span>Standard & Family Halls</span>
                  <span className="font-mono text-yellow-400">
                    {Math.round((rooms.filter(r => r.type === 'single' || r.type === 'family').filter(r => r.status === 'available').length / Math.max(1, rooms.filter(r => r.type === 'single' || r.type === 'family').length)) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-[#0A0B0E] h-2 rounded-full overflow-hidden p-0.5 border border-amber-500/20">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-amber-300 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.round((rooms.filter(r => r.type === 'single' || r.type === 'family').filter(r => r.status === 'available').length / Math.max(1, rooms.filter(r => r.type === 'single' || r.type === 'family').length)) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Quick Action Backup & Python Card */}
          <div className="bg-gradient-to-br from-[#1C1810] to-[#0A0B0E] p-6 rounded-3xl border border-amber-500/40 shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-amber-400 text-[10px] uppercase font-bold tracking-widest flex items-center gap-1">
                <Crown className="w-3 h-3" />
                <span>GSM_BY_US Special Edition</span>
              </div>
              <div className="text-lg font-black text-white mt-1 font-cinzel text-gold-gradient">
                Python main.py & EXE Exporter
              </div>
              <p className="text-amber-200/80 text-xs mt-2 mb-4 leading-relaxed font-serif">
                Download the standalone single-file CustomTkinter Python software or export full live system state.
              </p>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    playClickSound();
                    onNavigateTab('python-code');
                  }}
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 uppercase tracking-wide"
                >
                  Download main.py
                </button>
                <button 
                  onClick={() => {
                    playClickSound();
                    onNavigateTab('settings');
                  }}
                  className="bg-[#1A1D24] hover:bg-[#252A36] text-amber-300 border border-amber-500/30 text-xs font-semibold px-4 py-2 rounded-xl transition-all"
                >
                  Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Room & Table Matrix Grid */}
      <div className="bg-[#12141A] border border-amber-500/20 rounded-3xl p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-lg font-black text-white flex items-center gap-2 font-cinzel text-gold-gradient uppercase">
              <DoorClosed className="w-5 h-5 text-amber-400" />
              <span>Live Dining Tables & Rooms Matrix</span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Click on any unit to quickly toggle occupancy or housekeeping status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" /> Available ({availableRooms})
            </span>
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" /> Occupied ({bookedRooms})
            </span>
            <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-sm" /> Cleaning ({cleaningRooms})
            </span>
            <span className="flex items-center gap-1.5 text-gray-400 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-500 shadow-sm" /> Service ({maintenanceRooms})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {rooms.map((room) => {
            const isAvailable = room.status === 'available';
            const isBooked = room.status === 'booked';
            const isCleaning = room.status === 'cleaning' || room.cleaningStatus === 'in_progress';

            return (
              <div
                key={room.id}
                id={`room-card-${room.roomNumber}`}
                onClick={() => {
                  playClickSound();
                  onToggleRoomStatus(room.id);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none relative group overflow-hidden ${
                  isAvailable
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-950/30'
                    : isBooked
                    ? 'bg-amber-950/20 border-amber-500/40 hover:border-amber-400 hover:bg-amber-950/30'
                    : isCleaning
                    ? 'bg-yellow-950/20 border-yellow-500/30 hover:border-yellow-400 hover:bg-yellow-950/30'
                    : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-400">Floor {room.floor}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isAvailable
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isBooked
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isCleaning
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {isAvailable ? 'Available' : isBooked ? 'Occupied' : isCleaning ? 'Cleaning' : 'Service'}
                  </span>
                </div>

                <div className="mt-2.5">
                  <h4 className="text-xl font-black text-white font-mono tracking-tight">
                    Unit {room.roomNumber}
                  </h4>
                  <p className="text-xs text-amber-200/70 font-medium truncate mt-0.5">
                    {room.typeNameEn}
                  </p>
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px] text-gray-400 border-t border-amber-500/10 pt-2">
                  <span className="font-mono text-amber-400 font-bold">
                    Rs. {(room.pricePerNight || 0).toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-[10px]">{room.capacity} Guests</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
