import React, { useState } from 'react';
import { 
  Settings, 
  Building2, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  CheckCircle2,
  Image as ImageIcon,
  Crown,
  Upload,
  Sun,
  Moon,
  Volume2
} from 'lucide-react';
import { HotelSettings } from '../types';
import { DEFAULT_LOGO_URL, DEFAULT_PORTRAIT_URL } from '../data/initialData';
import { playClickSound, playSuccessSound, playRoyalIntroSound } from '../utils/audio';

interface SettingsManagerProps {
  hotelSettings: HotelSettings;
  themeMode: 'dark' | 'light';
  onToggleTheme: () => void;
  onUpdateSettings: (settings: HotelSettings) => void;
  onResetDemoData: () => void;
  onOpenLogoEditor: () => void;
  onReplayIntro: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  hotelSettings,
  themeMode,
  onToggleTheme,
  onUpdateSettings,
  onResetDemoData,
  onOpenLogoEditor,
  onReplayIntro
}) => {
  const [formData, setFormData] = useState<HotelSettings>(hotelSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound();
    onUpdateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#12141A] border border-amber-500/30 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#0A0B0E] rounded-[14px] flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-cinzel text-gold-gradient tracking-wide uppercase">
              System Settings & Brand Management
            </h2>
            <p className="text-xs text-amber-200/70 font-serif mt-0.5">
              Customize restaurant title, logos, theme colors, tax percentages, and contact information
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              playRoyalIntroSound();
              onReplayIntro();
            }}
            className="px-3.5 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#252A36] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Test Intro Sound</span>
          </button>

          {savedSuccess && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings Saved Live!</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings Form (2 cols) */}
        <div className="lg:col-span-2 bg-[#12141A] border border-amber-500/20 rounded-3xl p-6 shadow-2xl space-y-6">
          {/* Logo & Theme Quick Controls Bar */}
          <div className="p-4 bg-[#0A0B0E] rounded-2xl border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-md shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0B0E] p-0.5">
                  <img
                    src={formData.logoUrl || DEFAULT_LOGO_URL}
                    alt="Logo"
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-cinzel text-gold-gradient">
                  Restaurant Brand Emblem
                </h4>
                <p className="text-[11px] text-gray-400">
                  Visible in header, invoices, and intro screen
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onOpenLogoEditor();
                }}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40 transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Upload / Edit Logo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onToggleTheme();
                }}
                className="px-3.5 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#252A36] border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-amber-400" />}
                <span>{themeMode === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2 pt-2 border-t border-amber-500/10">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>Identity & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Title Name (English):</label>
                <input
                  type="text"
                  required
                  value={formData.hotelNameEn}
                  onChange={(e) => setFormData({ ...formData, hotelNameEn: e.target.value })}
                  placeholder="HASHMI RESTAURANT"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Title Name (Urdu):</label>
                <input
                  type="text"
                  required
                  value={formData.hotelNameUrdu}
                  onChange={(e) => setFormData({ ...formData, hotelNameUrdu: e.target.value })}
                  placeholder="ہاشمی ریسٹورنٹ اینڈ ہوٹل"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Tagline (English):</label>
                <input
                  type="text"
                  value={formData.taglineEn}
                  onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                  placeholder="Taste That Brings You Back"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400 font-serif"
                />
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Tagline (Urdu):</label>
                <input
                  type="text"
                  value={formData.taglineUrdu}
                  onChange={(e) => setFormData({ ...formData, taglineUrdu: e.target.value })}
                  placeholder="شاہانہ ذائقہ اور پرسکون ماحول"
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Phone / WhatsApp:</label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Official Email:</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-amber-200/90 font-semibold mb-1">Address / Location:</label>
              <input
                type="text"
                required
                value={formData.addressEn}
                onChange={(e) => setFormData({ ...formData, addressEn: e.target.value })}
                placeholder="Haveli Bahadur Shah, Jhang, Punjab, Pakistan"
                className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Tax Rate Percentage (%):</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={formData.taxRatePercent}
                  onChange={(e) => setFormData({ ...formData, taxRatePercent: Number(e.target.value) })}
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-amber-200/90 font-semibold mb-1">Currency Code & Symbol:</label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-100 font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Submit & Reset Bar */}
            <div className="pt-4 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  if (window.confirm('Reset all demo data back to default Hashmi Restaurant initial records?')) {
                    onResetDemoData();
                  }
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-red-950/40 text-gray-400 hover:text-red-400 font-medium flex items-center justify-center gap-2 transition-colors border border-gray-700 hover:border-red-500/30"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Records</span>
              </button>

              <button
                type="submit"
                id="btn-save-settings"
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-all active:scale-95 text-xs tracking-wider uppercase"
              >
                <Save className="w-4 h-4 fill-black" />
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Developer Attribution & Links Card */}
        <div className="bg-[#12141A] border border-amber-500/20 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-xl">
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0B0E]">
                  <img
                    src={formData.portraitUrl || DEFAULT_PORTRAIT_URL}
                    alt="Usama Saif"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <div>
                <h4 className="font-extrabold text-white text-base font-cinzel text-gold-gradient">
                  {hotelSettings.developer.name}
                </h4>
                <p className="text-xs text-amber-400 font-semibold">{hotelSettings.developer.brand}</p>
              </div>
            </div>

            <div className="p-4 bg-[#0A0B0E] rounded-2xl border border-amber-500/20 text-xs space-y-2 text-gray-300 mb-4">
              <p>📍 <strong>Location:</strong> {hotelSettings.developer.address}</p>
              <p>📞 <strong>Direct Contact:</strong> <span className="font-mono text-amber-300 font-bold">{hotelSettings.developer.phone}</span></p>
              <p>💻 <strong>Specialization:</strong> Desktop Software, POS Systems, Web & Cloud Tools</p>
            </div>

            <div className="space-y-2 text-xs">
              <a
                href={hotelSettings.developer.links.youtube}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A0B0E] hover:bg-[#1A1D24] border border-amber-500/20 text-gray-200 hover:text-amber-300 transition-colors"
              >
                <span>▶️ YouTube: @gsm_by_us</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>

              <a
                href={hotelSettings.developer.links.whatsappGroup}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A0B0E] hover:bg-[#1A1D24] border border-amber-500/20 text-gray-200 hover:text-green-300 transition-colors"
              >
                <span>💬 WhatsApp Support Community</span>
                <ExternalLink className="w-3.5 h-3.5 text-green-400" />
              </a>

              <a
                href={hotelSettings.developer.links.telegram}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A0B0E] hover:bg-[#1A1D24] border border-amber-500/20 text-gray-200 hover:text-blue-300 transition-colors"
              >
                <span>✈️ Telegram Official Channel</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              </a>

              <a
                href={hotelSettings.developer.links.blog}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A0B0E] hover:bg-[#1A1D24] border border-amber-500/20 text-gray-200 hover:text-yellow-300 transition-colors"
              >
                <span>🌐 Developer Blog & Tool Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              </a>
            </div>
          </div>

          <div className="pt-3 border-t border-amber-500/20 text-[11px] text-gray-400 text-center font-cinzel">
            HASHMI RESTAURANT MANAGEMENT • DEVELOPER EDITION
          </div>
        </div>
      </div>
    </div>
  );
};
