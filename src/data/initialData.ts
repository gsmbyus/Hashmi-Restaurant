import { Customer, Room, RoomType, Booking, Invoice, Income, Expense, AuditLog, HotelSettings, User } from '../types';
import hashmiLogoImg from '../assets/images/hashmi_restaurant_logo_1786650675396.jpg';
import usamaPortraitImg from '../assets/images/usama_saif_portrait_1786650689421.jpg';

export const DEFAULT_LOGO_URL = hashmiLogoImg;
export const DEFAULT_PORTRAIT_URL = usamaPortraitImg;

export const initialHotelSettings: HotelSettings = {
  hotelNameUrdu: 'ہاشمی ریسٹورنٹ اینڈ ہوٹل',
  hotelNameEn: 'HASHMI RESTAURANT',
  taglineUrdu: 'شاہانہ ذائقہ اور پرسکون رہائش – ذائقہ جو آپ کو بار بار بلائے',
  taglineEn: 'Taste That Brings You Back • Luxury Restaurant Management System',
  addressUrdu: 'حویلی بہادر شاہ، جھنگ، پنجاب، پاکستان',
  addressEn: 'Haveli Bahadur Shah, Jhang, Punjab, Pakistan',
  phone: '+92 347 7669235',
  whatsapp: '+92 347 7669235',
  email: 'gsmbyus.tools@gmail.com',
  website: 'https://gsmbyusamasaif.blogspot.com',
  currency: 'روپے (PKR)',
  taxRatePercent: 5,
  checkInTime: '12:00 PM',
  checkOutTime: '11:00 AM',
  logoUrl: hashmiLogoImg,
  developer: {
    name: 'اسامہ سیف (Usama Saif)',
    brand: 'GSM_BY_US',
    phone: '+92 347 7669235',
    address: 'حویلی بہادر شاہ، جھنگ، پنجاب، پاکستان',
    links: {
      youtube: 'https://youtube.com/@gsm_by_us?si=6pHSE9zAZwfLzjfA',
      whatsappChannel: 'https://whatsapp.com/channel/0029VbCEqo217EmsltUo420F',
      whatsappGroup: 'https://chat.whatsapp.com/JnZvPgozJJx6tc6nMRDzzT',
      telegram: 'https://t.me/gsmcrackbyus',
      blog: 'https://gsmbyusamasaif.blogspot.com',
    }
  }
};

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    username: 'admin',
    fullName: 'اسامہ سیف (ایڈمنسٹریٹر)',
    role: 'admin',
    email: 'admin@gsmbyus.com',
    phone: '+92 347 7669235',
    active: true,
    createdAt: '2026-01-01',
    lastLogin: '2026-08-13 10:30 AM'
  },
  {
    id: 'usr-2',
    username: 'reception1',
    fullName: 'محمد علی خان (ریسپشنسٹ)',
    role: 'receptionist',
    email: 'ali@smarthotel.pk',
    phone: '0300-1234567',
    active: true,
    createdAt: '2026-02-15',
    lastLogin: '2026-08-13 08:45 AM'
  },
  {
    id: 'usr-3',
    username: 'manager1',
    fullName: 'طارق محمود (ہوٹل منیجر)',
    role: 'manager',
    email: 'tariq@smarthotel.pk',
    phone: '0321-7654321',
    active: true,
    createdAt: '2026-03-01',
    lastLogin: '2026-08-12 05:20 PM'
  }
];

