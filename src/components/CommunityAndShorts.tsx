import React, { useState } from 'react';
import { MPCharacter } from './ChrisCharacter';
import { sound } from '../utils/audio';
import { ThumbsUp, MessageSquare, Check, Trophy, Play } from 'lucide-react';

export const CommunityAndShorts: React.FC = () => {
  const [pollVoted, setPollVoted] = useState<number | null>(null);
  const [pollVotes, setPollVotes] = useState([
    { text: '🪥 Brushing teeth before bed', count: 4820 },
    { text: '🥦 Eating rainbow broccoli & carrots', count: 3190 },
    { text: '🧸 60-second toy room cleanup frenzy', count: 6410 },
    { text: '🤝 Sharing mega blocks with best friend', count: 2150 },
  ]);

  const totalVotes = pollVotes.reduce((acc, curr) => acc + curr.count, 0);

  const handleVote = (idx: number) => {
    if (pollVoted !== null) return;
    sound.playSfx('sparkle');
    setPollVoted(idx);
    setPollVotes(prev =>
      prev.map((opt, i) => (i === idx ? { ...opt, count: opt.count + 1 } : opt))
    );
  };

  const shorts = [
    { id: 1, title: 'MP 1-minute tooth brushing dance! 🪥✨', views: '14.2M views', bg: 'from-sky-500 to-blue-700' },
    { id: 2, title: 'Secret golden coin inside the sweet machine?! 🍬🪙', views: '9.8M views', bg: 'from-amber-500 to-red-600' },
    { id: 3, title: 'Broccoli vs Candy Crunch Test! 🥦😋', views: '22.1M views', bg: 'from-emerald-500 to-teal-700' },
    { id: 4, title: 'MP cleans 20 racecars in 30 seconds! 🏎️💨', views: '18.4M views', bg: 'from-purple-500 to-pink-600' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 text-white animate-in fade-in duration-300">
      {/* Tab Header */}
      <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
        <Trophy className="w-6 h-6 text-yellow-400" />
        <div>
          <h2 className="text-2xl font-black font-['Fredoka'] text-yellow-300">
            Community & Shorts Channel Hub
          </h2>
          <p className="text-xs text-slate-300">
            Connect with 3.67M MP fans around the world!
          </p>
        </div>
      </div>

      {/* --- Section 1: Viral Shorts Shelf --- */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">⚡</span>
          <h3 className="text-lg font-bold">Trending MP Shorts</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {shorts.map((short) => (
            <div
              key={short.id}
              onClick={() => sound.playSfx('pop')}
              className={`aspect-[9/16] rounded-2xl bg-gradient-to-b ${short.bg} p-3.5 flex flex-col justify-between shadow-xl border-2 border-white/20 hover:scale-103 transition-transform cursor-pointer relative group overflow-hidden`}
            >
              <div className="flex items-center justify-between text-xs font-black">
                <span className="bg-black/40 px-2 py-0.5 rounded-full text-[10px]">SHORTS</span>
                <Play className="w-4 h-4 fill-white opacity-80 group-hover:scale-125 transition-transform" />
              </div>

              <div className="flex justify-center my-auto">
                <MPCharacter expression="excited" size="md" className="scale-110" />
              </div>

              <div>
                <h4 className="text-xs font-black text-white leading-tight drop-shadow line-clamp-2 mb-1">
                  {short.title}
                </h4>
                <div className="text-[10px] text-white/80 font-bold">{short.views}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- Section 2: Community Posts & Poll --- */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <span>📢 Channel Community Posts</span>
        </h3>

        {/* Post 1: Interactive Habit Poll */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-yellow-400 border border-yellow-200">
              <MPCharacter expression="happy" size="avatar" className="scale-125 translate-y-1" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>MP</span>
                <span className="bg-slate-500 text-white rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>
              <div className="text-xs text-slate-400">1 day ago • Channel Poll</div>
            </div>
          </div>

          <p className="text-sm text-slate-200 mb-4 font-medium">
            👋 Hello friends and super parents! MP is filming our next big episode with the toy robot! What good habit should MP conquer next? Vote below! 🗳️👇
          </p>

          {/* Poll Options */}
          <div className="space-y-2 mb-4">
            {pollVotes.map((opt, idx) => {
              const percent = Math.round((opt.count / totalVotes) * 100);
              const isSelected = pollVoted === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleVote(idx)}
                  disabled={pollVoted !== null}
                  className={`w-full relative overflow-hidden p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-yellow-400 bg-yellow-400/20 font-bold'
                      : 'border-white/10 bg-neutral-800/80 hover:bg-neutral-800'
                  }`}
                >
                  {/* Fill percentage background if voted */}
                  {pollVoted !== null && (
                    <div
                      className="absolute inset-y-0 left-0 bg-sky-500/20 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  )}

                  <span className="relative z-10 text-xs sm:text-sm text-white">
                    {opt.text}
                  </span>

                  {pollVoted !== null && (
                    <span className="relative z-10 text-xs font-mono font-bold text-yellow-300">
                      {percent}%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>{totalVotes.toLocaleString()} votes cast</span>
            <div className="flex items-center gap-3">
              <button onClick={() => sound.playSfx('pop')} className="flex items-center gap-1 hover:text-white cursor-pointer">
                <ThumbsUp className="w-3.5 h-3.5" /> <span>3.2K</span>
              </button>
              <button onClick={() => sound.playSfx('pop')} className="flex items-center gap-1 hover:text-white cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" /> <span>284</span>
              </button>
            </div>
          </div>
        </div>

        {/* Post 2: Milestone Celebration */}
        <div className="bg-neutral-900 border border-white/10 rounded-3xl p-5 shadow-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-yellow-400 border border-yellow-200">
              <MPCharacter expression="excited" size="avatar" className="scale-125 translate-y-1" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <span>MP</span>
                <span className="bg-slate-500 text-white rounded-full p-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              </div>
              <div className="text-xs text-slate-400">4 days ago</div>
            </div>
          </div>

          <p className="text-sm text-slate-200 mb-3">
            🎉 WE HIT 3.67 MILLION SUBSCRIBERS! 🏆✨ Thank you to every family, toddler, and friend who watches our good habit stories! MP loves you all so much! Stay tuned for more fun sweet machine episodes! 💛🚀
          </p>

          <div className="p-6 bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-around border-2 border-yellow-300">
            <MPCharacter expression="cheering" size="lg" />
            <div className="text-center">
              <div className="text-4xl">🏆</div>
              <div className="text-2xl font-black text-yellow-300 mt-1">3.67M CLUB</div>
              <div className="text-xs text-white/90">Official YouTube Milestone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
