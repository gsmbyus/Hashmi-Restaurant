import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Printer, 
  Download, 
  X, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2,
  Sparkles,
  Crown,
  Copy,
  Check,
  Calendar,
  Clock,
  CreditCard,
  User,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { Invoice, HotelSettings } from '../types';
import { playClickSound } from '../utils/audio';

interface InvoicePrintModalProps {
  invoice: Invoice;
  hotelSettings: HotelSettings;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  hotelSettings,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  const totalDays = invoice.totalDays || 1;
  const roomCharges = invoice.roomCharges ?? invoice.roomTotal ?? ((invoice.dailyRate || 0) * totalDays) ?? 0;
  const foodCharges = invoice.foodCharges ?? invoice.additionalCharges?.find(c => 
    c.title.includes('کھانا') || c.title.includes('Food') || c.title.includes('Dining')
  )?.amount ?? 0;
  const laundryCharges = invoice.laundryCharges ?? invoice.additionalCharges?.find(c => 
    c.title.includes('لانڈری') || c.title.includes('Laundry')
  )?.amount ?? 0;
  const extraCharges = invoice.extraCharges ?? invoice.additionalCharges?.filter(c => 
    !c.title.includes('کھانا') && !c.title.includes('Food') && !c.title.includes('Dining') &&
    !c.title.includes('لانڈری') && !c.title.includes('Laundry')
  ).reduce((sum, c) => sum + (c.amount || 0), 0) ?? 0;

  const subtotal = invoice.subtotal ?? invoice.subTotal ?? (roomCharges + foodCharges + laundryCharges + extraCharges);
  const taxPercentage = invoice.taxPercentage ?? invoice.gstTaxPercent ?? hotelSettings.taxRatePercent ?? hotelSettings.taxPercentage ?? 0;
  const taxAmount = invoice.taxAmount ?? invoice.gstAmount ?? Math.round((subtotal * taxPercentage) / 100);
  const discount = invoice.discount ?? invoice.discountAmount ?? 0;
  const grandTotal = invoice.grandTotal ?? invoice.netPayable ?? Math.max(0, subtotal + taxAmount - discount);
  const paidAmount = invoice.paidAmount ?? invoice.advancePaid ?? grandTotal;
  const remainingAmount = invoice.remainingAmount ?? invoice.balanceDue ?? Math.max(0, grandTotal - paidAmount);
  const dailyRate = invoice.dailyRate || (totalDays > 0 ? Math.round(roomCharges / totalDays) : roomCharges);
  const paymentStatus = invoice.paymentStatus ?? invoice.status ?? (remainingAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'unpaid');