export const initialRoomTypes: RoomType[] = [
  {
    id: 'rt-single',
    nameUrdu: 'سنگل بیڈ روم',
    nameEn: 'Single Room',
    basePrice: 3500,
    capacity: 1,
    description: 'ایک فرد کے لیے ارام دہ کمرہ، منسلک باتھ روم اور تیز وائی فائی',
    amenities: ['AC', 'WiFi', 'Attached Bath', 'LED TV']
  },
  {
    id: 'rt-double',
    nameUrdu: 'ڈبل بیڈ ڈیلوکس',
    nameEn: 'Double Deluxe Room',
    basePrice: 6000,
    capacity: 2,
    description: 'دو افراد یا فیملی کے لیے خوبصورت کشادہ روم، بالکونی ویو',
    amenities: ['King Bed', 'AC', 'Fast WiFi', 'Mini Fridge', 'Smart TV', 'Balcony']
  },
  {
    id: 'rt-exec',
    nameUrdu: 'ایگزیکٹو سوٹ',
    nameEn: 'Executive Suite',
    basePrice: 10500,
    capacity: 3,
    description: 'بزنس کلاس مہمانوں کے لیے لاؤنج کے ساتھ لگژری سوٹ',
    amenities: ['King Bed', 'Living Area', 'Mini Bar', 'Work Desk', 'Jacuzzi', 'Breakfast']
  },
  {
    id: 'rt-family',
    nameUrdu: 'فیملی لگژری سوٹ',
    nameEn: 'Family Luxury Suite',
    basePrice: 14000,
    capacity: 5,
    description: '2 بیڈ رومز، فیملی بیٹھک، کچن کارنر اور شاندار ویو',
    amenities: ['2 Bedrooms', 'Sofa Set', 'Mini Kitchen', '2 LED TVs', 'Complimentary Breakfast']
  },
  {
    id: 'rt-presidential',
    nameUrdu: 'پریذیڈنشل وی آئی پی سوٹ',
    nameEn: 'Presidential VIP Suite',
    basePrice: 22000,
    capacity: 4,
    description: 'پریمیم شاہانہ سوٹ، پرائیویٹ سروس، وی آئی پی ڈائننگ',
    amenities: ['VIP Butler', 'Panoramic View', 'Luxury Jacuzzi', 'Dining Area', 'Free Mini Bar', 'Airport Pickup']
  }
];

