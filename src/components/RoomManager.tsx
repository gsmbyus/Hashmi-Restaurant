import React, { useState } from 'react';
import { 
  DoorClosed, 
  Plus, 
  Filter, 
  Brush, 
  Wrench, 
  Check, 
  Edit3, 
  Trash2, 
  Sparkles,
  Wifi,
  Tv,
  Wind,
  Layers
} from 'lucide-react';
import { Room, RoomType } from '../types';

interface RoomManagerProps {
  rooms: Room[];
  roomTypes: RoomType[];
  onAddRoom: (room: Omit<Room, 'id'>) => void;
  onUpdateRoom: (room: Room) => void;
  onDeleteRoom: (roomId: string) => void;
}

export const RoomManager: React.FC<RoomManagerProps> = ({
  rooms,
  roomTypes,
  onAddRoom,
  onUpdateRoom,
  onDeleteRoom
}) => {
  const [selectedFloor, setSelectedFloor] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  // Form State
  const [formRoomNumber, setFormRoomNumber] = useState('');
  const [formFloor, setFormFloor] = useState(1);
  const [formTypeId, setFormTypeId] = useState(roomTypes[0]?.id || '');
  const [formPrice, setFormPrice] = useState(roomTypes[0]?.basePrice || 4000);
  const [formCapacity, setFormCapacity] = useState(2);
  const [formStatus, setFormStatus] = useState<'available' | 'booked' | 'maintenance' | 'cleaning'>('available');
  const [formNotes, setFormNotes] = useState('');

  const floors = Array.from(new Set(rooms.map(r => r.floor))).sort();

  const filteredRooms = rooms.filter(r => {
    if (selectedFloor !== 'all' && r.floor !== selectedFloor) return false;
    if (selectedStatus !== 'all' && r.status !== selectedStatus) return false;
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingRoom(null);
    setFormRoomNumber('');
    setFormFloor(1);
    const defaultType = roomTypes[0];
    setFormTypeId(defaultType?.id || '');
    setFormPrice(defaultType?.basePrice || 4000);
    setFormCapacity(defaultType?.capacity || 2);
    setFormStatus('available');
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (room: Room) => {
    setEditingRoom(room);
    setFormRoomNumber(room.roomNumber);
    setFormFloor(room.floor);
    setFormTypeId(room.typeId);
    setFormPrice(room.pricePerNight);
    setFormCapacity(room.capacity);
    setFormStatus(room.status);
    setFormNotes(room.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRoomNumber.trim()) return;

    const matchedType = roomTypes.find(t => t.id === formTypeId) || roomTypes[0];

    if (editingRoom) {
      onUpdateRoom({
        ...editingRoom,
        roomNumber: formRoomNumber.trim(),
        floor: Number(formFloor),
        typeId: matchedType.id,
        typeNameUrdu: matchedType.nameUrdu,
        typeNameEn: matchedType.nameEn,
        pricePerNight: Number(formPrice),
        capacity: Number(formCapacity),
        status: formStatus,
        notes: formNotes
      });
    } else {
      onAddRoom({
        roomNumber: formRoomNumber.trim(),
        floor: Number(formFloor),
        typeId: matchedType.id,
        typeNameUrdu: matchedType.nameUrdu,
        typeNameEn: matchedType.nameEn,
        pricePerNight: Number(formPrice),
        capacity: Number(formCapacity),
        status: formStatus,
        cleaningStatus: 'clean',
        amenities: matchedType.amenities || ['AC', 'WiFi'],
        notes: formNotes
      });
    }

    setIsAddModalOpen(false);
  };

  const handleToggleCleaning = (room: Room) => {
    const nextStatus = room.cleaningStatus === 'clean' ? 'dirty' : room.cleaningStatus === 'dirty' ? 'in_progress' : 'clean';
    onUpdateRoom({
      ...room,
      cleaningStatus: nextStatus,
      status: nextStatus === 'in_progress' ? 'cleaning' : nextStatus === 'clean' && room.status === 'cleaning' ? 'available' : room.status
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#181A20] border border-gray-800 rounded-2xl p-5 shadow-lg">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <DoorClosed className="w-6 h-6 text-blue-500" />
            <span>کمروں کی دیکھ بھال اور انتظام (Room Management)</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            تمام کمروں کی تفصیلات، کرایہ، گنجائش، اور صفائی کا کنٹرول
          </p>
        </div>

        <button
          id="btn-add-new-room"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-900/30 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>نیا کمرہ شامل کریں +</span>
        </button>
      </div>

      {/* Filter Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#181A20] p-3.5 rounded-xl border border-gray-800 text-xs">
        {/* Floor Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-gray-400 font-semibold px-2">منزل (Floor):</span>
          <button
            onClick={() => setSelectedFloor('all')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedFloor === 'all' ? 'bg-blue-600 text-white' : 'bg-[#0F1115] text-gray-300 hover:bg-gray-800'
            }`}
          >
            تمام منزلیں
          </button>
          {floors.map(f => (
            <button
              key={f}
              onClick={() => setSelectedFloor(f)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedFloor === f ? 'bg-blue-600 text-white' : 'bg-[#0F1115] text-gray-300 hover:bg-gray-800'
              }`}
            >
              منزل {f}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-gray-400 font-semibold px-2">اسٹیٹس:</span>
          {[
            { id: 'all', label: 'تمام' },
            { id: 'available', label: 'خالی (Available)' },
            { id: 'booked', label: 'بک شدہ (Booked)' },
            { id: 'cleaning', label: 'صفائی جاری (Cleaning)' },
            { id: 'maintenance', label: 'مرمت (Maintenance)' },
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setSelectedStatus(st.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedStatus === st.id ? 'bg-blue-600 text-white' : 'bg-[#0F1115] text-gray-300 hover:bg-gray-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredRooms.map((room) => {
          const isAvailable = room.status === 'available';
          const isBooked = room.status === 'booked';
          const isCleaning = room.status === 'cleaning' || room.cleaningStatus === 'in_progress';
          const isMaintenance = room.status === 'maintenance';

          return (
            <div
              key={room.id}
              className={`bg-[#181A20] border rounded-2xl p-5 shadow-lg transition-all relative flex flex-col justify-between ${
                isAvailable
                  ? 'border-gray-800 hover:border-green-500/50'
                  : isBooked
                  ? 'border-gray-800 hover:border-blue-500/50'
                  : isCleaning
                  ? 'border-gray-800 hover:border-yellow-500/50'
                  : 'border-gray-800 hover:border-gray-600'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-gray-400 bg-gray-800/80 px-2.5 py-1 rounded-md">
                    Floor {room.floor}
                  </span>
                  <span
                    className={`text-[11px] px-2.5 py-1 rounded-md font-bold ${
                      isAvailable
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : isBooked
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : isCleaning
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-gray-800 text-gray-300'
                    }`}
                  >
                    {isAvailable ? 'دستیاب' : isBooked ? 'بک شدہ' : isCleaning ? 'صفائی جاری' : 'مینٹیننس'}
                  </span>
                </div>

                {/* Room Title & Type */}
                <div className="mb-3">
                  <h3 className="text-2xl font-bold text-white font-mono">
                    کمرہ نمبر {room.roomNumber}
                  </h3>
                  <p className="text-xs text-gray-300 font-medium mt-0.5">
                    {room.typeNameUrdu}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {room.typeNameEn}
                  </p>
                </div>

                {/* Price & Capacity */}
                <div className="p-3 bg-[#0F1115] rounded-xl border border-gray-800 mb-3 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">یومیہ کرایہ:</span>
                    <span className="font-mono text-blue-400 font-bold text-sm">
                      Rs. {(room.pricePerNight || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">گنجائش:</span>
                    <span className="text-gray-200 font-medium">{room.capacity} افراد</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">صفائی اسٹیٹس:</span>
                    <span className={`font-medium ${
                      room.cleaningStatus === 'clean' ? 'text-green-400' : 'text-yellow-400'
                    }`}>
                      {room.cleaningStatus === 'clean' ? 'صاف ستھرا' : room.cleaningStatus === 'in_progress' ? 'صفائی جاری' : 'صفائی درکار'}
                    </span>
                  </div>
                </div>

                {room.notes && (
                  <p className="text-[11px] text-amber-400/90 bg-yellow-500/10 p-2 rounded-lg border border-yellow-500/20 mb-3">
                    📌 {room.notes}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleToggleCleaning(room)}
                  title="صفائی کی حالت تبدیل کریں"
                  className="flex-1 py-1.5 px-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Brush className="w-3.5 h-3.5 text-yellow-400" />
                  <span>صفائی ٹوگل</span>
                </button>

                <button
                  onClick={() => handleOpenEditModal(room)}
                  title="کمرے کی معلومات ایڈٹ کریں"
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-blue-400" />
                </button>

                <button
                  onClick={() => {
                    if (window.confirm(`کیا آپ واقعی کمرہ ${room.roomNumber} ڈیلیٹ کرنا چاہتے ہیں؟`)) {
                      onDeleteRoom(room.id);
                    }
                  }}
                  title="کمرہ ڈیلیٹ کریں"
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Room Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#181A20] border border-gray-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <DoorClosed className="w-5 h-5 text-blue-500" />
              <span>{editingRoom ? 'کمرے کی تفصیلات تبدیل کریں' : 'نیا کمرہ شامل کریں'}</span>
            </h3>

            <form onSubmit={handleSaveRoom} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">کمرہ نمبر (Room Number):</label>
                <input
                  type="text"
                  required
                  value={formRoomNumber}
                  onChange={(e) => setFormRoomNumber(e.target.value)}
                  placeholder="مثال: 105 یا 201"
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">منزل نمبر (Floor):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formFloor}
                    onChange={(e) => setFormFloor(Number(e.target.value))}
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">گنجائش (افراد):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(Number(e.target.value))}
                    className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">کمرے کی کیٹیگری (Room Type):</label>
                <select
                  value={formTypeId}
                  onChange={(e) => {
                    setFormTypeId(e.target.value);
                    const sel = roomTypes.find(t => t.id === e.target.value);
                    if (sel) setFormPrice(sel.basePrice);
                  }}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  {roomTypes.map(t => (
                    <option key={t.id} value={t.id}>{t.nameUrdu} - ({t.nameEn})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">یومیہ کرایہ روپے میں (Price/Night):</label>
                <input
                  type="number"
                  required
                  value={formPrice}
                  onChange={(e) => setFormPrice(Number(e.target.value))}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">موجودہ اسٹیٹس:</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="available">خالی / دستیاب (Available)</option>
                  <option value="booked">بک شدہ (Booked)</option>
                  <option value="cleaning">صفائی جاری (Cleaning)</option>
                  <option value="maintenance">مرمت و دیکھ بھال (Maintenance)</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">اضافی نوٹس (اختیاری):</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="مثال: بالکونی ویو، نیا بیڈ"
                  className="w-full bg-[#0F1115] border border-gray-800 rounded-lg px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500"
                />
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
