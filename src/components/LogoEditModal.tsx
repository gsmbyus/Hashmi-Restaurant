import React, { useState } from 'react';
import { Image as ImageIcon, Upload, RefreshCw, Check, X, Sparkles, Crown } from 'lucide-react';
import { HotelSettings } from '../types';
import { DEFAULT_LOGO_URL } from '../data/initialData';
import { playClickSound, playSuccessSound } from '../utils/audio';

interface LogoEditModalProps {
  hotelSettings: HotelSettings;
  onSaveLogo: (newLogoUrl: string) => void;
  onClose: () => void;
}

export const LogoEditModal: React.FC<LogoEditModalProps> = ({
  hotelSettings,
  onSaveLogo,
  onClose
}) => {
  const [logoInput, setLogoInput] = useState<string>(hotelSettings.logoUrl || DEFAULT_LOGO_URL);
  const [previewUrl, setPreviewUrl] = useState<string>(hotelSettings.logoUrl || DEFAULT_LOGO_URL);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playClickSound();
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setLogoInput(result);
        setPreviewUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setLogoInput(url);
    setPreviewUrl(url);
  };

  const handleResetToDefault = () => {
    playClickSound();
    setLogoInput(DEFAULT_LOGO_URL);
    setPreviewUrl(DEFAULT_LOGO_URL);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessSound();
    onSaveLogo(previewUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 select-none animate-fade-in">
      <div className="bg-[#12141A] border border-amber-500/40 rounded-3xl w-full max-w-md shadow-2xl p-6 relative overflow-hidden">
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-[#0A0B0E] rounded-[10px] flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-cinzel tracking-wide">
                Custom Logo Editor
              </h3>
              <p className="text-[11px] text-amber-200/70">
                Upload or customize the restaurant brand emblem
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Logo Preview Box */}
        <div className="my-5 p-4 bg-[#0A0B0E] rounded-2xl border border-amber-500/30 flex flex-col items-center justify-center text-center">
          <div className="relative group">
            <div className="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 shadow-xl">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#07080B] p-0.5 border border-amber-400/80 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Logo Preview"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  onError={() => setPreviewUrl(DEFAULT_LOGO_URL)}
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <h4 className="text-sm font-bold font-cinzel text-gold-gradient uppercase">
              {hotelSettings.hotelNameEn || 'HASHMI RESTAURANT'}
            </h4>
            <p className="text-[11px] text-gray-400 font-serif">
              Live preview of logo on crest frame
            </p>
          </div>
        </div>

        {/* Tabs: File Upload vs URL */}
        <div className="flex bg-[#0A0B0E] p-1 rounded-xl border border-amber-500/20 mb-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Image File (PNG/JPG)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Image Web URL</span>
          </button>
        </div>

        {/* Input Methods */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {activeTab === 'upload' ? (
            <div className="space-y-2">
              <label className="block text-gray-300 font-medium">Choose logo file from your device:</label>
              <div className="relative border-2 border-dashed border-amber-500/30 hover:border-amber-400 rounded-2xl p-4 text-center cursor-pointer bg-[#0A0B0E]/60 transition-colors">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Upload className="w-6 h-6 text-amber-400 mx-auto mb-1.5" />
                <p className="text-xs text-amber-200 font-semibold">Click or drag & drop image here</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Supports PNG, JPG, SVG, WebP (Max 5MB)</p>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-gray-300 font-medium mb-1">Direct Image URL:</label>
              <input
                type="url"
                value={logoInput}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full bg-[#0A0B0E] border border-amber-500/30 rounded-xl px-3.5 py-2.5 text-gray-200 focus:outline-none focus:border-amber-400 font-mono text-xs"
              />
            </div>
          )}

          {/* Reset to Default Button */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1.5 transition-colors font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Original Hashmi Crest</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-amber-500/20 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              id="btn-confirm-save-logo"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-950/50 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Logo</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
