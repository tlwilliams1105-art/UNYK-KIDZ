import React, { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { googleSignIn, logout, initAuth } from '../utils/firebaseAuth';
import {
  CalendarEvent,
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
} from '../utils/googleCalendar';
import { sound } from '../utils/audio';
import { HabitConsistencyChart } from './HabitConsistencyChart';
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  LogOut,
  UserCheck,
  Flame,
  Trophy,
  Award,
  Star,
  Zap,
  Check,
  Crown,
  BookOpen,
} from 'lucide-react';
import { SuperHabitCelebrationModal } from './SuperHabitCelebrationModal';

interface CalendarHabitPlannerProps {
  onEarnSticker?: (stickerId: string) => void;
  onViewStickerAlbum?: () => void;
  onOpenCertificates?: (presetId?: string) => void;
}

export const CalendarHabitPlanner: React.FC<CalendarHabitPlannerProps> = ({
  onEarnSticker,
  onViewStickerAlbum,
  onOpenCertificates,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- Daily Habit Streak State ---
  const [streakCount, setStreakCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('mp_habit_streak');
      return saved ? parseInt(saved, 10) : 6;
    } catch {
      return 6;
    }
  });

  const [todayHabits, setTodayHabits] = useState<{ [key: string]: boolean }>(() => {
    try {
      const saved = localStorage.getItem('mp_today_habits');
      return saved
        ? JSON.parse(saved)
        : {
            teeth: true,
            veggies: true,
            cleanup: true,
            show: true,
            bedtime: false,
          };
    } catch {
      return {
        teeth: true,
        veggies: true,
        cleanup: true,
        show: true,
        bedtime: false,
      };
    }
  });

  // Track consecutive completed days for each individual habit (e.g. 6 days done, next completes 7)
  const [habitStreaks, setHabitStreaks] = useState<{ [habitId: string]: number }>(() => {
    try {
      const saved = localStorage.getItem('mp_habit_streaks_map');
      return saved
        ? JSON.parse(saved)
        : {
            teeth: 6,
            veggies: 6,
            cleanup: 6,
            show: 6,
            bedtime: 6,
          };
    } catch {
      return {
        teeth: 6,
        veggies: 6,
        cleanup: 6,
        show: 6,
        bedtime: 6,
      };
    }
  });

  // 7-Day progress strip completion state (Mon through Sun)
  const [weekDayStatus, setWeekDayStatus] = useState<boolean[]>(() => {
    try {
      const saved = localStorage.getItem('mp_weekday_status');
      return saved ? JSON.parse(saved) : [true, true, true, true, true, true, false];
    } catch {
      return [true, true, true, true, true, true, false];
    }
  });

  // Exclusive 'Super Habit' Sticker unlocked state
  const [isSuperHabitUnlocked, setIsSuperHabitUnlocked] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mp_super_habit_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  // Celebration Modals State
  const [showSuperHabitCelebration, setShowSuperHabitCelebration] = useState(false);
  const [celebratedHabitTitle, setCelebratedHabitTitle] = useState<string>('Daily Habits');
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [streakRewardText, setStreakRewardText] = useState<string>('');

  // New Event Form State
  const [summary, setSummary] = useState('🪥 Morning Toothbrushing with MP');
  const [description, setDescription] = useState(
    'Brush teeth for 2 minutes to chase away the sugar bugs! As learned on MP.'
  );
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('08:00');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Confirmation Modals State
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteTitle, setConfirmDeleteTitle] = useState<string>('');
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  // Presets
  const presets = [
    {
      title: '🪥 Morning Toothbrushing with MP',
      desc: 'Brush teeth for 2 minutes with foamy bubbles to chase away sugar bugs! ⭐',
      time: '08:00',
      duration: 15,
    },
    {
      title: '🥦 Rainbow Veggie Power Lunch',
      desc: 'Eat crunchy broccoli, carrots, and apples for super energy like MP! 🥕',
      time: '12:30',
      duration: 30,
    },
    {
      title: '🧸 Playroom Toy Cleanup Frenzy',
      desc: 'Pack racecars, soccer balls, and teddy bears safely into the toy chest! 🏎️',
      time: '17:30',
      duration: 20,
    },
    {
      title: '📺 MP - Sweet Machine Episode Time',
      desc: 'Family watch time: Learn good habits with the magical sweet machine on YouTube! 🍬',
      time: '18:00',
      duration: 30,
    },
    {
      title: '🌙 Bedtime Routine & Starlight Sleep',
      desc: 'Warm bath, cozy bear pajamas, brushing teeth, and peaceful lullaby! 🐻✨',
      time: '20:00',
      duration: 45,
    },
  ];

  // Daily Habit Items List
  const habitItems = [
    { id: 'teeth', label: 'Morning Toothbrushing', icon: '🪥', soundType: 'brush' as const },
    { id: 'veggies', label: 'Rainbow Veggie Lunch', icon: '🥦', soundType: 'crunch' as const },
    { id: 'cleanup', label: 'Playroom Toy Cleanup', icon: '🧸', soundType: 'pop' as const },
    { id: 'show', label: 'MP Story & Song', icon: '📺', soundType: 'sparkle' as const },
    { id: 'bedtime', label: 'Cozy Bedtime Routine', icon: '🌙', soundType: 'sparkle' as const },
  ];

  const completedCount = Object.values(todayHabits).filter(Boolean).length;
  const isAllTodayCompleted = completedCount === habitItems.length;

  // Streak Milestones for Kids Rewards
  const milestones = [
    { days: 3, name: 'Bronze Habit Star', icon: '⭐', reward: '+3 Sweet Machine Coins', unlocked: streakCount >= 3 },
    { days: 5, name: 'Silver Habit Hero', icon: '🔥', reward: 'Habit Champion Badge', unlocked: streakCount >= 5 },
    { days: 7, name: 'Super Habit Hero', icon: '⚡👑', reward: "Exclusive 'Super Habit' Sticker", unlocked: streakCount >= 7 || isSuperHabitUnlocked },
    { days: 14, name: 'Diamond Legend Trophy', icon: '💎', reward: "MP's Best Friend Award", unlocked: streakCount >= 14 },
  ];

  // 7-day strip (Mon through Sun)
  const weekDays = [
    { label: 'Mon', completed: weekDayStatus[0], dayNum: 1 },
    { label: 'Tue', completed: weekDayStatus[1], dayNum: 2 },
    { label: 'Wed', completed: weekDayStatus[2], dayNum: 3 },
    { label: 'Thu', completed: weekDayStatus[3], dayNum: 4 },
    { label: 'Fri', completed: weekDayStatus[4], dayNum: 5 },
    { label: 'Today', completed: weekDayStatus[5] || isAllTodayCompleted, dayNum: 6, isToday: true },
    { label: 'Sun', completed: weekDayStatus[6], dayNum: 7 },
  ];

  // Trigger celebration and unlock the exclusive Super Habit sticker
  const triggerSuperHabitUnlock = (habitName = 'Daily Good Habits') => {
    setIsSuperHabitUnlocked(true);
    try {
      localStorage.setItem('mp_super_habit_unlocked', 'true');
    } catch {
      // Ignore
    }

    // Mark all 7 days complete on progress strip
    const allSeven = [true, true, true, true, true, true, true];
    setWeekDayStatus(allSeven);
    try {
      localStorage.setItem('mp_weekday_status', JSON.stringify(allSeven));
    } catch {
      // Ignore
    }

    if (streakCount < 7) {
      setStreakCount(7);
      try {
        localStorage.setItem('mp_habit_streak', '7');
      } catch {
        // Ignore
      }
    }

    // Persist and inform parent sticker collection
    onEarnSticker?.('stk-super-habit');
    setCelebratedHabitTitle(habitName);
    setShowSuperHabitCelebration(true);
  };

  const handleToggleWeekDay = (index: number) => {
    sound.playSfx('pop');
    const updated = [...weekDayStatus];
    updated[index] = !updated[index];
    setWeekDayStatus(updated);
    try {
      localStorage.setItem('mp_weekday_status', JSON.stringify(updated));
    } catch {
      // Ignore
    }

    // If all 7 days of the habit cycle are completed, trigger celebration!
    if (updated.every(Boolean)) {
      triggerSuperHabitUnlock('7-Day Habit Calendar Challenge');
    }
  };

  // Handle toggling an individual habit
  const handleToggleHabit = (habitId: string) => {
    const target = habitItems.find((h) => h.id === habitId);
    if (target?.soundType) {
      sound.playSfx(target.soundType);
    } else {
      sound.playSfx('sparkle');
    }

    const wasChecked = !!todayHabits[habitId];
    const willBeChecked = !wasChecked;

    // Track consecutive streak for this specific habit
    const currentHabitStreak = habitStreaks[habitId] ?? 6;
    const nextHabitStreak = willBeChecked ? currentHabitStreak + 1 : Math.max(0, currentHabitStreak - 1);
    const updatedHabitStreaks = { ...habitStreaks, [habitId]: nextHabitStreak };
    setHabitStreaks(updatedHabitStreaks);
    try {
      localStorage.setItem('mp_habit_streaks_map', JSON.stringify(updatedHabitStreaks));
    } catch {
      // ignore
    }

    setTodayHabits((prev) => {
      const next = { ...prev, [habitId]: willBeChecked };
      try {
        localStorage.setItem('mp_today_habits', JSON.stringify(next));
      } catch {
        // Ignore storage errors
      }

      // If all habits are completed with this check
      const nextCompletedCount = Object.values(next).filter(Boolean).length;
      if (nextCompletedCount === habitItems.length && willBeChecked) {
        const nextStreak = streakCount + 1;
        if (nextStreak >= 7) {
          triggerSuperHabitUnlock(target?.label || 'All Daily Habits');
        } else {
          triggerStreakBonus(nextStreak);
        }
      } else if (willBeChecked && nextHabitStreak >= 7) {
        // Individual habit completed 7 consecutive days!
        triggerSuperHabitUnlock(target?.label || 'Good Habit');
      }
      return next;
    });
  };

  // Trigger streak increment & celebration fanfare
  const triggerStreakBonus = (newStreak: number) => {
    if (newStreak >= 7) {
      triggerSuperHabitUnlock('Daily Habits');
      return;
    }
    sound.playSfx('fanfare');
    sound.playSfx('cheer');
    setStreakCount(newStreak);
    try {
      localStorage.setItem('mp_habit_streak', newStreak.toString());
    } catch {
      // Ignore
    }
    setStreakRewardText(`🎉 Incredible! ${newStreak}-Day Habit Streak Achieved! +5 Bonus Habit Coins Awarded! 🪙✨`);
    setShowStreakCelebration(true);
    setTimeout(() => setShowStreakCelebration(false), 5000);
  };

  const handleMarkAllCompleted = () => {
    const allDone: { [key: string]: boolean } = {};
    habitItems.forEach((h) => {
      allDone[h.id] = true;
    });
    setTodayHabits(allDone);
    try {
      localStorage.setItem('mp_today_habits', JSON.stringify(allDone));
    } catch {
      // Ignore
    }
    const nextStreak = streakCount + 1;
    if (nextStreak >= 7) {
      triggerSuperHabitUnlock('All Daily Habits');
    } else {
      triggerStreakBonus(nextStreak);
    }
  };

  // Initialize Auth on mount
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        loadEvents(currentToken);
      },
      () => {
        setUser(null);
        setToken(null);
        setEvents([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const loadEvents = async (accessToken: string) => {
    setIsLoadingEvents(true);
    setErrorMessage(null);
    try {
      const data = await fetchCalendarEvents(accessToken);
      setEvents(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load Google Calendar events';
      console.error(err);
      setErrorMessage(msg);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setUser(result.user);
        setToken(result.accessToken);
        sound.playSfx('fanfare');
        loadEvents(result.accessToken);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Sign-in was cancelled or failed';
      setErrorMessage(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    sound.playSfx('pop');
    await logout();
    setUser(null);
    setToken(null);
    setEvents([]);
  };

  const handleApplyPreset = (p: typeof presets[0]) => {
    sound.playSfx('pop');
    setSummary(p.title);
    setDescription(p.desc);
    setTime(p.time);
    setDurationMinutes(p.duration);
  };

  // Explicit confirmation before creating event
  const handleRequestCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim()) return;
    setShowCreateConfirm(true);
  };

  const handleExecuteCreate = async () => {
    setShowCreateConfirm(false);
    if (!token) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + durationMinutes * 60000);

      const newEvent: CalendarEvent = {
        summary: summary.trim(),
        description: description.trim(),
        start: {
          dateTime: startDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        end: {
          dateTime: endDateTime.toISOString(),
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
      };

      const created = await createCalendarEvent(token, newEvent);
      sound.playSfx('fanfare');
      sound.playSfx('cheer');
      setSuccessMessage(`Added "${created.summary}" to your Google Calendar!`);
      setTimeout(() => setSuccessMessage(null), 4000);
      loadEvents(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create event in Google Calendar';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Explicit confirmation before deleting event
  const handleRequestDelete = (eventId: string, eventTitle: string) => {
    setConfirmDeleteId(eventId);
    setConfirmDeleteTitle(eventTitle || 'this event');
  };

  const handleExecuteDelete = async () => {
    if (!token || !confirmDeleteId) return;

    const targetId = confirmDeleteId;
    setConfirmDeleteId(null);
    setIsLoadingEvents(true);
    try {
      sound.playSfx('pop');
      await deleteCalendarEvent(token, targetId);
      sound.playSfx('sparkle');
      setSuccessMessage('Event removed from your Google Calendar.');
      setTimeout(() => setSuccessMessage(null), 3000);
      loadEvents(token);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete event';
      setErrorMessage(msg);
      setIsLoadingEvents(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-white animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="text-center mb-6">
        <span className="bg-yellow-400 text-sky-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
          Google Calendar & Daily Habit Tracking
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 mt-2 font-['Fredoka'] drop-shadow-md">
          MP's Good Habit Schedule & Watch Calendar 📅✨
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mt-1">
          Sync daily toothbrushing, veggie power lunches, toy cleanup challenges, and episode watch parties directly to your Google Calendar!
        </p>
      </div>

      {/* ========================================================================= */}
      {/* --- VISUAL DAILY HABIT STREAK COUNTER WIDGET --- */}
      {/* ========================================================================= */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 p-6 sm:p-7 shadow-2xl border-4 border-yellow-300">
        {/* Playful background glowing stars */}
        <div className="absolute -top-6 -right-6 text-yellow-300/20 text-9xl pointer-events-none select-none">
          🔥
        </div>
        <div className="absolute -bottom-10 -left-10 text-yellow-300/20 text-9xl pointer-events-none select-none">
          ⭐
        </div>

        {/* Streak Top Row: Counter Badge & Cheer */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-white/20">
          {/* Left: Big Animated Flame Counter */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-yellow-400 text-red-600 flex items-center justify-center shadow-xl border-4 border-white transform hover:scale-105 transition-transform">
              <Flame className="w-12 h-12 sm:w-14 sm:h-14 fill-current animate-bounce" />
              <div className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 shadow">
                <Zap className="w-4 h-4 fill-current" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-widest text-yellow-200 bg-black/30 px-3 py-0.5 rounded-full">
                  Daily Habit Streak
                </span>
                <span className="text-xs font-bold text-white bg-red-800/60 px-2.5 py-0.5 rounded-full">
                  Level {Math.max(1, Math.floor(streakCount / 3))}
                </span>
              </div>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-['Fredoka'] tracking-tight drop-shadow-md mt-1">
                {streakCount} Days Strong! 🔥
              </h3>
              <p className="text-xs sm:text-sm text-yellow-100 font-semibold mt-0.5">
                {isAllTodayCompleted
                  ? "⭐ Awesome! Today's habits are all complete! Streak protected!"
                  : `Complete all ${habitItems.length} daily habits today to keep your streak burning!`}
              </p>
            </div>
          </div>

          {/* Right: Quick Action / Reward Status */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-2xl border border-white/20 text-center sm:text-right">
              <div className="text-[10px] uppercase font-bold text-yellow-200">Sweet Machine Perk</div>
              <div className="text-sm font-black text-white flex items-center justify-center sm:justify-end gap-1">
                <span>⭐ 2x Habit Coin Multiplier</span>
              </div>
            </div>

            <button
              onClick={handleMarkAllCompleted}
              disabled={isAllTodayCompleted}
              className={`px-5 py-3 rounded-2xl font-black text-xs sm:text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                isAllTodayCompleted
                  ? 'bg-emerald-500 text-white border-2 border-emerald-300 opacity-90'
                  : 'bg-yellow-400 hover:bg-yellow-300 text-sky-950 border-2 border-white animate-pulse'
              }`}
            >
              <Check className="w-5 h-5 stroke-[3]" />
              <span>{isAllTodayCompleted ? 'Completed Today! ✅' : "Complete Today's Habits! 🎉"}</span>
            </button>
          </div>
        </div>

        {/* Streak Middle Row: 7-Day Consecutive Days Strip */}
        <div className="relative z-10 pt-5 pb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-yellow-200">
              7-Day Consecutive Progress (Tap day to toggle):
            </span>
            <span className="text-xs text-white/90 font-bold">
              {weekDays.filter((d) => d.completed).length} of 7 Days Completed
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {weekDays.map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleToggleWeekDay(idx)}
                title={`Day ${d.dayNum} (${d.label}): Click to toggle completion`}
                className={`flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer ${
                  d.completed
                    ? 'bg-yellow-400 text-sky-950 font-black shadow-lg border-2 border-white scale-102 hover:bg-yellow-300'
                    : d.isToday
                    ? 'bg-black/40 border-2 border-yellow-300 text-white animate-pulse hover:bg-black/60'
                    : 'bg-black/25 text-white/60 border border-white/10 hover:border-yellow-400/40 hover:bg-black/40'
                }`}
              >
                <span className="text-[10px] sm:text-xs font-bold uppercase">{d.label}</span>
                <div className="my-1 text-lg sm:text-2xl">
                  {d.completed ? '🔥' : d.isToday ? '⭐' : '⭕'}
                </div>
                <span className="text-[9px] font-semibold opacity-90">
                  {d.completed ? 'Done ✅' : d.isToday ? 'Today' : 'Upcoming'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Streak Bottom Row: Interactive Daily Habit Checklist */}
        <div className="relative z-10 bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <h4 className="font-extrabold text-sm text-white">
                Today's Habit Checklist (Tap to complete):
              </h4>
            </div>
            <span className="text-xs font-bold text-yellow-300">
              {Math.round((completedCount / habitItems.length) * 100)}% Complete
            </span>
          </div>

          {/* Habit Item Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5">
            {habitItems.map((habit) => {
              const isChecked = !!todayHabits[habit.id];
              const habitStreak = habitStreaks[habit.id] ?? 6;
              return (
                <button
                  key={habit.id}
                  onClick={() => handleToggleHabit(habit.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-500/30 border-emerald-400 text-white shadow'
                      : 'bg-white/10 border-white/15 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl shrink-0">{habit.icon}</span>
                    <div className="text-left truncate">
                      <div className="text-xs font-bold truncate">{habit.label}</div>
                      <div className="text-[9px] text-yellow-300 font-semibold">
                        {habitStreak >= 7 ? '⭐ 7d Streak!' : `${habitStreak}/7 days`}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${
                      isChecked
                        ? 'bg-emerald-400 border-white text-sky-950 font-black'
                        : 'border-white/30 bg-black/20 text-transparent'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Kids Milestone Rewards Shelf */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-yellow-200 font-bold">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>Milestone Rewards:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {milestones.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                    m.unlocked
                      ? 'bg-yellow-400 text-sky-950 border-white shadow'
                      : 'bg-black/30 text-white/50 border-white/10'
                  }`}
                  title={`${m.days} days streak unlocks: ${m.reward}`}
                >
                  <span>{m.icon}</span>
                  <span>{m.days}d: {m.name}</span>
                  {m.unlocked && <span className="text-[10px]">✨</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* --- EXCLUSIVE 'SUPER HABIT' STICKER UNLOCK SHOWCASE --- */}
      {/* ========================================================================= */}
      <div
        className={`mb-8 relative overflow-hidden rounded-3xl p-6 sm:p-7 border-4 transition-all shadow-2xl ${
          isSuperHabitUnlocked
            ? 'bg-gradient-to-r from-amber-500/25 via-yellow-500/20 to-sky-500/25 border-yellow-400 shadow-[0_0_40px_rgba(251,191,36,0.35)]'
            : 'bg-neutral-900/90 border-yellow-400/40 shadow-xl'
        }`}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left: Sticker Trophy Graphic & Lore */}
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="relative shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 p-1 border-3 border-white shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-2xl bg-sky-950 flex flex-col items-center justify-center p-1 border border-yellow-300">
                <span className="text-3xl sm:text-4xl animate-bounce">⚡👑</span>
                <span className="text-[8px] font-black uppercase tracking-wider text-yellow-300 mt-0.5">
                  SUPER HABIT
                </span>
              </div>
              {isSuperHabitUnlocked && (
                <div className="absolute -top-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border border-white shadow">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full bg-red-600 text-white tracking-wider">
                  Exclusive Reward
                </span>
                <span
                  className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    isSuperHabitUnlocked
                      ? 'bg-yellow-400 text-sky-950 border-white font-extrabold'
                      : 'bg-neutral-800 text-slate-300 border-white/10'
                  }`}
                >
                  {isSuperHabitUnlocked ? 'UNLOCKED! ✨' : '7 Consecutive Days Goal'}
                </span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white font-['Fredoka']">
                Exclusive ‘Super Habit’ Sticker
              </h4>
              <p className="text-xs text-slate-300 max-w-md mt-1 leading-relaxed">
                {isSuperHabitUnlocked
                  ? 'Congratulations! You completed 7 consecutive days of consistent habits and unlocked this exclusive sticker!'
                  : 'Complete 7 consecutive days of any good habit to trigger the celebratory fireworks and unlock this legendary sticker!'}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            {isSuperHabitUnlocked ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    sound.playSfx('sparkle');
                    setShowSuperHabitCelebration(true);
                  }}
                  className="px-5 py-2.5 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-sky-950 font-black text-xs sm:text-sm shadow-lg border-2 border-white flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 fill-sky-950" />
                  <span>Replay Celebration 🎉</span>
                </button>
                {onOpenCertificates && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSfx('fanfare');
                      onOpenCertificates('super-habit-7');
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-sky-950 font-black text-xs sm:text-sm border-2 border-white flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
                  >
                    <Award className="w-4 h-4 text-amber-900" />
                    <span>Print 7-Day Certificate 📜</span>
                  </button>
                )}
                {onViewStickerAlbum && (
                  <button
                    type="button"
                    onClick={() => {
                      sound.playSfx('pop');
                      onViewStickerAlbum();
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-slate-200 font-bold text-xs border border-white/10 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>View in Album 📖</span>
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={() => triggerSuperHabitUnlock('Daily Good Habits')}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-sky-950 font-black text-xs sm:text-sm shadow-xl border-2 border-white flex items-center gap-2 transform active:scale-95 transition-all cursor-pointer animate-pulse"
              >
                <Crown className="w-4 h-4 fill-sky-950" />
                <span>Trigger 7-Day Super Habit Celebration ⭐</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Streak Celebration Popup */}
      {showStreakCelebration && (
        <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 via-amber-300 to-orange-400 text-sky-950 rounded-2xl shadow-2xl border-4 border-white flex items-center justify-between animate-in zoom-in duration-300">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">🏆</span>
            <div>
              <div className="text-xs uppercase font-black text-red-700 tracking-wider">
                STREAK LEVEL UP!
              </div>
              <div className="text-base font-black leading-tight">{streakRewardText}</div>
            </div>
          </div>
          <button
            onClick={() => setShowStreakCelebration(false)}
            className="text-xs bg-sky-950 text-white font-bold px-3 py-1.5 rounded-xl cursor-pointer hover:bg-sky-900"
          >
            Yay! 🚀
          </button>
        </div>
      )}

      {/* Super Habit Celebratory Fullscreen Modal Animation */}
      <SuperHabitCelebrationModal
        isOpen={showSuperHabitCelebration}
        onClose={() => setShowSuperHabitCelebration(false)}
        onViewStickerAlbum={onViewStickerAlbum}
        onOpenCertificates={() => {
          if (onOpenCertificates) onOpenCertificates('super-habit-7');
        }}
        habitTitle={celebratedHabitTitle}
      />

      {/* --- RECHARTS-BASED WEEKLY HABIT COMPLETION CONSISTENCY BAR CHART --- */}
      <HabitConsistencyChart todayHabits={todayHabits} streakCount={streakCount} />

      {/* Notifications / Alerts */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-2xl flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-white hover:underline ml-2">
            Dismiss
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-400 rounded-2xl flex items-center gap-2 text-xs text-emerald-200 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Authentication Card */}
      {!user ? (
        <div className="bg-neutral-900 border-2 border-yellow-400/40 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-2xl">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-400/40">
            <CalendarIcon className="w-8 h-8 text-yellow-300" />
          </div>
          <h3 className="text-xl font-bold mb-2">Connect Your Google Calendar</h3>
          <p className="text-xs text-slate-300 mb-6 leading-relaxed">
            See and schedule good habit reminders for your kids with permission from your Google account. Never miss morning toothbrushing or MP episode premieres!
          </p>

          {/* Official "Sign in with Google" Button (Specified in SKILL.md) */}
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="group flex items-center gap-3 bg-white text-slate-800 hover:bg-slate-100 font-semibold text-sm px-6 py-3 rounded-full shadow-lg transition-transform active:scale-95 border border-slate-300 cursor-pointer"
            >
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  className="transition-all duration-300 group-hover:filter group-hover:drop-shadow-[0_0_8px_#FBBC05]"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Connected User Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-neutral-900 border border-white/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-10 h-10 rounded-full border border-yellow-400" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-sky-950 font-bold flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <span>{user.displayName || 'Google Calendar Connected'}</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    Active Sync
                  </span>
                </div>
                <div className="text-xs text-slate-400">{user.email}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => token && loadEvents(token)}
                disabled={isLoadingEvents}
                className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-slate-300 rounded-xl transition-colors cursor-pointer"
              >
                {isLoadingEvents ? 'Syncing...' : 'Refresh Calendar'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-red-400 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            </div>
          </div>

          {/* Habit Schedule Creator & Upcoming Events Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 6 cols: Add Habit Event Form & Presets */}
            <div className="lg:col-span-6 bg-neutral-900/90 border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-lg text-white">Schedule Good Habit Event</h3>
              </div>

              {/* Quick Presets */}
              <div className="mb-5">
                <span className="text-xs font-bold text-slate-300 block mb-2">
                  Quick Presets (Click to Load):
                </span>
                <div className="space-y-1.5">
                  {presets.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className="w-full text-left p-2 rounded-xl text-xs bg-neutral-800/60 hover:bg-neutral-800 border border-white/5 hover:border-yellow-400/40 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="font-semibold text-white">{p.title}</span>
                      <span className="text-slate-400 text-[11px]">{p.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Event Form */}
              <form onSubmit={handleRequestCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Event Title:</label>
                  <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Description / Goal:</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-black/40 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Date:</label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Time:</label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Duration:</label>
                    <select
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full bg-black/40 border border-white/15 rounded-xl px-2 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    >
                      <option value={15}>15 mins</option>
                      <option value={30}>30 mins</option>
                      <option value={45}>45 mins</option>
                      <option value={60}>1 hour</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-sky-950 font-black text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmitting ? 'Adding...' : 'Add to Google Calendar'}</span>
                </button>
              </form>
            </div>

            {/* Right 6 cols: Upcoming Google Calendar Events */}
            <div className="lg:col-span-6 bg-neutral-900/90 border border-white/10 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-sky-400" />
                  <h3 className="font-bold text-lg text-white">Upcoming Calendar Events</h3>
                </div>
                <span className="text-xs text-slate-400">
                  {events.length} event{events.length === 1 ? '' : 's'}
                </span>
              </div>

              {isLoadingEvents ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-sky-400 mb-2" />
                  <span className="text-xs">Fetching Google Calendar events...</span>
                </div>
              ) : events.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No upcoming events scheduled yet.</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pick a preset on the left to add your first MP habit routine!
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {events.map((evt) => {
                    const startRaw = evt.start.dateTime || evt.start.date || '';
                    const startDate = startRaw ? new Date(startRaw) : null;
                    const dateFormatted = startDate
                      ? startDate.toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '';
                    const timeFormatted = startDate && evt.start.dateTime
                      ? startDate.toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'All Day';

                    return (
                      <div
                        key={evt.id}
                        className="p-3.5 bg-neutral-800/80 border border-white/10 rounded-2xl flex items-start justify-between gap-3 hover:border-sky-400/40 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-1">
                            {evt.summary}
                          </h4>
                          {evt.description && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                              {evt.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-yellow-300 font-semibold mt-1.5">
                            <Clock className="w-3 h-3" />
                            <span>
                              {dateFormatted} at {timeFormatted}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {evt.htmlLink && (
                            <a
                              href={evt.htmlLink}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 hover:bg-neutral-700 text-slate-400 hover:text-white rounded-lg transition-colors"
                              title="Open in Google Calendar"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {evt.id && (
                            <button
                              onClick={() => handleRequestDelete(evt.id!, evt.summary)}
                              className="p-1.5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                              title="Remove from Calendar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- EXPLICIT USER CONFIRMATION MODAL FOR CREATING EVENT --- */}
      {showCreateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-yellow-400 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white">
            <h4 className="text-lg font-bold text-yellow-300 mb-2">
              Confirm Add to Google Calendar
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Are you sure you want to add this event to your primary Google Calendar?
            </p>
            <div className="bg-black/50 p-3 rounded-xl mb-6 text-xs space-y-1">
              <div><strong className="text-slate-400">Event:</strong> {summary}</div>
              <div><strong className="text-slate-400">Date & Time:</strong> {date} at {time} ({durationMinutes} mins)</div>
              {description && <div><strong className="text-slate-400">Details:</strong> {description}</div>}
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowCreateConfirm(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteCreate}
                className="px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-sky-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Confirm & Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- EXPLICIT USER CONFIRMATION MODAL FOR DELETING EVENT --- */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-neutral-900 border border-red-500 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white">
            <div className="flex items-center gap-2 text-red-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-lg font-bold">Delete Calendar Event?</h4>
            </div>
            <p className="text-xs text-slate-300 mb-4">
              Are you sure you want to delete <span className="font-bold text-white">"{confirmDeleteTitle}"</span> from your Google Calendar? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Delete Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