export const initialRooms: Room[] = [
  {
    id: 'rm-101',
    roomNumber: '101',
    floor: 1,
    typeId: 'rt-single',
    typeNameUrdu: 'سنگل بیڈ روم',
    typeNameEn: 'Single Room',
    pricePerNight: 3500,
    status: 'booked',
    cleaningStatus: 'clean',
    amenities: ['AC', 'WiFi', 'Attached Bath', 'LED TV'],
    capacity: 1,
    currentBookingId: 'bk-1001'
  },
  {
    id: 'rm-102',
    roomNumber: '102',
    floor: 1,
    typeId: 'rt-single',
    typeNameUrdu: 'سنگل بیڈ روم',
    typeNameEn: 'Single Room',
    pricePerNight: 3500,
    status: 'available',
    cleaningStatus: 'clean',
    amenities: ['AC', 'WiFi', 'Attached Bath', 'LED TV'],
    capacity: 1
  },
  {
    id: 'rm-103',
    roomNumber: '103',
    floor: 1,
    typeId: 'rt-double',
    typeNameUrdu: 'ڈبل بیڈ ڈیلوکس',
    typeNameEn: 'Double Deluxe Room',
    pricePerNight: 6000,
    status: 'booked',
    cleaningStatus: 'clean',
    amenities: ['King Bed', 'AC', 'Fast WiFi', 'Mini Fridge', 'Smart TV'],
    capacity: 2,
    currentBookingId: 'bk-1002'
  },
  {
    id: 'rm-104',
    roomNumber: '104',
    floor: 1,
    typeId: 'rt-double',
    typeNameUrdu: 'ڈبل بیڈ ڈیلوکس',
    typeNameEn: 'Double Deluxe Room',
    pricePerNight: 6000,
    status: 'available',
    cleaningStatus: 'clean',
    amenities: ['King Bed', 'AC', 'Fast WiFi', 'Mini Fridge', 'Smart TV'],
    capacity: 2
  },
  {
    id: 'rm-201',
    roomNumber: '201',
    floor: 2,
    typeId: 'rt-exec',
    typeNameUrdu: 'ایگزیکٹو سوٹ',
    typeNameEn: 'Executive Suite',
    pricePerNight: 10500,
    status: 'available',
    cleaningStatus: 'clean',
    amenities: ['King Bed', 'Living Area', 'Mini Bar', 'Work Desk', 'Jacuzzi'],
    capacity: 3
  },
  {
    id: 'rm-202',
    roomNumber: '202',
    floor: 2,
    typeId: 'rt-exec',
    typeNameUrdu: 'ایگزیکٹو سوٹ',
    typeNameEn: 'Executive Suite',
    pricePerNight: 10500,
    status: 'booked',
    cleaningStatus: 'clean',
    amenities: ['King Bed', 'Living Area', 'Mini Bar', 'Work Desk', 'Jacuzzi'],
    capacity: 3,
    currentBookingId: 'bk-1003'
  },
  {
    id: 'rm-203',
    roomNumber: '203',
    floor: 2,
    typeId: 'rt-family',
    typeNameUrdu: 'فیملی لگژری سوٹ',
    typeNameEn: 'Family Luxury Suite',
    pricePerNight: 14000,
    status: 'cleaning',
    cleaningStatus: 'in_progress',
    amenities: ['2 Bedrooms', 'Sofa Set', 'Mini Kitchen', '2 LED TVs'],
    capacity: 5
  },
  {
    id: 'rm-204',
    roomNumber: '204',
    floor: 2,
    typeId: 'rt-family',
    typeNameUrdu: 'فیملی لگژری سوٹ',
    typeNameEn: 'Family Luxury Suite',
    pricePerNight: 14000,
    status: 'available',
    cleaningStatus: 'clean',
    amenities: ['2 Bedrooms', 'Sofa Set', 'Mini Kitchen', '2 LED TVs'],
    capacity: 5
  },
  {
    id: 'rm-301',
    roomNumber: '301',
    floor: 3,
    typeId: 'rt-presidential',
    typeNameUrdu: 'پریذیڈنشل وی آئی پی سوٹ',
    typeNameEn: 'Presidential VIP Suite',
    pricePerNight: 22000,
    status: 'available',
    cleaningStatus: 'clean',
    amenities: ['VIP Butler', 'Panoramic View', 'Luxury Jacuzzi', 'Dining Area', 'Free Mini Bar'],
    capacity: 4
  },
  {
    id: 'rm-302',
    roomNumber: '302',
    floor: 3,
    typeId: 'rt-double',
    typeNameUrdu: 'ڈبل بیڈ ڈیلوکس',
    typeNameEn: 'Double Deluxe Room',
    pricePerNight: 6000,
    status: 'maintenance',
    cleaningStatus: 'dirty',
    amenities: ['King Bed', 'AC', 'Fast WiFi'],
    capacity: 2,
    notes: 'اے سی کی سروس اور پینٹ کا کام جاری ہے'
  }
];

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'چوہدری عمران اشرف',
    cnic: '33202-1456789-1',
    phone: '0300-9876543',
    address: 'ماڈل ٹاؤن، لاہور',
    city: 'لاہور',
    gender: 'male',
    idType: 'cnic',
    notes: 'باقاعدہ مہمان (VIP)، خاموش کمرہ پسند کرتے ہیں',
    totalVisits: 4,
    totalSpent: 42000,
    createdAt: '2026-03-10'
  },
  {
    id: 'cust-2',
    name: 'سید کاشف رضا گیلانی',
    cnic: '33100-8765432-3',
    phone: '0345-5551234',
    address: 'گلبرگ 3، فیصل آباد',
    city: 'فیصل آباد',
    gender: 'male',
    idType: 'cnic',
    notes: 'فیملی ٹرپ، ایگزیکٹو کسٹمر',
    totalVisits: 2,
    totalSpent: 21000,
    createdAt: '2026-05-18'
  },
  {
    id: 'cust-3',
    name: 'ڈاکٹر ثناء طارق',
    cnic: '37405-2345678-4',
    phone: '0333-8889900',
    address: 'سیکٹر F-8، اسلام آباد',
    city: 'اسلام آباد',
    gender: 'female',
    idType: 'cnic',
    notes: 'میڈیکل کانفرنس کے لیے قیام',
    totalVisits: 1,
    totalSpent: 10500,
    createdAt: '2026-07-22'
  },
  {
    id: 'cust-4',
    name: 'حاجی بشیر احمد سیال',
    cnic: '33201-9988776-5',
    phone: '0347-7669235',
    address: 'جھنگ صدر، پنجاب',
    city: 'جھنگ',
    gender: 'male',
    idType: 'cnic',
    notes: 'لوکل بزنس پارٹنر',
    totalVisits: 6,
    totalSpent: 55000,
    createdAt: '2026-02-05'
  }
];

