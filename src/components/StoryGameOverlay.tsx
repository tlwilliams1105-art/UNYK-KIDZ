import React, { useState, useEffect, useRef } from 'react';
import { InteractiveStep } from '../data/episodes';
import { sound } from '../utils/audio';
import { Sparkles, CheckCircle2, RotateCcw, Volume2, ArrowRight, Play, Star } from 'lucide-react';
import { MPCharacter } from './ChrisCharacter';

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
  // Game lifecycle stages:
  // 'reading': AI voice reads the prompt aloud with word highlights & progress bar
  // 'ready': Voice narration finished, waiting for user to tap continue / start playing
  // 'playing': User is actively interacting with the challenge
  // 'victory': User completed the target count, MP cheers and user taps to advance
  const [stage, setStage] = useState<'reading' | 'ready' | 'playing'>('reading');
  const [completedCount, setCompletedCount] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [activeWordIdx, setActiveWordIdx] = useState<number>(-1);
  const [readingProgress, setReadingProgress] = useState(0);

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

  // --- Bedtime Routine State ---
  const [bathItemsCleaned, setBathItemsCleaned] = useState<number[]>([]);

  // --- Sharing Challenge State ---
  const [sharedTokens, setSharedTokens] = useState<number[]>([]);

  // Full spoken prompt text for synchronized narration
  const narrationText = `${step.title}. ${step.instruction}`;
  const promptWords = narrationText.split(/\s+/);
  const progressTimerRef = useRef<number | null>(null);

  // Synchronize AI Voice Narration on Mount
  useEffect(() => {
    let isCancelled = false;
    sound.playSfx('pop');

    // Estimate progress duration
    const estimatedSec = sound.estimateReadDurationSec(narrationText);
    const stepIntervalMs = (estimatedSec * 1000) / 100;

    let currentPct = 0;
    progressTimerRef.current = window.setInterval(() => {
      currentPct = Math.min(99, currentPct + 1);
      if (!isCancelled) {
        setReadingProgress(currentPct);
      }
    }, stepIntervalMs);

    sound.speakWithCallbacks(narrationText, {
      onWord: (idx) => {
        if (!isCancelled) {
          setActiveWordIdx(idx);
        }
      },
      onEnd: () => {
        if (!isCancelled) {
          if (progressTimerRef.current) clearInterval(progressTimerRef.current);
          setReadingProgress(100);
          setActiveWordIdx(-1);
          // Wait for user to tap continue after reading finishes (per decision)
          setStage('ready');
        }
      },
    });

    return () => {
      isCancelled = true;
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      sound.stopSpeech();
    };
  }, [step]);

  // User taps "Start Challenge" or "Skip Reading"
  const handleStartPlaying = () => {
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    sound.stopSpeech();
    sound.playSfx('pop');
    sound.playSfx('sparkle');
    setReadingProgress(100);
    setStage('playing');
  };

  // Re-read prompt aloud
  const handleReRead = () => {
    sound.playSfx('pop');
    const narrationText = `${step.title}. ${step.instruction}`;
    setStage('reading');
    setReadingProgress(0);

    const estimatedSec = sound.estimateReadDurationSec(narrationText);
    const stepIntervalMs = (estimatedSec * 1000) / 100;
    let currentPct = 0;
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    progressTimerRef.current = window.setInterval(() => {
      currentPct = Math.min(99, currentPct + 1);
      setReadingProgress(currentPct);
    }, stepIntervalMs);

    sound.speakWithCallbacks(narrationText, {
      onWord: (idx) => setActiveWordIdx(idx),
      onEnd: () => {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setReadingProgress(100);
        setActiveWordIdx(-1);
        setStage('ready');
      },
    });
  };

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
    setCrankAngle((prev) => prev + 120);
    setCompletedCount(newTurns);

    if (newTurns >= step.targetCount) {
      triggerWin();
    }
  };

  // Handle Bedtime item tap
  const handleBedtimeItem = (itemId: number) => {
    if (bathItemsCleaned.includes(itemId) || isSuccess) return;
    sound.playSfx('sparkle');
    const updated = [...bathItemsCleaned, itemId];
    setBathItemsCleaned(updated);
    setCompletedCount(updated.length);
    if (updated.length >= step.targetCount) {
      triggerWin();
    }
  };

  // Handle Sharing token tap
  const handleShareToken = (tokenId: number) => {
    if (sharedTokens.includes(tokenId) || isSuccess) return;
    sound.playSfx('sparkle');
    sound.playSfx('fanfare');
    const updated = [...sharedTokens, tokenId];
    setSharedTokens(updated);
    setCompletedCount(updated.length);
    if (updated.length >= step.targetCount) {
      triggerWin();
    }
  };

  const triggerWin = () => {
    setIsSuccess(true);
    sound.playSfx('fanfare');
    sound.playSfx('cheer');
    sound.speak(`${step.rewardText} Tap continue to advance to the next chapter!`);
  };

  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-300">
      {/* Container Card */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 rounded-3xl p-5 sm:p-7 text-white shadow-2xl border-4 border-yellow-300 overflow-hidden flex flex-col justify-between max-h-[92vh]">
        {/* Playful Floating Stars Background */}
        <div className="absolute -top-6 -right-6 text-yellow-300/30 text-8xl pointer-events-none select-none">
          ⭐
        </div>
        <div className="absolute -bottom-6 -left-6 text-yellow-300/30 text-8xl pointer-events-none select-none">
          ✨
        </div>

        {/* Top Header Ribbon */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-sky-950 font-black px-3 py-1 rounded-full text-xs md:text-sm uppercase tracking-wider shadow flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-950 fill-current" />
              Interactive Show Challenge
            </span>
            <span className="text-xs text-sky-100 hidden sm:inline font-semibold">
              Help MP build good habits!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReRead}
              className="text-xs font-bold text-sky-100 hover:text-white bg-sky-700/60 hover:bg-sky-700 p-1.5 rounded-lg transition-colors cursor-pointer"
              title="Read prompt again"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="text-xs font-bold text-sky-100 hover:text-white bg-sky-700/60 hover:bg-sky-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
            >
              Skip ⏭️
            </button>
          </div>
        </div>

        {/* Prompt Voice Reading / Spoken Narration Banner */}
        <div className="bg-sky-950/80 rounded-2xl p-3.5 sm:p-4 border-2 border-yellow-300/70 mb-3 shadow-inner relative">
          <div className="flex items-center justify-between text-xs text-yellow-300 font-extrabold uppercase mb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {stage === 'reading' ? 'MP is reading prompt...' : 'Prompt Ready!'}
            </span>
            <span className="text-sky-200 lowercase">
              {stage === 'reading' ? 'listening...' : 'tap below to play'}
            </span>
          </div>

          {/* Prompt Words with active word highlighter */}
          <p className="text-sm sm:text-base text-white mt-1 font-bold leading-relaxed">
            {promptWords.map((word, wIdx) => {
              const isHighlight = activeWordIdx === wIdx;
              return (
                <span
                  key={wIdx}
                  className={`inline-block mr-1.5 transition-all rounded px-1 py-0.5 ${
                    isHighlight
                      ? 'bg-yellow-300 text-sky-950 font-black scale-110 shadow-md ring-2 ring-yellow-400'
                      : 'text-sky-100 hover:text-white'
                  }`}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* AI Voice Read-Along Progress Meter */}
          <div className="w-full h-1.5 bg-black/40 rounded-full mt-2.5 overflow-hidden">
            <div
              className="h-full bg-yellow-400 transition-all duration-150 rounded-full"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>

        {/* --- STAGE 1 & 2: READING / READY-TO-PLAY GATE --- */}
        {stage !== 'playing' && !isSuccess && (
          <div className="bg-sky-900/70 rounded-2xl p-5 border-2 border-sky-300/40 my-auto flex flex-col items-center justify-center text-center shadow-lg">
            <div className="mb-3 transform scale-110">
              <MPCharacter expression={stage === 'reading' ? 'brushing' : 'excited'} size="md" />
            </div>

            {stage === 'reading' ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-xs sm:text-sm text-yellow-200 font-bold">
                  Listening to MP's instructions...
                </p>
                <button
                  type="button"
                  onClick={handleStartPlaying}
                  className="bg-yellow-400 hover:bg-yellow-300 text-sky-950 font-black text-xs px-4 py-2 rounded-xl shadow-lg border border-white flex items-center gap-1.5 cursor-pointer transform hover:scale-105 active:scale-95 transition-all mt-1"
                >
                  <span>Skip Reading & Play Now ⚡</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 animate-in zoom-in-95 duration-200">
                <span className="text-sm font-extrabold text-white">
                  Reading finished! Ready to help MP?
                </span>
                <button
                  type="button"
                  onClick={handleStartPlaying}
                  className="bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 text-sky-950 font-black text-base px-6 py-3 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 cursor-pointer transform hover:scale-105 active:scale-95 transition-all animate-bounce"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>Start Challenge Now! 🚀</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- STAGE 3: ACTIVE GAME ARENA --- */}
        {(stage === 'playing' || isSuccess) && (
          <div className="bg-sky-900/60 rounded-2xl p-4 sm:p-5 border-2 border-sky-300/40 min-h-[210px] flex flex-col items-center justify-center my-auto">
            {/* 1. TEETH BRUSHING */}
            {step.type === 'teeth' && (
              <div className="w-full flex flex-col items-center">
                <p className="text-xs text-yellow-200 mb-3 font-semibold uppercase tracking-wider text-center">
                  Tap each tooth to scrub away the funny sugar bugs!
                </p>
                <div className="grid grid-cols-4 gap-3 sm:gap-6">
                  {[0, 1, 2, 3].map((idx) => {
                    const cleaned = teethCleaned[idx];
                    return (
                      <button
                        key={idx}
                        type="button"
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
                            <span className="text-[10px] text-emerald-600 font-extrabold mt-1">
                              CLEAN!
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-2xl sm:text-3xl animate-bounce">👾</span>
                            <span className="text-[10px] text-red-500 font-bold mt-1">
                              Sugar Bug
                            </span>
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
                <p className="text-xs text-yellow-200 mb-2 font-semibold uppercase tracking-wider text-center">
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
                      type="button"
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
                <p className="text-xs text-yellow-200 mb-3 font-semibold uppercase tracking-wider text-center">
                  Tap scattered toys to pack them safely in the toy chest!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
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
                        type="button"
                        onClick={() => handleCleanToy(toy.id)}
                        disabled={isSuccess}
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-400 hover:bg-yellow-300 rounded-2xl flex flex-col items-center justify-center shadow-lg border-2 border-yellow-200 hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                      >
                        <span className="text-3xl animate-pulse">{toy.icon}</span>
                        <span className="text-[10px] text-sky-950 font-bold mt-0.5">
                          {toy.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. CRANK & COIN DISPENSER */}
            {step.type === 'crank' && (
              <div className="w-full flex flex-col items-center">
                <p className="text-xs text-yellow-200 mb-3 font-semibold uppercase tracking-wider text-center">
                  Click the magical candy crank handle 3 times to dispense!
                </p>
                <div className="flex items-center gap-6">
                  <button
                    type="button"
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
                    <div className="text-xs text-white/80 mt-1">
                      Spin to unleash the candy pop!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. BEDTIME ROUTINE */}
            {step.type === 'bedtime' && (
              <div className="w-full flex flex-col items-center">
                <p className="text-xs text-yellow-200 mb-3 font-semibold uppercase tracking-wider text-center">
                  Tap evening calm items to tuck MP into sweet dreams!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {[
                    { id: 1, name: 'Warm Bubble Bath', icon: '🛁' },
                    { id: 2, name: 'Soft Bear Pajamas', icon: '🐻' },
                    { id: 3, name: 'Starlight Lullaby', icon: '🌙' },
                  ].map((item) => {
                    const done = bathItemsCleaned.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleBedtimeItem(item.id)}
                        disabled={done || isSuccess}
                        className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          done
                            ? 'bg-emerald-500/30 border-emerald-400 opacity-60'
                            : 'bg-yellow-400 hover:bg-yellow-300 text-sky-950 border-white font-bold hover:scale-105'
                        }`}
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <span className="text-xs mt-1">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 6. SHARING ROUTINE */}
            {step.type === 'share' && (
              <div className="w-full flex flex-col items-center">
                <p className="text-xs text-yellow-200 mb-3 font-semibold uppercase tracking-wider text-center">
                  Share toys and treats with your friendly playmates!
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {[
                    { id: 1, name: 'Share Block Castle', icon: '🏰' },
                    { id: 2, name: 'Pass the Toy Car', icon: '🚗' },
                    { id: 3, name: 'High-Five Friend', icon: '✋' },
                  ].map((item) => {
                    const done = sharedTokens.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleShareToken(item.id)}
                        disabled={done || isSuccess}
                        className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                          done
                            ? 'bg-emerald-500/30 border-emerald-400 opacity-60'
                            : 'bg-yellow-400 hover:bg-yellow-300 text-sky-950 border-white font-bold hover:scale-105'
                        }`}
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <span className="text-xs mt-1">{item.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* FALLBACK */}
            {!['teeth', 'veggies', 'toys', 'crank', 'bedtime', 'share'].includes(step.type) && (
              <button
                type="button"
                onClick={triggerWin}
                className="px-6 py-3 bg-yellow-400 text-sky-950 font-black rounded-2xl hover:scale-105 cursor-pointer shadow-lg border-2 border-white"
              >
                Complete Habit ⭐
              </button>
            )}
          </div>
        )}

        {/* Bottom Progress Bar & Reward Continuation Footer */}
        <div className="mt-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-sky-950/70 p-3 rounded-2xl border border-sky-300/30">
          <div className="w-full sm:w-1/2">
            <div className="flex justify-between text-xs font-semibold text-sky-100 mb-1">
              <span>Habit Power Meter:</span>
              <span className="text-yellow-300 font-bold">
                {Math.min(100, Math.round((completedCount / step.targetCount) * 100))}%
              </span>
            </div>
            <div className="w-full h-3.5 bg-black/50 rounded-full overflow-hidden border border-sky-300/40">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${Math.min(100, (completedCount / step.targetCount) * 100)}%` }}
              />
            </div>
          </div>

          {isSuccess ? (
            <button
              type="button"
              onClick={onComplete}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-sky-950 font-black px-5 py-2.5 rounded-2xl shadow-xl animate-bounce cursor-pointer border-2 border-white transform hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5 text-yellow-500 fill-current" />
              <span>Continue to Next Chapter ⏭️</span>
            </button>
          ) : (
            <span className="text-xs text-sky-200 font-medium">
              Goal: {completedCount}/{step.targetCount} completed
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
