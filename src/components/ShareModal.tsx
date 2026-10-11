import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, title }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://youtube.com/watch?v=chris-kids-show';

  if (!isOpen) return null;

  const handleCopy = () => {
    sound.playSfx('sparkle');
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    { name: 'WhatsApp', icon: '💬', color: 'bg-emerald-600' },
    { name: 'Facebook', icon: '📘', color: 'bg-blue-600' },
    { name: 'Twitter/X', icon: '🐦', color: 'bg-neutral-800' },
    { name: 'Email', icon: '✉️', color: 'bg-red-600' },
    { name: 'Family Group', icon: '👨‍👩‍👧', color: 'bg-purple-600' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-neutral-900 rounded-3xl border border-white/20 p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold">Share Video</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-4 line-clamp-1 font-medium">
          {title}
        </p>

        {/* Share Icons */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {platforms.map((p) => (
            <button
              key={p.name}
              onClick={() => {
                sound.playSfx('pop');
                handleCopy();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <div className={`w-11 h-11 rounded-full ${p.color} flex items-center justify-center text-xl shadow`}>
                {p.icon}
              </div>
              <span className="text-[10px] text-slate-300 text-center font-medium leading-tight">
                {p.name}
              </span>
            </button>
          ))}
        </div>

        {/* Copy Link Input */}
        <div className="flex items-center bg-black/50 border border-white/15 rounded-2xl p-2 gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-xs text-slate-300 outline-none px-2 font-mono"
          />
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
