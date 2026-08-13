import React, { useState } from 'react';
import { 
  Zap, 
  X, 
  DoorClosed, 
  User, 
  Phone, 
  CreditCard, 
  DollarSign, 
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { Room, Customer } from '../types';

interface QuickCheckInModalProps {
  rooms: Room[];
  customers: Customer[];
  onClose: () => void;
  onConfirmQuickCheckIn: (data: {
    customerName: string;
    customerPhone: string;
    customerCnic: string;
    customerCity: string;
    roomId: string;
    totalDays: number;
    advancePayment: number;
    paymentMethod: 'cash' | 'card' | 'easypaisa' | 'jazzcash' | 'bank_transfer';
  }) => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({
  rooms,
  customers,
  onClose,
  onConfirmQuickCheckIn,
}) => {
  const availableRooms = rooms.filter(r => r.status === 'available');

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCnic, setCustomerCnic] = useState('');
  const [customerCity, setCustomerCity] = useState('جھنگ');
  const [selectedRoomId, setSelectedRoomId] = useState(availableRooms[0]?.id || '');
  const [totalDays, setTotalDays] = useState(1);
  const [advancePayment, setAdvancePayment] = useState(
    availableRooms[0] ? availableRooms[0].pricePerNight : 3000
  );
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'easypaisa' | 'jazzcash' | 'bank_transfer'>('cash');

  const selectedRoom = rooms.find(r => r.id === selectedRoomId);
  const totalAmount = selectedRoom ? selectedRoom.pricePerNight * totalDays : 0;

  const handleSelectExistingCustomer = (c: Customer) => {
    setCustomerName(c.name);
    setCustomerPhone(c.phone);
    setCustomerCnic(c.cnic);
    setCustomerCity(c.city);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerCnic.trim() || !selectedRoomId) return;

    onConfirmQuickCheckIn({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerCnic: customerCnic.trim(),
      customerCity: customerCity.trim() || 'جھنگ',
      roomId: selectedRoomId,
      totalDays: Number(totalDays),
      advancePayment: Number(advancePayment),
      paymentMethod,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">فوری واک اِن چیک اِن (Quick Walk-In Check-In)</h3>
              <p className="text-[11px] text-gray-400">نئے یا پرانے گیسٹ کا چند سیکنڈ میں چیک اِن</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Customers Quick Picker */}
        {customers.length > 0 && (
          <div className="mb-4 bg-[#0F1115] p-2.5 rounded-xl border border-gray-800 text-xs">
            <span className="text-gray-400 block mb-1.5 font-semibold">موجودہ کسٹمرز سے خودکار ڈیٹا منتخب کریں:</span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {customers.slice(0, 5).map(c => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleSelectExistingCustomer(c)}
                  className="px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-200 text-[11px] whitespace-nowrap shrink-0 border border-gray-700"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block text-gray-300 font-semibold mb-1">مہمان کا مکمل نام:</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="مثال: ملک اسد علی"
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
              <label className="block text-gray-300 font-semibold mb-1">شناختی کارڈ (CNIC):</label>
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

          <div>
            <label className="block text-gray-300 font-semibold mb-1">دستیاب کمرہ منتخب کریں:</label>
            {availableRooms.length === 0 ? (
              <div className="p-3 bg-red-950/20 border border-red-500/30 text-red-300 rounded-lg text-xs">
                ⚠️ اس وقت کوئی خالی کمرہ دستیاب نہیں ہے!
              </div>
            ) : (
              <select
                value={selectedRoomId}
                onChange={(e) => {
                  setSelectedRoomId(e.target.value);
                  const room = rooms.find(r => r.id === e.target.value);
                  if (room) setAdvancePayment(room.pricePerNight * totalDays);
                }}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              >
                {availableRooms.map(r => (
                  <option key={r.id} value={r.id}>
                    کمرہ نمبر {r.roomNumber} - ({r.typeNameUrdu}) - کرایہ: Rs. {(r.pricePerNight || 0).toLocaleString()}/رات
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">قیام کے کل دن:</label>
              <input
                type="number"
                min="1"
                max="30"
                required
                value={totalDays}
                onChange={(e) => {
                  const days = Number(e.target.value);
                  setTotalDays(days);
                  if (selectedRoom) setAdvancePayment(selectedRoom.pricePerNight * days);
                }}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">ایڈوانس وصولی (روپے میں):</label>
              <input
                type="number"
                min="0"
                required
                value={advancePayment}
                onChange={(e) => setAdvancePayment(Number(e.target.value))}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 font-semibold mb-1">طریقہ ادائیگی:</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as any)}
              className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
            >
              <option value="cash">کیش (Cash)</option>
              <option value="easypaisa">ایزی پیسہ (EasyPaisa)</option>
              <option value="jazzcash">جاز کیش (JazzCash)</option>
              <option value="bank_transfer">بینک اکاؤنٹ ٹرانسفر</option>
              <option value="card">ڈیبٹ / کریڈٹ کارڈ</option>
            </select>
          </div>

          {/* Pricing Preview Box */}
          <div className="bg-[#0F1115] p-3.5 rounded-xl border border-gray-800 text-xs space-y-1">
            <div className="flex justify-between text-gray-400">
              <span>کل تخمینہ کرایہ:</span>
              <span className="font-mono text-white font-bold">Rs. {(totalAmount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>وصول ہونے والا ایڈوانس:</span>
              <span className="font-mono font-bold">Rs. {Number(advancePayment || 0).toLocaleString()}</span>
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
              disabled={availableRooms.length === 0}
              className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold shadow-lg shadow-blue-900/30 flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>فوری چیک اِن مکمل کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