export const initialBookings: Booking[] = [
  {
    id: 'bk-1001',
    bookingNumber: 'BK-2026-001',
    customerId: 'cust-1',
    customerName: 'چوہدری عمران اشرف',
    customerPhone: '0300-9876543',
    customerCnic: '33202-1456789-1',
    roomId: 'rm-101',
    roomNumber: '101',
    roomTypeName: 'سنگل بیڈ روم',
    checkInDate: '2026-08-12',
    checkOutDate: '2026-08-15',
    checkInTime: '02:00 PM',
    checkOutTime: '11:00 AM',
    guestsCount: 1,
    advancePayment: 3500,
    dailyRate: 3500,
    totalDays: 3,
    totalAmount: 10500,
    status: 'checked_in',
    paymentStatus: 'partial',
    paymentMethod: 'cash',
    specialRequests: 'اضافی کمبل اور دیر سے چیک آؤٹ',
    createdAt: '2026-08-12 01:45 PM'
  },
  {
    id: 'bk-1002',
    bookingNumber: 'BK-2026-002',
    customerId: 'cust-2',
    customerName: 'سید کاشف رضا گیلانی',
    customerPhone: '0345-5551234',
    customerCnic: '33100-8765432-3',
    roomId: 'rm-103',
    roomNumber: '103',
    roomTypeName: 'ڈبل بیڈ ڈیلوکس',
    checkInDate: '2026-08-13',
    checkOutDate: '2026-08-16',
    checkInTime: '12:30 PM',
    checkOutTime: '11:00 AM',
    guestsCount: 2,
    advancePayment: 6000,
    dailyRate: 6000,
    totalDays: 3,
    totalAmount: 18000,
    status: 'checked_in',
    paymentStatus: 'partial',
    paymentMethod: 'easypaisa',
    specialRequests: 'بیڈ روم میں کافی میکر فراہم کریں',
    createdAt: '2026-08-13 12:15 PM'
  },
  {
    id: 'bk-1003',
    bookingNumber: 'BK-2026-003',
    customerId: 'cust-3',
    customerName: 'ڈاکٹر ثناء طارق',
    customerPhone: '0333-8889900',
    customerCnic: '37405-2345678-4',
    roomId: 'rm-202',
    roomNumber: '202',
    roomTypeName: 'ایگزیکٹو سوٹ',
    checkInDate: '2026-08-13',
    checkOutDate: '2026-08-14',
    checkInTime: '03:00 PM',
    checkOutTime: '11:00 AM',
    guestsCount: 1,
    advancePayment: 10500,
    dailyRate: 10500,
    totalDays: 1,
    totalAmount: 10500,
    status: 'reserved',
    paymentStatus: 'paid',
    paymentMethod: 'bank',
    specialRequests: 'صبح کا ناشتہ روم میں',
    createdAt: '2026-08-13 09:30 AM'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-101',
    invoiceNumber: 'INV-2026-089',
    bookingId: 'bk-1000-prev',
    customerId: 'cust-4',
    customerName: 'حاجی بشیر احمد سیال',
    customerPhone: '0347-7669235',
    customerCnic: '33201-9988776-5',
    roomNumber: '201',
    roomType: 'ایگزیکٹو سوٹ',
    checkInDate: '2026-08-10',
    checkOutDate: '2026-08-12',
    dailyRate: 10500,
    totalDays: 2,
    roomTotal: 21000,
    additionalCharges: [
      { id: 'ch-1', title: 'شام کا کھانا (ڈائننگ)', amount: 2400 },
      { id: 'ch-2', title: 'لانڈری سروس', amount: 800 }
    ],
    subTotal: 24200,
    gstTaxPercent: 5,
    gstAmount: 1210,
    discountAmount: 1410,
    advancePaid: 10000,
    netPayable: 24000,
    paidAmount: 24000,
    balanceDue: 0,
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    issueDate: '2026-08-12',
    issuedBy: 'اسامہ سیف',
    notes: 'تمام ادائیگیاں مکمل ہو گئی ہیں۔ تشریف آوری کا شکریہ۔'
  }
];

export const initialIncome: Income[] = [
  {
    id: 'inc-1',
    date: '2026-08-13',
    title: 'کمرہ 103 ایڈوانس بکنگ پیمنٹ',
    category: 'room_rent',
    categoryUrdu: 'کمرے کا کرایہ',
    amount: 6000,
    paymentMethod: 'easypaisa',
    reference: 'EP-994821',
    receivedBy: 'محمد علی',
    notes: 'آن لائن ریسیو ہوا'
  },
  {
    id: 'inc-2',
    date: '2026-08-13',
    title: 'کمرہ 202 فل پیمنٹ',
    category: 'room_rent',
    categoryUrdu: 'کمرے کا کرایہ',
    amount: 10500,
    paymentMethod: 'bank',
    reference: 'HBL-77632',
    receivedBy: 'اسامہ سیف',
    notes: 'بینک ٹرانسفر تصدیق شدہ'
  },
  {
    id: 'inc-3',
    date: '2026-08-12',
    title: 'حاجی بشیر احمد - حتمی بل کلیئرنس',
    category: 'room_rent',
    categoryUrdu: 'کمرے کا کرایہ',
    amount: 14000,
    paymentMethod: 'cash',
    reference: 'REC-089',
    receivedBy: 'اسامہ سیف'
  },
  {
    id: 'inc-4',
    date: '2026-08-12',
    title: 'ریسٹورنٹ و ڈائننگ بل کلیکشن',
    category: 'dining',
    categoryUrdu: 'کھانا اور مشروبات',
    amount: 5800,
    paymentMethod: 'cash',
    reference: 'REST-441',
    receivedBy: 'طارق محمود'
  }
];

