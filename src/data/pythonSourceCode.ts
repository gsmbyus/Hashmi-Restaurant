export const pythonMainCode = `"""
================================================================================
   SMART HOTEL MANAGEMENT SYSTEM (اسمارٹ ہوٹل مینجمنٹ سسٹم)
================================================================================
   Developed & Maintained By: Usama Saif (اسامہ سیف)
   Brand / Channel: GSM_BY_US
   Location: Haveli Bahadur Shah, Jhang, Punjab, Pakistan
   Contact / WhatsApp: +92 347 7669235
   YouTube: @gsm_by_us | Telegram: t.me/gsmcrackbyus
   Blog: gsmbyusamasaif.blogspot.com
================================================================================
   Requires: Python 3.10+ (Tested on Python 3.12)
   Dependencies: customtkinter, pillow
   Install: pip install customtkinter pillow
   Run: python main.py
================================================================================
"""

import os
import sys
import sqlite3
import hashlib
import datetime
import json
import csv
from tkinter import messagebox, filedialog, ttk
import tkinter as tk

try:
    import customtkinter as ctk
    from PIL import Image, ImageTk
except ImportError:
    print("Required packages missing. Please install with: pip install customtkinter pillow")
    sys.exit(1)

# Set CustomTkinter Appearance
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

DB_FILE = "hotel_management.db"

# ==============================================================================
# DATABASE MANAGER (SQLite 3)
# ==============================================================================
class DatabaseManager:
    @staticmethod
    def get_connection():
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        return conn

    @staticmethod
    def initialize_db():
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()

        # 1. Users Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                role TEXT NOT NULL DEFAULT 'receptionist',
                phone TEXT,
                email TEXT,
                active INTEGER DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 2. Customers Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS customers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cnic TEXT UNIQUE NOT NULL,
                passport TEXT,
                phone TEXT NOT NULL,
                address TEXT,
                city TEXT,
                gender TEXT DEFAULT 'male',
                notes TEXT,
                total_spent REAL DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')

        # 3. Rooms Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_number TEXT UNIQUE NOT NULL,
                floor INTEGER NOT NULL,
                type_name TEXT NOT NULL,
                price_per_night REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'available',
                cleaning_status TEXT NOT NULL DEFAULT 'clean',
                capacity INTEGER DEFAULT 2,
                amenities TEXT,
                notes TEXT
            )
        ''')

        # 4. Bookings Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                booking_no TEXT UNIQUE NOT NULL,
                customer_id INTEGER NOT NULL,
                customer_name TEXT NOT NULL,
                customer_phone TEXT,
                customer_cnic TEXT,
                room_id INTEGER NOT NULL,
                room_number TEXT NOT NULL,
                room_type TEXT,
                check_in_date TEXT NOT NULL,
                check_out_date TEXT NOT NULL,
                check_in_time TEXT,
                check_out_time TEXT,
                guests_count INTEGER DEFAULT 1,
                advance_payment REAL DEFAULT 0,
                daily_rate REAL NOT NULL,
                total_days INTEGER NOT NULL,
                total_amount REAL NOT NULL,
                status TEXT NOT NULL DEFAULT 'reserved',
                payment_status TEXT NOT NULL DEFAULT 'unpaid',
                payment_method TEXT DEFAULT 'cash',
                special_requests TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (customer_id) REFERENCES customers(id),
                FOREIGN KEY (room_id) REFERENCES rooms(id)
            )
        ''')

        # 5. Invoices Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS invoices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                invoice_no TEXT UNIQUE NOT NULL,
                booking_id INTEGER,
                customer_name TEXT NOT NULL,
                customer_phone TEXT,
                customer_cnic TEXT,
                room_number TEXT,
                room_type TEXT,
                check_in_date TEXT,
                check_out_date TEXT,
                daily_rate REAL,
                total_days INTEGER,
                room_total REAL,
                extras_total REAL DEFAULT 0,
                gst_percent REAL DEFAULT 5,
                gst_amount REAL DEFAULT 0,
                discount_amount REAL DEFAULT 0,
                advance_paid REAL DEFAULT 0,
                net_payable REAL NOT NULL,
                paid_amount REAL NOT NULL,
                balance_due REAL DEFAULT 0,
                payment_method TEXT DEFAULT 'cash',
                payment_status TEXT DEFAULT 'paid',
                issue_date TEXT,
                issued_by TEXT,
                notes TEXT
            )
        ''')

        # 6. Income Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS income (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                amount REAL NOT NULL,
                payment_method TEXT DEFAULT 'cash',
                reference TEXT,
                received_by TEXT,
                notes TEXT
            )
        ''')

        # 7. Expenses Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS expenses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                amount REAL NOT NULL,
                paid_to TEXT,
                payment_method TEXT DEFAULT 'cash',
                approved_by TEXT,
                receipt_no TEXT,
                notes TEXT
            )
        ''')

        # 8. Settings Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            )
        ''')

        # 9. Audit Logs Table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS audit_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                user_name TEXT,
                action TEXT,
                module TEXT,
                details TEXT
            )
        ''')

        # Check if Admin user exists, if not create default admin
        cursor.execute("SELECT id FROM users WHERE username = 'admin'")
        if not cursor.fetchone():
            default_pwd_hash = hashlib.sha256("admin123".encode('utf-8')).hexdigest()
            cursor.execute('''
                INSERT INTO users (username, password_hash, full_name, role, phone, email, active)
                VALUES (?, ?, ?, ?, ?, ?, 1)
            ''', ('admin', default_pwd_hash, 'اسامہ سیف (ایڈمنسٹریٹر)', 'admin', '+923477669235', 'gsmbyus@gmail.com'))

            # Also add default staff
            staff_pwd = hashlib.sha256("123456".encode('utf-8')).hexdigest()
            cursor.execute('''
                INSERT INTO users (username, password_hash, full_name, role, phone, email, active)
                VALUES (?, ?, ?, ?, ?, ?, 1)
            ''', ('staff', staff_pwd, 'محمد علی (ریسپشن)', 'receptionist', '03001234567', 'staff@hotel.com'))

        # Check if Rooms exist, if not seed default rooms
        cursor.execute("SELECT COUNT(*) as cnt FROM rooms")
        if cursor.fetchone()['cnt'] == 0:
            sample_rooms = [
                ('101', 1, 'سنگل بیڈ روم (Single Room)', 3500, 'available', 'clean', 1, 'AC, WiFi, LED TV'),
                ('102', 1, 'سنگل بیڈ روم (Single Room)', 3500, 'available', 'clean', 1, 'AC, WiFi, LED TV'),
                ('103', 1, 'ڈبل بیڈ ڈیلوکس (Double Deluxe)', 6000, 'booked', 'clean', 2, 'King Bed, AC, Smart TV, Fridge'),
                ('104', 1, 'ڈبل بیڈ ڈیلوکس (Double Deluxe)', 6000, 'available', 'clean', 2, 'King Bed, AC, Smart TV, Fridge'),
                ('201', 2, 'ایگزیکٹو سوٹ (Executive Suite)', 10500, 'available', 'clean', 3, 'Living Area, Jacuzzi, Mini Bar'),
                ('202', 2, 'ایگزیکٹو سوٹ (Executive Suite)', 10500, 'available', 'clean', 3, 'Living Area, Jacuzzi, Mini Bar'),
                ('203', 2, 'فیملی سوٹ (Family Luxury Suite)', 14000, 'cleaning', 'in_progress', 5, '2 Bedrooms, Sofa, Kitchen'),
                ('204', 2, 'فیملی سوٹ (Family Luxury Suite)', 14000, 'available', 'clean', 5, '2 Bedrooms, Sofa, Kitchen'),
                ('301', 3, 'پریذیڈنشل وی آئی پی سوٹ (VIP Suite)', 22000, 'available', 'clean', 4, 'VIP Lounge, Panoramic View, Butler'),
                ('302', 3, 'ڈبل بیڈ ڈیلوکس (Double Deluxe)', 6000, 'maintenance', 'dirty', 2, 'Maintenance Work in progress'),
            ]
            cursor.executemany('''
                INSERT INTO rooms (room_number, floor, type_name, price_per_night, status, cleaning_status, capacity, amenities)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', sample_rooms)

        # Seed sample customer
        cursor.execute("SELECT COUNT(*) as cnt FROM customers")
        if cursor.fetchone()['cnt'] == 0:
            cursor.execute('''
                INSERT INTO customers (name, cnic, phone, address, city, notes, total_spent)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', ('چوہدری عمران اشرف', '33202-1456789-1', '0300-9876543', 'ماڈل ٹاؤن، لاہور', 'لاہور', 'VIP Guest', 42000))
            cursor.execute('''
                INSERT INTO customers (name, cnic, phone, address, city, notes, total_spent)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', ('حاجی بشیر احمد سیال', '33201-9988776-5', '0347-7669235', 'جھنگ صدر', 'جھنگ', 'Business Partner', 55000))

        # Default settings
        default_settings = [
            ('hotel_name', 'اسمارٹ ہوٹل اینڈ رزارٹ (Smart Hotel)'),
            ('hotel_address', 'حویلی بہادر شاہ، جھنگ، پنجاب، پاکستان'),
            ('hotel_phone', '+92 347 7669235'),
            ('hotel_whatsapp', '+92 347 7669235'),
            ('hotel_email', 'gsmbyus.tools@gmail.com'),
            ('currency', 'روپے (PKR)'),
            ('tax_rate', '5'),
            ('developer_name', 'Usama Saif (اسامہ سیف) - GSM_BY_US'),
        ]
        for k, v in default_settings:
            cursor.execute("INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)", (k, v))

        conn.commit()
        conn.close()

    @staticmethod
    def log_action(user_name, action, module, details):
        try:
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO audit_logs (user_name, action, module, details)
                VALUES (?, ?, ?, ?)
            ''', (user_name, action, module, details))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"Error logging audit: {e}")


# ==============================================================================
# AUTHENTICATION & LOGIN WINDOW
# ==============================================================================
class LoginWindow(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("اسمارٹ ہوٹل مینجمنٹ سسٹم - لاگ ان | GSM_BY_US")
        self.geometry("540x650")
        self.resizable(False, False)

        # Center Window
        self.update_idletasks()
        width = self.winfo_width()
        height = self.winfo_height()
        x = (self.winfo_screenwidth() // 2) - (width // 2)
        y = (self.winfo_screenheight() // 2) - (height // 2)
        self.geometry(f'{width}x{height}+{x}+{y}')

        DatabaseManager.initialize_db()
        self.create_widgets()

    def create_widgets(self):
        # Background Container
        main_frame = ctk.CTkFrame(self, corner_radius=16, fg_color=("#1e293b", "#0f172a"))
        main_frame.pack(fill="both", expand=True, padx=20, pady=20)

        # Header Badge & Branding
        brand_badge = ctk.CTkLabel(
            main_frame,
            text="⚡ GSM_BY_US PIXEL LIFETIME PRO TOOL ⚡",
            font=ctk.CTkFont(size=12, weight="bold"),
            text_color="#38bdf8",
            fg_color="#1e293b",
            corner_radius=8
        )
        brand_badge.pack(pady=(15, 5))

        title_label = ctk.CTkLabel(
            main_frame,
            text="اسمارٹ ہوٹل مینجمنٹ سسٹم",
            font=ctk.CTkFont(size=24, weight="bold"),
            text_color="#f8fafc"
        )
        title_label.pack(pady=(5, 2))

        sub_label = ctk.CTkLabel(
            main_frame,
            text="Smart Hotel Management System (اردو انٹرفیس)",
            font=ctk.CTkFont(size=13),
            text_color="#94a3b8"
        )
        sub_label.pack(pady=(0, 20))

        # Inputs Card
        card = ctk.CTkFrame(main_frame, corner_radius=12, fg_color=("#334155", "#1e293b"))
        card.pack(fill="x", padx=30, pady=10)

        # Username
        ctk.CTkLabel(card, text="یوزر نیم (Username):", font=ctk.CTkFont(size=14, weight="bold"), anchor="w").pack(fill="x", padx=20, pady=(15, 2))
        self.username_entry = ctk.CTkEntry(card, placeholder_text="admin درج کریں", height=40, font=ctk.CTkFont(size=14))
        self.username_entry.pack(fill="x", padx=20, pady=(0, 15))
        self.username_entry.insert(0, "admin")

        # Password
        ctk.CTkLabel(card, text="پاس ورڈ (Password):", font=ctk.CTkFont(size=14, weight="bold"), anchor="w").pack(fill="x", padx=20, pady=(0, 2))
        self.password_entry = ctk.CTkEntry(card, placeholder_text="admin123 درج کریں", show="*", height=40, font=ctk.CTkFont(size=14))
        self.password_entry.pack(fill="x", padx=20, pady=(0, 15))
        self.password_entry.insert(0, "admin123")

        # Remember Me & Role Indicator
        self.remember_var = ctk.BooleanVar(value=True)
        remember_check = ctk.CTkCheckBox(card, text="مجھے یاد رکھیں (Remember Me)", variable=self.remember_var, font=ctk.CTkFont(size=12))
        remember_check.pack(anchor="w", padx=20, pady=(0, 15))

        # Login Button
        self.login_btn = ctk.CTkButton(
            card,
            text="سسٹم میں لاگ اِن کریں (Login)",
            font=ctk.CTkFont(size=16, weight="bold"),
            fg_color="#059669",
            hover_color="#047857",
            height=44,
            command=self.handle_login
        )
        self.login_btn.pack(fill="x", padx=20, pady=(0, 20))

        # Default Credentials Tip
        tip_box = ctk.CTkFrame(main_frame, fg_color="#1e293b", corner_radius=8)
        tip_box.pack(fill="x", padx=30, pady=(10, 15))
        ctk.CTkLabel(
            tip_box,
            text="🔑 ڈیفالٹ لاگ اِن: یوزر: admin | پاس ورڈ: admin123",
            font=ctk.CTkFont(size=12),
            text_color="#38bdf8"
        ).pack(pady=8)

        # Developer & Contact Footer
        footer_frame = ctk.CTkFrame(main_frame, fg_color="transparent")
        footer_frame.pack(side="bottom", fill="x", pady=10)

        dev_label = ctk.CTkLabel(
            footer_frame,
            text="ڈویلپر: اسامہ سیف (Usama Saif) | GSM_BY_US\\nحویلی بہادر شاہ، جھنگ، پنجاب | 📞 +92 347 7669235",
            font=ctk.CTkFont(size=11),
            text_color="#94a3b8",
            justify="center"
        )
        dev_label.pack()

    def handle_login(self):
        username = self.username_entry.get().strip()
        password = self.password_entry.get().strip()

        if not username or not password:
            messagebox.showwarning("توجہ فرمائیں", "برائے مہربانی یوزر نیم اور پاس ورڈ دونوں درج کریں!")
            return

        password_hash = hashlib.sha256(password.encode('utf-8')).hexdigest()

        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE username = ? AND password_hash = ? AND active = 1", (username, password_hash))
        user = cursor.fetchone()
        conn.close()

        if user:
            DatabaseManager.log_action(user['full_name'], "لاگ ان کامیاب", "Auth", f"{user['username']} نے لاگ ان کیا")
            self.destroy()
            app = HotelMainWindow(user)
            app.mainloop()
        else:
            messagebox.showerror("خرابی", "غلط یوزر نیم یا پاس ورڈ! برائے مہربانی دوبارہ کوشش کریں۔")


# ==============================================================================
# MAIN HOTEL APPLICATION DASHBOARD & WINDOW
# ==============================================================================
class HotelMainWindow(ctk.CTk):
    def __init__(self, current_user):
        super().__init__()
        self.current_user = current_user
        self.title(f"Smart Hotel Management System (اسمارٹ ہوٹل مینجمنٹ سسٹم) - {self.current_user['full_name']}")
        self.geometry("1280x820")
        self.minsize(1050, 700)

        # Layout Configuration
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(1, weight=1)

        self.create_sidebar()
        self.create_main_content()
        self.show_view("dashboard")

    def create_sidebar(self):
        self.sidebar_frame = ctk.CTkFrame(self, width=260, corner_radius=0, fg_color=("#0f172a", "#090d16"))
        self.sidebar_frame.grid(row=0, column=0, sticky="nsew")
        self.sidebar_frame.grid_rowconfigure(9, weight=1)

        # Brand Title
        brand_label = ctk.CTkLabel(
            self.sidebar_frame,
            text="🏨 اسمارٹ ہوٹل",
            font=ctk.CTkFont(size=22, weight="bold"),
            text_color="#10b981"
        )
        brand_label.grid(row=0, column=0, padx=20, pady=(20, 2), sticky="ew")

        sub_brand = ctk.CTkLabel(
            self.sidebar_frame,
            text="GSM_BY_US Pro Edition",
            font=ctk.CTkFont(size=12),
            text_color="#94a3b8"
        )
        sub_brand.grid(row=1, column=0, padx=20, pady=(0, 20), sticky="ew")

        # Navigation Buttons
        nav_items = [
            ("📊 ڈیش بورڈ (Dashboard)", "dashboard", 2),
            ("🏨 کمرے (Room Management)", "rooms", 3),
            ("📅 بکنگ سسٹم (Bookings)", "bookings", 4),
            ("👥 کسٹمرز (Customers)", "customers", 5),
            ("🧾 انوائس اور بلنگ (Invoices)", "invoices", 6),
            ("💰 آمدنی و اخراجات (Finance)", "finance", 7),
            ("📈 رپورٹس (Reports & Export)", "reports", 8),
        ]

        self.nav_buttons = {}
        for text, view_name, row in nav_items:
            btn = ctk.CTkButton(
                self.sidebar_frame,
                text=text,
                font=ctk.CTkFont(size=14, weight="bold"),
                anchor="w",
                height=42,
                corner_radius=8,
                fg_color="transparent",
                text_color="#e2e8f0",
                hover_color="#1e293b",
                command=lambda v=view_name: self.show_view(v)
            )
            btn.grid(row=row, column=0, padx=15, pady=4, sticky="ew")
            self.nav_buttons[view_name] = btn

        # Admin Panel Button (if admin)
        if self.current_user['role'] == 'admin':
            btn_admin = ctk.CTkButton(
                self.sidebar_frame,
                text="⚙️ ایڈمن پینل (Admin Panel)",
                font=ctk.CTkFont(size=14, weight="bold"),
                anchor="w",
                height=42,
                corner_radius=8,
                fg_color="#312e81",
                hover_color="#3730a3",
                command=lambda: self.show_view("admin")
            )
            btn_admin.grid(row=9, column=0, padx=15, pady=4, sticky="new")
            self.nav_buttons["admin"] = btn_admin

        # User Info & Logout at bottom
        user_card = ctk.CTkFrame(self.sidebar_frame, fg_color="#1e293b", corner_radius=10)
        user_card.grid(row=10, column=0, padx=15, pady=15, sticky="sew")

        ctk.CTkLabel(user_card, text=f"👤 {self.current_user['full_name']}", font=ctk.CTkFont(size=12, weight="bold"), text_color="#38bdf8").pack(pady=(8, 2), padx=10, anchor="w")
        ctk.CTkLabel(user_card, text=f"رول: {self.current_user['role'].upper()}", font=ctk.CTkFont(size=11), text_color="#94a3b8").pack(pady=(0, 8), padx=10, anchor="w")

        logout_btn = ctk.CTkButton(
            user_card,
            text="🚪 لاگ آؤٹ (Logout)",
            fg_color="#dc2626",
            hover_color="#b91c1c",
            height=30,
            command=self.logout
        )
        logout_btn.pack(fill="x", padx=10, pady=(0, 8))

    def create_main_content(self):
        self.content_container = ctk.CTkFrame(self, corner_radius=0, fg_color=("#0f172a", "#0f172a"))
        self.content_container.grid(row=0, column=1, sticky="nsew", padx=15, pady=15)
        self.content_container.grid_rowconfigure(0, weight=1)
        self.content_container.grid_columnconfigure(0, weight=1)

    def show_view(self, view_name):
        for name, btn in self.nav_buttons.items():
            if name == view_name:
                btn.configure(fg_color="#059669", text_color="#ffffff")
            else:
                btn.configure(fg_color="#312e81" if name == "admin" else "transparent", text_color="#e2e8f0")

        for widget in self.content_container.winfo_children():
            widget.destroy()

        if view_name == "dashboard":
            self.render_dashboard_view()
        elif view_name == "rooms":
            self.render_rooms_view()
        elif view_name == "bookings":
            self.render_bookings_view()
        elif view_name == "customers":
            self.render_customers_view()
        elif view_name == "invoices":
            self.render_invoices_view()
        elif view_name == "finance":
            self.render_finance_view()
        elif view_name == "reports":
            self.render_reports_view()
        elif view_name == "admin":
            self.render_admin_view()

    # --------------------------------------------------------------------------
    # 1. DASHBOARD VIEW
    # --------------------------------------------------------------------------
    def render_dashboard_view(self):
        dash_frame = ctk.CTkScrollableFrame(self.content_container, fg_color="transparent")
        dash_frame.pack(fill="both", expand=True)

        header = ctk.CTkFrame(dash_frame, fg_color="transparent")
        header.pack(fill="x", pady=(0, 20))
        ctk.CTkLabel(header, text="📊 ڈیش بورڈ اور اہم شماریات", font=ctk.CTkFont(size=24, weight="bold")).pack(side="left")
        ctk.CTkLabel(header, text=f"آج کی تاریخ: {datetime.date.today().strftime('%d-%m-%Y')}", font=ctk.CTkFont(size=14), text_color="#38bdf8").pack(side="right")

        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT COUNT(*) as total FROM rooms")
        total_rooms = cursor.fetchone()['total']

        cursor.execute("SELECT COUNT(*) as avail FROM rooms WHERE status = 'available'")
        avail_rooms = cursor.fetchone()['avail']

        cursor.execute("SELECT COUNT(*) as booked FROM rooms WHERE status = 'booked'")
        booked_rooms = cursor.fetchone()['booked']

        cursor.execute("SELECT COUNT(*) as clean FROM rooms WHERE status = 'cleaning'")
        cleaning_rooms = cursor.fetchone()['clean']

        cursor.execute("SELECT COUNT(*) as custs FROM customers")
        total_customers = cursor.fetchone()['custs']

        today_str = datetime.date.today().strftime('%Y-%m-%d')
        cursor.execute("SELECT SUM(amount) as inc FROM income WHERE date = ?", (today_str,))
        today_inc = cursor.fetchone()['inc'] or 0

        cursor.execute("SELECT SUM(amount) as exp FROM expenses WHERE date = ?", (today_str,))
        today_exp = cursor.fetchone()['exp'] or 0

        cursor.execute("SELECT SUM(amount) as total_inc FROM income")
        all_inc = cursor.fetchone()['total_inc'] or 0

        cursor.execute("SELECT SUM(amount) as total_exp FROM expenses")
        all_exp = cursor.fetchone()['total_exp'] or 0
        total_profit = all_inc - all_exp

        conn.close()

        kpi_frame = ctk.CTkFrame(dash_frame, fg_color="transparent")
        kpi_frame.pack(fill="x", pady=(0, 20))
        kpi_frame.grid_columnconfigure((0, 1, 2, 3), weight=1)

        cards = [
            ("خالی کمرے (Available)", str(avail_rooms), "#10b981", 0, 0),
            ("بک شدہ کمرے (Booked)", str(booked_rooms), "#ef4444", 0, 1),
            ("صفائی جاری (Cleaning)", str(cleaning_rooms), "#f59e0b", 0, 2),
            ("کل کسٹمرز (Customers)", str(total_customers), "#8b5cf6", 0, 3),
            ("آج کی آمدنی (Today Income)", f"Rs. {today_inc:,.0f}", "#06b6d4", 1, 0),
            ("آج کے اخراجات (Today Expense)", f"Rs. {today_exp:,.0f}", "#f43f5e", 1, 1),
            ("کل خالص منافع (Net Profit)", f"Rs. {total_profit:,.0f}", "#10b981", 1, 2),
            ("کل کمرے (Total Rooms)", str(total_rooms), "#64748b", 1, 3),
        ]

        for title, value, color, r, c in cards:
            card = ctk.CTkFrame(kpi_frame, fg_color="#1e293b", corner_radius=12)
            card.grid(row=r, column=c, padx=8, pady=8, sticky="nsew")
            ctk.CTkLabel(card, text=title, font=ctk.CTkFont(size=12), text_color="#94a3b8").pack(anchor="w", padx=15, pady=(12, 4))
            ctk.CTkLabel(card, text=value, font=ctk.CTkFont(size=20, weight="bold"), text_color=color).pack(anchor="w", padx=15, pady=(0, 12))

        actions_frame = ctk.CTkFrame(dash_frame, fg_color="#1e293b", corner_radius=12)
        actions_frame.pack(fill="x", pady=(0, 20), padx=8)

        ctk.CTkLabel(actions_frame, text="⚡ فوری کارروائیاں (Quick Actions)", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", padx=15, pady=(12, 10))
        btn_box = ctk.CTkFrame(actions_frame, fg_color="transparent")
        btn_box.pack(fill="x", padx=15, pady=(0, 15))

        ctk.CTkButton(btn_box, text="+ نئی بکنگ کریں (New Booking)", fg_color="#059669", hover_color="#047857", height=38, command=lambda: self.show_view("bookings")).pack(side="left", padx=(0, 10))
        ctk.CTkButton(btn_box, text="+ نیا کسٹمر شامل کریں (Add Customer)", fg_color="#2563eb", hover_color="#1d4ed8", height=38, command=lambda: self.show_view("customers")).pack(side="left", padx=(0, 10))
        ctk.CTkButton(btn_box, text="+ نیا خرچہ درج کریں (Add Expense)", fg_color="#dc2626", hover_color="#b91c1c", height=38, command=lambda: self.show_view("finance")).pack(side="left", padx=(0, 10))

        dev_card = ctk.CTkFrame(dash_frame, fg_color="#0f172a", border_width=1, border_color="#334155", corner_radius=12)
        dev_card.pack(fill="x", padx=8, pady=10)
        ctk.CTkLabel(dev_card, text="🌟 سافٹ ویئر ڈویلپر معلومات | GSM_BY_US", font=ctk.CTkFont(size=14, weight="bold"), text_color="#38bdf8").pack(anchor="w", padx=15, pady=(10, 4))
        ctk.CTkLabel(dev_card, text="ڈویلپر: اسامہ سیف (Usama Saif) | پتہ: حویلی بہادر شاہ، جھنگ، پنجاب، پاکستان | واٹس ایپ: +92 347 7669235\\nیوٹیوب: @gsm_by_us | ٹیلیگرام: t.me/gsmcrackbyus | بلاگ: gsmbyusamasaif.blogspot.com", font=ctk.CTkFont(size=12), text_color="#cbd5e1", justify="left").pack(anchor="w", padx=15, pady=(0, 10))

    # --------------------------------------------------------------------------
    # 2. ROOM MANAGEMENT VIEW
    # --------------------------------------------------------------------------
    def render_rooms_view(self):
        frame = ctk.CTkFrame(self.content_container, fg_color="transparent")
        frame.pack(fill="both", expand=True)

        top_bar = ctk.CTkFrame(frame, fg_color="transparent")
        top_bar.pack(fill="x", pady=(0, 15))
        ctk.CTkLabel(top_bar, text="🏨 کمروں کی فہرست اور انتظام (Room Management)", font=ctk.CTkFont(size=22, weight="bold")).pack(side="left")
        ctk.CTkButton(top_bar, text="+ نیا کمرہ شامل کریں (Add Room)", fg_color="#059669", height=36, command=self.open_add_room_modal).pack(side="right")

        tree_frame = ctk.CTkFrame(frame, fg_color="#1e293b", corner_radius=10)
        tree_frame.pack(fill="both", expand=True, pady=5)

        columns = ("id", "room_no", "floor", "type", "price", "status", "cleaning", "capacity")
        self.rooms_tree = ttk.Treeview(tree_frame, columns=columns, show="headings", height=15)

        self.rooms_tree.heading("id", text="ID")
        self.rooms_tree.heading("room_no", text="کمرہ نمبر")
        self.rooms_tree.heading("floor", text="منزل (Floor)")
        self.rooms_tree.heading("type", text="کمرے کی قسم (Type)")
        self.rooms_tree.heading("price", text="یومیہ کرایہ (Price/Night)")
        self.rooms_tree.heading("status", text="بکنگ اسٹیٹس")
        self.rooms_tree.heading("cleaning", text="صفائی اسٹیٹس")
        self.rooms_tree.heading("capacity", text="گنجائش (افراد)")

        self.rooms_tree.column("id", width=40, anchor="center")
        self.rooms_tree.column("room_no", width=80, anchor="center")
        self.rooms_tree.column("floor", width=80, anchor="center")
        self.rooms_tree.column("type", width=220, anchor="w")
        self.rooms_tree.column("price", width=120, anchor="center")
        self.rooms_tree.column("status", width=120, anchor="center")
        self.rooms_tree.column("cleaning", width=120, anchor="center")
        self.rooms_tree.column("capacity", width=90, anchor="center")

        self.rooms_tree.pack(fill="both", expand=True, padx=10, pady=10)
        self.refresh_rooms_table()

        btn_bar = ctk.CTkFrame(frame, fg_color="transparent")
        btn_bar.pack(fill="x", pady=10)
        ctk.CTkButton(btn_bar, text="🧹 صفائی مکمل مارک کریں (Mark Clean)", fg_color="#0284c7", command=self.mark_room_clean).pack(side="left", padx=(0, 10))
        ctk.CTkButton(btn_bar, text="🗑️ منتخب کمرہ ڈیلیٹ کریں (Delete Room)", fg_color="#dc2626", command=self.delete_selected_room).pack(side="left")

    def refresh_rooms_table(self):
        for item in self.rooms_tree.get_children():
            self.rooms_tree.delete(item)
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM rooms ORDER BY floor ASC, room_number ASC")
        for row in cursor.fetchall():
            self.rooms_tree.insert("", "end", values=(
                row['id'], row['room_number'], f"Floor {row['floor']}", row['type_name'],
                f"Rs. {row['price_per_night']:,.0f}", row['status'].upper(), row['cleaning_status'].upper(), row['capacity']
            ))
        conn.close()

    def mark_room_clean(self):
        sel = self.rooms_tree.selection()
        if not sel:
            messagebox.showwarning("توجہ", "برائے مہربانی لسٹ سے کمرہ منتخب کریں!")
            return
        item = self.rooms_tree.item(sel[0])
        room_id = item['values'][0]
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE rooms SET cleaning_status = 'clean', status = CASE WHEN status='cleaning' THEN 'available' ELSE status END WHERE id = ?", (room_id,))
        conn.commit()
        conn.close()
        self.refresh_rooms_table()
        messagebox.showinfo("کامیابی", "کمرے کی صفائی مکمل مارک کر دی گئی ہے!")

    def delete_selected_room(self):
        sel = self.rooms_tree.selection()
        if not sel:
            messagebox.showwarning("توجہ", "برائے مہربانی کمرہ منتخب کریں!")
            return
        if messagebox.askyesno("تصدیق", "کیا آپ واقعی یہ کمرہ ڈیلیٹ کرنا چاہتے ہیں؟"):
            item = self.rooms_tree.item(sel[0])
            room_id = item['values'][0]
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM rooms WHERE id = ?", (room_id,))
            conn.commit()
            conn.close()
            self.refresh_rooms_table()
            messagebox.showinfo("کامیابی", "کمرہ ڈیلیٹ کر دیا گیا!")

    def open_add_room_modal(self):
        modal = ctk.CTkToplevel(self)
        modal.title("نیا کمرہ شامل کریں")
        modal.geometry("450x520")
        modal.grab_set()

        ctk.CTkLabel(modal, text="نیا کمرہ درج کریں", font=ctk.CTkFont(size=18, weight="bold")).pack(pady=15)

        r_no = ctk.CTkEntry(modal, placeholder_text="کمرہ نمبر (مثال: 105)")
        r_no.pack(fill="x", padx=30, pady=8)

        floor_entry = ctk.CTkEntry(modal, placeholder_text="منزل نمبر (مثال: 1 یا 2)")
        floor_entry.pack(fill="x", padx=30, pady=8)

        type_combo = ctk.CTkComboBox(modal, values=[
            "سنگل بیڈ روم (Single Room)",
            "ڈبل بیڈ ڈیلوکس (Double Deluxe)",
            "ایگزیکٹو سوٹ (Executive Suite)",
            "فیملی لگژری سوٹ (Family Suite)",
            "پریذیڈنشل وی آئی پی سوٹ (VIP Suite)"
        ])
        type_combo.pack(fill="x", padx=30, pady=8)

        price_entry = ctk.CTkEntry(modal, placeholder_text="یومیہ کرایہ روپے میں (مثال: 5000)")
        price_entry.pack(fill="x", padx=30, pady=8)

        cap_entry = ctk.CTkEntry(modal, placeholder_text="گنجائش افراد (مثال: 2)")
        cap_entry.pack(fill="x", padx=30, pady=8)

        def save_room():
            rn = r_no.get().strip()
            fl = floor_entry.get().strip()
            tp = type_combo.get()
            pr = price_entry.get().strip()
            cp = cap_entry.get().strip()
            if not rn or not fl or not pr:
                messagebox.showerror("خرابی", "تمام لازمی خانے پر کریں!")
                return
            try:
                conn = DatabaseManager.get_connection()
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO rooms (room_number, floor, type_name, price_per_night, capacity, status, cleaning_status)
                    VALUES (?, ?, ?, ?, ?, 'available', 'clean')
                ''', (rn, int(fl), tp, float(pr), int(cp or 2)))
                conn.commit()
                conn.close()
                modal.destroy()
                self.refresh_rooms_table()
                messagebox.showinfo("کامیابی", "نیا کمرہ کامیابی سے شامل ہو گیا!")
            except Exception as e:
                messagebox.showerror("خرابی", f"کمرہ محفوظ نہیں ہو سکا: {e}")

        ctk.CTkButton(modal, text="محفوظ کریں (Save Room)", fg_color="#059669", height=40, command=save_room).pack(fill="x", padx=30, pady=20)

    # --------------------------------------------------------------------------
    # 3. BOOKINGS VIEW
    # --------------------------------------------------------------------------
    def render_bookings_view(self):
        frame = ctk.CTkFrame(self.content_container, fg_color="transparent")
        frame.pack(fill="both", expand=True)

        top_bar = ctk.CTkFrame(frame, fg_color="transparent")
        top_bar.pack(fill="x", pady=(0, 15))
        ctk.CTkLabel(top_bar, text="📅 بکنگ اور ریزرویشن سسٹم", font=ctk.CTkFont(size=22, weight="bold")).pack(side="left")
        ctk.CTkButton(top_bar, text="+ نئی بکنگ درج کریں (New Booking)", fg_color="#059669", height=36, command=self.open_new_booking_modal).pack(side="right")

        tree_frame = ctk.CTkFrame(frame, fg_color="#1e293b", corner_radius=10)
        tree_frame.pack(fill="both", expand=True, pady=5)

        columns = ("id", "b_no", "cust_name", "phone", "room", "checkin", "checkout", "advance", "total", "status")
        self.bookings_tree = ttk.Treeview(tree_frame, columns=columns, show="headings", height=15)

        self.bookings_tree.heading("id", text="ID")
        self.bookings_tree.heading("b_no", text="بکنگ نمبر")
        self.bookings_tree.heading("cust_name", text="کسٹمر کا نام")
        self.bookings_tree.heading("phone", text="موبائل نمبر")
        self.bookings_tree.heading("room", text="کمرہ نمبر")
        self.bookings_tree.heading("checkin", text="چیک اِن تاریخ")
        self.bookings_tree.heading("checkout", text="چیک آؤٹ تاریخ")
        self.bookings_tree.heading("advance", text="ایڈوانس ادا")
        self.bookings_tree.heading("total", text="کل رقم")
        self.bookings_tree.heading("status", text="اسٹیٹس")

        self.bookings_tree.column("id", width=40, anchor="center")
        self.bookings_tree.column("b_no", width=100, anchor="center")
        self.bookings_tree.column("cust_name", width=160, anchor="w")
        self.bookings_tree.column("phone", width=110, anchor="center")
        self.bookings_tree.column("room", width=70, anchor="center")
        self.bookings_tree.column("checkin", width=100, anchor="center")
        self.bookings_tree.column("checkout", width=100, anchor="center")
        self.bookings_tree.column("advance", width=90, anchor="center")
        self.bookings_tree.column("total", width=90, anchor="center")
        self.bookings_tree.column("status", width=90, anchor="center")

        self.bookings_tree.pack(fill="both", expand=True, padx=10, pady=10)
        self.refresh_bookings_table()

        btn_bar = ctk.CTkFrame(frame, fg_color="transparent")
        btn_bar.pack(fill="x", pady=10)
        ctk.CTkButton(btn_bar, text="🔑 چیک اِن کریں (Check-In)", fg_color="#2563eb", command=self.handle_check_in).pack(side="left", padx=(0, 10))
        ctk.CTkButton(btn_bar, text="🧾 چیک آؤٹ اور بلنگ (Check-Out & Bill)", fg_color="#059669", command=self.handle_check_out).pack(side="left", padx=(0, 10))
        ctk.CTkButton(btn_bar, text="❌ بکنگ کینسل کریں (Cancel)", fg_color="#dc2626", command=self.handle_cancel_booking).pack(side="left")

    def refresh_bookings_table(self):
        for item in self.bookings_tree.get_children():
            self.bookings_tree.delete(item)
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bookings ORDER BY id DESC")
        for row in cursor.fetchall():
            self.bookings_tree.insert("", "end", values=(
                row['id'], row['booking_no'], row['customer_name'], row['customer_phone'],
                row['room_number'], row['check_in_date'], row['check_out_date'],
                f"Rs. {row['advance_payment']:,.0f}", f"Rs. {row['total_amount']:,.0f}", row['status'].upper()
            ))
        conn.close()

    def handle_check_in(self):
        sel = self.bookings_tree.selection()
        if not sel:
            messagebox.showwarning("توجہ", "برائے مہربانی بکنگ منتخب کریں!")
            return
        item = self.bookings_tree.item(sel[0])
        b_id = item['values'][0]
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE bookings SET status = 'checked_in' WHERE id = ?", (b_id,))
        cursor.execute("SELECT room_id FROM bookings WHERE id = ?", (b_id,))
        r_id = cursor.fetchone()['room_id']
        cursor.execute("UPDATE rooms SET status = 'booked' WHERE id = ?", (r_id,))
        conn.commit()
        conn.close()
        self.refresh_bookings_table()
        messagebox.showinfo("کامیابی", "مہمان کا چیک اِن کامیابی سے مکمل ہو گیا!")

    def handle_check_out(self):
        sel = self.bookings_tree.selection()
        if not sel:
            messagebox.showwarning("توجہ", "برائے مہربانی بکنگ منتخب کریں!")
            return
        item = self.bookings_tree.item(sel[0])
        b_id = item['values'][0]
        
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM bookings WHERE id = ?", (b_id,))
        b = cursor.fetchone()

        if not b:
            conn.close()
            return

        inv_no = f"INV-{datetime.date.today().strftime('%Y')}-{b['id']:04d}"
        net = b['total_amount']
        paid = net
        
        cursor.execute('''
            INSERT INTO invoices (invoice_no, booking_id, customer_name, customer_phone, customer_cnic,
                                  room_number, room_type, check_in_date, check_out_date, daily_rate,
                                  total_days, room_total, net_payable, paid_amount, balance_due,
                                  payment_method, payment_status, issue_date, issued_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'cash', 'paid', ?, ?)
        ''', (inv_no, b['id'], b['customer_name'], b['customer_phone'], b['customer_cnic'],
              b['room_number'], b['room_type'], b['check_in_date'], b['check_out_date'],
              b['daily_rate'], b['total_days'], b['total_amount'], net, paid,
              datetime.date.today().strftime('%Y-%m-%d'), self.current_user['full_name']))

        cursor.execute("UPDATE bookings SET status = 'checked_out', payment_status = 'paid' WHERE id = ?", (b_id,))
        cursor.execute("UPDATE rooms SET status = 'cleaning', cleaning_status = 'in_progress' WHERE id = ?", (b['room_id'],))

        cursor.execute('''
            INSERT INTO income (date, title, category, amount, payment_method, received_by)
            VALUES (?, ?, 'room_rent', ?, 'cash', ?)
        ''', (datetime.date.today().strftime('%Y-%m-%d'), f"بل ادائیگی - بکنگ {b['booking_no']}", net - b['advance_payment'], self.current_user['full_name']))

        conn.commit()
        conn.close()

        self.refresh_bookings_table()
        messagebox.showinfo("چیک آؤٹ مکمل", f"چیک آؤٹ مکمل ہو گیا۔ انوائس نمبر {inv_no} کامیابی سے تیار کر دی گئی ہے!")

    def handle_cancel_booking(self):
        sel = self.bookings_tree.selection()
        if not sel:
            messagebox.showwarning("توجہ", "برائے مہربانی بکنگ منتخب کریں!")
            return
        if messagebox.askyesno("تصدیق", "کیا آپ واقعی یہ بکنگ کینسل کرنا چاہتے ہیں؟"):
            item = self.bookings_tree.item(sel[0])
            b_id = item['values'][0]
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT room_id FROM bookings WHERE id = ?", (b_id,))
            r = cursor.fetchone()
            if r:
                cursor.execute("UPDATE rooms SET status = 'available' WHERE id = ?", (r['room_id'],))
            cursor.execute("UPDATE bookings SET status = 'cancelled' WHERE id = ?", (b_id,))
            conn.commit()
            conn.close()
            self.refresh_bookings_table()
            messagebox.showinfo("کینسل", "بکنگ کینسل کر دی گئی اور کمرہ خالی کر دیا گیا!")

    def open_new_booking_modal(self):
        modal = ctk.CTkToplevel(self)
        modal.title("نئی بکنگ درج کریں (New Booking)")
        modal.geometry("520x680")
        modal.grab_set()

        ctk.CTkLabel(modal, text="نئی بکنگ فارم", font=ctk.CTkFont(size=18, weight="bold")).pack(pady=15)

        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, cnic, phone FROM customers")
        custs = cursor.fetchall()
        
        cursor.execute("SELECT id, room_number, type_name, price_per_night FROM rooms WHERE status = 'available'")
        avail_rooms = cursor.fetchall()
        conn.close()

        cust_options = [f"{c['id']} - {c['name']} ({c['phone']})" for c in custs] or ["کوئی کسٹمر موجود نہیں"]
        room_options = [f"{r['id']} - کمرہ {r['room_number']} ({r['type_name']} - Rs.{r['price_per_night']})" for r in avail_rooms] or ["کوئی خالی کمرہ دستیاب نہیں"]

        ctk.CTkLabel(modal, text="کسٹمر منتخب کریں:", anchor="w").pack(fill="x", padx=30, pady=(5, 2))
        cust_combo = ctk.CTkComboBox(modal, values=cust_options)
        cust_combo.pack(fill="x", padx=30, pady=(0, 8))

        ctk.CTkLabel(modal, text="دستیاب کمرہ منتخب کریں:", anchor="w").pack(fill="x", padx=30, pady=(5, 2))
        room_combo = ctk.CTkComboBox(modal, values=room_options)
        room_combo.pack(fill="x", padx=30, pady=(0, 8))

        today_str = datetime.date.today().strftime('%Y-%m-%d')
        tomorrow_str = (datetime.date.today() + datetime.timedelta(days=1)).strftime('%Y-%m-%d')

        ctk.CTkLabel(modal, text="چیک اِن تاریخ (YYYY-MM-DD):", anchor="w").pack(fill="x", padx=30, pady=(5, 2))
        cin_entry = ctk.CTkEntry(modal)
        cin_entry.pack(fill="x", padx=30, pady=(0, 8))
        cin_entry.insert(0, today_str)

        ctk.CTkLabel(modal, text="چیک آؤٹ تاریخ (YYYY-MM-DD):", anchor="w").pack(fill="x", padx=30, pady=(5, 2))
        cout_entry = ctk.CTkEntry(modal)
        cout_entry.pack(fill="x", padx=30, pady=(0, 8))
        cout_entry.insert(0, tomorrow_str)

        ctk.CTkLabel(modal, text="ایڈوانس پیمنٹ (روپے میں):", anchor="w").pack(fill="x", padx=30, pady=(5, 2))
        adv_entry = ctk.CTkEntry(modal, placeholder_text="0")
        adv_entry.pack(fill="x", padx=30, pady=(0, 8))
        adv_entry.insert(0, "1000")

        def submit_booking():
            if not custs or not avail_rooms:
                messagebox.showerror("خرابی", "کسٹمر یا کمرہ دستیاب نہیں!")
                return
            
            c_sel = cust_combo.get()
            r_sel = room_combo.get()
            c_id = int(c_sel.split(" - ")[0])
            r_id = int(r_sel.split(" - ")[0])

            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM customers WHERE id = ?", (c_id,))
            c_data = cursor.fetchone()
            cursor.execute("SELECT * FROM rooms WHERE id = ?", (r_id,))
            r_data = cursor.fetchone()

            b_no = f"BK-{datetime.date.today().strftime('%Y%m%d')}-{r_data['room_number']}"
            rate = r_data['price_per_night']
            adv = float(adv_entry.get().strip() or 0)
            total = rate * 1

            cursor.execute('''
                INSERT INTO bookings (booking_no, customer_id, customer_name, customer_phone, customer_cnic,
                                      room_id, room_number, room_type, check_in_date, check_out_date,
                                      advance_payment, daily_rate, total_days, total_amount, status, payment_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'checked_in', 'partial')
            ''', (b_no, c_data['id'], c_data['name'], c_data['phone'], c_data['cnic'],
                  r_data['id'], r_data['room_number'], r_data['type_name'], cin_entry.get(), cout_entry.get(),
                  adv, rate, total))

            cursor.execute("UPDATE rooms SET status = 'booked' WHERE id = ?", (r_id,))

            if adv > 0:
                cursor.execute('''
                    INSERT INTO income (date, title, category, amount, payment_method, received_by)
                    VALUES (?, ?, 'room_rent', ?, 'cash', ?)
                ''', (today_str, f"ایڈوانس بکنگ {b_no}", adv, self.current_user['full_name']))

            conn.commit()
            conn.close()

            modal.destroy()
            self.refresh_bookings_table()
            messagebox.showinfo("کامیابی", f"بکنگ نمبر {b_no} کامیابی سے درج ہو گئی!")

        ctk.CTkButton(modal, text="بکنگ کنفرم کریں (Confirm Booking)", fg_color="#059669", height=40, command=submit_booking).pack(fill="x", padx=30, pady=20)

    # --------------------------------------------------------------------------
    # 4. CUSTOMERS VIEW
    # --------------------------------------------------------------------------
    def render_customers_view(self):
        frame = ctk.CTkFrame(self.content_container, fg_color="transparent")
        frame.pack(fill="both", expand=True)

        top_bar = ctk.CTkFrame(frame, fg_color="transparent")
        top_bar.pack(fill="x", pady=(0, 15))
        ctk.CTkLabel(top_bar, text="👥 کسٹمر اور مہمان ڈائریکٹری (Customer Management)", font=ctk.CTkFont(size=22, weight="bold")).pack(side="left")
        ctk.CTkButton(top_bar, text="+ نیا کسٹمر شامل کریں (Add Customer)", fg_color="#059669", height=36, command=self.open_add_customer_modal).pack(side="right")

        tree_frame = ctk.CTkFrame(frame, fg_color="#1e293b", corner_radius=10)
        tree_frame.pack(fill="both", expand=True, pady=5)

        columns = ("id", "name", "cnic", "phone", "city", "address", "spent")
        self.cust_tree = ttk.Treeview(tree_frame, columns=columns, show="headings", height=15)

        self.cust_tree.heading("id", text="ID")
        self.cust_tree.heading("name", text="کسٹمر کا نام")
        self.cust_tree.heading("cnic", text="شناختی کارڈ (CNIC)")
        self.cust_tree.heading("phone", text="موبائل نمبر")
        self.cust_tree.heading("city", text="شہر")
        self.cust_tree.heading("address", text="پتہ")
        self.cust_tree.heading("spent", text="کل اخراجات")

        self.cust_tree.column("id", width=40, anchor="center")
        self.cust_tree.column("name", width=180, anchor="w")
        self.cust_tree.column("cnic", width=150, anchor="center")
        self.cust_tree.column("phone", width=130, anchor="center")
        self.cust_tree.column("city", width=100, anchor="center")
        self.cust_tree.column("address", width=220, anchor="w")
        self.cust_tree.column("spent", width=110, anchor="center")

        self.cust_tree.pack(fill="both", expand=True, padx=10, pady=10)
        self.refresh_customers_table()

        btn_bar = ctk.CTkFrame(frame, fg_color="transparent")
        btn_bar.pack(fill="x", pady=10)
        ctk.CTkButton(btn_bar, text="🗑️ کسٹمر ڈیلیٹ کریں (Delete)", fg_color="#dc2626", command=self.delete_customer).pack(side="left")

    def refresh_customers_table(self):
        for item in self.cust_tree.get_children():
            self.cust_tree.delete(item)
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM customers ORDER BY id DESC")
        for row in cursor.fetchall():
            self.cust_tree.insert("", "end", values=(
                row['id'], row['name'], row['cnic'], row['phone'], row['city'], row['address'], f"Rs. {row['total_spent']:,.0f}"
            ))
        conn.close()

    def delete_customer(self):
        sel = self.cust_tree.selection()
        if not sel:
            messagebox.showwarning("توجہ", "برائے مہربانی کسٹمر منتخب کریں!")
            return
        if messagebox.askyesno("تصدیق", "کیا آپ واقعی یہ کسٹمر ڈیلیٹ کرنا چاہتے ہیں؟"):
            item = self.cust_tree.item(sel[0])
            c_id = item['values'][0]
            conn = DatabaseManager.get_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM customers WHERE id = ?", (c_id,))
            conn.commit()
            conn.close()
            self.refresh_customers_table()
            messagebox.showinfo("کامیابی", "کسٹمر کا ریکارڈ ختم کر دیا گیا!")

    def open_add_customer_modal(self):
        modal = ctk.CTkToplevel(self)
        modal.title("نیا کسٹمر شامل کریں")
        modal.geometry("450x550")
        modal.grab_set()

        ctk.CTkLabel(modal, text="کسٹمر رجسٹریشن فارم", font=ctk.CTkFont(size=18, weight="bold")).pack(pady=15)

        name_e = ctk.CTkEntry(modal, placeholder_text="کسٹمر کا مکمل نام")
        name_e.pack(fill="x", padx=30, pady=8)

        cnic_e = ctk.CTkEntry(modal, placeholder_text="شناختی کارڈ (مثال: 33202-1234567-1)")
        cnic_e.pack(fill="x", padx=30, pady=8)

        phone_e = ctk.CTkEntry(modal, placeholder_text="موبائل نمبر (مثال: 0300-1234567)")
        phone_e.pack(fill="x", padx=30, pady=8)

        city_e = ctk.CTkEntry(modal, placeholder_text="شہر (City)")
        city_e.pack(fill="x", padx=30, pady=8)

        addr_e = ctk.CTkEntry(modal, placeholder_text="مکمل پتہ (Address)")
        addr_e.pack(fill="x", padx=30, pady=8)

        def save_cust():
            nm = name_e.get().strip()
            cn = cnic_e.get().strip()
            ph = phone_e.get().strip()
            ct = city_e.get().strip()
            ad = addr_e.get().strip()
            if not nm or not cn or not ph:
                messagebox.showerror("خرابی", "نام، شناختی کارڈ اور موبائل نمبر لازمی ہیں!")
                return
            try:
                conn = DatabaseManager.get_connection()
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO customers (name, cnic, phone, city, address)
                    VALUES (?, ?, ?, ?, ?)
                ''', (nm, cn, ph, ct, ad))
                conn.commit()
                conn.close()
                modal.destroy()
                self.refresh_customers_table()
                messagebox.showinfo("کامیابی", "کسٹمر کامیابی سے رجسٹر ہو گیا!")
            except Exception as e:
                messagebox.showerror("خرابی", f"کسٹمر محفوظ نہیں ہو سکا: {e}")

        ctk.CTkButton(modal, text="محفوظ کریں (Save Customer)", fg_color="#059669", height=40, command=save_cust).pack(fill="x", padx=30, pady=20)

    # --------------------------------------------------------------------------
    # 5. INVOICES & BILLING VIEW
    # --------------------------------------------------------------------------
    def render_invoices_view(self):
        frame = ctk.CTkFrame(self.content_container, fg_color="transparent")
        frame.pack(fill="both", expand=True)

        top_bar = ctk.CTkFrame(frame, fg_color="transparent")
        top_bar.pack(fill="x", pady=(0, 15))
        ctk.CTkLabel(top_bar, text="🧾 انوائس اور کسٹمر بلنگ ریکارڈز", font=ctk.CTkFont(size=22, weight="bold")).pack(side="left")

        tree_frame = ctk.CTkFrame(frame, fg_color="#1e293b", corner_radius=10)
        tree_frame.pack(fill="both", expand=True, pady=5)

        columns = ("id", "inv_no", "cust", "room", "dates", "amount", "paid", "status")
        self.inv_tree = ttk.Treeview(tree_frame, columns=columns, show="headings", height=15)

        self.inv_tree.heading("id", text="ID")
        self.inv_tree.heading("inv_no", text="انوائس نمبر")
        self.inv_tree.heading("cust", text="کسٹمر نام")
        self.inv_tree.heading("room", text="کمرہ")
        self.inv_tree.heading("dates", text="تاریخ قیام")
        self.inv_tree.heading("amount", text="کل بل رقم")
        self.inv_tree.heading("paid", text="ادا شدہ")
        self.inv_tree.heading("status", text="اسٹیٹس")

        self.inv_tree.column("id", width=40, anchor="center")
        self.inv_tree.column("inv_no", width=120, anchor="center")
        self.inv_tree.column("cust", width=180, anchor="w")
        self.inv_tree.column("room", width=70, anchor="center")
        self.inv_tree.column("dates", width=180, anchor="center")
        self.inv_tree.column("amount", width=100, anchor="center")
        self.inv_tree.column("paid", width=100, anchor="center")
        self.inv_tree.column("status", width=90, anchor="center")

        self.inv_tree.pack(fill="both", expand=True, padx=10, pady=10)
        self.refresh_invoices_table()

        btn_bar = ctk.CTkFrame(frame, fg_color="transparent")
        btn_bar.pack(fill="x", pady=10)
        ctk.CTkButton(btn_bar, text="🖨️ انوائس پرنٹ / ٹیکسٹ فائل ایکسپورٹ", fg_color="#0284c7", command=self.print_invoice_txt).pack(side="left")

    def refresh_invoices_table(self):
        for item in self.inv_tree.get_children():
            self.inv_tree.delete(item)
        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM invoices ORDER BY id DESC")
        for row in cursor.fetchall():
            self.inv_tree.insert("", "end", values=(
                row['id'], row['invoice_no'], row['customer_name'], row['room_number'],
                f"{row['check_in_date']} تا {row['check_out_date']}",
                f"Rs. {row['net_payable']:,.0f}", f"Rs. {row['paid_amount']:,.0f}", row['payment_status'].upper()
            ))
        conn.close()

    def print_invoice_txt(self):
        sel = self.inv_tree.selection()
        if not sel:
            messagebox.showwarning("توجہ", "برائے مہربانی انوائس منتخب کریں!")
            return
        item = self.inv_tree.item(sel[0])
        inv_id = item['values'][0]

        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM invoices WHERE id = ?", (inv_id,))
        inv = cursor.fetchone()
        conn.close()

        if not inv:
            return

        receipt_text = f"""
================================================================
          اسمارٹ ہوٹل اینڈ رزارٹ (SMART HOTEL & RESORT)
          حویلی بہادر شاہ، جھنگ، پنجاب، پاکستان
          فون / واٹس ایپ: +92 347 7669235
================================================================
انوائس نمبر: {inv['invoice_no']}
تاریخ اجراء: {inv['issue_date']}
جاری کنندہ: {inv['issued_by']}
----------------------------------------------------------------
مہمان کا نام: {inv['customer_name']}
موبائل نمبر: {inv['customer_phone']}
شناختی کارڈ: {inv['customer_cnic']}
----------------------------------------------------------------
کمرہ نمبر: {inv['room_number']} ({inv['room_type']})
قیام کی تاریخ: {inv['check_in_date']} تا {inv['check_out_date']}
کل دن: {inv['total_days']} دن
یومیہ کرایہ: Rs. {inv['daily_rate']:,.0f}
----------------------------------------------------------------
کمرے کا کل کرایہ: Rs. {inv['room_total']:,.0f}
اضافی چارجز: Rs. {inv['extras_total']:,.0f}
جی ایس ٹی / ٹیکس: Rs. {inv['gst_amount']:,.0f}
رعایت (Discount): Rs. {inv['discount_amount']:,.0f}
----------------------------------------------------------------
خالص قابل ادائیگی رقم: Rs. {inv['net_payable']:,.0f}
وصول شدہ رقم: Rs. {inv['paid_amount']:,.0f}
بقایا جات: Rs. {inv['balance_due']:,.0f}
طریقہ ادائیگی: {inv['payment_method'].upper()}
ادائیگی اسٹیٹس: {inv['payment_status'].upper()}
================================================================
ڈویلپر: اسامہ سیف (Usama Saif) | GSM_BY_US (+92 347 7669235)
ہمارے ہوٹل میں قیام کا بہت شکریہ!
================================================================
"""
        file_path = filedialog.asksaveasfilename(
            defaultextension=".txt",
            filetypes=[("Text files", "*.txt")],
            initialfile=f"Invoice_{inv['invoice_no']}.txt"
        )
        if file_path:
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(receipt_text)
            messagebox.showinfo("کامیابی", f"انوائس فائل کامیابی سے محفوظ کر دی گئی:\\n{file_path}")

    # --------------------------------------------------------------------------
    # 6. FINANCE (INCOME & EXPENSES) VIEW
    # --------------------------------------------------------------------------
    def render_finance_view(self):
        frame = ctk.CTkFrame(self.content_container, fg_color="transparent")
        frame.pack(fill="both", expand=True)

        top_bar = ctk.CTkFrame(frame, fg_color="transparent")
        top_bar.pack(fill="x", pady=(0, 15))
        ctk.CTkLabel(top_bar, text="💰 مالیاتی حساب کتاب (Income & Expenses)", font=ctk.CTkFont(size=22, weight="bold")).pack(side="left")
        ctk.CTkButton(top_bar, text="+ نیا خرچہ درج کریں (Add Expense)", fg_color="#dc2626", height=36, command=self.open_add_expense_modal).pack(side="right")

        tabview = ctk.CTkTabview(frame)
        tabview.pack(fill="both", expand=True)

        tab_inc = tabview.add("آمدنی کا ریکارڈ (Income)")
        tab_exp = tabview.add("اخراجات کا ریکارڈ (Expenses)")

        inc_cols = ("id", "date", "title", "cat", "amount", "method", "by")
        self.inc_tree = ttk.Treeview(tab_inc, columns=inc_cols, show="headings", height=12)
        self.inc_tree.heading("id", text="ID")
        self.inc_tree.heading("date", text="تاریخ")
        self.inc_tree.heading("title", text="تفصیل")
        self.inc_tree.heading("cat", text="کیٹیگری")
        self.inc_tree.heading("amount", text="رقم (روپے)")
        self.inc_tree.heading("method", text="طریقہ")
        self.inc_tree.heading("by", text="وصول کنندہ")
        self.inc_tree.pack(fill="both", expand=True, padx=10, pady=10)

        exp_cols = ("id", "date", "title", "cat", "amount", "paid_to", "by")
        self.exp_tree = ttk.Treeview(tab_exp, columns=exp_cols, show="headings", height=12)
        self.exp_tree.heading("id", text="ID")
        self.exp_tree.heading("date", text="تاریخ")
        self.exp_tree.heading("title", text="تفصیل خرچہ")
        self.exp_tree.heading("cat", text="کیٹیگری")
        self.exp_tree.heading("amount", text="رقم (روپے)")
        self.exp_tree.heading("paid_to", text="ادائیگی بنام")
        self.exp_tree.heading("by", text="منظور کنندہ")
        self.exp_tree.pack(fill="both", expand=True, padx=10, pady=10)

        self.refresh_finance_tables()

    def refresh_finance_tables(self):
        for item in self.inc_tree.get_children():
            self.inc_tree.delete(item)
        for item in self.exp_tree.get_children():
            self.exp_tree.delete(item)

        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM income ORDER BY id DESC")
        for r in cursor.fetchall():
            self.inc_tree.insert("", "end", values=(r['id'], r['date'], r['title'], r['category'], f"Rs. {r['amount']:,.0f}", r['payment_method'], r['received_by']))

        cursor.execute("SELECT * FROM expenses ORDER BY id DESC")
        for r in cursor.fetchall():
            self.exp_tree.insert("", "end", values=(r['id'], r['date'], r['title'], r['category'], f"Rs. {r['amount']:,.0f}", r['paid_to'], r['approved_by']))

        conn.close()

    def open_add_expense_modal(self):
        modal = ctk.CTkToplevel(self)
        modal.title("نیا خرچہ درج کریں")
        modal.geometry("450x520")
        modal.grab_set()

        ctk.CTkLabel(modal, text="نیا خرچہ فارم", font=ctk.CTkFont(size=18, weight="bold")).pack(pady=15)

        title_e = ctk.CTkEntry(modal, placeholder_text="خرچے کی تفصیل (مثال: جنریٹر فیول)")
        title_e.pack(fill="x", padx=30, pady=8)

        cat_combo = ctk.CTkComboBox(modal, values=["بجلی و فیول (Utilities)", "مرمت و دیکھ بھال (Maintenance)", "تنخواہیں (Salaries)", "صفائی کا سامان (Supplies)", "دیگر (Misc)"])
        cat_combo.pack(fill="x", padx=30, pady=8)

        amt_e = ctk.CTkEntry(modal, placeholder_text="رقم روپے میں (Amount)")
        amt_e.pack(fill="x", padx=30, pady=8)

        to_e = ctk.CTkEntry(modal, placeholder_text="ادائیگی بنام (Paid To)")
        to_e.pack(fill="x", padx=30, pady=8)

        def save_exp():
            t = title_e.get().strip()
            c = cat_combo.get()
            a = amt_e.get().strip()
            p = to_e.get().strip()
            if not t or not a:
                messagebox.showerror("خرابی", "تفصیل اور رقم درج کریں!")
                return
            try:
                conn = DatabaseManager.get_connection()
                cursor = conn.cursor()
                cursor.execute('''
                    INSERT INTO expenses (date, title, category, amount, paid_to, approved_by)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (datetime.date.today().strftime('%Y-%m-%d'), t, c, float(a), p, self.current_user['full_name']))
                conn.commit()
                conn.close()
                modal.destroy()
                self.refresh_finance_tables()
                messagebox.showinfo("کامیابی", "خرچہ کامیابی سے درج ہو گیا!")
            except Exception as e:
                messagebox.showerror("خرابی", f"محفوظ نہیں ہو سکا: {e}")

        ctk.CTkButton(modal, text="محفوظ کریں (Save Expense)", fg_color="#dc2626", height=40, command=save_exp).pack(fill="x", padx=30, pady=20)

    # --------------------------------------------------------------------------
    # 7. REPORTS & EXPORT VIEW
    # --------------------------------------------------------------------------
    def render_reports_view(self):
        frame = ctk.CTkScrollableFrame(self.content_container, fg_color="transparent")
        frame.pack(fill="both", expand=True)

        ctk.CTkLabel(frame, text="📈 ہوٹل رپورٹس اور ایکسل/سی ایس وی ایکسپورٹ", font=ctk.CTkFont(size=22, weight="bold")).pack(anchor="w", pady=(0, 20))

        box = ctk.CTkFrame(frame, fg_color="#1e293b", corner_radius=12)
        box.pack(fill="x", pady=10)

        ctk.CTkLabel(box, text="فوری رپورٹس ڈاؤن لوڈ کریں:", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", padx=20, pady=(15, 10))

        btn_row = ctk.CTkFrame(box, fg_color="transparent")
        btn_row.pack(fill="x", padx=20, pady=(0, 20))

        ctk.CTkButton(btn_row, text="📊 بکنگ رپورٹ ایکسپورٹ (CSV)", fg_color="#059669", command=lambda: self.export_table_to_csv("bookings")).pack(side="left", padx=(0, 10))
        ctk.CTkButton(btn_row, text="👥 کسٹمر لسٹ ایکسپورٹ (CSV)", fg_color="#2563eb", command=lambda: self.export_table_to_csv("customers")).pack(side="left", padx=(0, 10))
        ctk.CTkButton(btn_row, text="💰 مالیاتی رپورٹ ایکسپورٹ (CSV)", fg_color="#7c3aed", command=lambda: self.export_table_to_csv("income")).pack(side="left")

    def export_table_to_csv(self, table_name):
        file_path = filedialog.asksaveasfilename(
            defaultextension=".csv",
            filetypes=[("CSV files", "*.csv")],
            initialfile=f"Hotel_{table_name}_Report_{datetime.date.today().strftime('%Y%m%d')}.csv"
        )
        if not file_path:
            return

        conn = DatabaseManager.get_connection()
        cursor = conn.cursor()
        cursor.execute(f"SELECT * FROM {table_name}")
        rows = cursor.fetchall()
        
        if rows:
            headers = rows[0].keys()
            with open(file_path, "w", newline="", encoding="utf-8-sig") as f:
                writer = csv.writer(f)
                writer.writerow(headers)
                for r in rows:
                    writer.writerow(tuple(r))
            messagebox.showinfo("کامیابی", f"{table_name.capitalize()} رپورٹ CSV فارمیٹ میں کامیابی سے ایکسپورٹ ہو گئی!")
        else:
            messagebox.showwarning("توجہ", "کوئی ریکارڈ موجود نہیں!")
        conn.close()

    # --------------------------------------------------------------------------
    # 8. ADMIN PANEL & SETTINGS VIEW
    # --------------------------------------------------------------------------
    def render_admin_view(self):
        frame = ctk.CTkScrollableFrame(self.content_container, fg_color="transparent")
        frame.pack(fill="both", expand=True)

        ctk.CTkLabel(frame, text="⚙️ ایڈمن کنٹرول پینل و سسٹم سیٹنگز", font=ctk.CTkFont(size=22, weight="bold")).pack(anchor="w", pady=(0, 20))

        bk_box = ctk.CTkFrame(frame, fg_color="#1e293b", corner_radius=12)
        bk_box.pack(fill="x", pady=10)

        ctk.CTkLabel(bk_box, text="💾 ڈیٹا بیس بیک اپ اور ری اسٹور (Backup & Restore)", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", padx=20, pady=(15, 5))
        ctk.CTkLabel(bk_box, text="ڈیٹا محفوظ رکھنے کے لیے باقاعدگی سے بیک اپ فائل بنائیں", font=ctk.CTkFont(size=12), text_color="#94a3b8").pack(anchor="w", padx=20, pady=(0, 15))

        btn_row = ctk.CTkFrame(bk_box, fg_color="transparent")
        btn_row.pack(fill="x", padx=20, pady=(0, 20))
        ctk.CTkButton(btn_row, text="📥 بیک اپ بنائیں (Create Backup)", fg_color="#059669", command=self.create_db_backup).pack(side="left", padx=(0, 10))

        info_box = ctk.CTkFrame(frame, fg_color="#1e293b", corner_radius=12)
        info_box.pack(fill="x", pady=10)

        ctk.CTkLabel(info_box, text="🏢 ہوٹل پروفائل اور سافٹ ویئر تفصیلات", font=ctk.CTkFont(size=16, weight="bold")).pack(anchor="w", padx=20, pady=(15, 10))

        details = """
ہوٹل کا نام: اسمارٹ ہوٹل اینڈ رزارٹ (Smart Hotel Management System)
سافٹ ویئر ورژن: GSM_BY_US Pixel Lifetime Pro Edition
ڈویلپر و مینیجر: اسامہ سیف (Usama Saif)
پتہ: حویلی بہادر شاہ، جھنگ، پنجاب، پاکستان
رابطہ / واٹس ایپ: +92 347 7669235
یوٹیوب چینل: @gsm_by_us
بلاگ: gsmbyusamasaif.blogspot.com
"""
        ctk.CTkLabel(info_box, text=details, font=ctk.CTkFont(size=13), text_color="#cbd5e1", justify="left").pack(anchor="w", padx=20, pady=(0, 20))

    def create_db_backup(self):
        file_path = filedialog.asksaveasfilename(
            defaultextension=".db",
            filetypes=[("SQLite DB", "*.db")],
            initialfile=f"hotel_backup_{datetime.date.today().strftime('%Y%m%d')}.db"
        )
        if file_path:
            import shutil
            shutil.copy2(DB_FILE, file_path)
            messagebox.showinfo("کامیابی", f"ڈیٹا بیس بیک اپ کامیابی سے محفوظ کر دیا گیا:\\n{file_path}")

    def logout(self):
        if messagebox.askyesno("لاگ آؤٹ", "کیا آپ واقعی لاگ آؤٹ کرنا چاہتے ہیں؟"):
            self.destroy()
            login = LoginWindow()
            login.mainloop()


# ==============================================================================
# APPLICATION ENTRY POINT
# ==============================================================================
if __name__ == "__main__":
    app = LoginWindow()
    app.mainloop()
`;

