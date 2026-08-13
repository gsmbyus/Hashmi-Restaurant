export type UserRole = 'admin' | 'manager' | 'receptionist';

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email: string;
  phone: string;
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Customer {
  id: string;
  name: string;
  cnic: string;
  passport?: string;
  phone: string;
  address: string;
  city: string;
  gender: 'male' | 'female' | 'other';
  idType: 'cnic' | 'passport' | 'other';
  notes?: string;
  totalVisits: number;
  totalSpent: number;
  createdAt: string;
}

export type RoomStatus = 'available' | 'booked' | 'maintenance' | 'cleaning';
export type CleaningStatus = 'clean' | 'dirty' | 'in_progress';

export interface RoomType {
  id: string;
  nameUrdu: string;
  nameEn: string;
  basePrice: number;
  capacity: number;
  description: string;
  amenities: string[];
}

export interface Room {
  id: string;
  roomNumber: string;
  floor: number;
  typeId: string;
  typeNameUrdu: string;
  typeNameEn: string;
  pricePerNight: number;
  status: RoomStatus;
  cleaningStatus: CleaningStatus;
  amenities: string[];
  capacity: number;
  notes?: string;
  currentBookingId?: string;
}

export type BookingStatus = 'reserved' | 'checked_in' | 'checked_out' | 'cancelled';
export type PaymentStatus = 'paid' | 'partial' | 'unpaid';

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCnic: string;
  roomId: string;
  roomNumber: string;
  roomTypeName: string;
  checkInDate: string;
  checkOutDate: string;
  checkInTime: string;
  checkOutTime: string;
  guestsCount: number;
  advancePayment: number;
  dailyRate: number;
  totalDays: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash' | 'bank' | 'card';
  specialRequests?: string;
  createdAt: string;
}

export interface AdditionalCharge {
  id: string;
  title: string;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerCnic: string;
  roomNumber: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  dailyRate: number;
  totalDays: number;
  roomTotal: number;
  roomCharges?: number;
  foodCharges?: number;
  laundryCharges?: number;
  extraCharges?: number;
  additionalCharges?: AdditionalCharge[];
  subTotal: number;
  subtotal?: number;
  gstTaxPercent: number;
  taxPercentage?: number;
  gstAmount: number;
  taxAmount?: number;
  discountAmount: number;
  discount?: number;
  advancePaid: number;
  netPayable: number;
  grandTotal?: number;
  paidAmount: number;
  balanceDue: number;
  remainingAmount?: number;
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash' | 'bank' | 'card' | 'bank_transfer';
  paymentStatus: PaymentStatus;
  status?: PaymentStatus;
  issueDate: string;
  issueTime?: string;
  issuedBy: string;
  notes?: string;
}

export interface Income {
  id: string;
  date: string;
  title: string;
  category: 'room_rent' | 'dining' | 'laundry' | 'services' | 'other';
  categoryUrdu: string;
  amount: number;
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash' | 'bank' | 'card';
  reference?: string;
  receivedBy: string;
  notes?: string;
}

export type ExpenseCategory = 'utilities' | 'maintenance' | 'salaries' | 'supplies' | 'food' | 'taxes' | 'misc';

export interface Expense {
  id: string;
  date: string;
  title: string;
  category: ExpenseCategory;
  categoryUrdu: string;
  amount: number;
  paidTo: string;
  paymentMethod: 'cash' | 'easypaisa' | 'jazzcash' | 'bank' | 'card';
  approvedBy: string;
  receiptNo?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
}

export interface HotelSettings {
  hotelNameUrdu: string;
  hotelNameEn: string;
  taglineUrdu: string;
  taglineEn: string;
  addressUrdu: string;
  addressEn: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  currency: string;
  taxRatePercent: number;
  taxPercentage?: number;
  checkInTime: string;
  checkOutTime: string;
  logoUrl?: string;
  portraitUrl?: string;
  themeMode?: 'dark' | 'light';
  developer: {
    name: string;
    brand: string;
    phone: string;
    address: string;
    links: {
      youtube: string;
      whatsappChannel: string;
      whatsappGroup: string;
      telegram: string;
      blog: string;
    };
  };
}
