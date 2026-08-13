import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Volume2, VolumeX, ArrowRight, Play } from 'lucide-react';
import { playRoyalIntroSound } from '../utils/audio';
import { DEFAULT_LOGO_URL } from '../data/initialData';

interface IntroScreenProps {
  logoUrl?: string;
  restaurantTitle?: string;
  tagline?: string;
  onFinish: () => void;
}

export function IntroScreen({
  logoUrl = DEFAULT_LOGO_URL,
  restaurantTitle = 'HASHMI RESTAURANT',
  tagline = 'Taste That Brings You Back • Premium Luxury Restaurant Management System',
  onFinish
}: IntroScreenProps) {
  const [progress, setProgress] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<string>('Initializing Royal Engine...');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    // Attempt royal fanfare sound
    const timerAudio = setTimeout(() => {
      if (soundEnabled) {
        playRoyalIntroSound();
      }
    }, 400);

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = prev + 2;
        if (next < 25) setCurrentStep('👑 Initializing Luxury Restaurant Engine...');
        else if (next < 55) setCurrentStep('🍽️ Loading Table & Room Reservation Matrix...');
        else if (next < 80) setCurrentStep('💎 Synchronizing POS & Financial Ledgers...');
        else if (next < 98) setCurrentStep('✨ Activating GSM_BY_US Cloud Workspace...');
        else setCurrentStep('✅ Hashmi Restaurant System Ready!');
        return next;
      });
    }, 45);

    return () => {
      clearTimeout(timerAudio);
      clearInterval(interval);
    };
  }, [soundEnabled]);

  // Auto transition when progress reaches 100% after slight delay
  useEffect(() => {
    if (progress >= 100) {
      const finishTimer = setTimeout(() => {
        onFinish();
      }, 800);
      return () => clearTimeout(finishTimer);
    }
  }, [progress, onFinish]);

  const handleManualEnter = () => {
    if (soundEnabled && !hasInteracted) {
      playRoyalIntroSound();
    }
    setHasInteracted(true);
    onFinish();
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) {
      playRoyalIntroSound();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080B] text-white overflow-hidden select-none">
      {/* Royal Ambient Gold Lighting */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[650px] h-[650px] bg-gradient-to-b from-[#D4AF37]/20 via-[#B8860B]/10 to-transparent rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Gold Sparkle Stars Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none" />

      {/* Controls Bar Top */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <button
          onClick={handleToggleSound}
          id="btn-intro-sound"
          className="px-3.5 py-1.5 rounded-full bg-[#16181E] border border-amber-500/30 text-amber-300 hover:text-amber-200 text-xs flex items-center gap-2 transition-all hover:border-amber-400/60"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-gray-400" />}
          <span>{soundEnabled ? 'Sound: ON' : 'Sound: OFF'}</span>
        </button>

        <button
          onClick={handleManualEnter}
          id="btn-skip-intro"
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg shadow-amber-950/40 active:scale-95"
        >
          <span>Skip Intro</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Logo & Crest Hero Container */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl px-6">
        {/* Crown Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1A1D24] border border-amber-500/40 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-6 shadow-lg shadow-amber-950/50 animate-bounce">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>Royal Culinary & Hotel Management</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        </div>

        {/* Circular Gold Medallion Logo Frame with Glow */}
        <div className="relative mb-6 group cursor-pointer" onClick={() => { playRoyalIntroSound(); }}>
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-1000 animate-pulse" />
          
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full p-1.5 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-300 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-[#0A0B0E] p-1 border-2 border-amber-400/80 flex items-center justify-center">
              <img
                src={logoUrl || DEFAULT_LOGO_URL}
                alt={restaurantTitle}
                className="w-full h-full object-cover rounded-full transform transition duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Restaurant Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-cinzel tracking-wider text-gold-gradient uppercase drop-shadow-md">
          {restaurantTitle}
        </h1>

        {/* Subtitle / Tagline */}
        <p className="text-xs sm:text-sm text-amber-200/80 font-serif mt-2 max-w-md leading-relaxed tracking-wide">
          {tagline}
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full max-w-sm mt-8 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-amber-300/80 font-mono">
            <span className="truncate max-w-[260px]">{currentStep}</span>
            <span className="font-bold">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-[#16181F] rounded-full overflow-hidden p-0.5 border border-amber-500/30">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 transition-all duration-100 shadow-[0_0_12px_rgba(212,175,55,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Enter Button when ready */}
        <div className="mt-8">
          <button
            onClick={handleManualEnter}
            id="btn-intro-enter-now"
            className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-sm tracking-wider uppercase flex items-center gap-2.5 shadow-xl shadow-amber-950/60 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <Play className="w-4 h-4 fill-black" />
            <span>Enter Management Portal</span>
          </button>
        </div>

        {/* Developer Attribution Signature */}
        <div className="mt-8 pt-4 border-t border-amber-500/20 text-[11px] text-gray-400 text-center space-y-1">
          <p className="text-amber-400/90 font-medium">
            Developed & Maintained by <span className="font-bold text-amber-300">Usama Saif</span> • Brand: <span className="text-white font-semibold">GSM_BY_US</span>
          </p>
          <p className="text-[10px] text-gray-500">
            Haveli Bahadur Shah, Jhang, Punjab, Pakistan • +92 347 7669235
          </p>
        </div>
      </div>
    </div>
  );
}
