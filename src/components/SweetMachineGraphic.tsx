import React from 'react';

interface SweetMachineProps {
  crankRotation?: number;
  habitsCompleted?: {
    teeth: boolean;
    veggies: boolean;
    toys: boolean;
  };
  hasCoin?: boolean;
  onTurnCrank?: () => void;
  className?: string;
  dispensingCandy?: string | null;
}

export const SweetMachineGraphic: React.FC<SweetMachineProps> = ({
  crankRotation = 0,
  habitsCompleted = { teeth: false, veggies: false, toys: false },
  hasCoin = false,
  onTurnCrank,
  className = '',
  dispensingCandy = null,
}) => {
  return (
    <div className={`relative inline-block select-none ${className}`}>
      <svg
        viewBox="0 0 240 320"
        className="w-full h-full drop-shadow-2xl"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="machineBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff5252" />
            <stop offset="50%" stopColor="#e53935" />
            <stop offset="100%" stopColor="#b71c1c" />
          </linearGradient>
          <linearGradient id="glassDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f7fa" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#b2ebf2" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#80deea" stopOpacity="0.6" />
          </linearGradient>
          <radialGradient id="glassHighlight" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff59d" />
            <stop offset="50%" stopColor="#ffd600" />
            <stop offset="100%" stopColor="#ff6f00" />
          </linearGradient>
          <linearGradient id="basePlateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#42a5f5" />
            <stop offset="100%" stopColor="#1565c0" />
          </linearGradient>
        </defs>

        {/* Machine Base Stand */}
        <ellipse cx="120" cy="305" rx="90" ry="12" fill="#212121" opacity="0.3" />
        <rect x="40" y="275" width="160" height="28" rx="8" fill="url(#basePlateGrad)" stroke="#0d47a1" strokeWidth="3" />
        {/* Decorative rivets */}
        <circle cx="55" cy="289" r="3" fill="#ffffff" />
        <circle cx="185" cy="289" r="3" fill="#ffffff" />

        {/* --- Lower Machine Housing (Vivid Red / Yellow Trim) --- */}
        <path
          d="M 50 160 L 190 160 L 180 275 L 60 275 Z"
          fill="url(#machineBodyGrad)"
          stroke="#7f0000"
          strokeWidth="3.5"
        />

        {/* Chrome Trim Strip */}
        <rect x="48" y="155" width="144" height="12" rx="4" fill="url(#goldGrad)" stroke="#e65100" strokeWidth="2" />

        {/* --- Habit Progress Indicator Lamps (LEDs) --- */}
        <g transform="translate(68, 175)">
          {/* Lamp 1: Toothbrush */}
          <rect x="0" y="0" width="30" height="28" rx="6" fill={habitsCompleted.teeth ? "#e8f5e9" : "#37474f"} stroke={habitsCompleted.teeth ? "#4caf50" : "#263238"} strokeWidth="2" />
          <text x="15" y="19" textAnchor="middle" fontSize="14">🪥</text>
          {habitsCompleted.teeth && (
            <circle cx="15" cy="3" r="3" fill="#00e676" className="animate-ping" />
          )}

          {/* Lamp 2: Veggies */}
          <rect x="37" y="0" width="30" height="28" rx="6" fill={habitsCompleted.veggies ? "#e8f5e9" : "#37474f"} stroke={habitsCompleted.veggies ? "#4caf50" : "#263238"} strokeWidth="2" />
          <text x="52" y="19" textAnchor="middle" fontSize="14">🥦</text>
          {habitsCompleted.veggies && (
            <circle cx="52" cy="3" r="3" fill="#00e676" className="animate-ping" />
          )}

          {/* Lamp 3: Toys */}
          <rect x="74" y="0" width="30" height="28" rx="6" fill={habitsCompleted.toys ? "#e8f5e9" : "#37474f"} stroke={habitsCompleted.toys ? "#4caf50" : "#263238"} strokeWidth="2" />
          <text x="89" y="19" textAnchor="middle" fontSize="14">🧸</text>
          {habitsCompleted.toys && (
            <circle cx="89" cy="3" r="3" fill="#00e676" className="animate-ping" />
          )}
        </g>

        {/* --- Coin Slot --- */}
        <g transform="translate(100, 212)">
          <rect x="0" y="0" width="40" height="14" rx="4" fill="#212121" stroke="#ffeb3b" strokeWidth="1.5" />
          <rect x="6" y="5" width="28" height="4" rx="2" fill={hasCoin ? "#ffd600" : "#000000"} />
          {hasCoin && (
            <circle cx="20" cy="7" r="7" fill="url(#goldGrad)" stroke="#ff6f00" strokeWidth="1" className="animate-pulse" />
          )}
        </g>

        {/* --- Candy Dispenser Chute / Flap --- */}
        <path
          d="M 95 240 L 145 240 L 140 270 L 100 270 Z"
          fill="#212121"
          stroke="#424242"
          strokeWidth="2"
        />
        <rect x="98" y="242" width="44" height="20" rx="3" fill="#37474f" />
        <rect x="110" y="258" width="20" height="3" rx="1.5" fill="#cfd8dc" />

        {/* Dispensed Candy Drop */}
        {dispensingCandy && (
          <g transform="translate(110, 255)" className="animate-bounce">
            <circle cx="10" cy="10" r="11" fill="url(#goldGrad)" stroke="#ff6f00" strokeWidth="2" />
            <text x="10" y="15" textAnchor="middle" fontSize="13">{dispensingCandy}</text>
          </g>
        )}

        {/* --- Glass Globe / Dome --- */}
        <circle cx="120" cy="90" r="68" fill="url(#glassDomeGrad)" stroke="#4dd0e1" strokeWidth="3" />
        {/* Glass Dome Highlight */}
        <circle cx="120" cy="90" r="67" fill="url(#glassHighlight)" />

        {/* --- Colorful Candies inside Dome --- */}
        <g id="candies">
          {/* Swirl Lollipop */}
          <g transform="translate(120, 65)">
            <circle cx="0" cy="0" r="16" fill="#ff4081" stroke="#f50057" strokeWidth="2" />
            <path d="M -10 -5 Q 0 10 10 -5" stroke="#ffffff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <rect x="-2" y="16" width="4" height="18" rx="2" fill="#ffffff" />
          </g>
          {/* Gummy Stars & Candies */}
          <circle cx="85" cy="85" r="12" fill="#ffeb3b" stroke="#fbc02d" strokeWidth="2" />
          <circle cx="88" cy="82" r="3" fill="#ffffff" opacity="0.8" />

          <circle cx="155" cy="85" r="13" fill="#00e676" stroke="#00c853" strokeWidth="2" />
          <circle cx="158" cy="82" r="3" fill="#ffffff" opacity="0.8" />

          <circle cx="100" cy="115" r="14" fill="#e040fb" stroke="#aa00ff" strokeWidth="2" />
          <circle cx="103" cy="112" r="3" fill="#ffffff" opacity="0.8" />

          <circle cx="140" cy="118" r="13" fill="#ff9100" stroke="#ff6d00" strokeWidth="2" />
          <circle cx="143" cy="115" r="3" fill="#ffffff" opacity="0.8" />

          {/* Additional mini candies */}
          <circle cx="118" cy="128" r="9" fill="#00b0ff" />
          <circle cx="75" cy="115" r="8" fill="#ff1744" />
          <circle cx="165" cy="112" r="8" fill="#ffd600" />
        </g>

        {/* Shiny Glass Arc Reflection */}
        <path
          d="M 80 50 C 95 38, 120 35, 145 42"
          stroke="#ffffff"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* --- Big Mechanical Candy Crank on the Right --- */}
        <g
          transform={`translate(195, 205)`}
          className="cursor-pointer transition-transform duration-300"
          onClick={onTurnCrank}
        >
          {/* Base plate */}
          <circle cx="0" cy="0" r="14" fill="#37474f" stroke="#263238" strokeWidth="2" />
          
          {/* Rotating Crank Arm & Knob */}
          <g transform={`rotate(${crankRotation})`}>
            <rect x="-4" y="-35" width="8" height="40" rx="4" fill="url(#goldGrad)" stroke="#e65100" strokeWidth="2" />
            <circle cx="0" cy="-35" r="9" fill="#ff1744" stroke="#b71c1c" strokeWidth="2" />
            <circle cx="2" cy="-37" r="2.5" fill="#ffffff" opacity="0.8" />
          </g>
        </g>
      </svg>
    </div>
  );
};
