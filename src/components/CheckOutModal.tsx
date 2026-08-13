import React, { useState } from 'react';
import { 
  Receipt, 
  X, 
  DoorClosed, 
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  Utensils, 
  Shirt, 
  Plus
} from 'lucide-react';
import { Booking, HotelSettings } from '../types';

interface CheckOutModalProps {
  booking: Booking;
  hotelSettings: HotelSettings;
  onClose: () => void;
  onConfirmCheckOut: (data: {
    bookingId: string;
    foodCharges: number;
    laundryCharges: number;
    extraCharges: number;
    discount: number;
    paidAmount: number;
    paymentMethod: 'cash' | 'card' | 'easypaisa' | 'jazzcash' | 'bank_transfer';
    notes?: string;
  }) => void;
}

export const CheckOutModal: React.FC<CheckOutModalProps> = ({
  booking,
  hotelSettings,
  onClose,
  onConfirmCheckOut,
}) => {
  const [foodCharges, setFoodCharges] = useState<number>(0);
  const [laundryCharges, setLaundryCharges] = useState<number>(0);
  const [extraCharges, setExtraCharges] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'easypaisa' | 'jazzcash' | 'bank_transfer'>('cash');
  const [checkoutNotes, setCheckoutNotes] = useState('');

  const taxRate = Number(hotelSettings.taxRatePercent ?? hotelSettings.taxPercentage ?? 0);
  const roomCharges = Number(booking.totalAmount || 0);
  const advancePayment = Number(booking.advancePayment || 0);

  // Calculations
  const subtotal = roomCharges + foodCharges + laundryCharges + extraCharges;
  const taxAmount = Math.round((subtotal * taxRate) / 100);
  const grandTotal = Math.max(0, subtotal + taxAmount - discount);
  const remainingPayable = Math.max(0, grandTotal - advancePayment);

  const [paidAmount, setPaidAmount] = useState<number>(remainingPayable);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmCheckOut({
      bookingId: booking.id,
      foodCharges: Number(foodCharges || 0),
      laundryCharges: Number(laundryCharges || 0),
      extraCharges: Number(extraCharges || 0),
      discount: Number(discount || 0),
      paidAmount: Number(paidAmount || 0),
      paymentMethod,
      notes: checkoutNotes.trim() || undefined
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                چیک آؤٹ اور فائنل بلنگ (Guest Check-Out & Final Bill)
              </h3>
              <p className="text-[11px] text-gray-400">
                بکنگ #{booking.bookingNumber} - {booking.customerName}
              </p>
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
          {/* Guest & Room Recap */}
          <div className="bg-[#0F1115] p-3.5 rounded-xl border border-gray-800 grid grid-cols-2 gap-2 text-gray-300">
            <div>
              <span className="text-gray-500 block">مہمان:</span>
              <strong className="text-white text-sm">{booking.customerName}</strong>
            </div>
            <div className="text-left font-mono">
              <span className="text-gray-500 block text-right">کمرہ نمبر:</span>
              <strong className="text-blue-400 text-sm">کمرہ {booking.roomNumber}</strong>
            </div>
            <div>
              <span className="text-gray-500 block">قیام:</span>
              <span className="font-mono text-gray-300">{booking.checkInDate} تا {booking.checkOutDate} ({booking.totalDays || 1} دن)</span>
            </div>
            <div className="text-left font-mono">
              <span className="text-gray-500 block text-right">ایڈوانس وصولی:</span>
              <span className="text-green-400 font-bold">Rs. {advancePayment.toLocaleString()}</span>
            </div>
          </div>

          {/* Additional Charges */}
          <div className="space-y-2">
            <label className="block text-gray-300 font-bold">اضافی سروسز و چارجز (اختیاری):</label>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">کھانا و ریسٹورنٹ (Food):</label>
                <input
                  type="number"
                  min="0"
                  value={foodCharges}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setFoodCharges(val);
                    const sub = roomCharges + val + laundryCharges + extraCharges;
                    const tax = Math.round((sub * taxRate) / 100);
                    const tot = Math.max(0, sub + tax - discount);
                    setPaidAmount(Math.max(0, tot - advancePayment));
                  }}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3 py-2 text-gray-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">لانڈری سروس (Laundry):</label>
                <input
                  type="number"
                  min="0"
                  value={laundryCharges}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setLaundryCharges(val);
                    const sub = roomCharges + foodCharges + val + extraCharges;
                    const tax = Math.round((sub * taxRate) / 100);
                    const tot = Math.max(0, sub + tax - discount);
                    setPaidAmount(Math.max(0, tot - advancePayment));
                  }}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3 py-2 text-gray-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-gray-400 mb-1">دیگر متفرق سروسز (Other):</label>
                <input
                  type="number"
                  min="0"
                  value={extraCharges}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setExtraCharges(val);
                    const sub = roomCharges + foodCharges + laundryCharges + val;
                    const tax = Math.round((sub * taxRate) / 100);
                    const tot = Math.max(0, sub + tax - discount);
                    setPaidAmount(Math.max(0, tot - advancePayment));
                  }}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3 py-2 text-gray-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1">رعایت / ڈسکاؤنٹ (PKR):</label>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => {
                    const val = Number(e.target.value) || 0;
                    setDiscount(val);
                    const sub = roomCharges + foodCharges + laundryCharges + extraCharges;
                    const tax = Math.round((sub * taxRate) / 100);
                    const tot = Math.max(0, sub + tax - val);
                    setPaidAmount(Math.max(0, tot - advancePayment));
                  }}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3 py-2 text-gray-200 font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method & Received Now */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">ادائیگی کا طریقہ:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
              >
                <option value="cash">کیش (Cash)</option>
                <option value="easypaisa">ایزی پیسہ (EasyPaisa)</option>
                <option value="jazzcash">جاز کیش (JazzCash)</option>
                <option value="bank_transfer">بینک ٹرانسفر</option>
                <option value="card">کریڈٹ/ڈیبٹ کارڈ</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 font-semibold mb-1">اب وصول کی جانے والی رقم:</label>
              <input
                type="number"
                min="0"
                required
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value) || 0)}
                className="w-full bg-[#0F1115] border border-blue-500/50 rounded-lg px-3 py-2 text-blue-400 font-mono font-bold text-sm focus:outline-none"
              />
            </div>
          </div>

          {/* Final Billing Calculation Card */}
          <div className="bg-[#0F1115] p-4 rounded-xl border border-gray-800 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-gray-400">
              <span>کمرے کا کرایہ:</span>
              <span>Rs. {roomCharges.toLocaleString()}</span>
            </div>
            {foodCharges + laundryCharges + extraCharges > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>اضافی چارجز:</span>
                <span>Rs. {(foodCharges + laundryCharges + extraCharges).toLocaleString()}</span>
              </div>
            )}
            {taxRate > 0 && (
              <div className="flex justify-between text-gray-400">
                <span>ٹیکس ({taxRate}% GST):</span>
                <span>Rs. {taxAmount.toLocaleString()}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span>رعایت (Discount):</span>
                <span>- Rs. {discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-white font-bold text-sm border-t border-gray-800 pt-1.5">
              <span>کل بل (Grand Total):</span>
              <span>Rs. {grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>پہلے وصول شدہ ایڈوانس:</span>
              <span>- Rs. {advancePayment.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-amber-400 font-bold border-t border-gray-800 pt-1">
              <span>خالص واجب الادا رقم:</span>
              <span className="text-base">Rs. {remainingPayable.toLocaleString()}</span>
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
              <span>چیک آؤٹ و انوائس مکمل کریں</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
