import React, { useState, useEffect } from 'react';
import { 
  Room, 
  Booking, 
  Customer, 
  Invoice, 
  Income, 
  Expense, 
  User, 
  AuditLog, 
  HotelSettings,
  RoomType 
} from './types';
import { 
  initialHotelSettings, 
  initialRoomTypes, 
  initialRooms, 
  initialCustomers, 
  initialBookings, 
  initialInvoices, 
  initialIncome, 
  initialExpenses, 
  initialUsers, 
  initialAuditLogs,
  DEFAULT_LOGO_URL
} from './data/initialData';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { RoomManager } from './components/RoomManager';
import { BookingManager } from './components/BookingManager';
import { CustomerManager } from './components/CustomerManager';
import { InvoiceManager } from './components/InvoiceManager';
import { FinanceManager } from './components/FinanceManager';
import { ReportsManager } from './components/ReportsManager';
import { AdminPanel } from './components/AdminPanel';
import { SettingsManager } from './components/SettingsManager';
import { PythonExporter } from './components/PythonExporter';
import { QuickCheckInModal } from './components/QuickCheckInModal';
import { NewBookingModal } from './components/NewBookingModal';
import { CheckOutModal } from './components/CheckOutModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { AuthModal } from './components/AuthModal';
import { IntroScreen } from './components/IntroScreen';
import { LogoEditModal } from './components/LogoEditModal';
import { playSuccessSound } from './utils/audio';

