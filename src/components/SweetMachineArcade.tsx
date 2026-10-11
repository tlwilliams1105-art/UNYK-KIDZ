import React, { useState } from 'react';
import { SweetMachineGraphic } from './SweetMachineGraphic';
import { CollectibleSticker } from '../data/episodes';
import { sound } from '../utils/audio';
import { Sparkles, Trophy, RotateCcw, PlusCircle, CheckCircle2 } from 'lucide-react';

interface SweetMachineArcadeProps {
  stickers: CollectibleSticker[];
  onUnlockSticker: (id: string) => void;
}

export const SweetMachineArcade: React.FC<SweetMachineArcadeProps> = ({
  stickers,
  onUnlockSticker,
}) => {
  const [coins, setCoins] = useState(3);
  const [crankTurns, setCrankTurns] = useState(0);
  const [crankAngle, setCrankAngle] = useState(0);
  const [isDispensing, setIsDispensing] = useState(false);
  const [dispensedSticker, setDispensedSticker] = useState<CollectibleSticker | null>(null);

  const handleInsertCoin = () => {
    if (coins <= 0 || isDispensing) return;
    sound.playSfx('coin');
    setCoins(prev => prev - 1);
  };

  const handleTurnCrank = () => {
    if (isDispensing) return;
    sound.playSfx('crank');
    const newTurns = crankTurns + 1;
    setCrankTurns(newTurns);
    setCrankAngle(prev => prev + 120);

    // After 3 turns, dispense candy & sticker!
    if (newTurns >= 3) {
      setIsDispensing(true);
      sound.playSfx('fanfare');
      sound.playSfx('cheer');

      setTimeout(() => {
        // Pick random locked sticker or random treat
        const locked = stickers.filter(s => !s.unlocked);
        let chosen: CollectibleSticker;
        if (locked.length > 0) {
          chosen = locked[Math.floor(Math.random() * locked.length)];
          onUnlockSticker(chosen.id);
        } else {
          chosen = stickers[Math.floor(Math.random() * stickers.length)];
        }
        setDispensedSticker(chosen);
        setCrankTurns(0);
        setIsDispensing(false);
      }, 1500);
    }
  };

  const handleEarnMoreCoins = () => {
    sound.playSfx('sparkle');
    setCoins(prev => prev + 3);
  };

  const unlockedCount = stickers.filter(s => s.unlocked).length;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-white animate-in fade-in duration-300">
      {/* Title Banner */}
      <div className="text-center mb-8">
        <span className="bg-yellow-400 text-sky-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
          Playroom Arcade Station
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 mt-2 font-['Fredoka'] drop-shadow-md">
          The Magical Sweet Machine! 🍬✨
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mt-1">
          Turn the candy crank with your Habit Coins to collect sweet surprise treats and good habit stickers!
        </p>
      </div>

      {/* Main Arcade Area Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-sky-900/60 to-indigo-950/80 p-6 sm:p-8 rounded-3xl border-4 border-yellow-400 shadow-2xl">
        {/* Left Column: Sweet Machine & Controls */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center">
          {/* Sweet Machine Graphic */}
          <div className="w-64 sm:w-72">
            <SweetMachineGraphic
              crankRotation={crankAngle}
              habitsCompleted={{ teeth: true, veggies: true, toys: true }}
              hasCoin={coins > 0}
              onTurnCrank={handleTurnCrank}
              dispensingCandy={dispensedSticker ? dispensedSticker.icon : null}
            />
          </div>

          {/* Coin Status & Crank Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 bg-yellow-400/20 border-2 border-yellow-400 px-4 py-2 rounded-2xl">
              <span className="text-2xl">🪙</span>
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold text-yellow-200">Habit Coins:</div>
                <div className="text-xl font-extrabold text-yellow-300 leading-none">{coins}</div>
              </div>
            </div>

            <button
              onClick={handleTurnCrank}
              disabled={isDispensing}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-400 hover:to-pink-400 active:scale-95 text-white font-extrabold rounded-2xl shadow-lg border-2 border-white/30 transition-transform cursor-pointer"
            >
              <RotateCcw className="w-5 h-5" style={{ transform: `rotate(${crankAngle}deg)` }} />
              <span>Turn Crank ({crankTurns}/3)</span>
            </button>

            <button
              onClick={handleEarnMoreCoins}
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer"
              title="Practice good habits to get free coins"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+3 Free Coins</span>
            </button>
          </div>

          {/* Dispensed Reward Pop-up */}
          {dispensedSticker && (
            <div className="mt-6 p-4 bg-yellow-400 text-sky-950 rounded-2xl shadow-xl border-2 border-white flex items-center gap-4 animate-in zoom-in duration-300 max-w-sm">
              <span className="text-4xl">{dispensedSticker.icon}</span>
              <div className="text-left">
                <div className="text-xs uppercase font-black text-sky-800">You Unlocked!</div>
                <div className="text-base font-black leading-tight">{dispensedSticker.name}</div>
                <div className="text-xs font-semibold text-sky-900 mt-0.5">{dispensedSticker.habitFact}</div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Collectible Sticker Album */}
        <div className="lg:col-span-6 bg-black/40 rounded-2xl p-5 border border-white/10">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <h3 className="font-bold text-lg text-white">Good Habits Sticker Album</h3>
            </div>
            <span className="text-xs font-bold text-yellow-300 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/40">
              {unlockedCount} / {stickers.length} Collected
            </span>
          </div>

          {/* Stickers Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[360px] overflow-y-auto pr-1">
            {stickers.map((stk) => (
              <div
                key={stk.id}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all ${
                  stk.unlocked
                    ? 'bg-gradient-to-b from-sky-800/80 to-blue-900/80 border-2 border-yellow-300 shadow-md hover:scale-105'
                    : 'bg-neutral-800/50 border border-white/5 opacity-50'
                }`}
              >
                <div className="text-3xl mb-1">
                  {stk.unlocked ? stk.icon : '❓'}
                </div>
                <div className="text-[11px] font-bold text-slate-100 leading-tight">
                  {stk.unlocked ? stk.name : 'Secret Sticker'}
                </div>
                <div className="text-[9px] text-yellow-300 font-semibold mt-1">
                  {stk.unlocked ? stk.category : 'Locked'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
