import React, { useState } from 'react';
import { X, Download, RotateCcw, Palette, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface ColoringModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ColoringModal: React.FC<ColoringModalProps> = ({ isOpen, onClose }) => {
  const [selectedColor, setSelectedColor] = useState('#ffd600');
  const [fillColors, setFillColors] = useState<{ [key: string]: string }>({
    shirt: '#ffffff',
    hair: '#ffffff',
    machine: '#ffffff',
    bg: '#ffffff',
    candies: '#ffffff',
  });

  if (!isOpen) return null;

  const palette = [
    '#ffd600', // Yellow
    '#00c4f4', // Cyan
    '#ff1744', // Red
    '#00e676', // Green
    '#d500f9', // Purple
    '#ff9100', // Orange
    '#3d5afe', // Royal Blue
    '#ffffff', // White (Eraser)
  ];

  const handleColorPart = (part: string) => {
    sound.playSfx('pop');
    setFillColors(prev => ({ ...prev, [part]: selectedColor }));
  };

  const handleReset = () => {
    sound.playSfx('boing');
    setFillColors({
      shirt: '#ffffff',
      hair: '#ffffff',
      machine: '#ffffff',
      bg: '#ffffff',
      candies: '#ffffff',
    });
  };

  const handleDownload = () => {
    sound.playSfx('fanfare');
    // Create quick printable alert or trigger window.print
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-sky-900 to-indigo-950 rounded-3xl border-4 border-yellow-300 p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-yellow-300" />
            <h3 className="text-xl font-black text-yellow-300 font-['Fredoka']">
              MP & Sweet Machine Coloring Page! 🎨
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-300" />
          </button>
        </div>

        {/* Color Palette Selector */}
        <div className="flex items-center justify-between gap-2 mb-4 bg-black/30 p-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 mr-1">Crayon:</span>
            {palette.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setSelectedColor(c);
                  sound.playSfx('pop');
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                  selectedColor === c ? 'scale-125 border-white shadow' : 'border-black/40 hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-1 text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-300 text-sky-950 font-bold px-3 py-1.5 rounded-xl cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Print Page</span>
            </button>
          </div>
        </div>

        {/* Coloring Canvas Area */}
        <div className="w-full bg-white rounded-2xl p-4 shadow-inner flex items-center justify-center min-h-[300px]">
          <svg viewBox="0 0 400 300" className="w-full max-h-[300px] select-none">
            {/* Background */}
            <rect
              x="0"
              y="0"
              width="400"
              height="300"
              fill={fillColors.bg}
              stroke="#212121"
              strokeWidth="3"
              className="cursor-pointer"
              onClick={() => handleColorPart('bg')}
            />

            {/* Clouds / Stars in Sky */}
            <text x="40" y="50" fontSize="24" fill="#000000">⭐</text>
            <text x="340" y="50" fontSize="24" fill="#000000">🚀</text>

            {/* Sweet Machine Outline on Left */}
            <g onClick={() => handleColorPart('machine')} className="cursor-pointer">
              <rect x="50" y="140" width="100" height="120" rx="10" fill={fillColors.machine} stroke="#000000" strokeWidth="4" />
              <circle cx="100" cy="110" r="45" fill={fillColors.candies} stroke="#000000" strokeWidth="4" />
              <text x="100" y="118" textAnchor="middle" fontSize="28">🍬🍭</text>
              <text x="100" y="200" textAnchor="middle" fontSize="12" fontWeight="bold">SWEET MACHINE</text>
            </g>

            {/* MP Outline on Right */}
            <g className="cursor-pointer">
              {/* Hair */}
              <path
                d="M 230 110 C 230 70, 260 50, 300 50 C 340 50, 360 70, 360 110 Z"
                fill={fillColors.hair}
                stroke="#000000"
                strokeWidth="4"
                onClick={() => handleColorPart('hair')}
              />
              {/* Face */}
              <circle cx="295" cy="120" r="40" fill="#fff" stroke="#000000" strokeWidth="4" />
              <circle cx="280" cy="115" r="4" fill="#000000" />
              <circle cx="310" cy="115" r="4" fill="#000000" />
              <path d="M 285 135 Q 295 150 305 135" stroke="#000000" strokeWidth="3" fill="none" />

              {/* Yellow Shirt */}
              <path
                d="M 245 160 L 345 160 L 355 260 L 235 260 Z"
                fill={fillColors.shirt}
                stroke="#000000"
                strokeWidth="4"
                onClick={() => handleColorPart('shirt')}
              />
              <text x="295" y="210" textAnchor="middle" fontSize="11" fontWeight="bold">MP POLO</text>
            </g>
          </svg>
        </div>

        <p className="text-center text-xs text-slate-300 mt-3">
          Tap any part of the drawing with your selected crayon color to fill it in!
        </p>
      </div>
    </div>
  );
};
