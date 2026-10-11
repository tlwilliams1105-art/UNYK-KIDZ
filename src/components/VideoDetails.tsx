import React, { useState } from 'react';
import { Episode } from '../data/episodes';
import { MPCharacter } from './ChrisCharacter';
import { sound } from '../utils/audio';
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Check,
  Bell,
  CheckCircle2,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';

interface VideoDetailsProps {
  episode: Episode;
  isSubscribed: boolean;
  subscriberCount: number;
  onToggleSubscribe: () => void;
  onOpenShareModal: () => void;
  onOpenColoringModal: () => void;
  onOpenCertificates?: () => void;
}

export const VideoDetails: React.FC<VideoDetailsProps> = ({
  episode,
  isSubscribed,
  subscriberCount,
  onToggleSubscribe,
  onOpenShareModal,
  onOpenColoringModal,
  onOpenCertificates,
}) => {
  const [likes, setLikes] = useState(episode.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasDisliked, setHasDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const handleLike = () => {
    sound.playSfx('pop');
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
      if (hasDisliked) setHasDisliked(false);
      sound.playSfx('sparkle');
    }
  };

  const handleDislike = () => {
    sound.playSfx('pop');
    if (hasDisliked) {
      setHasDisliked(false);
    } else {
      setHasDisliked(true);
      if (hasLiked) {
        setLikes(prev => prev - 1);
        setHasLiked(false);
      }
    }
  };

  const handleSave = () => {
    sound.playSfx('sparkle');
    setIsSaved(!isSaved);
  };

  // Format subscribers: e.g. 3.67M
  const formatSubs = (count: number) => {
    return (count / 1000000).toFixed(2) + 'M subscribers';
  };

  // Format likes: e.g. 32K or 32,410
  const formatLikes = (count: number) => {
    if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div className="mt-3 text-white">
      {/* Video Title (Matches Screenshot) */}
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-50 leading-snug">
        {episode.title}
      </h1>

      {/* Channel Header & Video Action Buttons Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-white/10">
        {/* Left: Channel Info */}
        <div className="flex items-center gap-3">
          {/* Circular MP Avatar matching YouTube icon */}
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-yellow-400 bg-gradient-to-tr from-sky-400 to-yellow-300 shadow-md">
            <MPCharacter expression="happy" size="avatar" className="scale-125 translate-y-1" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white hover:text-sky-300 cursor-pointer transition-colors">
                MP
              </span>
              {/* Verified Badge */}
              <span className="bg-slate-500/80 text-white rounded-full p-0.5" title="Verified Channel">
                <Check className="w-3 h-3 stroke-[3]" />
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {formatSubs(subscriberCount)}
            </span>
          </div>

          {/* Subscribe Pill Button */}
          <div className="ml-2">
            <button
              onClick={onToggleSubscribe}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 cursor-pointer shadow-md ${
                isSubscribed
                  ? 'bg-neutral-800 text-slate-200 hover:bg-neutral-700 border border-white/10'
                  : 'bg-white text-black hover:bg-slate-200 active:scale-95'
              }`}
            >
              {isSubscribed ? (
                <>
                  <Bell className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-bounce" />
                  <span>Subscribed</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Actions (Like/Dislike, Share, Download, Save) */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Like & Dislike Segmented Pill */}
          <div className="flex items-center bg-neutral-800/90 rounded-full border border-white/10 overflow-hidden">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold hover:bg-neutral-700 transition-colors cursor-pointer border-r border-white/10 ${
                hasLiked ? 'text-sky-400' : 'text-slate-200'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-sky-400' : ''}`} />
              <span>{formatLikes(likes)}</span>
            </button>
            <button
              onClick={handleDislike}
              className={`px-3 py-2 hover:bg-neutral-700 transition-colors cursor-pointer ${
                hasDisliked ? 'text-red-400' : 'text-slate-200'
              }`}
              title="Dislike"
            >
              <ThumbsDown className={`w-4 h-4 ${hasDisliked ? 'fill-red-400' : ''}`} />
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={onOpenShareModal}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800/90 hover:bg-neutral-700 text-slate-200 rounded-full text-sm font-semibold border border-white/10 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          {/* Download Activity / Printable Coloring Button */}
          <button
            onClick={onOpenColoringModal}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800/90 hover:bg-neutral-700 text-slate-200 rounded-full text-sm font-semibold border border-white/10 transition-colors cursor-pointer"
            title="Download coloring sheet & good habit badge"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Activity Sheet</span>
          </button>

          {/* Award Certificate Button */}
          {onOpenCertificates && (
            <button
              onClick={() => {
                sound.playSfx('fanfare');
                onOpenCertificates();
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/30 to-yellow-500/30 hover:from-amber-500/40 hover:to-yellow-500/40 text-yellow-300 rounded-full text-sm font-bold border border-yellow-400/40 transition-colors cursor-pointer shadow-sm"
              title="Award official certificate of accomplishment"
            >
              <Award className="w-4 h-4 text-yellow-400" />
              <span>Award Certificate 🏆</span>
            </button>
          )}

          {/* Save to Playlist */}
          <button
            onClick={handleSave}
            className={`p-2.5 rounded-full border border-white/10 transition-colors cursor-pointer ${
              isSaved ? 'bg-sky-500/20 text-sky-400' : 'bg-neutral-800/90 hover:bg-neutral-700 text-slate-200'
            }`}
            title="Save to favorites"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-sky-400' : ''}`} />
          </button>

          {/* More button */}
          <button
            className="p-2.5 bg-neutral-800/90 hover:bg-neutral-700 text-slate-200 rounded-full border border-white/10 transition-colors cursor-pointer"
            title="More options"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Description Box */}
      <div
        onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
        className="mt-3 p-4 bg-neutral-900/90 hover:bg-neutral-900 rounded-2xl border border-white/10 cursor-pointer transition-colors"
      >
        {/* Top line with Views & Date */}
        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold text-slate-200 mb-2">
          <span>{episode.views}</span>
          <span>•</span>
          <span>{episode.uploadDate}</span>
          <span>•</span>
          <span className="text-yellow-400">#1 on YouTube Kids Trending</span>
        </div>

        {/* Description Body */}
        <div className={`text-sm text-slate-300 leading-relaxed whitespace-pre-line ${
          !isDescriptionExpanded ? 'line-clamp-2' : ''
        }`}>
          {episode.description}

          {/* Extra Content when Expanded */}
          {isDescriptionExpanded && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <h4 className="font-bold text-yellow-300 mb-2">🎶 Lyrics: The Good Habits Song</h4>
              <p className="italic text-slate-400 mb-4">
                "Brush, brush, brush your teeth, keep them shining white! 🪥<br />
                Eat your crunchy veggies, grow with all your might! 🥦🥕<br />
                Put away the racecars, pack the teddy bear! 🧸<br />
                Turn the magic candy crank, sharing treats we share! 🍭✨"
              </p>

              <h4 className="font-bold text-sky-300 mb-2">📌 Video Chapters:</h4>
              <div className="space-y-1 text-xs">
                {episode.chapters.map((ch) => (
                  <div key={ch.id} className="flex items-center gap-2 text-slate-300 hover:text-yellow-300">
                    <span className="font-mono text-sky-400 font-bold">{ch.timestamp}</span>
                    <span>{ch.title.split('-')[1]?.trim() || ch.title}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-sky-400">
                {episode.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Show More / Show Less Prompt */}
        <div className="mt-2 text-xs font-bold text-slate-400 flex items-center gap-1 hover:text-white">
          {isDescriptionExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
