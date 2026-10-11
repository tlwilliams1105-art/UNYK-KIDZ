import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
} from 'recharts';
import { sound } from '../utils/audio';
import {
  BarChart3,
  TrendingUp,
  Sparkles,
  Calendar,
  CheckCircle2,
  Flame,
  Star,
  Info,
} from 'lucide-react';

interface HabitConsistencyChartProps {
  todayHabits: { [key: string]: boolean };
  streakCount: number;
}

type ViewMode = 'daily' | 'trend' | 'category';

export const HabitConsistencyChart: React.FC<HabitConsistencyChartProps> = ({
  todayHabits,
  streakCount,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Habits total count for today
  const todayCompletedCount = useMemo(() => {
    return Object.values(todayHabits).filter(Boolean).length;
  }, [todayHabits]);

  // Daily Consistency for This Week (Mon to Sun)
  const dailyData = useMemo(() => {
    return [
      {
        name: 'Mon',
        fullName: 'Monday',
        completed: 5,
        total: 5,
        rate: 100,
        status: 'Perfect! ⭐',
        habits: '🪥 Teeth, 🥦 Veggies, 🧸 Cleanup, 📺 MP Show, 🌙 Bedtime',
        isToday: false,
      },
      {
        name: 'Tue',
        fullName: 'Tuesday',
        completed: 4,
        total: 5,
        rate: 80,
        status: 'Great Job! 👏',
        habits: '🪥 Teeth, 🥦 Veggies, 🧸 Cleanup, 📺 MP Show',
        isToday: false,
      },
      {
        name: 'Wed',
        fullName: 'Wednesday',
        completed: 5,
        total: 5,
        rate: 100,
        status: 'Perfect! ⭐',
        habits: '🪥 Teeth, 🥦 Veggies, 🧸 Cleanup, 📺 MP Show, 🌙 Bedtime',
        isToday: false,
      },
      {
        name: 'Thu',
        fullName: 'Thursday',
        completed: 4,
        total: 5,
        rate: 80,
        status: 'Great Job! 👏',
        habits: '🪥 Teeth, 🧸 Cleanup, 📺 MP Show, 🌙 Bedtime',
        isToday: false,
      },
      {
        name: 'Fri',
        fullName: 'Friday',
        completed: 5,
        total: 5,
        rate: 100,
        status: 'Perfect! ⭐',
        habits: '🪥 Teeth, 🥦 Veggies, 🧸 Cleanup, 📺 MP Show, 🌙 Bedtime',
        isToday: false,
      },
      {
        name: 'Sat (Today)',
        fullName: 'Saturday (Today)',
        completed: todayCompletedCount,
        total: 5,
        rate: Math.round((todayCompletedCount / 5) * 100),
        status: todayCompletedCount === 5 ? 'All Complete! 🔥' : 'In Progress ⏳',
        habits:
          Object.entries(todayHabits)
            .filter(([, done]) => done)
            .map(([k]) =>
              k === 'teeth'
                ? '🪥 Teeth'
                : k === 'veggies'
                ? '🥦 Veggies'
                : k === 'cleanup'
                ? '🧸 Cleanup'
                : k === 'show'
                ? '📺 MP Show'
                : '🌙 Bedtime'
            )
            .join(', ') || 'No habits checked yet',
        isToday: true,
      },
      {
        name: 'Sun',
        fullName: 'Sunday (Tomorrow)',
        completed: 0,
        total: 5,
        rate: 0,
        status: 'Scheduled 📅',
        habits: '5 habits planned on Google Calendar',
        isToday: false,
        isUpcoming: true,
      },
    ];
  }, [todayCompletedCount, todayHabits]);

  // 4-Week Consistency Trend Over Time
  const weeklyTrendData = useMemo(() => {
    // Current week dynamic rate (Mon-Sat completed habits / total so far)
    const currentWeekDone = 5 + 4 + 5 + 4 + 5 + todayCompletedCount;
    const currentWeekTarget = 30; // 6 days elapsed
    const currentWeekRate = Math.round((currentWeekDone / currentWeekTarget) * 100);

    return [
      {
        name: 'Week 1',
        fullName: '3 Weeks Ago',
        rate: 74,
        completedHabits: 26,
        targetHabits: 35,
        stars: 3,
        streakPeak: 3,
        note: 'Initial Habit Foundation',
      },
      {
        name: 'Week 2',
        fullName: '2 Weeks Ago',
        rate: 83,
        completedHabits: 29,
        targetHabits: 35,
        stars: 4,
        streakPeak: 5,
        note: '+9% Consistency Growth',
      },
      {
        name: 'Week 3',
        fullName: 'Last Week',
        rate: 89,
        completedHabits: 31,
        targetHabits: 35,
        stars: 4,
        streakPeak: 6,
        note: 'Super Habit Hero Streak',
      },
      {
        name: 'This Week',
        fullName: 'Current Week',
        rate: currentWeekRate,
        completedHabits: currentWeekDone,
        targetHabits: currentWeekTarget,
        stars: currentWeekRate >= 90 ? 5 : 4,
        streakPeak: streakCount,
        note: 'Active Golden Streak 🔥',
        isCurrent: true,
      },
    ];
  }, [todayCompletedCount, streakCount]);

  // Category Breakdown Data
  const categoryData = useMemo(() => {
    const teethScore = todayHabits.teeth ? 96 : 89;
    const veggiesScore = todayHabits.veggies ? 91 : 84;
    const cleanupScore = todayHabits.cleanup ? 86 : 80;
    const showScore = todayHabits.show ? 100 : 92;
    const bedtimeScore = todayHabits.bedtime ? 92 : 82;

    return [
      {
        name: '🪥 Teeth',
        fullName: 'Toothbrushing Routine',
        rate: teethScore,
        daysPerWeek: '6.7 / 7 days',
        badge: 'Sugar Bug Slayer',
      },
      {
        name: '🥦 Veggies',
        fullName: 'Rainbow Veggie Lunch',
        rate: veggiesScore,
        daysPerWeek: '6.4 / 7 days',
        badge: 'Crunch Master',
      },
      {
        name: '🧸 Cleanup',
        fullName: 'Toy Chest Cleanup',
        rate: cleanupScore,
        daysPerWeek: '6.0 / 7 days',
        badge: 'Room Champion',
      },
      {
        name: '📺 MP Show',
        fullName: 'MP Episode & Song Time',
        rate: showScore,
        daysPerWeek: '7.0 / 7 days',
        badge: 'Top Fan Award',
      },
      {
        name: '🌙 Bedtime',
        fullName: 'Starlight Bedtime Routine',
        rate: bedtimeScore,
        daysPerWeek: '6.3 / 7 days',
        badge: 'Cozy Dreamer',
      },
    ];
  }, [todayHabits]);

  // Calculate overall consistency percentage
  const overallConsistencyRate = useMemo(() => {
    const activeDays = dailyData.filter((d) => !d.isUpcoming);
    const totalDone = activeDays.reduce((acc, cur) => acc + cur.completed, 0);
    const totalPossible = activeDays.length * 5;
    return Math.round((totalDone / totalPossible) * 100);
  }, [dailyData]);

  const handleTabChange = (mode: ViewMode) => {
    sound.playSfx('pop');
    setViewMode(mode);
  };

  // Bar colors by value
  const getBarColor = (rate: number, isToday?: boolean, isUpcoming?: boolean) => {
    if (isUpcoming) return '#475569';
    if (isToday) return '#facc15'; // Vibrant gold for today
    if (rate >= 95) return '#10b981'; // Emerald 500
    if (rate >= 80) return '#06b6d4'; // Cyan 500
    if (rate >= 60) return '#f59e0b'; // Amber 500
    return '#f43f5e'; // Rose 500
  };

  // Custom Recharts Tooltip
  const CustomDailyTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900/95 border-2 border-yellow-400 p-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-white text-xs">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-2">
            <span className="font-extrabold text-yellow-300 text-sm font-['Fredoka']">
              {data.fullName}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                data.rate >= 90
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-400/40'
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Habits Completed:</span>
              <strong className="text-white">
                {data.completed} of {data.total}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Consistency Score:</span>
              <strong className="text-yellow-300">{data.rate}%</strong>
            </div>
            <div className="pt-1.5 border-t border-white/10 text-slate-300">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                Completed:
              </span>
              <span className="text-[10px] leading-tight text-white block">{data.habits}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900/95 border-2 border-yellow-400 p-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-white text-xs">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-2">
            <span className="font-extrabold text-yellow-300 text-sm font-['Fredoka']">
              {data.name} ({data.fullName})
            </span>
            <span className="text-xs">{'⭐'.repeat(data.stars)}</span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Weekly Consistency:</span>
              <strong className="text-emerald-400 text-sm font-black">{data.rate}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Habits Done:</span>
              <strong className="text-white">
                {data.completedHabits} / {data.targetHabits}
              </strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Streak Peak:</span>
              <strong className="text-yellow-300 font-bold">{data.streakPeak} Days 🔥</strong>
            </div>
            <div className="pt-1 border-t border-white/10 text-[10px] text-sky-300 font-semibold">
              {data.note}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomCategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-neutral-900/95 border-2 border-yellow-400 p-3 rounded-2xl shadow-2xl backdrop-blur-md max-w-xs text-white text-xs">
          <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5 mb-2">
            <span className="font-extrabold text-yellow-300 text-sm font-['Fredoka']">
              {data.fullName}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-400/30">
              {data.badge}
            </span>
          </div>

          <div className="space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Consistency Rate:</span>
              <strong className="text-emerald-400 text-sm font-black">{data.rate}%</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-semibold">Weekly Frequency:</span>
              <strong className="text-white">{data.daysPerWeek}</strong>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mb-8 bg-neutral-900/95 border-2 border-yellow-400/40 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Chart Top Header & Nav */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full tracking-wider">
              Recharts Analytics
            </span>
            <span className="bg-yellow-400/20 text-yellow-300 border border-yellow-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current text-orange-400" />
              {streakCount}-Day Streak Active
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-['Fredoka'] mt-1 flex items-center gap-2.5">
            <BarChart3 className="w-7 h-7 text-yellow-400" />
            <span>Weekly Habit Completion Consistency</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Visualize your good habit progress over time with interactive consistency bar analytics!
          </p>
        </div>

        {/* View Switch Buttons */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1.5 rounded-2xl border border-white/10 self-stretch md:self-auto justify-center">
          <button
            onClick={() => handleTabChange('daily')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'daily'
                ? 'bg-yellow-400 text-sky-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Daily (This Week)</span>
          </button>
          <button
            onClick={() => handleTabChange('trend')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'trend'
                ? 'bg-yellow-400 text-sky-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>4-Week Trend</span>
          </button>
          <button
            onClick={() => handleTabChange('category')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'category'
                ? 'bg-yellow-400 text-sky-950 font-black shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>By Habit</span>
          </button>
        </div>
      </div>

      {/* Stats Quick Badges */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        <div className="bg-black/30 border border-white/10 rounded-2xl p-3 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Week Consistency</div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 font-['Fredoka'] mt-0.5">
            {overallConsistencyRate}%
          </div>
          <div className="text-[10px] text-emerald-300 font-semibold flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+15% vs Month 1</span>
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-2xl p-3 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Today's Progress</div>
          <div className="text-xl sm:text-2xl font-black text-yellow-300 font-['Fredoka'] mt-0.5">
            {todayCompletedCount}/5 Habits
          </div>
          <div className="text-[10px] text-yellow-200 font-semibold">
            {todayCompletedCount === 5 ? '100% Done Today! 🎉' : 'Tap to finish remaining!'}
          </div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-2xl p-3 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Most Consistent</div>
          <div className="text-sm sm:text-base font-black text-sky-300 truncate mt-1">
            🪥 Toothbrushing
          </div>
          <div className="text-[10px] text-sky-200 font-semibold">96% All-Time Accuracy</div>
        </div>

        <div className="bg-black/30 border border-white/10 rounded-2xl p-3 text-center">
          <div className="text-[10px] uppercase font-bold text-slate-400">Sweet Coin Multiplier</div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 font-['Fredoka'] mt-0.5">
            2.5x Bonus 🪙
          </div>
          <div className="text-[10px] text-amber-200 font-semibold">Streak reward active</div>
        </div>
      </div>

      {/* Main Recharts Bar Chart Area */}
      <div className="relative z-10 w-full h-[320px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'daily' ? (
            <BarChart
              data={dailyData}
              margin={{ top: 20, right: 15, left: -10, bottom: 10 }}
              onMouseMove={(state: any) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setHoveredIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 700 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                unit="%"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip content={<CustomDailyTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
              <ReferenceLine
                y={100}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: 'Target: 100% Habit Master ⭐',
                  fill: '#34d399',
                  fontSize: 10,
                  position: 'top',
                }}
              />
              <Bar
                dataKey="rate"
                name="Consistency Rate"
                radius={[10, 10, 0, 0]}
                animationDuration={900}
                isAnimationActive={true}
              >
                {dailyData.map((entry, index) => (
                  <Cell
                    key={`daily-cell-${index}`}
                    fill={getBarColor(entry.rate, entry.isToday, entry.isUpcoming)}
                    stroke={entry.isToday ? '#ffffff' : hoveredIndex === index ? '#fde047' : 'none'}
                    strokeWidth={entry.isToday ? 2 : hoveredIndex === index ? 1.5 : 0}
                    className="transition-all duration-300"
                  />
                ))}
              </Bar>
            </BarChart>
          ) : viewMode === 'trend' ? (
            <BarChart
              data={weeklyTrendData}
              margin={{ top: 20, right: 15, left: -10, bottom: 10 }}
              onMouseMove={(state: any) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setHoveredIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 700 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                unit="%"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip content={<CustomTrendTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
              <ReferenceLine
                y={85}
                stroke="#38bdf8"
                strokeDasharray="4 4"
                label={{
                  value: 'Consistency Benchmark (85%)',
                  fill: '#38bdf8',
                  fontSize: 10,
                  position: 'top',
                }}
              />
              <Bar
                dataKey="rate"
                name="Weekly Consistency"
                radius={[10, 10, 0, 0]}
                animationDuration={900}
                isAnimationActive={true}
              >
                {weeklyTrendData.map((entry, index) => (
                  <Cell
                    key={`trend-cell-${index}`}
                    fill={entry.isCurrent ? '#facc15' : getBarColor(entry.rate)}
                    stroke={entry.isCurrent ? '#ffffff' : hoveredIndex === index ? '#fde047' : 'none'}
                    strokeWidth={entry.isCurrent ? 2 : hoveredIndex === index ? 1.5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={categoryData}
              margin={{ top: 20, right: 15, left: -10, bottom: 10 }}
              onMouseMove={(state: any) => {
                if (state && state.activeTooltipIndex !== undefined) {
                  setHoveredIndex(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#64748b"
                tick={{ fill: '#cbd5e1', fontSize: 11, fontWeight: 700 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
                unit="%"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
                tickLine={false}
              />
              <Tooltip content={<CustomCategoryTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }} />
              <ReferenceLine
                y={80}
                stroke="#f59e0b"
                strokeDasharray="4 4"
                label={{
                  value: 'Habit Mastery Line (80%)',
                  fill: '#f59e0b',
                  fontSize: 10,
                  position: 'top',
                }}
              />
              <Bar
                dataKey="rate"
                name="Category Consistency"
                radius={[10, 10, 0, 0]}
                animationDuration={900}
                isAnimationActive={true}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cat-cell-${index}`}
                    fill={getBarColor(entry.rate)}
                    stroke={hoveredIndex === index ? '#ffffff' : 'none'}
                    strokeWidth={hoveredIndex === index ? 1.5 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Chart Legend & Kid Insights */}
      <div className="relative z-10 mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Color Legend */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-bold text-slate-400">Legend:</span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="w-3 h-3 rounded-md bg-yellow-400 inline-block shadow-sm" />
            <span>Today (Active)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="w-3 h-3 rounded-md bg-emerald-500 inline-block shadow-sm" />
            <span>95%+ (Mastery)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="w-3 h-3 rounded-md bg-cyan-500 inline-block shadow-sm" />
            <span>80-94% (Great)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
            <span className="w-3 h-3 rounded-md bg-slate-600 inline-block" />
            <span>Upcoming</span>
          </div>
        </div>

        {/* Motivational MP Advice */}
        <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/20 px-3 py-1.5 rounded-xl text-[11px] text-yellow-200">
          <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
          <span>
            {todayCompletedCount === 5
              ? "🌟 Perfect day! Today's golden bar is glowing at 100%!"
              : `Complete ${5 - todayCompletedCount} more habit${
                  5 - todayCompletedCount === 1 ? '' : 's'
                } today to raise today's bar to 100%!`}
          </span>
        </div>
      </div>
    </div>
  );
};
