import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Mail,
  KeyRound, 
  Sparkles, 
  Phone, 
  CheckCircle2, 
  AlertCircle,
  ShieldCheck,
  Zap,
  Crown,
  LogIn,
  UserPlus
} from 'lucide-react';
import { User as UserType, HotelSettings } from '../types';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { DEFAULT_LOGO_URL } from '../data/initialData';

interface AuthModalProps {
  hotelSettings: HotelSettings;
  users: UserType[];
  onLoginSuccess: (user: UserType) => void;
  onRegisterUser: (user: Omit<UserType, 'id' | 'createdAt'>) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  hotelSettings,
  users,
  onLoginSuccess,
  onRegisterUser,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'google'>('login');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'receptionist'>('receptionist');
  const [googleEmail, setGoogleEmail] = useState('salarkhan35343@gmail.com');
  const [googleName, setGoogleName] = useState('Salar Khan');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    
    const user = users.find(
      u => u.username.toLowerCase() === username.trim().toLowerCase()
    );

    if (user) {
      if (!user.active) {
        setErrorMessage('This user account is currently deactivated. Please contact the administrator.');
        return;
      }
      playSuccessSound();
      onLoginSuccess(user);
    } else {
      setErrorMessage('Invalid username or password. Please try again or create a new local account.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');

    if (!fullName.trim() || !username.trim() || !password.trim()) {
      setErrorMessage('Please fill in all mandatory fields.');
      return;
    }

    const exists = users.some(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (exists) {
      setErrorMessage('This username is already taken. Please choose a different username.');
      return;
    }

    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      username: username.trim().toLowerCase(),
      fullName: fullName.trim(),
      email: email.trim() || `${username.trim().toLowerCase()}@hashmirestaurant.pk`,
      phone: phone.trim() || '+92 347 7669235',
      role,
      active: true,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
    };

    onRegisterUser(newUser);
    playSuccessSound();
    setSuccessMessage(`Account created successfully for ${fullName}! Activating workspace...`);
    
    // Automatically log in the user upon registration
    setTimeout(() => {
      onLoginSuccess(newUser);
    }, 1200);
  };

  const handleGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound();

    if (!googleEmail.trim()) {
      setErrorMessage('Please enter a valid Gmail address.');
      return;
    }

