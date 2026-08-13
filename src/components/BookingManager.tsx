import React, { useState } from 'react';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  UserCheck, 
  LogOut, 
  XCircle, 
  Receipt, 
  Eye, 
  Calendar, 
  Phone, 
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Booking, Room, Customer, HotelSettings } from '../types';

interface BookingManagerProps {
  bookings: Booking[];
  rooms: Room[];
  customers: Customer[];
  hotelSettings: HotelSettings;
  onOpenNewBookingModal: () => void;
  onCheckInBooking: (bookingId: string) => void;
  onCheckOutBooking: (booking: Booking) => void;
  onCancelBooking: (bookingId: string) => void;
  onViewInvoice: (bookingId: string) => void;
}

export const BookingManager: React.FC<BookingManagerProps> = ({
  bookings,
  rooms,
  customers,
  hotelSettings,
  onOpenNewBookingModal,
  onCheckInBooking,
  onCheckOutBooking,
  onCancelBooking,
  onViewInvoice,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        b.bookingNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.customerCnic.includes(q) ||
        b.roomNumber.includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A20] border border-gray-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <CalendarCheck className="w-6 h-6 text-blue-500" />
            <span>بکنگ اور ریزرویشن سسٹم (Booking Management)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            مہمانوں کی نئی بکنگز، ایڈوانس ادائیگیاں، فوری چیک اِن اور چیک آؤٹ
          </p>
        </div>

        <button
          id="btn-create-new-booking"
          onClick={onOpenNewBookingModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ نئی بکنگ درج کریں</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-[#181A20] p-3.5 rounded-xl border border-gray-800 text-xs">
        {/* Search */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بکنگ نمبر، کسٹمر، کمرہ نمبر تلاش کریں..."
            className="w-full bg-[#0F1115] border border-gray-800 rounded-lg pr-10 pl-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { id: 'all', label: 'تمام بکنگز' },
            { id: 'checked_in', label: 'مقیم (Checked-In)' },
            { id: 'reserved', label: 'ریزرو شدہ (Reserved)' },
            { id: 'checked_out', label: 'مکمل چیک آؤٹ (Checked-Out)' },
            { id: 'cancelled', label: 'کینسل شدہ (Cancelled)' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === st.id ? 'bg-blue-600 text-white' : 'bg-[#0F1115] text-gray-300 hover:bg-gray-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table View */}
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#0F1115] border-b border-gray-800 text-gray-400">
                <th className="py-3 px-4 font-bold">بکنگ نمبر</th>
                <th className="py-3 px-4 font-bold">مہمان کی تفصیل</th>
                <th className="py-3 px-4 font-bold">کمرہ نمبر و قسم</th>
                <th className="py-3 px-4 font-bold">تاریخ قیام (چیک اِن / آؤٹ)</th>
                <th className="py-3 px-4 font-bold">کرایہ و ایڈوانس</th>
                <th className="py-3 px-4 font-bold">اسٹیٹس</th>
                <th className="py-3 px-4 font-bold text-center">کارروائی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    کوئی بکنگ ریکارڈ نہیں ملا۔
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => {
                  const isCheckedIn = b.status === 'checked_in';
                  const isReserved = b.status === 'reserved';
                  const isCheckedOut = b.status === 'checked_out';
                  const isCancelled = b.status === 'cancelled';

                  return (
                    <tr key={b.id} className="hover:bg-gray-800/40 transition-colors">
                      {/* Booking No */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                          {b.bookingNumber}
                        </span>
                        <div className="text-[10px] text-gray-500 mt-1">{b.createdAt}</div>
                      </td>

                      {/* Guest Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{b.customerName}</div>
                        <div className="flex items-center gap-2 text-gray-400 text-[11px] mt-0.5">
                          <span className="font-mono">{b.customerPhone}</span>
                          <span>•</span>
                          <span className="font-mono text-gray-500">{b.customerCnic}</span>
                        </div>
                      </td>

                      {/* Room Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-blue-400 text-sm">
                          کمرہ {b.roomNumber}
                        </div>
                        <div className="text-[11px] text-gray-400">{b.roomTypeName}</div>
                        <div className="text-[10px] text-gray-500">{b.guestsCount} افراد</div>
                      </td>

                      {/* Dates */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-gray-200 font-mono">
                          <span>{b.checkInDate}</span>
                          <span className="text-gray-500">تا</span>
                          <span>{b.checkOutDate}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5">
                          کل دن: <span className="font-bold text-white">{b.totalDays}</span>
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="py-3.5 px-4 font-mono">
                        <div className="text-white font-bold text-sm">
                          Rs. {(b.totalAmount || 0).toLocaleString()}
                        </div>
                        <div className="text-xs text-green-400">
                          ایڈوانس: Rs. {(b.advancePayment || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-400 capitalize">
                          طریقہ: {b.paymentMethod}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                            isCheckedIn
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                              : isReserved
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : isCheckedOut
                              ? 'bg-gray-800 text-gray-300 border border-gray-700'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {isCheckedIn && <CheckCircle2 className="w-3 h-3 text-green-400" />}
                          {isReserved && <Calendar className="w-3 h-3 text-blue-400" />}
                          {isCheckedIn ? 'مقیم (Checked-In)' : isReserved ? 'ریزرو (Reserved)' : isCheckedOut ? 'چیک آؤٹ مکمل' : 'کینسل شدہ'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isReserved && (
                            <button
                              onClick={() => onCheckInBooking(b.id)}
                              title="مہمان کو کمرہ تفویض اور چیک اِن کریں"
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition-colors"
                            >
                              چیک اِن
                            </button>
                          )}

                          {isCheckedIn && (
                            <button
                              onClick={() => onCheckOutBooking(b)}
                              title="چیک آؤٹ کریں اور انوائس بل تیار کریں"
                              className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1 transition-colors"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>چیک آؤٹ و بل</span>
                            </button>
                          )}

                          {(isReserved || isCheckedIn) && (
                            <button
                              onClick={() => {
                                if (window.confirm(`کیا آپ واقعی بکنگ ${b.bookingNumber} کینسل کرنا چاہتے ہیں؟`)) {
                                  onCancelBooking(b.id);
                                }
                              }}
                              title="بکنگ کینسل کریں"
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}

                          {isCheckedOut && (
                            <button
                              onClick={() => onViewInvoice(b.id)}
                              title="انوائس دیکھیں یا پرنٹ کریں"
                              className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-blue-400 flex items-center gap-1 transition-colors"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>انوائس</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
