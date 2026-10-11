import React, { useState, useEffect } from 'react';
import {
  WARDROBE_ITEMS,
  WardrobeItem,
  UserWardrobeState,
  DEFAULT_WARDROBE_STATE,
} from '../data/wardrobe';
import { MPCharacter } from './ChrisCharacter';
import { sound } from '../utils/audio';
import { Sparkles, Flame, Check, Lock, Shirt, Award, RotateCcw } from 'lucide-react';

interface WardrobeStudioProps {
  currentStreak: number;
  onWardrobeChange?: (newWardrobe: UserWardrobeState) => void;
  onOpenCalendar?: () => void;
}

export const WardrobeStudio: React.FC<WardrobeStudioProps> = ({
  currentStreak,
  onWardrobeChange,
  onOpenCalendar,
}) => {
  const [wardrobe, setWardrobe] = useState<UserWardrobeState>(() => {
    try {
      const saved = localStorage.getItem('mp_wardrobe_state');
      return saved ? JSON.parse(saved) : DEFAULT_WARDROBE_STATE;
    } catch {
      return DEFAULT_WARDROBE_STATE;
    }
  });

  const [activeCategory, setActiveCategory] = useState<'outfit' | 'hat' | 'accessory'>('outfit');
  const [previewExpression, setPreviewExpression] = useState<'happy' | 'excited' | 'cheering'>('happy');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Sync wardrobe changes to localStorage
  const handleSelectItem = (item: WardrobeItem) => {
    const isUnlocked = currentStreak >= item.streakRequired;
    if (!isUnlocked) {
      sound.playSfx('boing');
      sound.speak(`Keep your habit streak going! This unlocks at a ${item.streakRequired}-day streak!`);
      return;
    }

    sound.playSfx('sparkle');
    sound.playSfx('pop');

    let updated: UserWardrobeState;
    if (item.category === 'outfit') {
      updated = { ...wardrobe, selectedOutfitId: item.id };
    } else if (item.category === 'hat') {
      updated = { ...wardrobe, selectedHatId: item.id };
    } else {
      updated = { ...wardrobe, selectedAccessoryId: item.id };
    }

    setWardrobe(updated);
    try {
      localStorage.setItem('mp_wardrobe_state', JSON.stringify(updated));
    } catch {
      // ignore
    }

    if (onWardrobeChange) {
      onWardrobeChange(updated);
    }

    setSuccessToast(`Equipped ${item.name}! ✨`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleResetDefaults = () => {
    sound.playSfx('pop');
    setWardrobe(DEFAULT_WARDROBE_STATE);
    try {
      localStorage.setItem('mp_wardrobe_state', JSON.stringify(DEFAULT_WARDROBE_STATE));
    } catch {
      // ignore
    }
    if (onWardrobeChange) onWardrobeChange(DEFAULT_WARDROBE_STATE);
    setSuccessToast('Reset to Classic Sunshine Polo!');
    setTimeout(() => setSuccessToast(null), 2000);
  };

  const filteredItems = WARDROBE_ITEMS.filter((item) => item.category === activeCategory);

  const selectedItemForCategory = (() => {
    if (activeCategory === 'outfit') {
      return WARDROBE_ITEMS.find((i) => i.id === wardrobe.selectedOutfitId);
    }
    if (activeCategory === 'hat') {
      return WARDROBE_ITEMS.find((i) => i.id === wardrobe.selectedHatId);
    }
    return WARDROBE_ITEMS.find((i) => i.id === wardrobe.selectedAccessoryId);
  })();

  const totalUnlocked = WARDROBE_ITEMS.filter((i) => currentStreak >= i.streakRequired).length;

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 text-white animate-in fade-in">
      {/* Top Banner / Streak Status */}
      <div className="bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-yellow-300 relative overflow-hidden mb-8">
        <div className="absolute top-2 right-4 text-7xl opacity-20 pointer-events-none select-none">
          🎨
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-yellow-400 text-sky-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow">
                <Shirt className="w-3.5 h-3.5 fill-current" />
                MP Dress-Up Studio
              </span>
              <span className="bg-orange-500/80 text-white font-extrabold text-xs px-3 py-1 rounded-full flex items-center gap-1 border border-orange-300">
                <Flame className="w-3.5 h-3.5 fill-current" />
                {currentStreak}-Day Streak Active!
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-yellow-300 font-['Fredoka']">
              Customize MP’s Colorful Wardrobe! 🌈
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mt-1">
              Practice your good habits every day to build streaks and unlock dazzling new polos,
              firefighter gear, royal crowns, and superhero capes!
            </p>
          </div>

          {/* Quick Streak Progress Box */}
          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 w-full md:w-auto">
            <div className="text-xs text-sky-200 font-bold mb-1">Wardrobe Unlocked:</div>
            <div className="text-2xl font-black text-yellow-300">
              {totalUnlocked} / {WARDROBE_ITEMS.length} Items
            </div>
            {onOpenCalendar && (
              <button
                type="button"
                onClick={onOpenCalendar}
                className="mt-2 text-xs font-black text-yellow-300 hover:text-yellow-200 underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <span>Check Habit Streaks in Calendar 📅</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Studio View: Character Stage on Left, Wardrobe Rack on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* --- LEFT: MP LIVE PREVIEW STAGE --- */}
        <div className="lg:col-span-5 bg-gradient-to-b from-sky-900/80 to-blue-950/90 rounded-3xl p-6 border-2 border-sky-400/50 shadow-2xl flex flex-col items-center text-center relative">
          <div className="text-xs font-black uppercase tracking-wider text-yellow-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            Live Show Wardrobe Preview
          </div>

          {/* Expression switcher */}
          <div className="flex items-center gap-2 mb-4 bg-sky-950/70 p-1.5 rounded-full border border-sky-400/30">
            {(['happy', 'excited', 'cheering'] as const).map((expr) => (
              <button
                key={expr}
                type="button"
                onClick={() => {
                  sound.playSfx('pop');
                  setPreviewExpression(expr);
                }}
                className={`px-3 py-1 rounded-full text-xs font-extrabold capitalize transition-all cursor-pointer ${
                  previewExpression === expr
                    ? 'bg-yellow-400 text-sky-950 shadow scale-105'
                    : 'text-sky-200 hover:text-white'
                }`}
              >
                {expr === 'happy' ? '😊 Happy' : expr === 'excited' ? '🤩 Excited' : '🎉 Cheering'}
              </button>
            ))}
          </div>

          {/* Big MP Character with equipped wardrobe */}
          <div className="my-2 p-4 bg-radial from-yellow-300/20 via-sky-500/10 to-transparent rounded-full transform hover:scale-105 transition-transform duration-300">
            <MPCharacter
              expression={previewExpression}
              size="xl"
              wardrobe={wardrobe}
              animate
            />
          </div>

          {/* Current Outfit Name Badge */}
          <div className="mt-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-yellow-300/50 shadow">
            <div className="text-[11px] text-sky-300 font-bold uppercase">Equipped Style:</div>
            <div className="text-base font-black text-yellow-300">
              {selectedItemForCategory?.name || 'Classic Sunshine Polo'}
            </div>
            <div className="text-xs text-slate-300 mt-0.5">
              {selectedItemForCategory?.description}
            </div>
          </div>

          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="mt-4 text-xs text-sky-300 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Default Classic Look
          </button>
        </div>

        {/* --- RIGHT: WARDROBE RACK & CATEGORY TABS --- */}
        <div className="lg:col-span-7 space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-neutral-900/90 rounded-2xl border border-white/10 shadow-lg">
            <button
              type="button"
              onClick={() => {
                sound.playSfx('pop');
                setActiveCategory('outfit');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeCategory === 'outfit'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-sky-950 shadow-lg scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>👕</span>
              <span>Colorful Polos</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSfx('pop');
                setActiveCategory('hat');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeCategory === 'hat'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-sky-950 shadow-lg scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>🧢</span>
              <span>Hats & Crowns</span>
            </button>
            <button
              type="button"
              onClick={() => {
                sound.playSfx('pop');
                setActiveCategory('accessory');
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                activeCategory === 'accessory'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-sky-950 shadow-lg scale-102'
                  : 'text-slate-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              <span>🦸</span>
              <span>Accessories</span>
            </button>
          </div>

          {/* Success equip notice toast */}
          {successToast && (
            <div className="bg-emerald-500 text-sky-950 font-black text-sm px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Wardrobe Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isUnlocked = currentStreak >= item.streakRequired;
              const isEquipped =
                (item.category === 'outfit' && wardrobe.selectedOutfitId === item.id) ||
                (item.category === 'hat' && wardrobe.selectedHatId === item.id) ||
                (item.category === 'accessory' && wardrobe.selectedAccessoryId === item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer select-none flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-gradient-to-b from-sky-900/90 to-blue-900/90 border-yellow-400 shadow-[0_0_20px_rgba(255,214,0,0.4)] scale-102'
                      : isUnlocked
                      ? 'bg-neutral-800/80 hover:bg-neutral-800 border-white/10 hover:border-yellow-300/60 shadow'
                      : 'bg-neutral-900/60 border-neutral-800 opacity-60 hover:opacity-80'
                  }`}
                >
                  {/* Streak requirement badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl shadow"
                        style={{ backgroundColor: item.previewColor }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400 capitalize">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {isEquipped ? (
                      <span className="bg-yellow-400 text-sky-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <Check className="w-3 h-3 stroke-[3]" /> Equipped
                      </span>
                    ) : isUnlocked ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Ready to Wear
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {item.streakRequired}-Day Streak
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>

                  {/* Bottom Action Footer */}
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-yellow-300 font-semibold">
                      {isUnlocked
                        ? 'Click to put on MP ✨'
                        : `Streak progress: ${currentStreak}/${item.streakRequired} days`}
                    </span>
                    <button
                      type="button"
                      className={`font-black text-[11px] px-3 py-1 rounded-xl transition-all ${
                        isEquipped
                          ? 'bg-yellow-400 text-sky-950'
                          : isUnlocked
                          ? 'bg-white text-sky-950 hover:bg-yellow-300'
                          : 'bg-neutral-700 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isEquipped ? 'Wearing' : isUnlocked ? 'Equip' : 'Locked'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
