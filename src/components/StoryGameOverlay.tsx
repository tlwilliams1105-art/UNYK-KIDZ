import React, { useState } from 'react';
import { InteractiveStep } from '../data/episodes';
import { sound } from '../utils/audio';
import { Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

interface StoryGameOverlayProps {
  step: InteractiveStep;
  onComplete: () => void;
  onSkip: () => void;
}

export const StoryGameOverlay: React.FC<StoryGameOverlayProps> = ({
  step,
  onComplete,
  onSkip,
}) => {
  const [completedCount, setCompletedCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- Teeth Challenge State ---
  const [teethCleaned, setTeethCleaned] = useState<boolean[]>([false, false, false, false]);

  // --- Veggies Challenge State ---
  const [veggiesEaten, setVeggiesEaten] = useState<number>(0);
  const [wrongSelection, setWrongSelection] = useState<string | null>(null);

  // --- Toys Challenge State ---
  const [toysCleaned, setToysCleaned] = useState<number[]>([]);

  // --- Crank State ---
  const [crankTurns, setCrankTurns] = useState(0);
  const [crankAngle, setCrankAngle] = useState(0);

  // Handle Tooth Clean
  const handleBrushTooth = (idx: number) => {
    if (teethCleaned[idx] || isSuccess) return;
    sound.playSfx('brush');
    const updated = [...teethCleaned];
    updated[idx] = true;
    setTeethCleaned(updated);

    const newCount = completedCount + 1;
    setCompletedCount(newCount);

    if (newCount >= step.targetCount) {
      triggerWin();
    }
  };

  // Handle Veggie Click
  const handleEatFood = (food: { name: string; isHealthy: boolean; icon: string }) => {
    if (isSuccess) return;
    if (food.isHealthy) {
      sound.playSfx('crunch');
      sound.playSfx('sparkle');
      const next = veggiesEaten + 1;
      setVeggiesEaten(next);
      setCompletedCount(next);
      setWrongSelection(null);
      if (next >= step.targetCount) {
        triggerWin();
      }
    } else {
      sound.playSfx('boing');
      setWrongSelection("Save sugary sweets for after healthy food! Pick a crunchy veggie first! 🥦");
      setTimeout(() => setWrongSelection(null), 2500);
    }
  };

  // Handle Toy Click
  const handleCleanToy = (toyId: number) => {
    if (toysCleaned.includes(toyId) || isSuccess) return;
    sound.playSfx('pop');
    sound.playSfx('sparkle');
    const updated = [...toysCleaned, toyId];
    setToysCleaned(updated);
    setCompletedCount(updated.length);

    if (updated.length >= step.targetCount) {
      triggerWin();
    }
  };

  // Handle Crank Spin
  const handleSpinCrank = () => {
    if (isSuccess) return;
    sound.playSfx('crank');
    const newTurns = crankTurns + 1;
    setCrankTurns(newTurns);
    setCrankAngle(prev => prev + 120);
    setCompletedCount(newTurns);

    if (newTurns >= step.targetCount) {
      triggerWin();
    }
  };

  const triggerWin = () => {
    setIsSuccess(true);
    sound.playSfx('fanfare');
    sound.playSfx('cheer');
    setTimeout(() => {
      onComplete();
    }, 2200);
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {/* Container Card */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl border-4 border-yellow-300 overflow-hidden">
        {/* Playful Floating Stars Background */}
        <div className="absolute -top-6 -right-6 text-yellow-300/30 text-8xl pointer-events-none select-none">⭐</div>
        <div className="absolute -bottom-6 -left-6 text-yellow-300/30 text-8xl pointer-events-none select-none">✨</div>

        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-sky-950 font-bold px-3 py-1 rounded-full text-xs md:text-sm uppercase tracking-wider shadow">
              Interactive Show Challenge
            </span>
            <span className="text-xs text-sky-100 hidden sm:inline">Help MP with good habits!</span>
          </div>

          <button
            onClick={onSkip}
            className="text-xs font-medium text-sky-100 hover:text-white bg-sky-700/60 hover:bg-sky-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Skip Challenge ⏭️
          </button>
        </div>

        {/* Challenge Title */}
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-extrabold text-yellow-300 drop-shadow-md">
            {step.title}
          </h3>
          <p className="text-sm md:text-base text-sky-100 mt-1 font-medium">
            {step.instruction}
          </p>
        </div>

        {/* Game Arena based on Step Type */}
        <div className="bg-sky-900/60 rounded-2xl p-5 border-2 border-sky-300/40 min-h-[220px] flex flex-col items-center justify-center">
          {/* 1. TEETH BRUSHING */}
          {step.type === 'teeth' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-yellow-200 mb-4 font-semibold uppercase tracking-wider">
                Tap each tooth to scrub away the funny sugar bugs!
              </p>
              <div className="grid grid-cols-4 gap-3 sm:gap-6">
                {[0, 1, 2, 3].map((idx) => {
                  const cleaned = teethCleaned[idx];
                  return (
                    <button
                      key={idx}
                      onClick={() => handleBrushTooth(idx)}
                      disabled={cleaned || isSuccess}
                      className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-2xl flex flex-col items-center justify-center transition-all transform cursor-pointer ${
                        cleaned
                          ? 'bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)] scale-105 border-4 border-emerald-400'
                          : 'bg-yellow-100 hover:scale-105 hover:bg-white border-4 border-yellow-300 active:scale-95'
                      }`}
                    >
                      {cleaned ? (
                        <>
                          <span className="text-2xl sm:text-3xl">✨</span>
                          <span className="text-[10px] text-emerald-600 font-extrabold mt-1">CLEAN!</span>
                        </>
                      ) : (
                        <>
                          <span className="text-2xl sm:text-3xl animate-bounce">👾</span>
                          <span className="text-[10px] text-red-500 font-bold mt-1">Sugar Bug</span>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. VEGGIES FOOD CHOICE */}
          {step.type === 'veggies' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-yellow-200 mb-2 font-semibold uppercase tracking-wider">
                Click healthy rainbow foods for super strength!
              </p>
              {wrongSelection && (
                <div className="bg-amber-400 text-sky-950 font-bold px-3 py-1.5 rounded-xl text-xs mb-3 animate-shake">
                  {wrongSelection}
                </div>
              )}
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {[
                  { name: 'Broccoli', isHealthy: true, icon: '🥦' },
                  { name: 'Carrot', isHealthy: true, icon: '🥕' },
                  { name: 'Sweet Donut', isHealthy: false, icon: '🍩' },
                  { name: 'Crisp Apple', isHealthy: true, icon: '🍎' },
                  { name: 'Strawberry', isHealthy: true, icon: '🍓' },
                  { name: 'Candy Lollipop', isHealthy: false, icon: '🍭' },
                ].map((food, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleEatFood(food)}
                    disabled={isSuccess}
                    className="p-3 bg-white/10 hover:bg-white/20 border-2 border-white/20 hover:border-yellow-300 rounded-2xl flex flex-col items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  >
                    <span className="text-3xl">{food.icon}</span>
                    <span className="text-[11px] font-bold mt-1 text-sky-100">{food.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. TOY CLEANUP */}
          {step.type === 'toys' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-yellow-200 mb-3 font-semibold uppercase tracking-wider">
                Tap scattered toys to pack them safely in the toy chest!
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {[
                  { id: 1, name: 'Racecar', icon: '🏎️' },
                  { id: 2, name: 'Teddy Bear', icon: '🧸' },
                  { id: 3, name: 'Soccer Ball', icon: '⚽' },
                  { id: 4, name: 'Train Engine', icon: '🚂' },
                  { id: 5, name: 'Toy Robot', icon: '🤖' },
                ].map((toy) => {
                  const cleaned = toysCleaned.includes(toy.id);
                  if (cleaned) {
                    return (
                      <div
                        key={toy.id}
                        className="w-16 h-16 rounded-2xl bg-emerald-500/30 border-2 border-emerald-400 flex items-center justify-center opacity-60 scale-90"
                      >
                        <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                      </div>
                    );
                  }
                  return (
                    <button
                      key={toy.id}
                      onClick={() => handleCleanToy(toy.id)}
                      disabled={isSuccess}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 hover:bg-yellow-300 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 border-yellow-200 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                    >
                      <span className="text-3xl animate-pulse">{toy.icon}</span>
                      <span className="text-[10px] text-sky-950 font-bold mt-0.5">{toy.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. CRANK & COIN DISPENSER */}
          {step.type === 'crank' && (
            <div className="w-full flex flex-col items-center">
              <p className="text-xs text-yellow-200 mb-3 font-semibold uppercase tracking-wider">
                Click the magical candy crank handle 3 times to dispense!
              </p>
              <div className="flex items-center gap-6">
                <button
                  onClick={handleSpinCrank}
                  disabled={isSuccess}
                  className="relative group p-4 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full border-4 border-white shadow-xl hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                >
                  <RotateCcw
                    className="w-16 h-16 text-sky-950 transition-transform duration-300"
                    style={{ transform: `rotate(${crankAngle}deg)` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl">🍬</span>
                  </div>
                </button>
                <div className="text-left">
                  <div className="text-xs uppercase text-sky-200 font-bold">Turns Needed:</div>
                  <div className="text-3xl font-extrabold text-yellow-300">
                    {crankTurns} / {step.targetCount}
                  </div>
                  <div className="text-xs text-white/80 mt-1">Spin to unleash the candy pop!</div>
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK/GENERAL */}
          {!['teeth', 'veggies', 'toys', 'crank'].includes(step.type) && (
            <button
              onClick={triggerWin}
              className="px-6 py-3 bg-yellow-400 text-sky-950 font-bold rounded-2xl hover:scale-105 cursor-pointer"
            >
              Complete Habit ⭐
            </button>
          )}
        </div>

        {/* Progress Bar & Reward Feedback */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between text-xs font-semibold text-sky-100 mb-1">
              <span>Habit Power Meter:</span>
              <span>{Math.min(100, Math.round((completedCount / step.targetCount) * 100))}%</span>
            </div>
            <div className="w-full h-4 bg-sky-950/60 rounded-full overflow-hidden border border-sky-300/40">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (completedCount / step.targetCount) * 100)}%` }}
              />
            </div>
          </div>

          {isSuccess && (
            <div className="flex items-center gap-2 bg-emerald-400 text-sky-950 font-black px-4 py-2 rounded-2xl shadow-lg animate-bounce">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <span>{step.rewardText}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
