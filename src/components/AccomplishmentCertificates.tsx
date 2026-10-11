import React, { useState, useEffect, useRef } from 'react';
import { sound } from '../utils/audio';
import { MPCharacter } from './ChrisCharacter';
import {
  Award,
  Sparkles,
  Printer,
  Download,
  CheckCircle2,
  Trophy,
  Star,
  Crown,
  Heart,
  Share2,
  RotateCcw,
  Plus,
  Trash2,
  Calendar,
  Check,
  Zap,
} from 'lucide-react';

export interface AccomplishmentPreset {
  id: string;
  category: 'Streaks' | 'Daily Habits' | 'Kindness & Growth' | 'Special Milestones';
  title: string;
  badge: string;
  icon: string;
  citation: string;
  theme: 'gold' | 'rainbow' | 'space' | 'emerald';
}

export const PRESET_ACCOMPLISHMENTS: AccomplishmentPreset[] = [
  {
    id: 'super-habit-7',
    category: 'Streaks',
    title: '7-Day Super Habit Hero',
    badge: '⚡ Super Habit Hero Milestone',
    icon: '⚡👑',
    citation: 'For outstanding dedication in completing 7 consecutive days of daily good habits and building super strength!',
    theme: 'gold',
  },
  {
    id: 'habit-14-streak',
    category: 'Streaks',
    title: '14-Day Consistency Master',
    badge: '🏆 Consistency Superstar',
    icon: '🏆⭐',
    citation: 'For maintaining an incredible two-week habit streak and proving that practice makes super habits stick!',
    theme: 'gold',
  },
  {
    id: 'teeth-hero',
    category: 'Daily Habits',
    title: 'Dental Hero & Sugar Bug Buster',
    badge: '🪥 Sparkling Smile Honor',
    icon: '🪥✨',
    citation: 'For brushing teeth thoroughly for 2 full minutes morning and night and banishing all sneaky sugar bugs!',
    theme: 'rainbow',
  },
  {
    id: 'veggie-champion',
    category: 'Daily Habits',
    title: 'Veggie Power Plate Champion',
    badge: '🥦 Super Nutrition Award',
    icon: '🥦🥕',
    citation: 'For powering up muscles and energy by joyfully eating crunchy rainbow veggies, broccoli, and fresh fruit!',
    theme: 'emerald',
  },
  {
    id: 'tidy-room',
    category: 'Daily Habits',
    title: 'Super Tidy Room Master',
    badge: '🧸 Responsibility Star',
    icon: '🧸🚗',
    citation: 'For independently packing toys, blocks, and racecars neatly into the chest and keeping the playroom safe!',
    theme: 'rainbow',
  },
  {
    id: 'sweet-machine-grad',
    category: 'Special Milestones',
    title: 'Magical Sweet Machine Graduate',
    badge: '🍬 Good Habits Master',
    icon: '🍬🍭',
    citation: 'For successfully conquering all daily good habit missions and unlocking the magical golden sweet machine treats!',
    theme: 'rainbow',
  },
  {
    id: 'kindness-sharing',
    category: 'Kindness & Growth',
    title: 'Kindness & Sharing Ambassador',
    badge: '🤝 Heart of Gold Award',
    icon: '🤝❤️',
    citation: 'For demonstrating wonderful kindness, sharing favorite toys, taking turns, and making friends smile!',
    theme: 'rainbow',
  },
  {
    id: 'bedtime-star',
    category: 'Daily Habits',
    title: 'Peaceful Bedtime Routine Star',
    badge: '🌙 Sweet Dreams Champion',
    icon: '🌙🐻',
    citation: 'For mastering the bedtime routine: warm bubble bath, cozy pajamas, and drifting peacefully to sleep with happy dreams!',
    theme: 'space',
  },
  {
    id: 'bravery-doctor',
    category: 'Special Milestones',
    title: 'Super Brave Kid Award',
    badge: '🦸 Courage & Bravery Medal',
    icon: '🦸‍♂️⭐',
    citation: 'For showing tremendous courage, a brave heart, and a big smile during doctor visits and new adventures!',
    theme: 'gold',
  },
  {
    id: 'potty-master',
    category: 'Special Milestones',
    title: 'Big Kid Milestone Award',
    badge: '🌟 Growing Up Superstar',
    icon: '🌟🎉',
    citation: 'For learning big-kid independence, listening to body cues, and celebrating awesome everyday victories!',
    theme: 'rainbow',
  },
];

