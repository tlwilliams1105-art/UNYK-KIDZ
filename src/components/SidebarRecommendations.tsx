import React, { useState } from 'react';
import { Episode, EPISODES } from '../data/episodes';
import { ChrisCharacter } from './ChrisCharacter';
import { sound } from '../utils/audio';
import { Check, Sparkles } from 'lucide-react';

interface SidebarRecommendationsProps {
  currentEpisodeId: string;
  onSelectEpisode: (ep: Episode) => void;
}

export const SidebarRecommendations: React.FC<SidebarRecommendationsProps> = ({
  currentEpisodeId,
  onSelectEpisode,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [autoplay, setAutoplay] = useState(true);

  const categories = ['All', 'Good Habits', 'Toy Adventures', 'Songs & Learning', 'Bedtime Stories'];

  const filteredEpisodes = EPISODES.filter((ep) => {
    if (selectedFilter === 'All') return true;
    return ep.category === selectedFilter;
  });

  return (
    <div className="w-full text-white">
      {/* Category Pills Header */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedFilter(cat);
              sound.playSfx('pop');
            }}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              selectedFilter === cat
                ? 'bg-white text-black'
                : 'bg-neutral-800 text-slate-300 hover:bg-neutral-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Autoplay Toggle Row */}
      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
        <span className="font-semibold text-slate-300">Up Next</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <span>Autoplay</span>
          <input
            type="checkbox"
            checked={autoplay}
            onChange={(e) => setAutoplay(e.target.checked)}
            className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
          />
        </label>
      </div>

      {/* Video Cards List */}
      <div className="space-y-3">
        {filteredEpisodes.map((ep) => {
          const isCurrent = ep.id === currentEpisodeId;
          return (
            <div
              key={ep.id}
              onClick={() => {
                if (!isCurrent) {
                  sound.playSfx('pop');
                  onSelectEpisode(ep);
                }
              }}
              className={`flex gap-3 group p-1.5 rounded-xl transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-sky-500/15 border border-sky-500/30'
                  : 'hover:bg-neutral-800/80'
              }`}
            >
              {/* Thumbnail Container */}
              <div
                className="relative w-40 sm:w-44 aspect-video rounded-xl overflow-hidden shrink-0 shadow-md border border-white/10"
                style={{ backgroundColor: ep.thumbnailTheme.bg }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-25 flex items-center justify-center text-xl select-none font-bold text-white">
                  <span>🚀 ⭐ 🚗</span>
                </div>

                {/* Small Chris Face on Thumbnail */}
                <div className="absolute -bottom-1 -right-1 transform scale-75 origin-bottom-right">
                  <ChrisCharacter expression="happy" size="avatar" />
                </div>

                {/* Comic Badge Title */}
                <div className="absolute top-1.5 left-2 bg-yellow-400 text-sky-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                  MP SHOW
                </div>

                {/* Duration Badge */}
                <span className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {ep.duration}
                </span>

                {isCurrent && (
                  <div className="absolute inset-0 bg-sky-600/40 backdrop-blur-xs flex items-center justify-center">
                    <span className="bg-sky-400 text-black font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow">
                      PLAYING NOW
                    </span>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-100 group-hover:text-sky-300 line-clamp-2 leading-snug">
                    {ep.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <span>MP kids show</span>
                    <span className="bg-slate-500 text-white rounded-full p-0.5">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                  <span>{ep.views.split(' ')[0]} views</span>
                  <span>•</span>
                  <span>{ep.uploadDate}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