export const pythonRequirementsTxt = `customtkinter>=5.2.2
Pillow>=10.2.0
packaging>=24.0
`;

export const buildExeBatScript = `@echo off
title Build Smart Hotel Management System - GSM_BY_US
echo ========================================================
echo   Smart Hotel Management System - Windows EXE Builder
echo   Developed By: Usama Saif (GSM_BY_US)
echo   WhatsApp: +92 347 7669235
echo ========================================================
echo.
echo [1/3] Checking and installing requirements...
pip install -r requirements.txt
pip install pyinstaller

echo.
echo [2/3] Compiling main.py to standalone EXE...
pyinstaller --noconsole --onefile --name="SmartHotelManagementSystem_GSM_BY_US" --collect-all customtkinter main.py

echo.
echo [3/3] Build finished!
echo Your standalone executable is located in the 'dist' folder.
echo Location: dist\\SmartHotelManagementSystem_GSM_BY_US.exe
echo.
pause
`;

export const runBatScript = `@echo off
title Smart Hotel Management System - GSM_BY_US
echo ========================================================
echo   Launching Smart Hotel Management System...
echo   Developer: Usama Saif (GSM_BY_US)
echo ========================================================
python main.py
if %errorlevel% neq 0 (
    echo.
    echo Missing dependencies? Installing now...
    pip install -r requirements.txt
    python main.py
)
pause
`;