export default function App() {
  // Intro Screen State (opens with logo & fanfare sound)
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    return true;
  });

  // Theme Mode State (Dark Luxury Black & Gold vs Light Royal Gold)
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('hashmi_theme_mode');
    return (saved as 'dark' | 'light') || 'dark';
  });

  // Logo Editor Modal State
  const [isLogoEditorOpen, setIsLogoEditorOpen] = useState<boolean>(false);

  // Persistent State Loaders
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('hashmi_hotel_user');
    return saved ? JSON.parse(saved) : initialUsers[0];
  });

  const [hotelSettings, setHotelSettings] = useState<HotelSettings>(() => {
    const saved = localStorage.getItem('hashmi_hotel_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.logoUrl) parsed.logoUrl = DEFAULT_LOGO_URL;
        return parsed;
      } catch {
        return initialHotelSettings;
      }
    }
    return initialHotelSettings;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_rooms');
    return saved ? JSON.parse(saved) : initialRooms;
  });

  const [roomTypes, setRoomTypes] = useState<RoomType[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_room_types');
    return saved ? JSON.parse(saved) : initialRoomTypes;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_bookings');
    return saved ? JSON.parse(saved) : initialBookings;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [income, setIncome] = useState<Income[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_income');
    return saved ? JSON.parse(saved) : initialIncome;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('hashmi_hotel_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  // UI Active Navigation & Modals
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState<boolean>(false);
  const [isNewBookingOpen, setIsNewBookingOpen] = useState<boolean>(false);
  const [checkingOutBooking, setCheckingOutBooking] = useState<Booking | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  // Sync Theme to Root Element
  useEffect(() => {
    localStorage.setItem('hashmi_theme_mode', themeMode);
    if (themeMode === 'light') {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#FBF9F5';
      document.body.style.color = '#1A1D24';
    } else {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0A0B0E';
      document.body.style.color = '#F3F4F6';
    }
  }, [themeMode]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('hashmi_hotel_settings', JSON.stringify(hotelSettings));
  }, [hotelSettings]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_income', JSON.stringify(income));
  }, [income]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hashmi_hotel_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper: Log Action
  const logAudit = (action: string, details: string, module: string = 'General') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      userId: currentUser?.id || 'admin',
      userName: currentUser?.fullName || 'Administrator (Usama Saif)',
      action,
      module,
      details,
      timestamp: new Date().toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'medium' })
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('hashmi_hotel_user', JSON.stringify(user));
    logAudit('User Login', `User ${user.fullName} (${user.username}) logged in`);
  };

  const handleLogout = () => {
    logAudit('User Logout', `User ${currentUser?.fullName} logged out`);
    setCurrentUser(null);
    localStorage.removeItem('hashmi_hotel_user');
  };

  const handleRegisterUser = (newUser: Omit<User, 'id' | 'createdAt'>) => {
    const created: User = {
      ...newUser,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, created]);
    logAudit('User Registered', `New user registered: ${created.username} (${created.role})`);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    logAudit('User Deleted', `User ID ${userId} removed from system`);
  };

  // Logo Customization
  const handleSaveLogo = (newLogoUrl: string) => {
    setHotelSettings(prev => ({
      ...prev,
      logoUrl: newLogoUrl
    }));
    logAudit('Logo Updated', 'Restaurant brand logo emblem was customized');
  };

  // Theme Toggler
  const handleToggleTheme = () => {
    setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Room Handlers
  const handleAddRoom = (newRoomData: Omit<Room, 'id'>) => {
    const room: Room = {
      ...newRoomData,
      id: `r-${Date.now()}`
    };
    setRooms(prev => [...prev, room]);
    logAudit('New Room Added', `Unit ${room.roomNumber} (${room.typeNameEn}) created`);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    logAudit('Room Updated', `Unit ${updatedRoom.roomNumber} status updated`);
  };

  const handleDeleteRoom = (roomId: string) => {
    const r = rooms.find(item => item.id === roomId);
    setRooms(prev => prev.filter(item => item.id !== roomId));
    logAudit('Room Deleted', `Unit ${r?.roomNumber || roomId} deleted`);
  };

  const handleToggleRoomStatus = (roomId: string) => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return;

    let nextStatus: Room['status'] = 'available';
    if (targetRoom.status === 'available') nextStatus = 'booked';
    else if (targetRoom.status === 'booked') nextStatus = 'cleaning';
    else if (targetRoom.status === 'cleaning') nextStatus = 'maintenance';
    else if (targetRoom.status === 'maintenance') nextStatus = 'available';

    const updated: Room = {
      ...targetRoom,
      status: nextStatus,
      cleaningStatus: nextStatus === 'cleaning' ? 'in_progress' : nextStatus === 'available' ? 'clean' : targetRoom.cleaningStatus
    };

    handleUpdateRoom(updated);
  };

  // Customer Handlers
  const handleAddCustomer = (cData: Omit<Customer, 'id' | 'totalVisits' | 'totalSpent' | 'createdAt'>) => {
    const created: Customer = {
      ...cData,
      id: `c-${Date.now()}`,
      totalVisits: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCustomers(prev => [...prev, created]);
    logAudit('New Customer', `Customer ${created.name} (CNIC: ${created.cnic}) registered`);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
    logAudit('Customer Updated', `Customer ${updatedCustomer.name} profile updated`);
  };

  const handleDeleteCustomer = (customerId: string) => {
    setCustomers(prev => prev.filter(c => c.id !== customerId));
    logAudit('Customer Deleted', `Customer ID ${customerId} deleted`);
  };

  // Booking & Check-in Handlers
  const handleNewBookingConfirm = (bookingData: Omit<Booking, 'id' | 'bookingNumber' | 'createdAt'>) => {
    const bNum = `HR-${Date.now().toString().slice(-6)}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `b-${Date.now()}`,
      bookingNumber: bNum,
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update Room status to booked
    const targetRoom = rooms.find(r => r.roomNumber === newBooking.roomNumber);
    if (targetRoom) {
      handleUpdateRoom({
        ...targetRoom,
        status: 'booked',
        currentBookingId: newBooking.id
      });
    }

    // Add Income if advance payment made
    if (newBooking.advancePayment > 0) {
      const inc: Income = {
        id: `inc-${Date.now()}`,
        title: `Advance Deposit - Unit ${newBooking.roomNumber} (${newBooking.customerName})`,
        category: 'room_rent',
        categoryUrdu: 'کمرہ کرایہ / ایڈوانس ڈپازٹ',
        amount: newBooking.advancePayment,
        date: new Date().toISOString().split('T')[0],
        paymentMethod: newBooking.paymentMethod,
        receivedBy: currentUser?.fullName || 'Administrator',
        reference: newBooking.bookingNumber
      };
      setIncome(prev => [inc, ...prev]);
    }

    logAudit('New Booking Created', `Booking #${newBooking.bookingNumber} confirmed for ${newBooking.customerName}`);
    setIsNewBookingOpen(false);
  };

  const handleQuickCheckInConfirm = (quickData: {
    roomNumber: string;
    customerName: string;
    customerPhone: string;
    customerCnic: string;
    advancePayment: number;
    paymentMethod: string;
    expectedCheckOutDate: string;
  }) => {
    const today = new Date().toISOString().split('T')[0];
    const bNum = `HR-W-${Date.now().toString().slice(-5)}`;
    const targetRoom = rooms.find(r => r.roomNumber === quickData.roomNumber);

    const newBooking: Booking = {
      id: `b-quick-${Date.now()}`,
      bookingNumber: bNum,
      customerId: `c-walkin-${Date.now()}`,
      customerName: quickData.customerName,
      customerPhone: quickData.customerPhone,
      customerCnic: quickData.customerCnic,
      roomId: targetRoom?.id || 'r-101',
      roomNumber: quickData.roomNumber,
      roomTypeName: targetRoom?.typeNameEn || 'Executive Suite',
      checkInDate: today,
      checkOutDate: quickData.expectedCheckOutDate,
      checkInTime: '12:00 PM',
      checkOutTime: '11:00 AM',
      guestsCount: 2,
      advancePayment: quickData.advancePayment,
      dailyRate: targetRoom?.pricePerNight || 5000,
      totalDays: 1,
      totalAmount: targetRoom?.pricePerNight || quickData.advancePayment || 5000,
      paymentMethod: (quickData.paymentMethod as any) || 'cash',
      paymentStatus: quickData.advancePayment > 0 ? 'partial' : 'unpaid',
      status: 'checked_in',
      createdAt: new Date().toISOString()
    };

    setBookings(prev => [newBooking, ...prev]);

    // Update Room status
    if (targetRoom) {
      handleUpdateRoom({
        ...targetRoom,
        status: 'booked',
        currentBookingId: newBooking.id
      });
    }

    // Add Income
    if (quickData.advancePayment > 0) {
      const inc: Income = {
        id: `inc-${Date.now()}`,
        title: `Walk-in Guest Deposit - Unit ${quickData.roomNumber}`,
        category: 'room_rent',
        categoryUrdu: 'واک اِن فوری چیک ان',
        amount: quickData.advancePayment,
        date: today,
        paymentMethod: (quickData.paymentMethod as any) || 'cash',
        receivedBy: currentUser?.fullName || 'Front Desk',
        reference: bNum
      };
      setIncome(prev => [inc, ...prev]);
    }

    logAudit('Quick Check-in', `Walk-in guest ${quickData.customerName} checked into Room ${quickData.roomNumber}`);
    setIsQuickCheckInOpen(false);
  };

  const handleCheckOutFinalConfirm = (finalInvoiceData: any) => {
    const booking = bookings.find(b => b.id === finalInvoiceData.bookingId);
    if (!booking) return;

    const foodChg = Number(finalInvoiceData.foodCharges || 0);
    const laundryChg = Number(finalInvoiceData.laundryCharges || 0);
    const extraChg = Number(finalInvoiceData.extraCharges || 0);
    const addChg = Number(finalInvoiceData.additionalCharges ?? (foodChg + laundryChg + extraChg) ?? 0);
    const disc = Number(finalInvoiceData.discount ?? finalInvoiceData.discountAmount ?? 0);
    const finalPaid = Number(finalInvoiceData.paidAmount ?? finalInvoiceData.finalPaidAmount ?? 0);
    
    const roomTotal = Number(booking.totalAmount || 0);
    const advancePaid = Number(booking.advancePayment || 0);
    const subtotal = roomTotal + addChg;
    const taxRate = Number(hotelSettings.taxRatePercent ?? hotelSettings.taxPercentage ?? 0);
    const tax = Math.round((subtotal * taxRate) / 100);
    const grandTotal = Math.max(0, subtotal + tax - disc);
    const totalPaid = Math.min(grandTotal, advancePaid + finalPaid);
    const balanceDue = Math.max(0, grandTotal - totalPaid);
    const invNumber = `INV-${Date.now().toString().slice(-6)}`;
    const now = new Date();
    const issueDate = now.toISOString().split('T')[0];
    const issueTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const additionalItems = [];
    if (foodChg > 0) additionalItems.push({ id: `chg-f-${Date.now()}`, title: 'کھانا و ریسٹورنٹ (Food)', amount: foodChg });
    if (laundryChg > 0) additionalItems.push({ id: `chg-l-${Date.now()}`, title: 'لانڈری سروس (Laundry)', amount: laundryChg });
    if (extraChg > 0) additionalItems.push({ id: `chg-e-${Date.now()}`, title: 'دیگر سروسز (Other)', amount: extraChg });
    if (additionalItems.length === 0 && addChg > 0) {
      additionalItems.push({ id: `chg-s-${Date.now()}`, title: 'اضافی سروسز (Services)', amount: addChg });
    }

    // Create Invoice
    const newInvoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: invNumber,
      bookingId: booking.id,
      customerId: booking.customerId,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone,
      customerCnic: booking.customerCnic,
      roomNumber: booking.roomNumber,
      roomType: booking.roomTypeName || 'Executive Suite',
      checkInDate: booking.checkInDate,
      checkOutDate: issueDate,
      dailyRate: booking.dailyRate || 5000,
      totalDays: booking.totalDays || 1,
      roomTotal: roomTotal,
      roomCharges: roomTotal,
      foodCharges: foodChg,
      laundryCharges: laundryChg,
      extraCharges: extraChg,
      additionalCharges: additionalItems,
      subTotal: subtotal,
      subtotal: subtotal,
      gstTaxPercent: taxRate,
      taxPercentage: taxRate,
      gstAmount: tax,
      taxAmount: tax,
      discountAmount: disc,
      discount: disc,
      advancePaid: advancePaid,
      netPayable: grandTotal,
      grandTotal: grandTotal,
      paidAmount: totalPaid,
      balanceDue: balanceDue,
      remainingAmount: balanceDue,
      paymentMethod: (finalInvoiceData.paymentMethod as any) || 'cash',
      paymentStatus: balanceDue === 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'unpaid',
      status: balanceDue === 0 ? 'paid' : totalPaid > 0 ? 'partial' : 'unpaid',
      issueDate: issueDate,
      issueTime: issueTime,
      issuedBy: currentUser?.fullName || 'Cashier',
      notes: finalInvoiceData.notes
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // Update Booking status to checked_out
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: 'checked_out', paymentStatus: 'paid' } : b));

    // Free up Room & mark as cleaning
    const room = rooms.find(r => r.roomNumber === booking.roomNumber);
    if (room) {
      handleUpdateRoom({
        ...room,
        status: 'cleaning',
        cleaningStatus: 'in_progress',
        currentBookingId: undefined
      });
    }

    // Record Final Payment Income
    if (finalPaid > 0) {
      const inc: Income = {
        id: `inc-${Date.now()}`,
        title: `Settlement Invoice #${invNumber} - Room ${booking.roomNumber}`,
        category: 'room_rent',
        categoryUrdu: 'چیک آؤٹ فائنل بلنگ',
        amount: finalPaid,
        date: issueDate,
        paymentMethod: (finalInvoiceData.paymentMethod as any) || 'cash',
        receivedBy: currentUser?.fullName || 'Cashier',
        reference: invNumber
      };
      setIncome(prev => [inc, ...prev]);
    }

    logAudit('Check-out & Invoice', `Invoice #${newInvoice.invoiceNumber} generated for ${booking.customerName}`);
    setCheckingOutBooking(null);
    setViewingInvoice(newInvoice);
  };

  // Reset Demo Records back to Hashmi Restaurant initial set
  const handleResetDemoData = () => {
    setHotelSettings(initialHotelSettings);
    setRooms(initialRooms);
    setRoomTypes(initialRoomTypes);
    setCustomers(initialCustomers);
    setBookings(initialBookings);
    setInvoices(initialInvoices);
    setIncome(initialIncome);
    setExpenses(initialExpenses);
    setUsers(initialUsers);
    setAuditLogs(initialAuditLogs);
    playSuccessSound();
    logAudit('System Reset', 'All records refreshed to initial default demo data');
  };

  // 1. First Screen: Royal Intro Animation with Sound & Logo
  if (showIntro) {
    return (
      <IntroScreen
        logoUrl={hotelSettings.logoUrl || DEFAULT_LOGO_URL}
        restaurantTitle={hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'}
        tagline={hotelSettings.taglineEn || 'Taste That Brings You Back • Premium Management System'}
        onFinish={() => {
          setShowIntro(false);
        }}
      />
    );
  }

  // 2. Auth Guard: If no logged in user, display the Royal Auth & Registration Screen
  if (!currentUser) {
    return (
      <AuthModal
        hotelSettings={hotelSettings}
        users={users}
        onLoginSuccess={handleLoginSuccess}
        onRegisterUser={handleRegisterUser}
      />
    );
  }

  const availableRoomsCount = rooms.filter(r => r.status === 'available').length;
  const activeBookingsCount = bookings.filter(b => b.status === 'checked_in' || b.status === 'reserved').length;

  return (
    <div className={`flex h-screen w-full overflow-hidden ${themeMode === 'light' ? 'bg-[#FBF9F5] text-gray-900' : 'bg-[#0A0B0E] text-[#F3F4F6]'}`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        hotelSettings={hotelSettings}
        onLogout={handleLogout}
        onOpenLogoEditor={() => setIsLogoEditorOpen(true)}
        availableRoomsCount={availableRoomsCount}
        activeBookingsCount={activeBookingsCount}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        {/* Top Navbar */}
        <Navbar
          currentUser={currentUser}
          hotelSettings={hotelSettings}
          themeMode={themeMode}
          onToggleTheme={handleToggleTheme}
          onReplayIntro={() => setShowIntro(true)}
          onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
          onOpenNewBooking={() => setIsNewBookingOpen(true)}
          onOpenPythonCode={() => setCurrentTab('python-code')}
          onOpenQuickSettings={() => setCurrentTab('settings')}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'dashboard' && (
              <Dashboard
                rooms={rooms}
                bookings={bookings}
                customers={customers}
                income={income}
                expenses={expenses}
                hotelSettings={hotelSettings}
                onNavigateTab={setCurrentTab}
                onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
                onOpenNewBooking={() => setIsNewBookingOpen(true)}
                onOpenAddExpense={() => setCurrentTab('finance')}
                onOpenLogoEditor={() => setIsLogoEditorOpen(true)}
                onToggleRoomStatus={handleToggleRoomStatus}
              />
            )}

            {currentTab === 'rooms' && (
              <RoomManager
                rooms={rooms}
                roomTypes={roomTypes}
                onAddRoom={handleAddRoom}
                onUpdateRoom={handleUpdateRoom}
                onDeleteRoom={handleDeleteRoom}
              />
            )}

            {currentTab === 'bookings' && (
              <BookingManager
                bookings={bookings}
                rooms={rooms}
                customers={customers}
                onOpenNewBooking={() => setIsNewBookingOpen(true)}
                onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
                onCheckOutBooking={(b) => setCheckingOutBooking(b)}
                onCancelBooking={(id) => {
                  setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
                  logAudit('Booking Cancelled', `Booking ID ${id} was marked as cancelled`);
                }}
                onViewInvoice={(b) => {
                  const inv = invoices.find(i => i.bookingId === b.id);
                  if (inv) setViewingInvoice(inv);
                }}
              />
            )}

            {currentTab === 'customers' && (
              <CustomerManager
                customers={customers}
                bookings={bookings}
                onAddCustomer={handleAddCustomer}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
              />
            )}

            {currentTab === 'invoices' && (
              <InvoiceManager
                invoices={invoices}
                hotelSettings={hotelSettings}
                onViewInvoice={(inv) => setViewingInvoice(inv)}
                onDeleteInvoice={(id) => {
                  setInvoices(prev => prev.filter(i => i.id !== id));
                  logAudit('Invoice Deleted', `Invoice ID ${id} deleted`);
                }}
              />
            )}

            {currentTab === 'finance' && (
              <FinanceManager
                income={income}
                expenses={expenses}
                onAddIncome={(inc) => {
                  const created: Income = { 
                    ...inc, 
                    id: `inc-${Date.now()}`,
                    title: inc.title || 'General Revenue',
                    categoryUrdu: inc.categoryUrdu || 'آمدنی'
                  };
                  setIncome(prev => [created, ...prev]);
                  logAudit('Income Recorded', `Amount Rs. ${inc.amount.toLocaleString()} logged`);
                }}
                onAddExpense={(exp) => {
                  const created: Expense = { 
                    ...exp, 
                    id: `exp-${Date.now()}`,
                    title: exp.title || 'General Expense',
                    categoryUrdu: exp.categoryUrdu || 'اخراجات'
                  };
                  setExpenses(prev => [created, ...prev]);
                  logAudit('Expense Recorded', `Amount Rs. ${exp.amount.toLocaleString()} logged`);
                }}
                onDeleteIncome={(id) => {
                  setIncome(prev => prev.filter(i => i.id !== id));
                  logAudit('Income Deleted', `Income record ID ${id} deleted`);
                }}
                onDeleteExpense={(id) => {
                  setExpenses(prev => prev.filter(e => e.id !== id));
                  logAudit('Expense Deleted', `Expense record ID ${id} deleted`);
                }}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsManager
                rooms={rooms}
                bookings={bookings}
                customers={customers}
                invoices={invoices}
                income={income}
                expenses={expenses}
                hotelSettings={hotelSettings}
              />
            )}

            {currentTab === 'python-code' && (
              <PythonExporter />
            )}

            {currentTab === 'admin' && (
              <AdminPanel
                users={users}
                auditLogs={auditLogs}
                currentUser={currentUser}
                hotelSettings={hotelSettings}
                onNavigateTab={setCurrentTab}
                onAddUser={handleRegisterUser}
                onDeleteUser={handleDeleteUser}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsManager
                hotelSettings={hotelSettings}
                themeMode={themeMode}
                onToggleTheme={handleToggleTheme}
                onUpdateSettings={(newSettings) => {
                  setHotelSettings(newSettings);
                  logAudit('Settings Updated', 'Restaurant title & preferences updated');
                }}
                onResetDemoData={handleResetDemoData}
                onOpenLogoEditor={() => setIsLogoEditorOpen(true)}
                onReplayIntro={() => setShowIntro(true)}
              />
            )}
          </div>
        </main>
      </div>

      {/* Global Modals */}
      {isLogoEditorOpen && (
        <LogoEditModal
          hotelSettings={hotelSettings}
          onSaveLogo={handleSaveLogo}
          onClose={() => setIsLogoEditorOpen(false)}
        />
      )}

      {isQuickCheckInOpen && (
        <QuickCheckInModal
          rooms={rooms}
          customers={customers}
          onClose={() => setIsQuickCheckInOpen(false)}
          onConfirmQuickCheckIn={handleQuickCheckInConfirm}
        />
      )}

      {isNewBookingOpen && (
        <NewBookingModal
          rooms={rooms}
          customers={customers}
          onClose={() => setIsNewBookingOpen(false)}
          onConfirmBooking={handleNewBookingConfirm}
        />
      )}

      {checkingOutBooking && (
        <CheckOutModal
          booking={checkingOutBooking}
          hotelSettings={hotelSettings}
          onClose={() => setCheckingOutBooking(null)}
          onConfirmCheckOut={handleCheckOutFinalConfirm}
        />
      )}

      {viewingInvoice && (
        <InvoicePrintModal
          invoice={viewingInvoice}
          hotelSettings={hotelSettings}
          onClose={() => setViewingInvoice(null)}
        />
      )}
    </div>
  );
}
