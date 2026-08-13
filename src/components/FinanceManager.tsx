import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Search, 
  Calendar, 
  Trash2, 
  DollarSign, 
  PieChart,
  Tag
} from 'lucide-react';
import { Income, Expense } from '../types';

interface FinanceManagerProps {
  income: Income[];
  expenses: Expense[];
  onAddIncome: (item: Omit<Income, 'id'>) => void;
  onAddExpense: (item: Omit<Expense, 'id'>) => void;
  onDeleteIncome: (id: string) => void;
  onDeleteExpense: (id: string) => void;
}

export const FinanceManager: React.FC<FinanceManagerProps> = ({
  income,
  expenses,
  onAddIncome,
  onAddExpense,
  onDeleteIncome,
  onDeleteExpense,
}) => {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'month'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formCategory, setFormCategory] = useState('');
  const [formAmount, setFormAmount] = useState<number>(1000);
  const [formDescription, setFormDescription] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState<'cash' | 'card' | 'bank_transfer' | 'easypaisa' | 'jazzcash'>('cash');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = todayStr.substring(0, 7);

  const filterByDate = (date: string) => {
    if (dateFilter === 'today') return date === todayStr;
    if (dateFilter === 'month') return date.startsWith(currentMonthStr);
    return true;
  };

  const filteredIncome = income.filter(i => filterByDate(i.date));
  const filteredExpenses = expenses.filter(e => filterByDate(e.date));

  const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const incomeCategories = [
    'کمرے کا کرایہ (Room Rent)',
    'کھانا و ریسٹورنٹ (Restaurant & Food)',
    'لانڈری سروس (Laundry)',
    'ہال بکنگ (Hall Booking)',
    'منی بار و اسنیکس (Mini Bar)',
    'پارکنگ فیس (Parking)',
    'دیگر متفرق آمدن (Other Income)'
  ];

  const expenseCategories = [
    'بجلی و یوٹیلیٹی بلز (Electricity & Utilities)',
    'ملازمین کی تنخواہیں (Staff Salaries)',
    'کمروں کی دیکھ بھال و مرمت (Maintenance)',
    'صفائی و لانڈری سامان (Cleaning Supplies)',
    'کھانے پینے کا راشن (Kitchen Groceries)',
    'انٹرنیٹ و سافٹ ویئر اخراجات (Internet & IT)',
    'سرکاری ٹیکس و لائسنس (Taxes & Fees)',
    'متفرق ہوٹل اخراجات (Miscellaneous)'
  ];

  const handleOpenAdd = () => {
    setFormCategory(activeTab === 'income' ? incomeCategories[0] : expenseCategories[0]);
    setFormAmount(1000);
    setFormDescription('');
    setFormPaymentMethod('cash');
    setFormDate(new Date().toISOString().split('T')[0]);
    setIsAddModalOpen(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formAmount || formAmount <= 0) return;

    if (activeTab === 'income') {
      onAddIncome({
        category: formCategory,
        amount: Number(formAmount),
        description: formDescription.trim() || formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        recordedBy: 'اسامہ سیف (Admin)'
      });
    } else {
      onAddExpense({
        category: formCategory,
        amount: Number(formAmount),
        description: formDescription.trim() || formCategory,
        paymentMethod: formPaymentMethod,
        date: formDate,
        recordedBy: 'اسامہ سیف (Admin)'
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A20] border border-gray-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Wallet className="w-6 h-6 text-blue-500" />
            <span>آمدنی و اخراجات کا حساب کتاب (Income & Expense Management)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            ہوٹل کے تمام مالیاتی لین دین، روزمرہ اخراجات اور منافع کا مکمل ریکارڈ
          </p>
        </div>

        <button
          id="btn-add-finance-entry"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{activeTab === 'income' ? '+ نئی آمدن درج کریں' : '+ نیا خرچہ درج کریں'}</span>
        </button>
      </div>

      {/* Financial Overview KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#181A20] border border-gray-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">کل آمدنی (Total Income)</span>
            <div className="w-9 h-9 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl lg:text-3xl font-bold text-green-400 font-mono">
            Rs. {(totalIncome || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-gray-500">{filteredIncome.length} ٹرانزیکشنز</div>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">کل اخراجات (Total Expenses)</span>
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl lg:text-3xl font-bold text-red-400 font-mono">
            Rs. {(totalExpenses || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-gray-500">{filteredExpenses.length} اندراجات</div>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">خالص منافع (Net Profit)</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className={`mt-3 text-2xl lg:text-3xl font-bold font-mono ${netProfit >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
            Rs. {(netProfit || 0).toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-gray-500">آمدن منفی اخراجات</div>
        </div>

        <div className="bg-[#181A20] border border-gray-800 p-5 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">منافع کی شرح (Profit Margin)</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl lg:text-3xl font-bold text-purple-400 font-mono">
            {profitMargin}%
          </div>
          <div className="mt-2 text-[11px] text-gray-500">مجموعی کارکردگی</div>
        </div>
      </div>

      {/* Tabs & Date Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#181A20] p-3 rounded-2xl border border-gray-800 text-xs">
        {/* Toggle Income / Expense Tab */}
        <div className="flex items-center gap-2 bg-[#0F1115] p-1 rounded-xl border border-gray-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('income')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'income' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            💰 آمدنی ریکارڈز ({filteredIncome.length})
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg font-bold transition-colors ${
              activeTab === 'expenses' ? 'bg-red-600 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            📉 اخراجات ریکارڈز ({filteredExpenses.length})
          </button>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-gray-400 font-semibold px-2">مدت:</span>
          {[
            { id: 'all', label: 'تمام ریکارڈز' },
            { id: 'today', label: 'صرف آج' },
            { id: 'month', label: 'موجودہ مہینہ' }
          ].map(df => (
            <button
              key={df.id}
              onClick={() => setDateFilter(df.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                dateFilter === df.id ? 'bg-blue-600 text-white' : 'bg-[#0F1115] text-gray-300 hover:bg-gray-800'
              }`}
            >
              {df.label}
            </button>
          ))}
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#181A20] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="bg-[#0F1115] border-b border-gray-800 text-gray-400">
                <th className="py-3 px-4 font-bold">شمار</th>
                <th className="py-3 px-4 font-bold">کیٹیگری (Category)</th>
                <th className="py-3 px-4 font-bold">تفصیل (Description)</th>
                <th className="py-3 px-4 font-bold">تاریخ</th>
                <th className="py-3 px-4 font-bold">طریقہ ادائیگی</th>
                <th className="py-3 px-4 font-bold">رقم (Amount)</th>
                <th className="py-3 px-4 font-bold text-center">حذف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {activeTab === 'income' ? (
                filteredIncome.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      کوئی آمدن کا ریکارڈ موجود نہیں ہے۔
                    </td>
                  </tr>
                ) : (
                  filteredIncome.map((inc, index) => (
                    <tr key={inc.id} className="hover:bg-[#0F1115]/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-500">{index + 1}</td>
                      <td className="py-3 px-4 font-bold text-white">{inc.category}</td>
                      <td className="py-3 px-4 text-gray-300">{inc.description}</td>
                      <td className="py-3 px-4 font-mono text-gray-400">{inc.date}</td>
                      <td className="py-3 px-4 capitalize font-mono text-gray-300">{inc.paymentMethod}</td>
                      <td className="py-3 px-4 font-mono font-bold text-green-400 text-sm">
                        + Rs. {(inc.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm('کیا آپ واقعی یہ ریکارڈ ڈیلیٹ کرنا چاہتے ہیں؟')) {
                              onDeleteIncome(inc.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )
              ) : (
                filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      کوئی خرچے کا ریکارڈ موجود نہیں ہے۔
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp, index) => (
                    <tr key={exp.id} className="hover:bg-[#0F1115]/50 transition-colors">
                      <td className="py-3 px-4 font-mono text-gray-500">{index + 1}</td>
                      <td className="py-3 px-4 font-bold text-white">{exp.category}</td>
                      <td className="py-3 px-4 text-gray-300">{exp.description}</td>
                      <td className="py-3 px-4 font-mono text-gray-400">{exp.date}</td>
                      <td className="py-3 px-4 capitalize font-mono text-gray-300">{exp.paymentMethod}</td>
                      <td className="py-3 px-4 font-mono font-bold text-red-400 text-sm">
                        - Rs. {(exp.amount || 0).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            if (window.confirm('کیا آپ واقعی یہ خرچہ ریکارڈ ڈیلیٹ کرنا چاہتے ہیں؟')) {
                              onDeleteExpense(exp.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181A20] border border-gray-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-blue-500" />
              <span>{activeTab === 'income' ? 'نیا آمدن اندراج' : 'نیا خرچہ اندراج'}</span>
            </h3>

            <form onSubmit={handleSaveEntry} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">کیٹیگری منتخب کریں:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  {(activeTab === 'income' ? incomeCategories : expenseCategories).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">رقم روپے میں (Amount in PKR):</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(Number(e.target.value))}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 font-mono text-base focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">تفصیل و مد (Description):</label>
                <input
                  type="text"
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="مثال: لیسکو بجلی کا بل جون 2026"
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">تاریخ:</label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">ادائیگی کا طریقہ:</label>
                  <select
                    value={formPaymentMethod}
                    onChange={(e) => setFormPaymentMethod(e.target.value as any)}
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="cash">کیش (نقد)</option>
                    <option value="easypaisa">ایزی پیسہ (EasyPaisa)</option>
                    <option value="jazzcash">جاز کیش (JazzCash)</option>
                    <option value="bank_transfer">بینک ٹرانسفر (Bank)</option>
                    <option value="card">کریڈٹ/ڈیبٹ کارڈ</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-900/30"
                >
                  محفوظ کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
