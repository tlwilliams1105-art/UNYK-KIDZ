import React, { useEffect, useState, useRef } from 'react';
import { MPCharacter } from './ChrisCharacter';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Trophy,
  Zap,
  Award,
  Crown,
  Flame,
  CheckCircle2,
  X,
  Volume2,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface SuperHabitCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewStickerAlbum?: () => void;
  onOpenCertificates?: () => void;
  habitTitle?: string;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  shape: 'circle' | 'square' | 'star' | 'ribbon';
  rotation: number;
  speedY: number;
  speedX: number;
  rotationSpeed: number;
  opacity: number;
}

const CONFETTI_COLORS = [
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#FBBF24', // Yellow
  '#EF4444', // Red
  '#06B6D4', // Cyan
];

export const SuperHabitCelebrationModal: React.FC<SuperHabitCelebrationModalProps> = ({
  isOpen,
  onClose,
  onViewStickerAlbum,
  onOpenCertificates,
  habitTitle = 'Daily Good Habits',
}) => {
  const [particles, setParticles] = useState<ConfettiPiece[]>([]);
  const [isSparkling, setIsSparkling] = useState(true);
  const animFrameRef = useRef<number | null>(null);

  // Initialize and run celebratory sound and confetti
  useEffect(() => {
    if (!isOpen) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    // Play triumphant sound sequence
    sound.playSfx('fanfare');
    const timer1 = setTimeout(() => sound.playSfx('cheer'), 400);
    const timer2 = setTimeout(() => sound.playSfx('sparkle'), 800);
    const timer3 = setTimeout(() => sound.playSfx('bell'), 1200);

    // Speak celebratory message
    sound.speak(
      `Hooray! You completed 7 consecutive days of ${habitTitle}! You unlocked the exclusive Super Habit sticker!`
    );

    // Generate confetti pieces
    const newParticles: ConfettiPiece[] = Array.from({ length: 65 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100,
      y: -10 - Math.random() * 40,
      size: 8 + Math.random() * 14,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      shape: (['circle', 'square', 'star', 'ribbon'] as const)[Math.floor(Math.random() * 4)],
      rotation: Math.random() * 360,
      speedY: 1.5 + Math.random() * 3.5,
      speedX: (Math.random() - 0.5) * 2,
      rotationSpeed: (Math.random() - 0.5) * 8,
      opacity: 0.8 + Math.random() * 0.2,
    }));

    setParticles(newParticles);

    // Animation loop for falling confetti
    let running = true;
    const updatePhysics = () => {
      if (!running) return;
      setParticles((prev) =>
        prev.map((p) => {
          let newY = p.y + p.speedY * 0.45;
          let newX = p.x + p.speedX * 0.2;
          let newRot = p.rotation + p.rotationSpeed;
          if (newY > 110) {
            newY = -10;
            newX = Math.random() * 100;
          }
          return {
            ...p,
            y: newY,
            x: newX,
            rotation: newRot,
          };
        })
      );
      animFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animFrameRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen, habitTitle]);

  if (!isOpen) return null;

  const handleReplay = () => {
    sound.playSfx('fanfare');
    sound.playSfx('cheer');
    sound.playSfx('sparkle');
    setIsSparkling(false);
    setTimeout(() => setIsSparkling(true), 50);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="7 Consecutive Days Super Habit Celebration"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300"
    >
      {/* Falling Confetti Canvas Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: p.shape === 'ribbon' ? `${p.size * 2}px` : `${p.size}px`,
              backgroundColor: p.color,
              borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'ribbon' ? '4px' : '2px',
              transform: `rotate(${p.rotation}deg)`,
              opacity: p.opacity,
              boxShadow: `0 0 6px ${p.color}`,
              transition: 'none',
            }}
          />
        ))}

        {/* Ambient Radial Golden Sunburst */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
          <div className="w-[800px] h-[800px] bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 rounded-full blur-3xl animate-pulse" />
        </div>
      </div>

      {/* Main Celebration Modal Card */}
      <div className="relative z-10 w-full max-w-xl bg-gradient-to-b from-neutral-900 via-neutral-900 to-sky-950/90 border-4 border-yellow-400 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(251,191,36,0.45)] text-center my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
          title="Close celebration"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-500 text-sky-950 font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg border-2 border-white mb-4 animate-bounce">
          <Zap className="w-4 h-4 fill-sky-950" />
          <span>7 Consecutive Days Completed!</span>
          <Crown className="w-4 h-4 fill-sky-950" />
        </div>

        {/* Big Headline */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Fredoka'] tracking-tight drop-shadow-lg">
          Super Habit Unlocked! 🌟
        </h2>
        <p className="text-xs sm:text-sm text-yellow-200 font-bold mt-1 max-w-md mx-auto">
          Incredible dedication! You completed 7 straight days of good habits. MP is so proud of your consistency!
        </p>

        {/* The Exclusive 'Super Habit' Sticker Feature Card */}
        <div className="relative my-6 p-6 rounded-3xl bg-gradient-to-tr from-yellow-500/20 via-purple-600/20 to-sky-500/20 border-3 border-yellow-400 shadow-[0_0_35px_rgba(251,191,36,0.35)] overflow-hidden group">
          {/* Shimmer sweep effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2.5s_infinite]" />

          {/* Golden Corner Ribbons */}
          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow flex items-center gap-1 border border-red-300">
            <Flame className="w-3 h-3 fill-current" />
            <span>Exclusive</span>
          </div>

          <div className="absolute top-3 right-3 bg-yellow-400 text-sky-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-md shadow flex items-center gap-1 border border-white">
            <Crown className="w-3 h-3 fill-current" />
            <span>Legendary</span>
          </div>

          {/* Central 3D Floating Sticker Emblem */}
          <div className="flex flex-col items-center justify-center my-2">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-b from-amber-300 via-yellow-400 to-amber-500 p-1 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform flex items-center justify-center">
              {/* Outer rotating rays */}
              <div className="absolute inset-0 rounded-2xl bg-yellow-300/40 blur-md animate-pulse" />

              {/* Inner sticker badge */}
              <div className="relative w-full h-full rounded-2xl bg-gradient-to-b from-sky-950 to-neutral-900 flex flex-col items-center justify-center border-2 border-yellow-300 p-2">
                <span className="text-4xl sm:text-5xl drop-shadow-[0_0_12px_rgba(250,204,21,0.9)] select-none animate-bounce">
                  ⚡👑
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 mt-1">
                  SUPER HABIT
                </span>
              </div>

              {/* Floating Sparkles badges */}
              <div className="absolute -top-2 -right-2 bg-yellow-400 text-sky-950 rounded-full p-1 border-2 border-white shadow">
                <Sparkles className="w-4 h-4 fill-sky-950" />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-emerald-400 text-sky-950 rounded-full p-1 border-2 border-white shadow">
                <Award className="w-4 h-4" />
              </div>
            </div>

            {/* Sticker Name & Description */}
            <div className="mt-4">
              <h3 className="text-xl sm:text-2xl font-black text-yellow-300 font-['Fredoka']">
                Super Habit Hero
              </h3>
              <div className="text-[11px] text-amber-200 font-bold uppercase tracking-wider mt-0.5">
                Collectible Milestone Sticker #13
              </div>
              <p className="text-xs text-slate-200 mt-2 max-w-sm mx-auto leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/10">
                “7 consecutive days builds true super strength! Your habit is officially locked into your daily routine!” 🥦🪥✨
              </p>
            </div>
          </div>
        </div>

        {/* MP Character Cheering Section */}
        <div className="flex items-center justify-center gap-4 bg-black/40 border border-white/10 rounded-2xl p-3 mb-6">
          <div className="shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-yellow-400 bg-amber-400/20">
            <MPCharacter expression="cheering" size="sm" className="scale-110 translate-y-1" />
          </div>
          <div className="text-left text-xs text-slate-200">
            <span className="font-extrabold text-yellow-300 block text-sm">
              MP says:
            </span>
            <span>
              “7 days in a row is out of this world! Keep your streak burning bright every single day!”
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Claim / Keep Sticker */}
          <button
            onClick={() => {
              sound.playSfx('sparkle');
              sound.playSfx('bell');
              onClose();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400 hover:from-yellow-300 hover:to-amber-200 text-sky-950 font-black text-sm shadow-xl border-2 border-white flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>Claim Sticker! 👑</span>
          </button>

          {/* Award Official Certificate */}
          {onOpenCertificates && (
            <button
              onClick={() => {
                sound.playSfx('fanfare');
                onClose();
                onOpenCertificates();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-sky-950 font-black text-sm shadow-lg border-2 border-white flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-900" />
              <span>Official Certificate 📜</span>
            </button>
          )}

          {/* Go to Sticker Album */}
          {onViewStickerAlbum && (
            <button
              onClick={() => {
                sound.playSfx('pop');
                onClose();
                onViewStickerAlbum();
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-lg border border-purple-400/50 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Album 📖</span>
            </button>
          )}

          {/* Replay Sound & Animation */}
          <button
            onClick={handleReplay}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white font-semibold text-xs border border-white/15 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            title="Replay fanfare and sound effects"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Replay 🎉</span>
          </button>
        </div>
      </div>
    </div>
  );
};
