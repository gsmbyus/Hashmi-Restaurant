import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  History, 
  Phone, 
  CreditCard, 
  MapPin, 
  UserCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { Customer, Booking } from '../types';

interface CustomerManagerProps {
  customers: Customer[];
  bookings: Booking[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'createdAt'>) => void;
  onUpdateCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
}

export const CustomerManager: React.FC<CustomerManagerProps> = ({
  customers,
  bookings,
  onAddCustomer,
  onUpdateCustomer,
  onDeleteCustomer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [historyCustomer, setHistoryCustomer] = useState<Customer | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCnic, setFormCnic] = useState('');
  const [formPassport, setFormPassport] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formGender, setFormGender] = useState<'male' | 'female' | 'other'>('male');
  const [formNotes, setFormNotes] = useState('');

  const filteredCustomers = customers.filter(c => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.cnic.includes(q) ||
      c.phone.includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormName('');
    setFormCnic('');
    setFormPassport('');
    setFormPhone('');
    setFormCity('لاہور');
    setFormAddress('');
    setFormGender('male');
    setFormNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormName(customer.name);
    setFormCnic(customer.cnic);
    setFormPassport(customer.passport || '');
    setFormPhone(customer.phone);
    setFormCity(customer.city);
    setFormAddress(customer.address);
    setFormGender(customer.gender);
    setFormNotes(customer.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCnic.trim() || !formPhone.trim()) return;

    if (editingCustomer) {
      onUpdateCustomer({
        ...editingCustomer,
        name: formName.trim(),
        cnic: formCnic.trim(),
        passport: formPassport.trim() || undefined,
        phone: formPhone.trim(),
        city: formCity.trim(),
        address: formAddress.trim(),
        gender: formGender,
        notes: formNotes.trim() || undefined
      });
    } else {
      onAddCustomer({
        name: formName.trim(),
        cnic: formCnic.trim(),
        passport: formPassport.trim() || undefined,
        phone: formPhone.trim(),
        city: formCity.trim() || 'جھنگ',
        address: formAddress.trim(),
        gender: formGender,
        idType: formPassport.trim() ? 'passport' : 'cnic',
        notes: formNotes.trim() || undefined
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A20] border border-gray-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Users className="w-6 h-6 text-blue-500" />
            <span>کسٹمر اور مہمان ڈائریکٹری (Customer Management)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            تمام کسٹمرز کا ڈیٹا بیس، شناختی کارڈ (CNIC)، موبائل نمبر اور قیام کی ہسٹری
          </p>
        </div>

        <button
          id="btn-add-customer-main"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ نیا کسٹمر رجسٹر کریں</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-[#181A20] p-3 rounded-2xl border border-gray-800 flex items-center justify-between gap-4">
        <div className="w-full max-w-md relative">
          <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="کسٹمر کا نام، شناختی کارڈ، فون یا شہر تلاش کریں..."
            className="w-full bg-[#0F1115] border border-gray-800 rounded-lg pr-10 pl-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="text-xs text-gray-400">
          کل رجسٹرڈ کسٹمرز: <span className="font-bold text-blue-400 font-mono">{customers.length}</span>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const customerBookings = bookings.filter(b => b.customerId === customer.id);

          return (
            <div
              key={customer.id}
              className="bg-[#181A20] border border-gray-800 hover:border-gray-700 rounded-2xl p-5 shadow-xl flex flex-col justify-between transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-base">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white leading-tight">
                        {customer.name}
                      </h3>
                      <span className="text-[11px] text-gray-400 font-mono">
                        {customer.city}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 font-medium">
                    {customer.totalVisits} بار قیام
                  </span>
                </div>

                {/* Details */}
                <div className="p-3 bg-[#0F1115] rounded-xl border border-gray-800 space-y-1.5 text-xs mb-3">
                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-500">شناختی کارڈ (CNIC):</span>
                    <span className="font-mono text-gray-200 font-semibold">{customer.cnic}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-500">موبائل نمبر:</span>
                    <span className="font-mono text-green-400 font-bold">{customer.phone}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-300">
                    <span className="text-gray-500">پتہ:</span>
                    <span className="text-gray-300 truncate max-w-[180px]">{customer.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-gray-300 border-t border-gray-800 pt-1.5">
                    <span className="text-gray-500">کل اخراجات:</span>
                    <span className="font-mono text-blue-400 font-bold">
                      Rs. {(customer.totalSpent || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                {customer.notes && (
                  <p className="text-[11px] text-amber-300/90 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20 mb-3">
                    📝 {customer.notes}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => setHistoryCustomer(customer)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <History className="w-3.5 h-3.5 text-blue-400" />
                  <span>قیام ہسٹری ({customerBookings.length})</span>
                </button>

                <button
                  onClick={() => handleOpenEdit(customer)}
                  title="کسٹمر معلومات ایڈٹ کریں"
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-blue-400" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`کیا آپ واقعی کسٹمر ${customer.name} کا ریکارڈ ڈیلیٹ کرنا چاہتے ہیں؟`)) {
                      onDeleteCustomer(customer.id);
                    }
                  }}
                  title="کسٹمر ڈیلیٹ کریں"
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181A20] border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span>{editingCustomer ? 'کسٹمر کی معلومات تبدیل کریں' : 'نیا کسٹمر شامل کریں'}</span>
            </h3>

            <form onSubmit={handleSaveCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">کسٹمر کا مکمل نام:</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="مثال: چوہدری عمران اشرف"
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">شناختی کارڈ (CNIC):</label>
                  <input
                    type="text"
                    required
                    value={formCnic}
                    onChange={(e) => setFormCnic(e.target.value)}
                    placeholder="مثال: 33202-1456789-1"
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">موبائل نمبر:</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="مثال: 0300-9876543"
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">شہر (City):</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    placeholder="مثال: جھنگ / لاہور / فیصل آباد"
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">پاسپورٹ نمبر (اختیاری):</label>
                  <input
                    type="text"
                    value={formPassport}
                    onChange={(e) => setFormPassport(e.target.value)}
                    placeholder="مثال: PK-994821"
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">مکمل پتہ (Address):</label>
                <input
                  type="text"
                  required
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="مثال: ماڈل ٹاؤن، جھنگ صدر"
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">خصوصی نوٹس یا ترجیحات:</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="مثال: VIP مہمان، ایگزیکٹو فلور ترجیح"
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

      {/* Customer Stay History Modal */}
      {historyCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#181A20] border border-gray-800 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                <span>قیام ہسٹری - {historyCustomer.name}</span>
              </h3>
              <button
                onClick={() => setHistoryCustomer(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-3">
              {bookings.filter(b => b.customerId === historyCustomer.id).length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  کوئی سابقہ بکنگ ریکارڈ موجود نہیں ہے۔
                </div>
              ) : (
                bookings
                  .filter(b => b.customerId === historyCustomer.id)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-3.5 bg-[#0F1115] border border-gray-800 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-400">{b.bookingNumber}</span>
                          <span className="text-white font-bold">کمرہ {b.roomNumber} ({b.roomTypeName})</span>
                        </div>
                        <div className="text-gray-400 text-[11px] mt-1 font-mono">
                          {b.checkInDate} تا {b.checkOutDate} ({b.totalDays} دن)
                        </div>
                      </div>

                      <div className="text-left font-mono">
                        <div className="font-bold text-white">Rs. {(b.totalAmount || 0).toLocaleString()}</div>
                        <div className="text-[10px] text-green-400 uppercase">{b.status}</div>
                      </div>
                    </div>
                  ))
              )}
            </div>

            <div className="pt-3 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setHistoryCustomer(null)}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium text-xs"
              >
                بند کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
