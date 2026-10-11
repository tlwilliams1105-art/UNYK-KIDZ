import React from 'react';

interface CharacterProps {
  expression?: 'happy' | 'excited' | 'brushing' | 'eating' | 'thinking' | 'cheering';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'avatar';
  className?: string;
  animate?: boolean;
}

export const MPCharacter: React.FC<CharacterProps> = ({
  expression = 'happy',
  size = 'lg',
  className = '',
  animate = true,
}) => {
  const sizeMap = {
    avatar: 'w-10 h-10',
    sm: 'w-20 h-20',
    md: 'w-36 h-36',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80',
  };

  const isAvatar = size === 'avatar';

  return (
    <div className={`relative inline-block select-none group cursor-pointer ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle neon glow filter for responsive hover interaction */}
          <filter id="mpNeonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="glowBlur" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 1   0 0.8 0 0 0.8   0 0 0.2 0 0.2  0 0 0 1 0"
              result="glowColor"
            />
            <feMerge>
              <feMergeNode in="glowColor" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Warm, glowing rich brown skin gradients */}
          <radialGradient id="mpSkinGrad" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#a36339" />
            <stop offset="65%" stopColor="#874a23" />
            <stop offset="100%" stopColor="#693414" />
          </radialGradient>
          <linearGradient id="mpNeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#753d19" />
            <stop offset="100%" stopColor="#5c2e10" />
          </linearGradient>

          {/* Deep espresso textured hair gradients */}
          <linearGradient id="mpHairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3d261a" />
            <stop offset="40%" stopColor="#24150d" />
            <stop offset="100%" stopColor="#120a06" />
          </linearGradient>

          {/* Signature bright yellow polo */}
          <linearGradient id="mpShirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffea3b" />
            <stop offset="70%" stopColor="#fbc02d" />
            <stop offset="100%" stopColor="#f57f17" />
          </linearGradient>
          <linearGradient id="mpCollarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff176" />
            <stop offset="100%" stopColor="#f9a825" />
          </linearGradient>
        </defs>

        {/* --- Shirt Body (Yellow Polo) --- */}
        <path
          d="M 40 185 C 45 155, 65 140, 100 140 C 135 140, 155 155, 160 185 L 165 200 L 35 200 Z"
          fill="url(#mpShirtGrad)"
          stroke="#d84315"
          strokeWidth="2.5"
        />

        {/* Polo Collar Placket */}
        <path
          d="M 94 145 L 94 185 L 106 185 L 106 145 Z"
          fill="#fff59d"
          stroke="#f57f17"
          strokeWidth="1.5"
        />
        {/* Buttons on Polo */}
        <circle cx="100" cy="155" r="2.5" fill="#e65100" />
        <circle cx="100" cy="170" r="2.5" fill="#e65100" />

        {/* Left Polo Collar Wing */}
        <polygon
          points="95,142 68,154 85,160 97,147"
          fill="url(#mpCollarGrad)"
          stroke="#e65100"
          strokeWidth="2"
        />
        {/* Right Polo Collar Wing */}
        <polygon
          points="105,142 132,154 115,160 103,147"
          fill="url(#mpCollarGrad)"
          stroke="#e65100"
          strokeWidth="2"
        />

        {/* --- Neck --- */}
        <rect
          x="88"
          y="125"
          width="24"
          height="22"
          rx="6"
          fill="url(#mpNeckGrad)"
        />

        {/* --- Ears --- */}
        <ellipse cx="50" cy="98" rx="10" ry="14" fill="#874a23" stroke="#5c2e10" strokeWidth="1.5" />
        <ellipse cx="50" cy="98" rx="5" ry="7" fill="#693414" />
        <ellipse cx="150" cy="98" rx="10" ry="14" fill="#874a23" stroke="#5c2e10" strokeWidth="1.5" />
        <ellipse cx="150" cy="98" rx="5" ry="7" fill="#693414" />

        {/* --- Head Base (Brown Skin) with subtle neon glow on hover --- */}
        <path
          d="M 52 90 C 52 50, 72 35, 100 35 C 128 35, 148 50, 148 90 C 148 128, 128 142, 100 142 C 72 142, 52 128, 52 90 Z"
          fill="url(#mpSkinGrad)"
          stroke="#54280d"
          strokeWidth="2"
          className="transition-all duration-300 group-hover:filter group-hover:drop-shadow-[0_0_10px_rgba(255,214,0,0.85)] group-hover:stroke-yellow-400 group-hover:stroke-[2.5]"
        />

        {/* Rosy/Warm Cheeks with healthy toddler glow */}
        <circle cx="68" cy="105" r="12" fill="#d85a42" opacity="0.32" />
        <circle cx="132" cy="105" r="12" fill="#d85a42" opacity="0.32" />

        {/* --- Eyes (Big, friendly, dark warm brown eyes with high-contrast sparkles) --- */}
        {/* Left Eye */}
        <g>
          <ellipse cx="78" cy="92" rx="10" ry="12" fill="#ffffff" stroke="#54280d" strokeWidth="1.2" />
          <ellipse cx="79" cy="92" rx="6.5" ry="7.5" fill="#2d170b" />
          <ellipse cx="79" cy="92" rx="3.5" ry="4" fill="#0d0704" />
          {/* Eye Sparkles */}
          <circle cx="81" cy="89" r="2.8" fill="#ffffff" />
          <circle cx="77" cy="94" r="1.3" fill="#ffffff" />
          {/* Eyelashes / Upper Lid */}
          <path d="M 68 84 Q 78 80 88 84" stroke="#1f1109" strokeWidth="2.8" strokeLinecap="round" />
        </g>

        {/* Right Eye */}
        <g>
          <ellipse cx="122" cy="92" rx="10" ry="12" fill="#ffffff" stroke="#54280d" strokeWidth="1.2" />
          <ellipse cx="121" cy="92" rx="6.5" ry="7.5" fill="#2d170b" />
          <ellipse cx="121" cy="92" rx="3.5" ry="4" fill="#0d0704" />
          {/* Eye Sparkles */}
          <circle cx="123" cy="89" r="2.8" fill="#ffffff" />
          <circle cx="119" cy="94" r="1.3" fill="#ffffff" />
          {/* Eyelashes / Upper Lid */}
          <path d="M 112 84 Q 122 80 132 84" stroke="#1f1109" strokeWidth="2.8" strokeLinecap="round" />
        </g>

        {/* Eyebrows */}
        <path
          d={expression === 'thinking' ? "M 67 77 Q 78 71 87 76" : "M 68 75 Q 78 69 88 73"}
          stroke="#1f1109"
          strokeWidth="3.4"
          strokeLinecap="round"
        />
        <path
          d={expression === 'excited' ? "M 112 72 Q 122 67 132 72" : "M 112 73 Q 122 69 132 75"}
          stroke="#1f1109"
          strokeWidth="3.4"
          strokeLinecap="round"
        />

        {/* Button Nose */}
        <path
          d="M 96 102 Q 100 106 104 102"
          stroke="#54280d"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Soft nose highlight */}
        <circle cx="100" cy="100" r="2" fill="#c47d4e" opacity="0.6" />

        {/* --- Mouth & Smile --- */}
        {expression === 'happy' && (
          <g>
            {/* Open happy smile showing clean white teeth */}
            <path
              d="M 83 112 Q 100 136 117 112 C 117 112, 100 114, 83 112 Z"
              fill="#ad1457"
              stroke="#54280d"
              strokeWidth="2"
            />
            {/* Bright White Teeth */}
            <path
              d="M 86 113 Q 100 116 114 113 L 113 118 Q 100 120 87 118 Z"
              fill="#ffffff"
            />
            {/* Cute pink tongue */}
            <path
              d="M 91 127 Q 100 122 109 127 Q 100 136 91 127 Z"
              fill="#ff4081"
            />
          </g>
        )}

        {expression === 'excited' && (
          <g>
            <path
              d="M 80 110 Q 100 144 120 110 Q 100 112 80 110 Z"
              fill="#880e4f"
              stroke="#4a148c"
              strokeWidth="2"
            />
            <path
              d="M 84 111 Q 100 116 116 111 L 115 119 Q 100 121 85 119 Z"
              fill="#ffffff"
            />
            <ellipse cx="100" cy="133" rx="11" ry="8" fill="#ff4081" />
          </g>
        )}

        {expression === 'brushing' && (
          <g>
            <path
              d="M 85 116 Q 100 126 115 116"
              stroke="#4a148c"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Toothpaste bubbles */}
            <circle cx="82" cy="114" r="5" fill="#e1f5fe" stroke="#0288d1" strokeWidth="1" />
            <circle cx="118" cy="115" r="4.5" fill="#e1f5fe" stroke="#0288d1" strokeWidth="1" />
            <circle cx="100" cy="122" r="6" fill="#e1f5fe" stroke="#0288d1" strokeWidth="1" />
          </g>
        )}

        {expression === 'eating' && (
          <g>
            <ellipse cx="100" cy="116" rx="9" ry="7" fill="#ad1457" stroke="#4a148c" strokeWidth="2" />
            <path d="M 94 114 Q 100 112 106 114" stroke="#ffffff" strokeWidth="2" />
          </g>
        )}

        {expression === 'thinking' && (
          <path
            d="M 88 116 Q 100 112 112 118"
            stroke="#4a148c"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {expression === 'cheering' && (
          <g>
            <path
              d="M 81 110 Q 100 144 119 110 Z"
              fill="#ad1457"
              stroke="#4a148c"
              strokeWidth="2"
            />
            <path
              d="M 85 112 Q 100 117 115 112 L 114 118 Q 100 121 86 118 Z"
              fill="#ffffff"
            />
            <circle cx="100" cy="130" r="8" fill="#ff4081" />
          </g>
        )}

        {/* --- MP's Hair (Cute textured curls crown & curls along hairline) --- */}
        <g id="mpHair">
          {/* Main Hair Volume */}
          <path
            d="M 46 72 C 38 42, 60 16, 100 15 C 140 16, 162 42, 154 72 C 158 58, 148 42, 136 38 C 142 48, 140 64, 136 78 C 128 52, 114 42, 100 42 C 102 56, 98 72, 94 84 C 84 58, 72 44, 60 44 C 58 56, 54 68, 48 80 C 46 75, 45 73, 46 72 Z"
            fill="url(#mpHairGrad)"
            stroke="#120a06"
            strokeWidth="2"
          />

          {/* Cute textured curls/coils at the top and forehead */}
          <circle cx="56" cy="40" r="11" fill="#24150d" stroke="#120a06" strokeWidth="1" />
          <circle cx="72" cy="28" r="12" fill="#2d1a10" stroke="#120a06" strokeWidth="1" />
          <circle cx="92" cy="22" r="13" fill="#382014" stroke="#120a06" strokeWidth="1" />
          <circle cx="112" cy="22" r="13" fill="#2d1a10" stroke="#120a06" strokeWidth="1" />
          <circle cx="132" cy="28" r="12" fill="#24150d" stroke="#120a06" strokeWidth="1" />
          <circle cx="146" cy="42" r="11" fill="#1c100a" stroke="#120a06" strokeWidth="1" />

          {/* Soft front curl fringe giving MP his unique sweet hairstyle */}
          <circle cx="68" cy="50" r="9" fill="#24150d" />
          <circle cx="84" cy="44" r="9.5" fill="#331c11" />
          <circle cx="102" cy="42" r="10" fill="#3d2215" />
          <circle cx="118" cy="45" r="9.5" fill="#2d1a10" />
          <circle cx="134" cy="52" r="9" fill="#24150d" />

          {/* Hair shine highlights */}
          <path
            d="M 80 26 C 92 22, 110 22, 122 26"
            stroke="#5c3825"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* Arms / Accessories based on expression */}
        {expression === 'brushing' && !isAvatar && (
          <g className={animate ? 'animate-bounce' : ''}>
            {/* Blue Toothbrush */}
            <rect x="120" y="105" width="45" height="8" rx="4" transform="rotate(-25 120 105)" fill="#0288d1" stroke="#01579b" strokeWidth="1.5" />
            <rect x="105" y="100" width="14" height="12" rx="2" transform="rotate(-25 105 100)" fill="#ffffff" stroke="#b0bec5" strokeWidth="1.5" />
            {/* Sparkle */}
            <path d="M 98 90 L 102 82 L 106 90 L 114 94 L 106 98 L 102 106 L 98 98 L 90 94 Z" fill="#ffd600" />
          </g>
        )}

        {expression === 'eating' && !isAvatar && (
          <g>
            {/* Bright crunchy broccoli */}
            <g transform="translate(130, 95) scale(0.8)">
              <rect x="12" y="24" width="8" height="14" rx="3" fill="#8bc34a" stroke="#558b2f" strokeWidth="1.5" />
              <circle cx="10" cy="18" r="10" fill="#4caf50" stroke="#2e7d32" strokeWidth="1.5" />
              <circle cx="22" cy="16" r="11" fill="#43a047" stroke="#2e7d32" strokeWidth="1.5" />
              <circle cx="16" cy="10" r="10" fill="#66bb6a" stroke="#2e7d32" strokeWidth="1.5" />
            </g>
          </g>
        )}

        {expression === 'cheering' && !isAvatar && (
          <g>
            {/* Raised hands with matching brown skin tone */}
            <ellipse cx="34" cy="140" rx="9" ry="12" fill="#874a23" stroke="#54280d" strokeWidth="1.5" />
            <ellipse cx="166" cy="140" rx="9" ry="12" fill="#874a23" stroke="#54280d" strokeWidth="1.5" />
          </g>
        )}
      </svg>
    </div>
  );
};

// Also export as ChrisCharacter for backwards compatibility across existing components
export const ChrisCharacter = MPCharacter;
