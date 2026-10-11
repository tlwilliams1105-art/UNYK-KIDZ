import React, { useState, useEffect } from 'react';
import { MPCharacter } from './ChrisCharacter';
import { sound } from '../utils/audio';
import {
  Sun,
  Sparkles,
  Volume2,
  VolumeX,
  RefreshCw,
  Star,
  Heart,
  Smile,
  Award,
  ChevronRight,
  Flame,
} from 'lucide-react';

export interface Affirmation {
  id: string;
  theme: string;
  message: string;
  subtext: string;
  characterExpression: 'happy' | 'excited' | 'cheering';
  emoji: string;
  bgGradient: string;
  borderColor: string;
  accentColor: string;
}

export const AFFIRMATIONS: Affirmation[] = [
  {
    id: 'aff-1',
    theme: 'Morning Sunshine',
    message: 'Good morning, MP! Today is going to be filled with bright smiles, big hugs, and super fun adventures!',
    subtext: 'Take a deep breath of fresh morning air and stretch high like a giraffe! 🦒',
    characterExpression: 'excited',
    emoji: '☀️',
    bgGradient: 'from-amber-500/20 via-yellow-500/10 to-orange-500/20',
    borderColor: 'border-amber-400/50',
    accentColor: 'text-amber-300',
  },
  {
    id: 'aff-2',
    theme: 'Superstar Kindness',
    message: 'I have superpowers inside me: kindness, sharing, and a heart full of joy for everyone!',
    subtext: 'A kind word or a warm smile can make anyone’s day happy! 💖',
    characterExpression: 'happy',
    emoji: '🌟',
    bgGradient: 'from-sky-500/20 via-blue-500/10 to-indigo-500/20',
    borderColor: 'border-sky-400/50',
    accentColor: 'text-sky-300',
  },
  {
    id: 'aff-3',
    theme: 'Brave & Curious',
    message: 'I am brave enough to try new things, and every mistake is just a chance to learn something awesome!',
    subtext: 'MP believes in you—try your best today with a big smile! 🚀',
    characterExpression: 'cheering',
    emoji: '🦁',
    bgGradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
    borderColor: 'border-emerald-400/50',
    accentColor: 'text-emerald-300',
  },
  {
    id: 'aff-4',
    theme: 'Healthy Habits Hero',
    message: 'I take good care of my body! I brush my teeth clean, wash my hands, and eat colorful crunchy fruits!',
    subtext: 'Strong teeth and happy tummies make great adventure heroes! 🍎',
    characterExpression: 'happy',
    emoji: '✨',
    bgGradient: 'from-lime-500/20 via-green-500/10 to-emerald-500/20',
    borderColor: 'border-lime-400/50',
    accentColor: 'text-lime-300',
  },
  {
    id: 'aff-5',
    theme: 'Joy & Laughter',
    message: 'Today I choose happiness! My giggle is like music and makes everyone around me feel safe and loved.',
    subtext: 'Give your best friend or family member a high five today! 🖐️',
    characterExpression: 'excited',
    emoji: '🎈',
    bgGradient: 'from-pink-500/20 via-rose-500/10 to-purple-500/20',
    borderColor: 'border-pink-400/50',
    accentColor: 'text-pink-300',
  },
  {
    id: 'aff-6',
    theme: 'Super Helper',
    message: 'I am a wonderful helper! Putting away my toys and helping others makes me feel proud and strong.',
    subtext: 'Teamwork makes the dream work in MP’s adventure club! 🤝',
    characterExpression: 'cheering',
    emoji: '🏆',
    bgGradient: 'from-violet-500/20 via-purple-500/10 to-indigo-500/20',
    borderColor: 'border-violet-400/50',
    accentColor: 'text-violet-300',
  },
  {
    id: 'aff-7',
    theme: 'Calm & Strong',
    message: 'When things feel tricky, I can pause, take 3 slow deep breaths, and find my peaceful superhero calm.',
    subtext: 'Breathe in sunshine... breathe out worries! 🌈',
    characterExpression: 'happy',
    emoji: '🧘',
    bgGradient: 'from-cyan-500/20 via-sky-500/10 to-blue-500/20',
    borderColor: 'border-cyan-400/50',
    accentColor: 'text-cyan-300',
  },
  {
    id: 'aff-8',
    theme: 'Curious Explorer',
    message: 'My brain is like a giant sponge, ready to discover new colors, words, numbers, and songs today!',
    subtext: 'Ask lots of fun questions and find wonder everywhere! 🔍',
    characterExpression: 'excited',
    emoji: '🔭',
    bgGradient: 'from-yellow-500/20 via-amber-500/10 to-orange-500/20',
    borderColor: 'border-yellow-400/50',
    accentColor: 'text-yellow-300',
  },
  {
    id: 'aff-9',
    theme: 'Unique & Loved',
    message: 'There is only one person in the whole wide universe just like me, and that makes me truly special!',
    subtext: 'You are loved just the way you are! Never forget it! 💫',
    characterExpression: 'cheering',
    emoji: '⭐',
    bgGradient: 'from-fuchsia-500/20 via-purple-500/10 to-pink-500/20',
    borderColor: 'border-fuchsia-400/50',
    accentColor: 'text-fuchsia-300',
  },
];