export const initialExpenses: Expense[] = [
  {
    id: 'exp-1',
    date: '2026-08-13',
    title: 'بجلی جنریٹر ڈیزل فلنگ',
    category: 'utilities',
    categoryUrdu: 'بجلی و فیول',
    amount: 8500,
    paidTo: 'پاکستان پٹرولیم جھنگ',
    paymentMethod: 'cash',
    approvedBy: 'اسامہ سیف',
    receiptNo: 'PSO-9921',
    notes: '25 لیٹر ڈیزل برائے بیک اپ جنریٹر'
  },
  {
    id: 'exp-2',
    date: '2026-08-12',
    title: 'کمرہ 302 اے سی گیس چارج اور مرمت',
    category: 'maintenance',
    categoryUrdu: 'مرمت و دیکھ بھال',
    amount: 4200,
    paidTo: 'ملنگ الیکٹرانکس',
    paymentMethod: 'cash',
    approvedBy: 'طارق محمود',
    receiptNo: 'REP-1102'
  },
  {
    id: 'exp-3',
    date: '2026-08-11',
    title: 'صفائی و لانڈری کیمیکلز خریداری',
    category: 'supplies',
    categoryUrdu: 'صفائی کا سامان',
    amount: 3200,
    paidTo: 'المدینہ ٹریڈرز',
    paymentMethod: 'jazzcash',
    approvedBy: 'محمد علی'
  },
  {
    id: 'exp-4',
    date: '2026-08-01',
    title: 'اسٹاف ماہانہ تنخواہیں (جزوی پیشگی)',
    category: 'salaries',
    categoryUrdu: 'ملازمین کی تنخواہ',
    amount: 35000,
    paidTo: 'ہوٹل اسٹاف',
    paymentMethod: 'bank',
    approvedBy: 'اسامہ سیف'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-08-13 12:30:15',
    userId: 'usr-1',
    userName: 'اسامہ سیف',
    action: 'نئی بکنگ درج کی گئی',
    module: 'Bookings',
    details: 'کمرہ 103 کے لیے سید کاشف رضا گیلانی کی بکنگ درج کی گئی۔ ایڈوانس 6,000 روپے',
    ipAddress: '192.168.1.10'
  },
  {
    id: 'log-2',
    timestamp: '2026-08-13 11:15:00',
    userId: 'usr-2',
    userName: 'محمد علی',
    action: 'روم اسٹیٹس تبدیل',
    module: 'Rooms',
    details: 'کمرہ 203 کی صفائی جاری رکھی گئی۔ اسٹیٹس: صفائی جاری',
    ipAddress: '192.168.1.12'
  },
  {
    id: 'log-3',
    timestamp: '2026-08-13 09:45:20',
    userId: 'usr-1',
    userName: 'اسامہ سیف',
    action: 'سسٹم لاگ ان',
    module: 'Auth',
    details: 'ایڈمن پینل میں کامیابی کے ساتھ لاگ ان کیا گیا',
    ipAddress: '192.168.1.10'
  },
  {
    id: 'log-4',
    timestamp: '2026-08-12 04:30:00',
    userId: 'usr-3',
    userName: 'طارق محمود',
    action: 'انوائس جنریٹ اور پرنٹ',
    module: 'Invoices',
    details: 'حاجی بشیر احمد کے لیے انوائس INV-2026-089 مالیت 24,000 روپے تیار کی گئی',
    ipAddress: '192.168.1.15'
  }
];

export const DEFAULT_HOTEL_SETTINGS = initialHotelSettings;
export const INITIAL_USERS = initialUsers;
export const INITIAL_ROOM_TYPES = initialRoomTypes;
export const INITIAL_ROOMS = initialRooms;
export const INITIAL_CUSTOMERS = initialCustomers;
export const INITIAL_BOOKINGS = initialBookings;
export const INITIAL_INVOICES = initialInvoices;
export const INITIAL_INCOME = initialIncome;
export const INITIAL_EXPENSES = initialExpenses;
export const INITIAL_AUDIT_LOGS = initialAuditLogs;
