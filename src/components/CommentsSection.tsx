import React, { useState } from 'react';
import { ChannelComment, INITIAL_COMMENTS } from '../data/episodes';
import { sound } from '../utils/audio';
import { ThumbsUp, ThumbsDown, MessageSquare, Pin, Heart, Sparkles, Send } from 'lucide-react';

export const CommentsSection: React.FC = () => {
  const [comments, setComments] = useState<ChannelComment[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState('');
  const [sortBy, setSortBy] = useState<'top' | 'newest'>('top');
  const [isFocused, setIsFocused] = useState(false);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    sound.playSfx('sparkle');
    const newEntry: ChannelComment = {
      id: `user-${Date.now()}`,
      author: 'You (Preschool Explorer)',
      avatarColor: 'bg-gradient-to-tr from-sky-400 to-indigo-500 text-white',
      avatarEmoji: '🌟',
      timeAgo: 'Just now',
      text: newCommentText.trim(),
      likes: 1,
      likedByUser: true,
    };

    setComments([newEntry, ...comments]);
    setNewCommentText('');
    setIsFocused(false);
  };

  const handleLikeComment = (id: string) => {
    sound.playSfx('pop');
    setComments(prev =>
      prev.map(c => {
        if (c.id === id) {
          const liked = !c.likedByUser;
          return {
            ...c,
            likedByUser: liked,
            likes: liked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  const addEmoji = (emoji: string) => {
    setNewCommentText(prev => prev + ' ' + emoji);
    sound.playSfx('pop');
  };

  return (
    <div className="mt-8 text-white">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <span>Comments</span>
            <span className="text-sm text-slate-400 font-normal">({comments.length.toLocaleString()})</span>
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button
              onClick={() => setSortBy('top')}
              className={`font-semibold cursor-pointer ${sortBy === 'top' ? 'text-white' : 'hover:text-slate-200'}`}
            >
              Top comments
            </button>
            <span>•</span>
            <button
              onClick={() => setSortBy('newest')}
              className={`font-semibold cursor-pointer ${sortBy === 'newest' ? 'text-white' : 'hover:text-slate-200'}`}
            >
              Newest first
            </button>
          </div>
        </div>
      </div>

      {/* Add Comment Input Box */}
      <form onSubmit={handlePostComment} className="flex gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow">
          🌟
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Add a comment... (e.g. My favorite candy from the sweet machine!)"
            className="w-full bg-transparent border-b border-white/20 focus:border-white focus:outline-none py-1.5 text-sm text-white placeholder-slate-400 transition-colors"
          />

          {/* Quick Emoji Bar & Action Buttons */}
          {isFocused && (
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 mr-1">Quick emojis:</span>
                {['🪥', '🥦', '🍬', '⭐', '❤️', '🚀', '🍭'].map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => addEmoji(em)}
                    className="text-base p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    {em}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFocused(false);
                    setNewCommentText('');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newCommentText.trim()}
                  className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold bg-sky-500 hover:bg-sky-400 disabled:bg-neutral-800 disabled:text-slate-500 text-slate-950 rounded-full transition-colors cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Comment</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3 text-sm">
            {/* Author Avatar */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold ${comment.avatarColor} shadow`}>
              {comment.avatarEmoji}
            </div>

            {/* Comment Body */}
            <div className="flex-1">
              {/* Top metadata line */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-bold text-white text-xs sm:text-sm">
                  {comment.author}
                </span>

                {comment.isCreator && (
                  <span className="bg-yellow-400 text-sky-950 text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>CREATOR</span>
                  </span>
                )}

                <span className="text-xs text-slate-400">
                  {comment.timeAgo}
                </span>

                {comment.isPinned && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-neutral-800 px-2 py-0.5 rounded-full">
                    <Pin className="w-3 h-3 text-yellow-400" />
                    <span>Pinned by MP</span>
                  </span>
                )}
              </div>

              {/* Text */}
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                {comment.text}
              </p>

              {/* Interaction Bar */}
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                <button
                  onClick={() => handleLikeComment(comment.id)}
                  className={`flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer ${
                    comment.likedByUser ? 'text-sky-400 font-bold' : ''
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${comment.likedByUser ? 'fill-sky-400' : ''}`} />
                  <span>{comment.likes}</span>
                </button>

                <button
                  className="hover:text-white transition-colors cursor-pointer"
                  title="Dislike"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                {comment.isCreator && (
                  <span className="flex items-center gap-1 text-red-400 font-semibold text-[11px]">
                    <Heart className="w-3.5 h-3.5 fill-red-400" />
                    <span>Loved by MP</span>
                  </span>
                )}

                <button
                  onClick={() => sound.playSfx('pop')}
                  className="hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
