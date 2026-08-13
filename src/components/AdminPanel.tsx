import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  UserPlus, 
  Key, 
  Trash2, 
  Database, 
  Activity, 
  Lock, 
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  Crown,
  Edit2
} from 'lucide-react';
import { User, AuditLog, HotelSettings } from '../types';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface AdminPanelProps {
  users: User[];
  auditLogs: AuditLog[];
  currentUser: User | null;
  hotelSettings?: HotelSettings;
  onNavigateTab?: (tab: string) => void;
  onAddUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  onDeleteUser: (userId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  users,
  auditLogs,
  currentUser,
  hotelSettings,
  onNavigateTab,
  onAddUser,
  onDeleteUser,
}) => {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formFullName, setFormFullName] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'receptionist' | 'manager'>('receptionist');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUsername.trim() || !formPassword.trim() || !formFullName.trim()) return;

    playSuccessSound();
    onAddUser({
      username: formUsername.trim().toLowerCase(),
      fullName: formFullName.trim(),
      email: formEmail.trim() || `${formUsername.trim().toLowerCase()}@hashmirestaurant.pk`,
      phone: formPhone.trim() || '+92 347 7669235',
      role: formRole,
      active: true,
      lastLogin: 'Never'
    });

    setFormUsername('');
    setFormPassword('');
    setFormFullName('');
    setFormPhone('');
    setFormEmail('');
    setIsAddUserOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12141A] border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#0A0B0E] rounded-[14px] flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-cinzel text-gold-gradient tracking-wide uppercase">
              Admin & Security Control Panel
            </h2>
            <p className="text-xs text-amber-200/70 font-serif mt-0.5">
              Role permissions, authorized users, live system audit logs, and encryption safeguards
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {onNavigateTab && (
            <button
              onClick={() => {
                playClickSound();
                onNavigateTab('settings');
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A1D24] hover:bg-[#252A36] border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-sm transition-all"
            >
              <Edit2 className="w-4 h-4 text-amber-400" />
              <span>Edit Title & Settings</span>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              setIsAddUserOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-black shadow-lg shadow-amber-950/40 transition-all active:scale-95 uppercase tracking-wide shrink-0"
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Create System User</span>
          </button>
        </div>
      </div>

      {/* Database & Security Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-[#12141A] border border-amber-500/20 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-400">Database Engine:</div>
            <div className="text-sm font-bold text-white mt-0.5 font-cinzel">SQLite v3.45 & LocalStorage</div>
            <div className="text-[11px] text-emerald-400">All tables live and synchronized</div>
          </div>
        </div>

        <div className="bg-[#12141A] border border-amber-500/20 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-400">Security Encryption:</div>
            <div className="text-sm font-bold text-white mt-0.5 font-mono">SHA-256 Authentication</div>
            <div className="text-[11px] text-amber-300">Role-based permission guard active</div>
          </div>
        </div>

        <div className="bg-[#12141A] border border-amber-500/20 p-5 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-gray-400">Software License:</div>
            <div className="text-sm font-bold text-white mt-0.5 font-cinzel text-gold-gradient">GSM_BY_US Enterprise</div>
            <div className="text-[11px] text-amber-300">Usama Saif (+92 347 7669235)</div>
          </div>
        </div>
      </div>

      {/* Users & Staff List */}
      <div className="bg-[#12141A] border border-amber-500/20 rounded-3xl shadow-xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4 font-cinzel text-gold-gradient uppercase">
          <Users className="w-5 h-5 text-amber-400" />
          <span>Active Staff & Administrative Accounts ({users.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <div
              key={u.id}
              className="bg-[#0A0B0E] border border-amber-500/20 rounded-2xl p-4 flex flex-col justify-between hover:border-amber-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">{u.fullName}</span>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                    u.role === 'admin'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : u.role === 'manager'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  }`}>
                    {u.role}
                  </span>
                </div>

                <div className="text-xs text-gray-400 space-y-1 font-mono">
                  <div>Username: <strong className="text-amber-200">{u.username}</strong></div>
                  <div>Phone: <strong className="text-gray-300">{u.phone}</strong></div>
                  <div>Email: <span className="text-gray-400">{u.email}</span></div>
                  <div className="text-[10px] text-gray-500">Registered: {u.createdAt}</div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-500/10 flex items-center justify-between">
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active Status
                </span>

                {u.username !== 'admin' && (
                  <button
                    onClick={() => {
                      playClickSound();
                      if (window.confirm(`Delete user ${u.username}?`)) {
                        onDeleteUser(u.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 text-xs transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-[#12141A] border border-amber-500/20 rounded-3xl shadow-xl p-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4 font-cinzel text-gold-gradient uppercase">
          <Activity className="w-5 h-5 text-amber-400" />
          <span>System Security & Action Logs</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-amber-500/20 text-amber-200/80 bg-[#0A0B0E]">
                <th className="py-3 px-3.5 font-semibold">Timestamp</th>
                <th className="py-3 px-3.5 font-semibold">User</th>
                <th className="py-3 px-3.5 font-semibold">Action</th>
                <th className="py-3 px-3.5 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-amber-500/10 font-mono">
              {auditLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-[#1A1D24]">
                  <td className="py-3 px-3.5 text-gray-400 text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-3.5 text-amber-300 font-bold">{log.username}</td>
                  <td className="py-3 px-3.5 text-emerald-400 font-bold">{log.action}</td>
                  <td className="py-3 px-3.5 text-gray-300 font-sans text-xs">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-[#12141A] border border-amber-500/40 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 font-cinzel text-gold-gradient">
              <UserPlus className="w-5 h-5 text-amber-400" />
              <span>Create New System Account</span>
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Full Name:</label>
                <input
                  type="text"
                  required
                  value={formFullName}
                  onChange={(e) => setFormFullName(e.target.value)}
                  placeholder="e.g. Salar Khan"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-amber-200/90 font-semibold mb-1">Username:</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    placeholder="salarkhan"
                    className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-amber-200/90 font-semibold mb-1">Password:</label>
                  <input
                    type="password"
                    required
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Role & Permissions:</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="receptionist">Receptionist / Front Desk</option>
                  <option value="manager">Restaurant Manager</option>
                  <option value="admin">Administrator / Owner</option>
                </select>
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Phone Number:</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="+92 347 7669235"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold shadow-lg shadow-amber-950/40 uppercase tracking-wide"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