    // Find existing user by email or create new Google auth profile
    let existing = users.find(u => u.email.toLowerCase() === googleEmail.trim().toLowerCase());
    if (!existing) {
      existing = {
        id: `google-${Date.now()}`,
        username: googleEmail.split('@')[0],
        fullName: googleName || 'Google User',
        email: googleEmail.trim(),
        phone: '+92 347 7669235',
        role: 'manager',
        active: true,
        createdAt: new Date().toISOString().split('T')[0],
        lastLogin: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })
      };
      onRegisterUser(existing);
    }

    playSuccessSound();
    setSuccessMessage(`Signed in via Google as ${googleEmail}. Welcome to Hashmi Restaurant!`);
    setTimeout(() => {
      onLoginSuccess(existing!);
    }, 1000);
  };

  const handleQuickRoleLogin = (roleType: 'admin' | 'manager' | 'receptionist') => {
    playClickSound();
    const targetUser = users.find(u => u.role === roleType) || users[0];
    if (targetUser) {
      playSuccessSound();
      onLoginSuccess(targetUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07080B]/90 backdrop-blur-md p-4 select-none overflow-y-auto">
      {/* Luxury Gold Ambient Backlight */}
      <div className="absolute w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-[#12141A] border border-amber-500/30 rounded-3xl w-full max-w-lg shadow-2xl p-6 sm:p-8 relative overflow-hidden my-auto">
        {/* Top Gold Trim Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Brand Header */}
        <div className="text-center relative z-10 mb-6">
          <div className="relative inline-block mb-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 shadow-xl mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0B0E] p-0.5 border border-amber-400/60 flex items-center justify-center">
                <img
                  src={hotelSettings.logoUrl || DEFAULT_LOGO_URL}
                  alt={hotelSettings.hotelNameEn}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#1A1D24] border border-amber-500/50 rounded-full px-2.5 py-0.5 text-[10px] text-amber-400 font-bold flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Royal Auth</span>
            </div>
          </div>

          <h2 className="text-2xl font-black font-cinzel text-gold-gradient tracking-wide uppercase">
            {hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'}
          </h2>
          <p className="text-xs text-amber-200/80 font-serif mt-1">
            {hotelSettings.taglineEn || 'Taste That Brings You Back • Premium Management System'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 bg-[#0A0B0E] p-1.5 rounded-2xl border border-amber-500/20 mb-6 text-xs font-bold gap-1">
          <button
            onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
            id="tab-auth-login"
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'login' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-950/40 font-black' 
                : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>

          <button
            onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
            id="tab-auth-register"
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'register' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-950/40 font-black' 
                : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>

          <button
            onClick={() => { setAuthMode('google'); setErrorMessage(''); }}
            id="tab-auth-google"
            className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'google' 
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black shadow-lg shadow-amber-950/40 font-black' 
                : 'text-gray-400 hover:text-amber-300'
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>Google / Gmail</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. Login Mode */}
        {authMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-amber-200/90 font-semibold mb-1">Username:</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-400 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-amber-200/90 font-semibold mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-400 font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
              <span className="text-gray-500">Default Password: admin123</span>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('admin123');
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fill Admin Credentials</span>
              </button>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-950/50 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4 fill-black" />
              <span>Sign In to Hashmi Restaurant</span>
            </button>
          </form>
        )}

        {/* 2. Register Mode */}
        {authMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-amber-200/90 font-semibold mb-1">Full Name:</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Salar Khan"
                className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Username:</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="salarkhan"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Password:</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Email Address:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2 text-gray-100 placeholder:text-gray-600 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-amber-200/90 font-semibold mb-1">System Role:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2 text-gray-100 focus:outline-none focus:border-amber-400"
              >
                <option value="admin">Administrator / Owner (Full Access)</option>
                <option value="manager">Restaurant Manager (Operations & Tables)</option>
                <option value="receptionist">Receptionist / Cashier (Front Desk & Billing)</option>
              </select>
            </div>

            <button
              type="submit"
              id="btn-register-submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm tracking-wider uppercase shadow-xl shadow-amber-950/50 transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4 fill-black" />
              <span>Create Account & Enter System</span>
            </button>
          </form>
        )}

        {/* 3. Google / Gmail Mode */}
        {authMode === 'google' && (
          <form onSubmit={handleGoogleLogin} className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#0A0B0E] rounded-2xl border border-amber-500/20 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto shadow-md">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white">Google Workspace Authentication</h3>
              <p className="text-gray-400 text-[11px]">
                Sign in with your verified Google / Gmail account for instant single sign-on.
              </p>
            </div>

            <div>
              <label className="block text-amber-200/90 font-semibold mb-1">Your Full Name:</label>
              <input
                type="text"
                required
                value={googleName}
                onChange={(e) => setGoogleName(e.target.value)}
                placeholder="Salar Khan"
                className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-amber-200/90 font-semibold mb-1">Gmail Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-red-400" />
                <input
                  type="email"
                  required
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="salarkhan35343@gmail.com"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl pl-10 pr-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-google-login-submit"
              className="w-full py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs tracking-wider uppercase shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5 mt-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google Account</span>
            </button>
          </form>
        )}

        {/* Quick Demo Access Bar */}
        <div className="mt-6 pt-4 border-t border-amber-500/20">
          <p className="text-[11px] text-amber-200/60 text-center mb-2.5 font-medium">
            ⚡ Quick Demo One-Click Access:
          </p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              onClick={() => handleQuickRoleLogin('admin')}
              className="px-2 py-1.5 rounded-lg bg-[#0A0B0E] hover:bg-amber-950/40 border border-amber-500/20 hover:border-amber-400 text-[11px] text-amber-300 transition-all font-semibold"
            >
              👑 Owner / Admin
            </button>
            <button
              onClick={() => handleQuickRoleLogin('manager')}
              className="px-2 py-1.5 rounded-lg bg-[#0A0B0E] hover:bg-amber-950/40 border border-amber-500/20 hover:border-amber-400 text-[11px] text-amber-300 transition-all font-semibold"
            >
              💼 Manager
            </button>
            <button
              onClick={() => handleQuickRoleLogin('receptionist')}
              className="px-2 py-1.5 rounded-lg bg-[#0A0B0E] hover:bg-amber-950/40 border border-amber-500/20 hover:border-amber-400 text-[11px] text-amber-300 transition-all font-semibold"
            >
              🛎️ Receptionist
            </button>
          </div>
        </div>

        {/* Developer Attribution Footer */}
        <div className="mt-6 pt-3 text-[11px] text-gray-500 text-center border-t border-gray-800/80">
          <span className="text-amber-400/90 font-medium">Developed by Usama Saif (GSM_BY_US)</span> • Haveli Bahadur Shah, Jhang
          <div className="text-[10px] text-gray-500 font-mono mt-0.5">+92 347 7669235</div>
        </div>
      </div>
    </div>
  );
};