  const handleCopySummary = () => {
    playClickSound();
    const summaryText = `*${hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'} - INVOICE #${invoice.invoiceNumber}*\nGuest: ${invoice.customerName}\nRoom: ${invoice.roomNumber} (${invoice.roomType || 'Standard'})\nCheck-In: ${invoice.checkInDate} | Check-Out: ${invoice.checkOutDate}\nTotal Days: ${totalDays}\n\n*Amount Details:*\nRoom Rent: Rs. ${roomCharges.toLocaleString()}\nFood & Dining: Rs. ${foodCharges.toLocaleString()}\nLaundry/Services: Rs. ${(laundryCharges + extraCharges).toLocaleString()}\nTotal Payable: Rs. ${grandTotal.toLocaleString()}\nPaid: Rs. ${paidAmount.toLocaleString()}\nBalance Due: Rs. ${remainingAmount.toLocaleString()}\nStatus: ${paymentStatus.toUpperCase()}\n\nContact: ${hotelSettings.phone}`;
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
        {/* Animated Modal Container with Luxury Glow and CSS/Motion Transitions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#0E1015] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(212,175,55,0.15)] flex flex-col my-auto max-h-[94vh] overflow-hidden animate-in fade-in zoom-in-95"
        >
          {/* Top Control Bar (Hidden when Printing) */}
          <div className="bg-[#141720] border-b border-amber-500/20 px-5 py-3.5 flex items-center justify-between gap-3 print-hidden select-none">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#0A0B0E] rounded-[6px] flex items-center justify-center">
                  <Receipt className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">انوائس و بلنگ فولیو</span>
                  <span className="text-[10px] font-mono font-bold bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-0.5 rounded-full">
                    {invoice.invoiceNumber}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Black & Gold Luxury Print Ready Preview</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopySummary}
                id="btn-copy-invoice-summary"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A1D24] hover:bg-[#232732] border border-amber-500/20 text-gray-300 hover:text-amber-300 text-xs font-semibold transition-all"
                title="Copy formatted invoice text for WhatsApp"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                <span>{copied ? 'کاپی ہوگیا!' : 'کاپی خلاصہ'}</span>
              </button>

              <button
                onClick={handlePrint}
                id="btn-print-invoice"
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black text-xs font-black flex items-center gap-1.5 shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-transform active:scale-95"
              >
                <Printer className="w-4 h-4 text-black" />
                <span>پرنٹ کریں (Print)</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  onClose();
                }}
                id="btn-close-invoice-modal"
                className="p-1.5 rounded-xl bg-[#1A1D24] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-gray-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Area (Regal on screen, crisp print format in print media) */}
          <div className="overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0A0B0E] text-gray-100 flex-1">
            <div
              id="printable-invoice"
              className="bg-[#12141A] print:bg-white text-gray-200 print:text-gray-900 border border-amber-500/30 print:border-gray-300 rounded-2xl print:rounded-none p-6 sm:p-8 md:p-10 shadow-2xl relative"
            >
              {/* Subtle Luxury Watermark Emblem in Background (Screen only) */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none print:hidden">
                <Crown className="w-96 h-96 text-amber-400" />
              </div>

              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b-2 border-amber-500/30 print:border-gray-900 pb-6 mb-6">
                {/* Brand & Contact Info */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 p-0.5 shadow-lg flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-[#0A0B0E] print:bg-black rounded-[14px] flex items-center justify-center">
                      <Crown className="w-8 h-8 text-amber-400" />
                    </div>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black font-cinzel text-gold-gradient print:text-black tracking-wider uppercase">
                      {hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'}
                    </h1>
                    <h2 className="text-lg font-bold text-amber-300/90 print:text-gray-800 font-urdu-nastaliq mt-0.5">
                      {hotelSettings.hotelNameUrdu || 'ہاشمی ریسٹورنٹ اینڈ ہوٹل'}
                    </h2>
                    <p className="text-xs text-gray-400 print:text-gray-600 mt-1">
                      {hotelSettings.taglineEn || 'Luxury Dining & Executive Accommodation Suites'}
                    </p>
                    
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 print:text-gray-700">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 print:text-gray-600" />
                        <span>{hotelSettings.addressUrdu || 'قریب بائی پاس چوک، جھنگ'}</span>
                      </div>
                      <div className="flex items-center gap-1 font-mono">
                        <Phone className="w-3.5 h-3.5 text-amber-400 print:text-gray-600" />
                        <span>{hotelSettings.phone}</span>
                      </div>
                      {hotelSettings.email && (
                        <div className="flex items-center gap-1 font-mono">
                          <Mail className="w-3.5 h-3.5 text-amber-400 print:text-gray-600" />
                          <span>{hotelSettings.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Invoice Serial & Date Details */}
                <div className="flex flex-col md:items-end justify-between text-right font-mono bg-[#181B24] print:bg-gray-50 border border-amber-500/20 print:border-gray-300 p-4 rounded-xl shrink-0">
                  <div className="flex items-center justify-between md:justify-end gap-3 mb-2">
                    <span className="text-[11px] font-sans uppercase font-bold tracking-widest text-amber-400 print:text-gray-800">
                      TAX INVOICE / بل
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      paymentStatus === 'paid' 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 print:bg-green-100 print:text-green-800' 
                        : paymentStatus === 'partial'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30 print:bg-yellow-100 print:text-yellow-800'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 print:bg-red-100 print:text-red-800'
                    }`}>
                      {paymentStatus === 'paid' ? 'PAID (ادا شدہ)' : paymentStatus === 'partial' ? 'PARTIAL (جزوی)' : 'UNPAID (غیر ادا)'}
                    </span>
                  </div>

                  <div className="text-sm font-black text-white print:text-black">
                    #{invoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-gray-400 print:text-gray-700 mt-1 flex items-center md:justify-end gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400/80 print:text-gray-500" />
                    <span>تاریخ: {invoice.issueDate}</span>
                  </div>
                  {invoice.issueTime && (
                    <div className="text-xs text-gray-400 print:text-gray-700 flex items-center md:justify-end gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400/80 print:text-gray-500" />
                      <span>وقت: {invoice.issueTime}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Guest & Reservation Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Guest Information */}
                <div className="bg-[#181B24] print:bg-gray-50 border border-amber-500/20 print:border-gray-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 border-b border-amber-500/20 print:border-gray-300 pb-2 mb-2.5">
                    <User className="w-4 h-4 text-amber-400 print:text-gray-700" />
                    <h3 className="font-bold text-xs text-amber-300 print:text-gray-900 uppercase tracking-wide">
                      مہمان کی تفصیلات (Guest Information)
                    </h3>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400 print:text-gray-600">مہمان کا نام:</span>
                      <span className="font-bold text-white print:text-black text-sm">{invoice.customerName}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400 print:text-gray-600 font-sans">شناختی کارڈ (CNIC):</span>
                      <span className="text-gray-200 print:text-gray-800">{invoice.customerCnic || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between font-mono">
                      <span className="text-gray-400 print:text-gray-600 font-sans">موبائل رابطہ:</span>
                      <span className="text-gray-200 print:text-gray-800">{invoice.customerPhone || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Stay & Room Details */}
                <div className="bg-[#181B24] print:bg-gray-50 border border-amber-500/20 print:border-gray-300 rounded-xl p-4">
                  <div className="flex items-center gap-2 border-b border-amber-500/20 print:border-gray-300 pb-2 mb-2.5">
                    <Building2 className="w-4 h-4 text-amber-400 print:text-gray-700" />
                    <h3 className="font-bold text-xs text-amber-300 print:text-gray-900 uppercase tracking-wide">
                      قیام و کمرہ (Stay & Room Details)
                    </h3>
                  </div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-gray-400 print:text-gray-600 font-sans">کمرہ / ہال نمبر:</span>
                      <span className="font-bold text-amber-400 print:text-gray-900">Room {invoice.roomNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 print:text-gray-600 font-sans">کیٹیگری:</span>
                      <span className="text-gray-200 print:text-gray-800">{invoice.roomType || 'Executive Suite'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 print:text-gray-600 font-sans">چیک اِن تا چیک آؤٹ:</span>
                      <span className="text-gray-200 print:text-gray-800">{invoice.checkInDate} ➔ {invoice.checkOutDate}</span>
                    </div>
                    <div className="flex justify-between font-sans">
                      <span className="text-gray-400 print:text-gray-600">کل ایام (Stay Duration):</span>
                      <span className="font-bold text-white print:text-black font-mono">{totalDays} دن / رات</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Billing Table */}
              <div className="border border-amber-500/25 print:border-gray-300 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-right text-xs">
                  <thead className="bg-[#1A1D26] print:bg-gray-100 text-amber-300 print:text-gray-900 border-b border-amber-500/30 print:border-gray-300">
                    <tr>
                      <th className="py-3 px-3.5 font-bold">#</th>
                      <th className="py-3 px-3.5 font-bold">تفصیل / سروس (Service & Charge Description)</th>
                      <th className="py-3 px-3.5 font-bold text-center">شرح یومیہ (Rate)</th>
                      <th className="py-3 px-3.5 font-bold text-center">تعداد / دن (Qty)</th>
                      <th className="py-3 px-3.5 font-bold text-left">کل رقم (Total PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-500/10 print:divide-gray-200 text-gray-300 print:text-gray-800">
                    {/* Line 1: Room Rent */}
                    <tr className="hover:bg-amber-500/5 print:hover:bg-transparent transition-colors">
                      <td className="py-3 px-3.5 font-mono text-gray-500">01</td>
                      <td className="py-3 px-3.5 font-medium">
                        <div className="text-white print:text-black font-semibold">کمرے کا قیام و کرایہ (Room Stay Charge)</div>
                        <div className="text-[11px] text-gray-400 print:text-gray-600">کمرہ {invoice.roomNumber} - {invoice.roomType || 'Executive Suite'}</div>
                      </td>
                      <td className="py-3 px-3.5 font-mono text-center">Rs. {(dailyRate || 0).toLocaleString()}</td>
                      <td className="py-3 px-3.5 font-mono text-center">{totalDays} دن</td>
                      <td className="py-3 px-3.5 font-mono font-bold text-left text-amber-300 print:text-black">
                        Rs. {(roomCharges || 0).toLocaleString()}
                      </td>
                    </tr>

                    {/* Line 2: Food & Dining */}
                    {foodCharges > 0 && (
                      <tr className="hover:bg-amber-500/5 print:hover:bg-transparent transition-colors">
                        <td className="py-3 px-3.5 font-mono text-gray-500">02</td>
                        <td className="py-3 px-3.5 font-medium">
                          <div className="text-white print:text-black font-semibold">کھانا و ریسٹورنٹ آرڈرز (Food & Dining Service)</div>
                          <div className="text-[11px] text-gray-400 print:text-gray-600">روم سروس و ریفریشمنٹ بلنگ</div>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-center">-</td>
                        <td className="py-3 px-3.5 font-mono text-center">1</td>
                        <td className="py-3 px-3.5 font-mono font-bold text-left text-amber-300 print:text-black">
                          Rs. {(foodCharges || 0).toLocaleString()}
                        </td>
                      </tr>
                    )}

                    {/* Line 3: Laundry */}
                    {laundryCharges > 0 && (
                      <tr className="hover:bg-amber-500/5 print:hover:bg-transparent transition-colors">
                        <td className="py-3 px-3.5 font-mono text-gray-500">03</td>
                        <td className="py-3 px-3.5 font-medium">
                          <div className="text-white print:text-black font-semibold">لانڈری و واشنگ سروس (Laundry Charges)</div>
                          <div className="text-[11px] text-gray-400 print:text-gray-600">پریسنگ و کپڑوں کی دھلائی</div>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-center">-</td>
                        <td className="py-3 px-3.5 font-mono text-center">1</td>
                        <td className="py-3 px-3.5 font-mono font-bold text-left text-amber-300 print:text-black">
                          Rs. {(laundryCharges || 0).toLocaleString()}
                        </td>
                      </tr>
                    )}

                    {/* Line 4: Extra charges */}
                    {extraCharges > 0 && (
                      <tr className="hover:bg-amber-500/5 print:hover:bg-transparent transition-colors">
                        <td className="py-3 px-3.5 font-mono text-gray-500">04</td>
                        <td className="py-3 px-3.5 font-medium">
                          <div className="text-white print:text-black font-semibold">اضافی خدمات و متفرق چارجز (Other Hotel Services)</div>
                          <div className="text-[11px] text-gray-400 print:text-gray-600">اضافی گیسٹ / سہولیات</div>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-center">-</td>
                        <td className="py-3 px-3.5 font-mono text-center">1</td>
                        <td className="py-3 px-3.5 font-mono font-bold text-left text-amber-300 print:text-black">
                          Rs. {(extraCharges || 0).toLocaleString()}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Financial Calculation Ledger */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
                {/* Payment Method & Guarantee Stamp */}
                <div className="w-full sm:w-1/2 space-y-3">
                  <div className="bg-[#181B24] print:bg-gray-50 border border-amber-500/20 print:border-gray-300 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-300 print:text-gray-900 mb-2 flex items-center gap-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-amber-400 print:text-gray-600" />
                      <span>طریقہ ادائیگی و سیکیورٹی (Payment Details)</span>
                    </h4>
                    <div className="space-y-1 text-xs text-gray-300 print:text-gray-700">
                      <div className="flex justify-between">
                        <span>ادائیگی کا موڈ:</span>
                        <span className="font-mono font-bold uppercase text-white print:text-black">{invoice.paymentMethod || 'Cash'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>کیشیئر / کیش انچارج:</span>
                        <span className="text-gray-200 print:text-gray-800">{invoice.issuedBy || 'Front Desk'}</span>
                      </div>
                      {invoice.notes && (
                        <div className="pt-2 border-t border-amber-500/20 print:border-gray-300 text-[11px] text-gray-400 print:text-gray-600">
                          <strong>نوٹ:</strong> {invoice.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-gray-400 print:text-gray-600 px-1">
                    <ShieldCheck className="w-4 h-4 text-amber-400 print:text-gray-600 shrink-0" />
                    <span>یہ ایک کمپیوٹرائزڈ رسید ہے اور تمام ٹیکس قوانین کے مطابق تیار کی گئی ہے۔</span>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="w-full sm:w-80 bg-[#181B24] print:bg-gray-50 border border-amber-500/25 print:border-gray-300 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-300 print:text-gray-700">
                    <span>ذیلی میزان (Subtotal):</span>
                    <span className="font-mono font-bold">Rs. {(subtotal || 0).toLocaleString()}</span>
                  </div>

                  {taxAmount > 0 && (
                    <div className="flex justify-between text-gray-400 print:text-gray-600">
                      <span>سیلز ٹیکس ({taxPercentage}% GST):</span>
                      <span className="font-mono">Rs. {(taxAmount || 0).toLocaleString()}</span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 print:text-green-700 font-medium">
                      <span>خصوصی رعایت (Discount):</span>
                      <span className="font-mono font-bold">- Rs. {(discount || 0).toLocaleString()}</span>
                    </div>
                  )}

                  {/* Net Grand Total Highlight */}
                  <div className="flex justify-between items-center text-sm font-black border-t-2 border-amber-500/30 print:border-gray-900 pt-2 pb-1">
                    <span className="text-white print:text-black font-bold">کل واجب الادا رقم:</span>
                    <span className="font-mono text-base font-black text-gold-gradient print:text-black">
                      Rs. {(grandTotal || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-300 print:text-gray-700 border-t border-amber-500/10 print:border-gray-200 pt-1.5">
                    <span>وصول شدہ رقم (Paid Amount):</span>
                    <span className="font-mono font-bold text-emerald-400 print:text-green-800">
                      Rs. {(paidAmount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center font-bold border-t border-amber-500/20 print:border-gray-300 pt-2">
                    <span className="text-gray-300 print:text-gray-700">بقایا واجب الادا (Balance Due):</span>
                    <span className={`font-mono text-sm font-black ${
                      remainingAmount > 0 ? 'text-rose-400 print:text-red-700' : 'text-emerald-400 print:text-green-700'
                    }`}>
                      Rs. {(remainingAmount || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signatures & Authorized Seal */}
              <div className="grid grid-cols-2 gap-8 pt-8 mt-6 border-t border-amber-500/20 print:border-gray-300 text-xs">
                <div className="text-center">
                  <div className="border-b border-gray-600 print:border-gray-400 w-3/4 mx-auto mb-1 pb-4"></div>
                  <span className="text-gray-400 print:text-gray-600 font-medium">دستخط مہمان (Guest Signature)</span>
                </div>
                <div className="text-center">
                  <div className="border-b border-gray-600 print:border-gray-400 w-3/4 mx-auto mb-1 pb-4"></div>
                  <span className="text-gray-400 print:text-gray-600 font-medium">استقبالیہ دستخط و مہر (Manager / Cashier)</span>
                </div>
              </div>

              {/* Terms & Developer Attribution */}
              <div className="mt-8 pt-4 border-t-2 border-amber-500/30 print:border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-gray-400 print:text-gray-600">
                <div>
                  <strong>Software Developed by:</strong> Usama Saif (GSM_BY_US) | Haveli Bahadur Shah, Jhang
                </div>
                <div className="font-mono text-amber-400/90 print:text-gray-800 font-semibold">
                  WhatsApp Support: +92 347 7669235
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