interface MorningAffirmationProps {
  onEarnSticker?: (stickerId: string) => void;
  className?: string;
}

export const MorningAffirmation: React.FC<MorningAffirmationProps> = ({
  onEarnSticker,
  className = '',
}) => {
  // Select initial randomized affirmation
  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.floor(Math.random() * AFFIRMATIONS.length)
  );
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasAffirmedToday, setHasAffirmedToday] = useState(false);
  const [streakCount, setStreakCount] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_affirmation_streak');
      return saved ? parseInt(saved, 10) : 3;
    } catch {
      return 3;
    }
  });
  const [showCelebrationBadge, setShowCelebrationBadge] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  const currentAffirmation = AFFIRMATIONS[currentIndex];

  // Stop speech if unmounting
  useEffect(() => {
    return () => {
      sound.stopSpeech();
    };
  }, []);

  const handleNextAffirmation = () => {
    sound.playSfx('sparkle');
    sound.stopSpeech();
    setIsSpeaking(false);
    setShowCelebrationBadge(false);

    // Pick a different randomized affirmation
    let nextIdx = Math.floor(Math.random() * AFFIRMATIONS.length);
    if (nextIdx === currentIndex && AFFIRMATIONS.length > 1) {
      nextIdx = (currentIndex + 1) % AFFIRMATIONS.length;
    }
    setCurrentIndex(nextIdx);
  };

  const handleSpeak = async () => {
    if (isSpeaking) {
      sound.stopSpeech();
      setIsSpeaking(false);
      return;
    }

    sound.playSfx('pop');
    setIsSpeaking(true);

    const speechText = `${currentAffirmation.theme}! ${currentAffirmation.message} ${currentAffirmation.subtext}`;
    try {
      await sound.speak(speechText);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleAffirm = () => {
    if (hasAffirmedToday) {
      sound.playSfx('cheer');
      setShowCelebrationBadge(true);
      setTimeout(() => setShowCelebrationBadge(false), 2500);
      return;
    }

    sound.playSfx('fanfare');
    sound.playSfx('bell');
    setHasAffirmedToday(true);
    setShowCelebrationBadge(true);

    const newStreak = streakCount + 1;
    setStreakCount(newStreak);
    try {
      localStorage.setItem('mp_affirmation_streak', newStreak.toString());
    } catch {
      // Ignore
    }

    if (onEarnSticker) {
      onEarnSticker('stk-healthy');
    }

    setTimeout(() => {
      setShowCelebrationBadge(false);
    }, 4000);
  };

  return (
    <section
      aria-label="Morning Affirmation for Kids"
      className={`relative mb-5 overflow-hidden rounded-3xl border ${currentAffirmation.borderColor} bg-gradient-to-br ${currentAffirmation.bgGradient} bg-neutral-900/90 p-4 sm:p-5 shadow-xl transition-all duration-300 backdrop-blur-sm ${className}`}
    >
      {/* Background playful stars and light sheen */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full bg-yellow-400/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-6 -bottom-6 h-36 w-36 rounded-full bg-sky-400/10 blur-2xl" />

      {/* Header bar: Title, Streak count, and Compact toggle */}
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 shadow-inner">
            <Sun className="h-4 w-4 animate-[spin_12s_linear_infinite]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-['Fredoka'] text-sm sm:text-base font-extrabold tracking-wide text-white">
                Morning Affirmation with MP
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300">
                <Sparkles className="h-3 w-3" />
                <span>Daily Encouragement</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Start your day with positive thoughts, good habits & big smiles!
            </p>
          </div>
        </div>

        {/* Streak counter badge & view toggle */}
        <div className="flex items-center gap-2">
          <div
            title="Morning Affirmation Streak"
            className="flex items-center gap-1.5 rounded-full border border-orange-400/30 bg-orange-500/20 px-2.5 py-1 text-xs font-bold text-orange-200"
          >
            <Flame className="h-3.5 w-3.5 text-orange-400 fill-orange-400 animate-pulse" />
            <span>{streakCount} Day Streak</span>
          </div>

          <button
            type="button"
            onClick={() => setIsCompact(!isCompact)}
            className="rounded-lg border border-white/10 bg-neutral-800/80 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-neutral-700 hover:text-white transition-colors"
          >
            {isCompact ? 'Expand' : 'Compact'}
          </button>
        </div>
      </div>

      {/* Main Card Content */}
      <div className={`mt-3.5 flex flex-col sm:flex-row items-center sm:items-start gap-4 ${isCompact ? 'sm:gap-3' : ''}`}>
        {/* MP Character Avatar Container */}
        <div
          onClick={() => {
            sound.playSfx('pop');
            handleNextAffirmation();
          }}
          title="Click MP for another affirmation!"
          className="relative flex-shrink-0 cursor-pointer group"
        >
          <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-2xl overflow-hidden border-2 border-yellow-400/60 bg-gradient-to-tr from-sky-400/30 to-amber-300/30 shadow-md group-hover:scale-105 transition-transform duration-200">
            <MPCharacter
              expression={currentAffirmation.characterExpression}
              size="sm"
              className="translate-y-1 scale-110"
            />
            {/* Playful emoji badge in corner */}
            <span className="absolute bottom-1 right-1 text-base select-none drop-shadow">
              {currentAffirmation.emoji}
            </span>
          </div>
          <span className="block text-center text-[10px] text-amber-300/80 font-semibold mt-1 group-hover:text-amber-200">
            Tap MP! ✨
          </span>
        </div>

        {/* Affirmation Message & Actions */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className={`text-xs font-black uppercase tracking-wider ${currentAffirmation.accentColor}`}>
              {currentAffirmation.theme}
            </span>
            <span className="text-slate-500 text-xs">·</span>
            <span className="text-xs text-slate-400 font-medium">
              Morning Sunshine Boost
            </span>
          </div>

          {/* Primary Affirmation Text */}
          <blockquote className="font-['Fredoka'] text-base sm:text-lg md:text-xl font-bold text-white leading-snug drop-shadow-sm">
            “{currentAffirmation.message}”
          </blockquote>

          {/* Encouraging Kid Tip */}
          {!isCompact && (
            <p className="mt-1.5 text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {currentAffirmation.subtext}
            </p>
          )}

          {/* Interactive Button Bar */}
          <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            {/* "I Believe It!" / "Say It Loud!" Button */}
            <button
              type="button"
              onClick={handleAffirm}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs sm:text-sm font-black transition-all transform active:scale-95 shadow-md ${
                hasAffirmedToday
                  ? 'bg-amber-400 text-sky-950 hover:bg-amber-300 border border-yellow-200'
                  : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-300 text-sky-950 hover:from-amber-300 hover:to-yellow-300 border border-white'
              }`}
            >
              <Star
                className={`h-4 w-4 ${
                  hasAffirmedToday ? 'fill-sky-950 text-sky-950 animate-bounce' : 'fill-sky-950 text-sky-950'
                }`}
              />
              <span>{hasAffirmedToday ? 'Affirmed Today! ⭐' : 'I Believe It! ⭐'}</span>
            </button>

            {/* Listen / Read to Me Voice Button */}
            <button
              type="button"
              onClick={handleSpeak}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs sm:text-sm font-bold border transition-colors ${
                isSpeaking
                  ? 'border-sky-400 bg-sky-500/30 text-sky-200 animate-pulse'
                  : 'border-white/10 bg-neutral-800 text-slate-200 hover:bg-neutral-700 hover:text-white'
              }`}
              title={isSpeaking ? 'Stop voice reading' : 'Listen to MP read this affirmation aloud'}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="h-4 w-4 text-sky-300" />
                  <span>Pause MP</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 text-amber-400" />
                  <span>Read Aloud 🔊</span>
                </>
              )}
            </button>

            {/* Shuffle / Next Affirmation */}
            <button
              type="button"
              onClick={handleNextAffirmation}
              className="flex items-center gap-1.5 rounded-full border border-white/10 bg-neutral-800 px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-200 hover:bg-neutral-700 hover:text-white transition-colors"
              title="Get a new randomized encouraging message"
            >
              <RefreshCw className="h-3.5 w-3.5 text-yellow-400 transition-transform active:rotate-180" />
              <span>New Affirmation 🔄</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pop-up Celebration reaction when stamped */}
      {showCelebrationBadge && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in zoom-in duration-200 z-20 p-4">
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-yellow-300 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 p-5 text-center text-sky-950 shadow-2xl animate-bounce">
            <span className="text-4xl">🌟🎉</span>
            <h4 className="mt-1 font-['Fredoka'] text-lg font-black">
              Woohoo, Superstar!
            </h4>
            <p className="mt-0.5 text-xs font-bold text-sky-950/90">
              You affirmed your morning superpower! MP is super proud of you today!
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
