import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DoorClosed, 
  Users, 
  Receipt,
  FileText,
  DollarSign
} from 'lucide-react';
import { Room, Booking, Customer, Invoice, Income, Expense, HotelSettings } from '../types';

interface ReportsManagerProps {
  rooms: Room[];
  bookings: Booking[];
  customers: Customer[];
  invoices: Invoice[];
  income: Income[];
  expenses: Expense[];
  hotelSettings: HotelSettings;
}

export const ReportsManager: React.FC<ReportsManagerProps> = ({
  rooms,
  bookings,
  customers,
  invoices,
  income,
  expenses,
  hotelSettings,
}) => {
  const [reportPeriod, setReportPeriod] = useState<'today' | 'this_month' | 'all'>('all');

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  const filterItemDate = (date: string) => {
    if (reportPeriod === 'today') return date === todayStr;
    if (reportPeriod === 'this_month') return date.startsWith(currentMonthStr);
    return true;
  };

  const periodIncome = income.filter(i => filterItemDate(i.date));
  const periodExpenses = expenses.filter(e => filterItemDate(e.date));
  const periodBookings = bookings.filter(b => filterItemDate(b.checkInDate));
  const periodInvoices = invoices.filter(inv => filterItemDate(inv.issueDate));

  const totalPeriodIncome = periodIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalPeriodExpenses = periodExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalPeriodIncome - totalPeriodExpenses;

  // Export CSV Helper
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportBookingsCSV = () => {
    const headers = ['Booking No', 'Customer', 'CNIC', 'Phone', 'Room', 'Check In', 'Check Out', 'Total Days', 'Total (PKR)', 'Advance (PKR)', 'Status'];
    const rows = bookings.map(b => [
      b.bookingNumber,
      b.customerName,
      b.customerCnic,
      b.customerPhone,
      b.roomNumber,
      b.checkInDate,
      b.checkOutDate,
      b.totalDays,
      b.totalAmount,
      b.advancePayment,
      b.status
    ]);
    downloadCSV(`Bookings_Report_${todayStr}`, headers, rows);
  };

  const handleExportCustomersCSV = () => {
    const headers = ['Name', 'CNIC', 'Phone', 'City', 'Address', 'Visits', 'Total Spent (PKR)'];
    const rows = customers.map(c => [
      c.name,
      c.cnic,
      c.phone,
      c.city,
      c.address,
      c.totalVisits,
      c.totalSpent
    ]);
    downloadCSV(`Customers_Directory_${todayStr}`, headers, rows);
  };

  const handleExportFinanceCSV = () => {
    const headers = ['Type', 'Category', 'Description', 'Date', 'Payment Method', 'Amount (PKR)', 'Recorded By'];
    const rows = [
      ...income.map(i => ['INCOME', i.category, i.description, i.date, i.paymentMethod, i.amount, i.recordedBy]),
      ...expenses.map(e => ['EXPENSE', e.category, e.description, e.date, e.paymentMethod, -e.amount, e.recordedBy])
    ];
    downloadCSV(`Financial_Statement_${todayStr}`, headers, rows);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A20] border border-gray-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-6 h-6 text-blue-500" />
            <span>رپورٹس، تجزیات اور ڈیٹا ایکسپورٹ (Reports & Analytics)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            ہوٹل کی مالی کارکردگی کا تفصیلی جائزہ اور ایکسل/سی ایس وی فائلیں ڈاؤن لوڈ کریں
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>رپورٹ پرنٹ کریں</span>
          </button>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-[#181A20] p-3 rounded-2xl border border-gray-800 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 font-semibold">رپورٹ کا دورانیہ:</span>
          {[
            { id: 'all', label: 'تمام ریکارڈز (All Time)' },
            { id: 'this_month', label: 'رواں ماہ (This Month)' },
            { id: 'today', label: 'آج کا دن (Today)' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setReportPeriod(p.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                reportPeriod === p.id ? 'bg-blue-600 text-white shadow shadow-blue-900/30' : 'bg-[#0F1115] text-gray-300 hover:bg-gray-800'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="text-gray-400">
          تاریخ: <span className="font-mono text-blue-400">{todayStr}</span>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#181A20] border border-gray-800 p-5 rounded-2xl">
          <span className="text-xs text-gray-400">دورانیہ کی کل آمدن:</span>
          <div className="text-2xl lg:text-3xl font-bold text-green-400 font-mono mt-1">
            Rs. {(totalPeriodIncome || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">{periodIncome.length} ٹرانزیکشنز</p>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-5 rounded-2xl">
          <span className="text-xs text-gray-400">دورانیہ کے کل اخراجات:</span>
          <div className="text-2xl lg:text-3xl font-bold text-red-400 font-mono mt-1">
            Rs. {(totalPeriodExpenses || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">{periodExpenses.length} اندراجات</p>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-5 rounded-2xl">
          <span className="text-xs text-gray-400">خالص منافع (Net Profit):</span>
          <div className={`text-2xl lg:text-3xl font-bold font-mono mt-1 ${netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            Rs. {(netProfit || 0).toLocaleString()}
          </div>
          <p className="text-[11px] text-gray-500 mt-2">آمدنی منفی اخراجات</p>
        </div>
      </div>

      {/* Quick CSV Export Cards */}
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-400" />
          <span>ایکسل اور سی ایس وی ڈیٹا ایکسپورٹ سینٹر (Data Export Center)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0F1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                <Receipt className="w-4 h-4 text-blue-400" />
                <span>بکنگز رپورٹ CSV</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                تمام بُکنگز، روم نمبرز، کرایہ، چیک اِن اور چیک آؤٹ تواریخ کی مکمل لسٹ
              </p>
            </div>
            <button
              onClick={handleExportBookingsCSV}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow shadow-blue-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤن لوڈ Bookings CSV</span>
            </button>
          </div>

          <div className="bg-[#0F1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                <Users className="w-4 h-4 text-purple-400" />
                <span>کسٹمرز ڈائریکٹری CSV</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                تمام رجسٹرڈ گیسٹس، موبائل نمبرز، شناختی کارڈز (CNIC) اور قیام کے اعداد و شمار
              </p>
            </div>
            <button
              onClick={handleExportCustomersCSV}
              className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow shadow-purple-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤن لوڈ Customers CSV</span>
            </button>
          </div>

          <div className="bg-[#0F1115] border border-gray-800 p-4 rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span>مالیاتی اسٹیٹمنٹ CSV</span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                ہوٹل کی تمام آمدنیاں اور اخراجات بمعہ کیٹیگری اور تفصیلات ایکسل شیٹ
              </p>
            </div>
            <button
              onClick={handleExportFinanceCSV}
              className="w-full py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow shadow-green-900/30"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ڈاؤن لوڈ Finance CSV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
