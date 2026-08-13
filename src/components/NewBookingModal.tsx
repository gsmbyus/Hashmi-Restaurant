import React, { useState } from 'react';
import { 
  CalendarCheck, 
  X, 
  DoorClosed, 
  User, 
  Phone, 
  CreditCard, 
  Calendar, 
  Users,
  CheckCircle2
} from 'lucide-react';
import { Room, Customer } from '../types';

interface NewBookingModalProps {
  rooms: Room[];
  customers: Customer[];
  onClose: () => void;
  onConfirmBooking: (data: {
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerCnic: string;
    customerCity: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    totalDays: number;
    guestsCount: number;
    advancePayment: number;
    paymentMethod: 'cash' | 'card' | 'easypaisa' | 'jazzcash' | 'bank_transfer';
    status: 'checked_in' | 'reserved';
    specialRequests?: string;
  }) => void;
}

export const NewBookingModal: React.FC<NewBookingModalProps> = ({
  rooms,
  customers,
  onClose,
  onConfirmBooking,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('new');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCnic, setCustomerCnic] = useState('');
  const [customerCity, setCustomerCity] = useState('لاہور');

  const availableRooms = rooms.filter(r => r.status === 'available');
  const [selectedRoomId, setSelectedRoomId] = useState(availableRooms[0]?.id || rooms[0]?.id || '');
  
  const [checkInDate, setCheckInDate] = useState(todayStr);
  const [checkOutDate, setCheckOutDate] = useState(tomorrowStr);
  const [guestsCount, setGuestsCount] = useState(2);
  const [advancePayment, setAdvancePayment] = useState(2000);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'easypaisa' | 'jazzcash' | 'bank_transfer'>('cash');
  const [bookingStatus, setBookingStatus] = useState<'checked_in' | 'reserved'>('checked_in');
  const [specialRequests, setSpecialRequests] = useState('');

  // Calculate days
  const d1 = new Date(checkInDate);
  const d2 = new Date(checkOutDate);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const totalRent = selectedRoom ? selectedRoom.pricePerNight * calculatedDays : 0;

  const handleCustomerSelectChange = (cid: string) => {
    setSelectedCustomerId(cid);
    if (cid === 'new') {
      setCustomerName('');
      setCustomerPhone('');
      setCustomerCnic('');
      setCustomerCity('لاہور');
    } else {
      const found = customers.find(c => c.id === cid);
      if (found) {
        setCustomerName(found.name);
        setCustomerPhone(found.phone);
        setCustomerCnic(found.cnic);
        setCustomerCity(found.city);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerCnic.trim() || !selectedRoomId) return;

    onConfirmBooking({
      customerId: selectedCustomerId !== 'new' ? selectedCustomerId : undefined,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCnic: customerCnic.trim(),
      customerCity: customerCity.trim() || 'جھنگ',
      roomId: selectedRoomId,
      checkInDate,
      checkOutDate,
      totalDays: calculatedDays,
      guestsCount: Number(guestsCount),
      advancePayment: Number(advancePayment),
      paymentMethod,
      status: bookingStatus,
      specialRequests: specialRequests.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">نئی بکنگ و ریزرویشن فارم (New Booking Wizard)</h3>
              <p className="text-[11px] text-gray-400">مہمان کی مکمل تفصیلات اور روم بکنگ اندراج</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Guest Selection Mode */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">مہمان منتخب کریں یا نیا درج کریں:</label>
            <select
              value={selectedCustomerId}
              onChange={(e) => handleCustomerSelectChange(e.target.value)}
              className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="new">+ نیا مہمان (نیا کسٹمر اکاؤنٹ بنائیں)</option>
              {customers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} - ({c.phone}) - CNIC: {c.cnic}
                </option>
              ))}
            </select>
          </div>

          {/* Guest Inputs */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">مہمان کا مکمل نام:</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: رانا وقاص علی"
              className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">موبائل فون نمبر:</label>
              <input
                type="text"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="0300-1234567"
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">شناختی کارڈ نمبر (CNIC):</label>
              <input
                type="text"
                required
                value={customerCnic}
                onChange={(e) => setCustomerCnic(e.target.value)}
                placeholder="33202-xxxxxxx-x"
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">شہر (City):</label>
              <input
                type="text"
                value={customerCity}
                onChange={(e) => setCustomerCity(e.target.value)}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">افراد کی تعداد (Guests):</label>
              <input
                type="number"
                min="1"
                max="10"
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Room Selection */}
          <div>
            <label className="block text-gray-300 font-semibold mb-1">کمرہ نمبر منتخب کریں:</label>
            <select
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
            >
              {rooms.map(r => (
                <option key={r.id} value={r.id} disabled={r.status !== 'available' && bookingStatus === 'checked_in'}>
                  کمرہ {r.roomNumber} - {r.typeNameUrdu} (Rs. {(r.pricePerNight || 0).toLocaleString()}/رات) - {r.status === 'available' ? '✅ خالی' : `⚠️ ${r.status}`}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">چیک اِن تاریخ (Check-In):</label>
              <input
                type="date"
                required
                value={checkInDate}
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">چیک آؤٹ تاریخ (Check-Out):</label>
              <input
                type="date"
                required
                value={checkOutDate}
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          {/* Booking Type & Advance */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">بکنگ کی نوعیت:</label>
              <select
                value={bookingStatus}
                onChange={(e) => setBookingStatus(e.target.value as any)}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="checked_in">فوری قیام (Checked-In)</option>
                <option value="reserved">ایڈوانس ریزرویشن (Reserved)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">ایڈوانس رقم (Advance PKR):</label>
              <input
                type="number"
                min="0"
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">ادائیگی کا طریقہ:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="cash">کیش (Cash)</option>
              <option value="easypaisa">ایزی پیسہ (EasyPaisa)</option>
              <option value="jazzcash">جاز کیش (JazzCash)</option>
              <option value="bank_transfer">بینک اکاؤنٹ</option>
              <option value="card">کارڈ ادائیگی</option>
            </select>
          </div>

          {/* Summary Box */}
          <div className="bg-[#0F1115] p-3.5 rounded-xl border border-gray-800 space-y-1 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>قیام کی مدت:</span>
              <span className="font-mono text-white font-bold">{calculatedDays} دن</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>کل کمرہ کرایہ:</span>
              <span className="font-mono text-white font-bold">Rs. {(totalRent || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-400 font-bold border-t border-gray-800 pt-1">
              <span>ایڈوانس کٹوتی کے بعد باقی:</span>
              <span className="font-mono">Rs. {Math.max(0, (totalRent || 0) - (advancePayment || 0)).toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium"
            >
              منسوخ کریں
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-900/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>بکنگ مکمل کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