export interface SavedCertificate {
  id: string;
  childName: string;
  accomplishmentTitle: string;
  badge: string;
  icon: string;
  citation: string;
  coSigner: string;
  dateStr: string;
  theme: 'gold' | 'rainbow' | 'space' | 'emerald';
  createdAt: number;
}

interface AccomplishmentCertificatesProps {
  initialAccomplishmentId?: string;
  onClose?: () => void;
  onEarnSticker?: (stickerId: string) => void;
}

export const AccomplishmentCertificates: React.FC<AccomplishmentCertificatesProps> = ({
  initialAccomplishmentId,
  onClose,
  onEarnSticker,
}) => {
  // Preset or custom state
  const initialPreset =
    PRESET_ACCOMPLISHMENTS.find((p) => p.id === initialAccomplishmentId) ||
    PRESET_ACCOMPLISHMENTS[0];

  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPreset.id);
  const [childName, setChildName] = useState<string>('Liam');
  const [accomplishmentTitle, setAccomplishmentTitle] = useState<string>(initialPreset.title);
  const [badgeText, setBadgeText] = useState<string>(initialPreset.badge);
  const [iconEmoji, setIconEmoji] = useState<string>(initialPreset.icon);
  const [citationText, setCitationText] = useState<string>(initialPreset.citation);
  const [coSignerName, setCoSignerName] = useState<string>('Mom & Dad ❤️');
  const [awardDate, setAwardDate] = useState<string>(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  });
  const [certificateTheme, setCertificateTheme] = useState<'gold' | 'rainbow' | 'space' | 'emerald'>(
    initialPreset.theme
  );
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState<string | null>(null);

  // Saved Certificates Hall of Fame
  const [savedCertificates, setSavedCertificates] = useState<SavedCertificate[]>(() => {
    try {
      const saved = localStorage.getItem('mp_certificates');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        id: 'cert-sample-1',
        childName: 'Liam',
        accomplishmentTitle: '7-Day Super Habit Hero',
        badge: '⚡ Super Habit Hero Milestone',
        icon: '⚡👑',
        citation: 'For outstanding dedication in completing 7 consecutive days of daily good habits and building super strength!',
        coSigner: 'Mom & Dad ❤️',
        dateStr: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        theme: 'gold',
        createdAt: Date.now() - 86400000,
      },
    ];
  });

  const [viewTab, setViewTab] = useState<'creator' | 'hallOfFame'>('creator');
  const certificateRef = useRef<HTMLDivElement>(null);

  // Quick child name suggestions
  const quickNames = ['Liam', 'Emma', 'Noah', 'Olivia', 'Lucas', 'Mia', 'MP', 'My Champion'];

  // Handle preset selection
  const handleSelectPreset = (preset: AccomplishmentPreset) => {
    sound.playSfx('pop');
    setSelectedPresetId(preset.id);
    setAccomplishmentTitle(preset.title);
    setBadgeText(preset.badge);
    setIconEmoji(preset.icon);
    setCitationText(preset.citation);
    setCertificateTheme(preset.theme);
    setIsCustomMode(false);
  };

  // Play fanfare and confetti on certificate creation
  const handleCelebrate = () => {
    sound.playSfx('fanfare');
    setTimeout(() => sound.playSfx('cheer'), 400);
    setTimeout(() => sound.playSfx('sparkle'), 800);
    sound.speak(`Congratulations ${childName}! You earned the official certificate for ${accomplishmentTitle}! We are so proud of you!`);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 4500);
  };

  // Save certificate to Hall of Fame
  const handleSaveCertificate = () => {
    sound.playSfx('sparkle');
    sound.playSfx('bell');
    const newCert: SavedCertificate = {
      id: `cert-${Date.now()}`,
      childName: childName.trim() || 'Champion',
      accomplishmentTitle,
      badge: badgeText,
      icon: iconEmoji,
      citation: citationText,
      coSigner: coSignerName,
      dateStr: awardDate,
      theme: certificateTheme,
      createdAt: Date.now(),
    };

    const updated = [newCert, ...savedCertificates];
    setSavedCertificates(updated);
    try {
      localStorage.setItem('mp_certificates', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (onEarnSticker) {
      onEarnSticker('stk-8'); // Unlock Golden Habit Coin if not yet
    }

    setSavedSuccessMessage(`Certificate saved to ${childName}’s Hall of Fame! 🏆`);
    setTimeout(() => setSavedSuccessMessage(null), 3500);
    handleCelebrate();
  };

  // Delete saved certificate
  const handleDeleteSaved = (id: string) => {
    sound.playSfx('pop');
    const updated = savedCertificates.filter((c) => c.id !== id);
    setSavedCertificates(updated);
    try {
      localStorage.setItem('mp_certificates', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Load saved certificate into editor
  const handleLoadSaved = (cert: SavedCertificate) => {
    sound.playSfx('pop');
    setChildName(cert.childName);
    setAccomplishmentTitle(cert.accomplishmentTitle);
    setBadgeText(cert.badge);
    setIconEmoji(cert.icon);
    setCitationText(cert.citation);
    setCoSignerName(cert.coSigner);
    setAwardDate(cert.dateStr);
    setCertificateTheme(cert.theme);
    setViewTab('creator');
  };

  // Trigger high-quality native print (with specialized print-only styling)
  const handlePrint = () => {
    sound.playSfx('sparkle');
    window.print();
  };

  // Get theme styles
  const getThemeStyles = () => {
    switch (certificateTheme) {
      case 'gold':
        return {
          wrapper: 'bg-gradient-to-br from-amber-100 via-amber-50 to-yellow-100 border-[#c59b27] text-amber-950',
          innerBorder: 'border-[#c59b27]',
          cornerAccent: 'text-[#b8860b]',
          sealBg: 'bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-400 text-yellow-950 border-[#855e0a]',
          headerColor: 'text-[#8b5a00]',
          badgeBg: 'bg-amber-500/20 text-amber-900 border-amber-500/40',
          signatureLine: 'border-amber-900/60',
        };
      case 'rainbow':
        return {
          wrapper: 'bg-gradient-to-br from-sky-50 via-white to-pink-50 border-sky-400 text-slate-900',
          innerBorder: 'border-yellow-400',
          cornerAccent: 'text-sky-500',
          sealBg: 'bg-gradient-to-tr from-yellow-400 via-amber-300 to-yellow-400 text-sky-950 border-yellow-500',
          headerColor: 'text-sky-700',
          badgeBg: 'bg-sky-500/15 text-sky-900 border-sky-400/40',
          signatureLine: 'border-sky-800/50',
        };
      case 'space':
        return {
          wrapper: 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-400 text-white',
          innerBorder: 'border-cyan-400',
          cornerAccent: 'text-yellow-300',
          sealBg: 'bg-gradient-to-tr from-cyan-400 via-sky-300 to-yellow-300 text-slate-950 border-cyan-200',
          headerColor: 'text-cyan-300',
          badgeBg: 'bg-cyan-500/20 text-cyan-200 border-cyan-400/40',
          signatureLine: 'border-cyan-300/60',
        };
      case 'emerald':
        return {
          wrapper: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-emerald-500 text-emerald-950',
          innerBorder: 'border-emerald-500',
          cornerAccent: 'text-emerald-600',
          sealBg: 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-emerald-400 text-emerald-950 border-emerald-700',
          headerColor: 'text-emerald-800',
          badgeBg: 'bg-emerald-500/20 text-emerald-900 border-emerald-500/40',
          signatureLine: 'border-emerald-900/60',
        };
    }
  };

  const currentThemeStyles = getThemeStyles();

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-6 text-white animate-in fade-in duration-300">
      {/* Print Stylesheet injection to format 8.5x11 Landscape Certificate */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-certificate, #printable-certificate * {
            visibility: visible;
          }
          #printable-certificate {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 24px;
            box-sizing: border-box;
            background: white !important;
            color: black !important;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          @page {
            size: landscape;
            margin: 0.5cm;
          }
        }
      `}</style>

      {/* Confetti Celebration Banner */}
      {showCelebration && (
        <div className="fixed top-14 inset-x-0 z-50 flex justify-center pointer-events-none animate-in slide-in-from-top duration-300">
          <div className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 text-sky-950 px-6 py-3 rounded-full font-black text-base shadow-2xl flex items-center gap-3 border-4 border-white animate-bounce">
            <Trophy className="w-6 h-6 text-amber-700" />
            <span>🎉 Hooray {childName}! You earned an Official Good Habits Certificate! 🏆✨</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-sky-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Official MP Academy 📜
            </span>
            <span className="text-xs text-yellow-300 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Printable & Frameable
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-yellow-300 mt-1 font-['Fredoka'] drop-shadow-md">
            Certificates of Accomplishment 🏆
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Celebrate good habits, 7-day consistency streaks, and milestones with official personalized certificates signed by MP!
          </p>
        </div>

        {/* Tab Switcher & Action Controls */}
        <div className="flex items-center gap-2 bg-neutral-900 p-1 rounded-2xl border border-white/10">
          <button
            onClick={() => {
              sound.playSfx('pop');
              setViewTab('creator');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'creator'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-sky-950 shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Design Certificate</span>
          </button>
          <button
            onClick={() => {
              sound.playSfx('pop');
              setViewTab('hallOfFame');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewTab === 'hallOfFame'
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md font-black'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Hall of Fame ({savedCertificates.length})</span>
          </button>
        </div>
      </div>

      {savedSuccessMessage && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-sm font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{savedSuccessMessage}</span>
        </div>
      )}

      {/* ================= TAB 1: DESIGN CERTIFICATE ================= */}
      {viewTab === 'creator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Customization Controls (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-5 bg-neutral-900/90 border border-white/10 p-5 sm:p-6 rounded-3xl shadow-xl">
            {/* 1. Recipient Child Name */}
            <div>
              <label className="block text-xs uppercase font-extrabold text-yellow-300 mb-1.5">
                1. Child’s Name (Recipient):
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                placeholder="Enter child's name"
                className="w-full bg-neutral-800 border-2 border-yellow-400/50 focus:border-yellow-400 rounded-xl px-3.5 py-2 text-white font-bold text-base placeholder-slate-500 focus:outline-none shadow-inner"
              />
              {/* Quick Preset Names */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {quickNames.map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      sound.playSfx('pop');
                      setChildName(name);
                    }}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all cursor-pointer ${
                      childName === name
                        ? 'bg-yellow-400 text-sky-950 font-black border-yellow-300 shadow'
                        : 'bg-neutral-800/80 text-slate-300 hover:text-white border-white/10 hover:bg-neutral-700'
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Choose Accomplishment Preset */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs uppercase font-extrabold text-yellow-300">
                  2. Choose Accomplishment:
                </label>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSfx('pop');
                    setIsCustomMode(!isCustomMode);
                  }}
                  className="text-[11px] text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer"
                >
                  {isCustomMode ? 'Use Presets' : '✏️ Custom Award'}
                </button>
              </div>

              {!isCustomMode ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {PRESET_ACCOMPLISHMENTS.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-2xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                        selectedPresetId === preset.id && !isCustomMode
                          ? 'bg-amber-500/20 border-yellow-400 shadow-md ring-2 ring-yellow-400/40'
                          : 'bg-neutral-800/60 border-white/10 hover:bg-neutral-800'
                      }`}
                    >
                      <span className="text-2xl shrink-0">{preset.icon}</span>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{preset.title}</div>
                        <div className="text-[10px] text-yellow-200/80 line-clamp-1">{preset.category}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 p-3 bg-neutral-800/80 rounded-2xl border border-white/10">
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      Accomplishment Title:
                    </label>
                    <input
                      type="text"
                      value={accomplishmentTitle}
                      onChange={(e) => setAccomplishmentTitle(e.target.value)}
                      placeholder="e.g. Mastered Tying Shoes!"
                      className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-bold block mb-1">
                      Badge / Medal Tagline:
                    </label>
                    <input
                      type="text"
                      value={badgeText}
                      onChange={(e) => setBadgeText(e.target.value)}
                      placeholder="e.g. 🌟 Super Independence Star"
                      className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white font-bold focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="w-1/3">
                      <label className="text-[11px] text-slate-300 font-bold block mb-1">Emoji Icon:</label>
                      <input
                        type="text"
                        value={iconEmoji}
                        onChange={(e) => setIconEmoji(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-1.5 text-base text-center focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[11px] text-slate-300 font-bold block mb-1">Citation Note:</label>
                      <textarea
                        rows={2}
                        value={citationText}
                        onChange={(e) => setCitationText(e.target.value)}
                        placeholder="Write a sweet encouraging sentence..."
                        className="w-full bg-neutral-900 border border-white/20 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Certificate Theme & Border Style */}
            <div>
              <label className="block text-xs uppercase font-extrabold text-yellow-300 mb-1.5">
                3. Certificate Style Theme:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'gold', name: 'Royal Gold', color: 'bg-amber-400 text-amber-950', icon: '👑' },
                  { id: 'rainbow', name: 'Sweet Candy', color: 'bg-sky-400 text-sky-950', icon: '🍭' },
                  { id: 'space', name: 'Galaxy Stars', color: 'bg-indigo-600 text-white', icon: '🚀' },
                  { id: 'emerald', name: 'Healthy Green', color: 'bg-emerald-500 text-white', icon: '🥦' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      sound.playSfx('pop');
                      setCertificateTheme(th.id as any);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      certificateTheme === th.id
                        ? 'border-yellow-400 ring-2 ring-yellow-400/50 scale-102 shadow-md'
                        : 'border-white/10 opacity-70 hover:opacity-100 bg-neutral-800'
                    }`}
                  >
                    <span className="text-xl block">{th.icon}</span>
                    <span className="text-[10px] font-bold block mt-0.5">{th.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Signature & Date Details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-300 mb-1">
                  Parent / Teacher Co-Signer:
                </label>
                <input
                  type="text"
                  value={coSignerName}
                  onChange={(e) => setCoSignerName(e.target.value)}
                  placeholder="Mom & Dad ❤️"
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase font-bold text-slate-300 mb-1">
                  Award Date:
                </label>
                <input
                  type="text"
                  value={awardDate}
                  onChange={(e) => setAwardDate(e.target.value)}
                  className="w-full bg-neutral-800 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white font-semibold focus:border-yellow-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              {/* Save & Celebrate Button */}
              <button
                type="button"
                onClick={handleSaveCertificate}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 text-sky-950 font-black text-sm shadow-xl border-2 border-white flex items-center justify-center gap-2 cursor-pointer transform active:scale-95 transition-all"
              >
                <Trophy className="w-4 h-4 text-amber-800" />
                <span>Save & Award Certificate! 🏆</span>
              </button>

              {/* Print Button */}
              <button
                type="button"
                onClick={handlePrint}
                className="py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 text-sky-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer border border-sky-300"
                title="Print ready for fridge or frame"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate 🖨️</span>
              </button>
            </div>
          </div>

          {/* RIGHT: LIVE INTERACTIVE CERTIFICATE PREVIEW (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Quick Preview Header Helper */}
            <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
              <span className="font-bold flex items-center gap-1.5 text-yellow-300">
                <Sparkles className="w-4 h-4" /> Official 8.5" x 11" Frameable Certificate Preview
              </span>
              <button
                type="button"
                onClick={handleCelebrate}
                className="text-xs text-yellow-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
              >
                <span>Replay Fanfare 🎉</span>
              </button>
            </div>

            {/* THE PRINTABLE CERTIFICATE CANVAS */}
            <div
              id="printable-certificate"
              ref={certificateRef}
              className={`w-full relative rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl border-8 select-none transition-all duration-300 ${currentThemeStyles.wrapper}`}
              style={{ aspectRatio: '1.414 / 1' }}
            >
              {/* Inner Decorative Double Border with Vintage Corner Accents */}
              <div
                className={`w-full h-full border-4 border-dashed rounded-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden ${currentThemeStyles.innerBorder}`}
              >
                {/* Corner Floral / Star Ornaments */}
                <span className={`absolute top-2 left-2 text-2xl select-none ${currentThemeStyles.cornerAccent}`}>
                  ✦
                </span>
                <span className={`absolute top-2 right-2 text-2xl select-none ${currentThemeStyles.cornerAccent}`}>
                  ✦
                </span>
                <span className={`absolute bottom-2 left-2 text-2xl select-none ${currentThemeStyles.cornerAccent}`}>
                  ✦
                </span>
                <span className={`absolute bottom-2 right-2 text-2xl select-none ${currentThemeStyles.cornerAccent}`}>
                  ✦
                </span>

                {/* Background Pattern Elements */}
                <div className="absolute inset-0 opacity-5 pointer-events-none flex flex-wrap gap-8 items-center justify-around p-8 text-4xl">
                  <span>⭐</span>
                  <span>🏆</span>
                  <span>🍬</span>
                  <span>🚀</span>
                  <span>⭐</span>
                  <span>🪥</span>
                  <span>🥦</span>
                  <span>❤️</span>
                  <span>⭐</span>
                </div>

                {/* 1. TOP HEADER & LOGO */}
                <div className="text-center relative z-10">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <span className="text-xl">⭐</span>
                    <span className="text-xs sm:text-sm font-black tracking-widest uppercase opacity-80 font-mono">
                      MP SHOW • GOOD HABITS ACADEMY
                    </span>
                    <span className="text-xl">⭐</span>
                  </div>

                  <h1
                    className={`text-2xl sm:text-4xl md:text-5xl font-black tracking-wider uppercase font-['Fredoka'] drop-shadow-sm ${currentThemeStyles.headerColor}`}
                  >
                    Certificate of Accomplishment
                  </h1>

                  <div className="text-[11px] sm:text-xs font-bold tracking-wider uppercase opacity-75 mt-0.5">
                    PRESENTED WITH PRIDE & ADMIRATION TO
                  </div>
                </div>

                {/* 2. RECIPIENT CHILD NAME IN GLAMOROUS DISPLAY FONT */}
                <div className="text-center my-1 sm:my-2 relative z-10">
                  <div className="inline-block relative">
                    <span className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wide font-['Fredoka'] drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700">
                      {childName.trim() || 'Awesome Kid'}
                    </span>
                    {/* Golden underline with star */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-1" />
                  </div>

                  <p className="text-xs sm:text-sm font-extrabold uppercase tracking-wide opacity-80 mt-1">
                    For extraordinary effort and proudly accomplishing:
                  </p>
                </div>

                {/* 3. ACCOMPLISHMENT BADGE & CITATION */}
                <div className="text-center relative z-10 max-w-xl mx-auto my-1">
                  {/* Big Accomplishment Pill */}
                  <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border-2 shadow-sm font-black text-sm sm:text-lg mb-2 bg-white/70 backdrop-blur-xs">
                    <span className="text-2xl sm:text-3xl animate-bounce">{iconEmoji}</span>
                    <span className="tracking-tight">{accomplishmentTitle}</span>
                  </div>

                  {/* Encouraging Citation */}
                  <p className="text-xs sm:text-sm font-semibold italic leading-relaxed opacity-90 px-4">
                    “{citationText}”
                  </p>
                </div>

                {/* 4. BOTTOM SIGNATURES, DATE, AND OFFICIAL GOLDEN EMBOSSED SEAL */}
                <div className="relative z-10 grid grid-cols-3 items-end pt-3 sm:pt-4 border-t-2 border-dashed border-current/20">
                  {/* Left: Parent / Guardian Signature */}
                  <div className="text-center">
                    <div className="font-['Fredoka'] text-sm sm:text-base font-bold text-amber-700 italic">
                      {coSignerName}
                    </div>
                    <div className={`w-3/4 mx-auto border-t-2 mt-1 mb-0.5 ${currentThemeStyles.signatureLine}`} />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-70 block">
                      Parent / Guardian Co-Signer
                    </span>
                  </div>

                  {/* Center: Official Embossed Radial Golden Ribbon Seal */}
                  <div className="flex flex-col items-center justify-center -mb-2">
                    <div
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 shadow-xl flex flex-col items-center justify-center transform hover:scale-110 transition-transform ${currentThemeStyles.sealBg}`}
                    >
                      {/* Sunburst Teeth Pattern */}
                      <span className="text-2xl sm:text-3xl drop-shadow">⭐</span>
                      <span className="text-[7px] sm:text-[8px] font-black tracking-tighter uppercase text-center leading-none mt-0.5">
                        VERIFIED
                        <br />
                        EXCELLENCE
                      </span>
                      {/* Ribbon tails hanging down */}
                      <div className="absolute -bottom-2 -left-1 w-3 h-4 bg-amber-500 rounded-bl transform -rotate-12" />
                      <div className="absolute -bottom-2 -right-1 w-3 h-4 bg-amber-500 rounded-br transform rotate-12" />
                    </div>
                    <span className="text-[9px] font-mono font-bold mt-1 opacity-70">{awardDate}</span>
                  </div>

                  {/* Right: MP's Official Character Signature */}
                  <div className="text-center flex flex-col items-center">
                    <div className="flex items-center justify-center gap-1.5 font-['Fredoka'] text-sm sm:text-base font-black text-amber-600">
                      <span>MP ⭐</span>
                      <span className="text-xs opacity-75 font-normal">(Show Host)</span>
                    </div>
                    <div className={`w-3/4 mx-auto border-t-2 mt-1 mb-0.5 ${currentThemeStyles.signatureLine}`} />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-70 block">
                      MP Good Habits Club
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Share / Print Help Bar */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300">
              <span className="flex items-center gap-1 bg-neutral-800/80 px-3 py-1 rounded-full border border-white/10">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Print-ready landscape PDF / paper
              </span>
              <span className="flex items-center gap-1 bg-neutral-800/80 px-3 py-1 rounded-full border border-white/10">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Fits standard 8.5" x 11" fridge magnets
              </span>
              <span className="flex items-center gap-1 bg-neutral-800/80 px-3 py-1 rounded-full border border-white/10">
                <Check className="w-3.5 h-3.5 text-emerald-400" /> Preserves child accomplishment history
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: HALL OF FAME (SAVED CERTIFICATES) ================= */}
      {viewTab === 'hallOfFame' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-yellow-300 font-['Fredoka']">
                🏆 Hall of Fame: Earned Certificates ({savedCertificates.length})
              </h3>
              <p className="text-xs text-slate-300">
                All certificates created for your family or students are preserved here for reprinting and sharing!
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                sound.playSfx('pop');
                setViewTab('creator');
              }}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-sky-950 font-black text-xs rounded-xl flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Certificate</span>
            </button>
          </div>

          {savedCertificates.length === 0 ? (
            <div className="text-center py-16 bg-neutral-900/60 rounded-3xl border border-white/10">
              <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-3" />
              <h4 className="text-lg font-bold text-white">No certificates saved yet!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Design your child's first certificate of accomplishment and hit "Save & Award" to start your trophy wall!
              </p>
              <button
                type="button"
                onClick={() => setViewTab('creator')}
                className="px-5 py-2.5 bg-yellow-400 text-sky-950 font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                Design a Certificate Now ⭐
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-lg flex flex-col justify-between hover:border-yellow-400/40 transition-all group"
                >
                  <div>
                    {/* Header with Child Name & Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-3xl">{cert.icon}</span>
                        <div>
                          <h4 className="font-black text-lg text-white font-['Fredoka']">
                            {cert.childName}
                          </h4>
                          <span className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider block">
                            {cert.dateStr}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs bg-yellow-400/20 text-yellow-300 font-bold px-2 py-0.5 rounded-full border border-yellow-400/30">
                        Official ⭐
                      </span>
                    </div>

                    {/* Accomplishment title */}
                    <div className="bg-neutral-800/80 p-3 rounded-2xl border border-white/5 mb-3">
                      <div className="text-xs font-extrabold text-white mb-0.5">
                        {cert.accomplishmentTitle}
                      </div>
                      <p className="text-[11px] text-slate-300 italic line-clamp-2">
                        “{cert.citation}”
                      </p>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Co-Signed by: <span className="text-slate-200 font-bold">{cert.coSigner}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleLoadSaved(cert)}
                      className="flex-1 py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-yellow-300 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>View & Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleLoadSaved(cert);
                        setTimeout(() => handlePrint(), 200);
                      }}
                      className="py-1.5 px-3 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold text-xs rounded-xl border border-sky-400/30 transition-colors cursor-pointer flex items-center justify-center gap-1"
                      title="Print certificate"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSaved(cert.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Delete saved certificate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
