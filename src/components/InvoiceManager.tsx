import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Printer, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  DollarSign, 
  Calendar,
  CreditCard
} from 'lucide-react';
import { Invoice, HotelSettings } from '../types';
import { InvoicePrintModal } from './InvoicePrintModal';

interface InvoiceManagerProps {
  invoices: Invoice[];
  hotelSettings: HotelSettings;
  onViewInvoice?: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoiceId: string) => void;
}

export const InvoiceManager: React.FC<InvoiceManagerProps> = ({
  invoices,
  hotelSettings,
  onViewInvoice,
  onDeleteInvoice,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'partial' | 'unpaid'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getInvoiceAmounts = (inv: Invoice) => {
    const total = inv.netPayable ?? inv.grandTotal ?? inv.subTotal ?? (inv.roomTotal || 0);
    const paid = inv.paidAmount ?? inv.advancePaid ?? total;
    const balance = inv.balanceDue ?? inv.remainingAmount ?? Math.max(0, total - paid);
    const status = inv.paymentStatus ?? inv.status ?? (balance === 0 ? 'paid' : paid > 0 ? 'partial' : 'unpaid');
    return { total, paid, balance, status };
  };

  const filteredInvoices = invoices.filter((inv) => {
    const { status } = getInvoiceAmounts(inv);
    if (statusFilter !== 'all' && status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        (inv.invoiceNumber || '').toLowerCase().includes(q) ||
        (inv.customerName || '').toLowerCase().includes(q) ||
        (inv.customerPhone || '').includes(q) ||
        (inv.roomNumber || '').includes(q)
      );
    }
    return true;
  });

  const totalInvoiced = invoices.reduce((sum, i) => sum + getInvoiceAmounts(i).total, 0);
  const totalCollected = invoices.reduce((sum, i) => sum + getInvoiceAmounts(i).paid, 0);
  const totalPending = invoices.reduce((sum, i) => sum + getInvoiceAmounts(i).balance, 0);

  const handleOpenInvoice = (inv: Invoice) => {
    if (onViewInvoice) {
      onViewInvoice(inv);
    } else {
      setSelectedInvoice(inv);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A20] border border-gray-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-blue-500" />
            <span>انوائسز اور بلنگ کا انتظام (Invoices & Billing)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            تمام تیار شدہ انوائسز کا ریکارڈ، کسٹمر بلز کا پرنٹ اور ادائیگی کی تفصیلات
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-[#0F1115] px-4 py-2 rounded-xl border border-gray-800 text-xs">
            <span className="text-gray-400">کل وصول شدہ رقم:</span>
            <span className="font-mono font-bold text-green-400 mr-2">Rs. {totalCollected.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* KPI mini row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#181A20] border border-gray-800 p-4 rounded-xl">
          <div className="text-gray-400">کل تیار شدہ بلز:</div>
          <div className="text-2xl font-bold text-white font-mono mt-1">Rs. {totalInvoiced.toLocaleString()}</div>
          <div className="text-[11px] text-gray-500 mt-1">{invoices.length} کل انوائسز</div>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-4 rounded-xl">
          <div className="text-gray-400">کل وصولی (Paid Amount):</div>
          <div className="text-2xl font-bold text-green-400 font-mono mt-1">Rs. {totalCollected.toLocaleString()}</div>
          <div className="text-[11px] text-green-500/80 mt-1">کامیاب وصولی</div>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-4 rounded-xl">
          <div className="text-gray-400">بقایا جات (Pending Balance):</div>
          <div className="text-2xl font-bold text-red-400 font-mono mt-1">Rs. {totalPending.toLocaleString()}</div>
          <div className="text-[11px] text-gray-500 mt-1">غیر وصول شدہ</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-[#181A20] p-3 rounded-2xl border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="انوائس نمبر، مہمان کا نام، فون تلاش کریں..."
            className="w-full bg-[#0F1115] border border-gray-800 rounded-lg pr-10 pl-3 py-2 text-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'تمام انوائسز' },
            { id: 'paid', label: 'ادا شدہ (Paid)' },
            { id: 'partial', label: 'جزوی ادا شدہ' },
            { id: 'unpaid', label: 'غیر ادا شدہ' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === st.id ? 'bg-blue-600 text-white' : 'bg-[#0F1115] text-gray-300 hover:bg-gray-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#0F1115] border-b border-gray-800 text-gray-400">
                <th className="py-3 px-4 font-bold">انوائس نمبر</th>
                <th className="py-3 px-4 font-bold">مہمان کا نام</th>
                <th className="py-3 px-4 font-bold">کمرہ</th>
                <th className="py-3 px-4 font-bold">تاریخ و وقت</th>
                <th className="py-3 px-4 font-bold">کل بل رقم</th>
                <th className="py-3 px-4 font-bold">وصول شدہ</th>
                <th className="py-3 px-4 font-bold">اسٹیٹس</th>
                <th className="py-3 px-4 font-bold text-center">پرنٹ و ایکشن</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    کوئی انوائس ریکارڈ موجود نہیں ہے۔
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => {
                  const { total, paid, status } = getInvoiceAmounts(inv);
                  return (
                    <tr key={inv.id} className="hover:bg-[#0F1115]/50 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{inv.customerName}</div>
                        <div className="text-[11px] text-gray-400 font-mono">{inv.customerPhone}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-blue-400 font-bold">
                        کمرہ {inv.roomNumber}
                      </td>

                      <td className="py-3.5 px-4 text-gray-300 font-mono">
                        <div>{inv.issueDate}</div>
                        {inv.issueTime && <div className="text-[10px] text-gray-500">{inv.issueTime}</div>}
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-white text-sm">
                        Rs. {total.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-green-400 font-bold">
                        Rs. {paid.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          status === 'paid'
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : status === 'partial'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {status === 'paid' ? 'ادا شدہ (Paid)' : status === 'partial' ? 'جزوی' : 'غیر ادا شدہ'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenInvoice(inv)}
                            title="انوائس دیکھیں اور پرنٹ کریں"
                            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold flex items-center gap-1.5 shadow transition-colors shadow-blue-900/30"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>پرنٹ بل</span>
                          </button>

                          {onDeleteInvoice && (
                            <button
                              onClick={() => {
                                if (window.confirm(`کیا آپ واقعی انوائس ${inv.invoiceNumber} حذف کرنا چاہتے ہیں؟`)) {
                                  onDeleteInvoice(inv.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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

      {/* Print / View Invoice Modal */}
      {selectedInvoice && (
        <InvoicePrintModal
          invoice={selectedInvoice}
          hotelSettings={hotelSettings}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