export const readmeUrduText = `# اسمارٹ ہوٹل مینجمنٹ سسٹم (Smart Hotel Management System)
### Developed by Usama Saif (GSM_BY_US)

پروفیشنل، جدید اور مکمل اردو ہوٹل مینجمنٹ سسٹم جو کہ Python اور CustomTkinter میں تیار کیا گیا ہے۔

## خصوصیات (Features)
- مکمل اردو گرافیکل یوزر انٹرفیس (Urdu GUI)
- ایڈمن و یوزر لاگ اِن سسٹم بمعہ پاس ورڈ ہیشنگ (SHA-256)
- SQLite سنگل فائل ڈیٹا بیس (آٹو سیٹ اپ)
- کمروں کا مکمل انتظام، کرایہ، اور صفائی اسٹیٹس کنٹرول
- کسٹمر ڈائریکٹری بمعہ شناختی کارڈ (CNIC) و فون نمبر
- ریزرویشن، بکنگ، ایڈوانس، فوری واک اِن چیک اِن اور چیک آؤٹ
- بلنگ و انوائس جنریشن بمعہ GST ٹیکس اور ڈسکاؤنٹ
- آمدنی اور اخراجات کا مکمل فنانشل لیجر
- رپورٹس، تجزیات اور CSV ایکسل ایکسپورٹ
- ونڈوز پورٹیبل EXE بلڈ سپورٹ

## چلانے کا طریقہ (How to Run)
1. Python 3.10 یا نیا ورژن انسٹال کریں۔
2. کمانڈ چلائیں:
   \`\`\`bash
   pip install -r requirements.txt
   python main.py
   \`\`\`
   یا \`run.bat\` پر ڈبل کلک کریں۔

## ونڈوز EXE فائل بنانے کا طریقہ (Build EXE)
\`build_exe.bat\` پر ڈبل کلک کریں یا ٹرمینل میں چلائیں:
\`\`\`bash
pip install pyinstaller
pyinstaller --noconsole --onefile --name="SmartHotelManagementSystem_GSM_BY_US" --collect-all customtkinter main.py
\`\`\`

## ڈویلپر کی تفصیلات (Developer Contact)
- **ڈویلپر:** اسامہ سیف (Usama Saif)
- **برانڈ:** GSM_BY_US
- **مقام:** حویلی بہادر شاہ، جھنگ، پنجاب، پاکستان
- **واٹس ایپ:** +92 347 7669235
- **یوٹیوب:** @gsm_by_us
- **ٹیلی گرام:** t.me/gsmcrackbyus
- **بلاگ:** gsmbyusamasaif.blogspot.com
`;

export const PYTHON_MAIN_SOURCE = pythonMainCode;
export const REQUIREMENTS_TXT = pythonRequirementsTxt;
export const BUILD_EXE_BAT = buildExeBatScript;
export const RUN_BAT = runBatScript;
export const README_URDU = readmeUrduText;
