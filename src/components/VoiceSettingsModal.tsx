import React, { useState, useEffect } from 'react';
import { sound, VoiceConfig } from '../utils/audio';
import {
  X,
  Volume2,
  Sparkles,
  Sliders,
  Check,
  Play,
  RotateCcw,
  AudioWaveform,
  CheckCircle2,
} from 'lucide-react';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [config, setConfig] = useState<VoiceConfig>(() => sound.getVoiceConfig());
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setConfig(sound.getVoiceConfig());
      // Populate browser voices
      const loadVoices = () => {
        setBrowserVoices(sound.getAvailableBrowserVoices());
      };
      loadVoices();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    sound.setVoiceConfig(config);
    sound.playSfx('sparkle');
    setStatusNotice('Natural voice settings saved!');
    setTimeout(() => {
      setStatusNotice(null);
      onClose();
    }, 800);
  };

  const handleTestVoice = (customText?: string) => {
    sound.setVoiceConfig(config);
    setIsPlayingTest(true);
    sound.testVoice(customText);
    setTimeout(() => {
      setIsPlayingTest(false);
    }, 3500);
  };

  const handleResetDefaults = () => {
    sound.playSfx('pop');
    const defaultConfig: VoiceConfig = {
      engine: 'gemini',
      geminiVoice: 'Puck',
      browserVoiceURI: '',
      pitch: 1.0,
      rate: 1.0,
    };
    setConfig(defaultConfig);
    sound.setVoiceConfig(defaultConfig);
    setStatusNotice('Reset to MP natural defaults!');
    setTimeout(() => setStatusNotice(null), 2000);
  };

  const geminiPersonas = [
    {
      id: 'Puck' as const,
      name: "MP's Signature Voice",
      actor: 'Puck',
      icon: '👦🏽',
      tag: 'Recommended for MP',
      desc: 'Cheerful, warm, energetic preschool cartoon character. Sounds completely natural and friendly!',
    },
    {
      id: 'Zephyr' as const,
      name: 'Energetic Storyteller',
      actor: 'Zephyr',
      icon: '🚀',
      tag: 'Fast & Lively',
      desc: 'Bright, bouncy, and adventurous tone for exciting habit challenges and sweet machine spins.',
    },
    {
      id: 'Kore' as const,
      name: 'Gentle Preschool Guide',
      actor: 'Kore',
      icon: '🌸',
      tag: 'Soothing & Sweet',
      desc: 'Soft, melodic, and calm tone perfect for bedtime routines and patient morning routines.',
    },
    {
      id: 'Charon' as const,
      name: 'Friendly Host',
      actor: 'Charon',
      icon: '⭐',
      tag: 'Warm Storybook',
      desc: 'Warm, grounded, and encouraging classic storybook narrator voice.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-neutral-900 border-2 border-yellow-400 rounded-3xl max-w-xl w-full p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-yellow-400 text-sky-950 flex items-center justify-center shadow-lg font-black text-xl">
              🎙️
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-yellow-300 font-['Fredoka']">
                Natural Voice Settings
              </h3>
              <p className="text-xs text-slate-300">
                Choose MP's voice persona, speed, and realistic sound style
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-6 pr-1">
          {/* Engine Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Voice Sound Engine:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playSfx('pop');
                  setConfig((prev) => ({ ...prev, engine: 'gemini' }));
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  config.engine === 'gemini'
                    ? 'bg-gradient-to-br from-amber-500/30 to-yellow-500/20 border-yellow-400 text-white shadow-lg'
                    : 'bg-neutral-800/60 border-white/10 hover:bg-neutral-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm flex items-center gap-1.5 text-yellow-300">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    Gemini AI Voice
                  </span>
                  {config.engine === 'gemini' && (
                    <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Ultra-realistic human cartoon show actor. Natural inflection & playful warmth!
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playSfx('pop');
                  setConfig((prev) => ({ ...prev, engine: 'browser' }));
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  config.engine === 'browser'
                    ? 'bg-gradient-to-br from-sky-500/30 to-blue-500/20 border-sky-400 text-white shadow-lg'
                    : 'bg-neutral-800/60 border-white/10 hover:bg-neutral-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm flex items-center gap-1.5 text-sky-300">
                    <Volume2 className="w-4 h-4 text-sky-400" />
                    Browser Neural Voice
                  </span>
                  {config.engine === 'browser' && (
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Local device natural synthesizer (Google/Edge Natural voices) with zero latency.
                </p>
              </button>
            </div>
          </div>

          {/* Gemini AI Voice Personas */}
          {config.engine === 'gemini' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Select MP's Character Persona:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {geminiPersonas.map((p) => {
                  const isSelected = config.geminiVoice === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        sound.playSfx('pop');
                        setConfig((prev) => ({ ...prev, geminiVoice: p.id }));
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-yellow-400/20 border-yellow-300 shadow-md ring-2 ring-yellow-400/50'
                          : 'bg-neutral-800/60 border-white/10 hover:bg-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{p.icon}</span>
                          <span className="font-black text-xs text-white">{p.name}</span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected
                              ? 'bg-yellow-400 text-sky-950'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {p.tag}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-tight">{p.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Browser Voices Picker */}
          {config.engine === 'browser' && (
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Select Installed Browser Voice:
              </label>
              <select
                value={config.browserVoiceURI}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, browserVoiceURI: e.target.value }))
                }
                className="w-full bg-neutral-800 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-yellow-400"
              >
                <option value="">✨ Auto-detect Best Natural Voice (Google / Neural)</option>
                {browserVoices.map((v, i) => (
                  <option key={i} value={v.voiceURI || v.name}>
                    {v.name} ({v.lang}) {v.name.toLowerCase().includes('natural') ? '🔥 Natural' : ''}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Tip: Voices named "Natural", "Google", or "Online" offer the smoothest human cadence.
              </p>
            </div>
          )}

          {/* Speed & Pitch Controls */}
          <div className="bg-black/30 border border-white/10 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-yellow-400" />
                Natural Cadence & Tone Tuning
              </span>
              <button
                type="button"
                onClick={handleResetDefaults}
                className="text-[10px] text-yellow-300 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to 1.0x (Natural)
              </button>
            </div>

            {/* Speaking Rate / Speed */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-semibold">Storytelling Speed:</span>
                <span className="text-yellow-300 font-bold">{config.rate.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.8"
                max="1.3"
                step="0.05"
                value={config.rate}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, rate: parseFloat(e.target.value) }))
                }
                className="w-full accent-yellow-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Slow & Clear (0.8x)</span>
                <span>Natural (1.0x)</span>
                <span>Energetic (1.3x)</span>
              </div>
            </div>

            {/* Speaking Pitch */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400 font-semibold">Natural Pitch / Tone:</span>
                <span className="text-yellow-300 font-bold">{config.pitch.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.2"
                step="0.05"
                value={config.pitch}
                onChange={(e) =>
                  setConfig((prev) => ({ ...prev, pitch: parseFloat(e.target.value) }))
                }
                className="w-full accent-yellow-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>Warm & Deep (0.85x)</span>
                <span>Natural Human (1.0x)</span>
                <span>Bright Kid (1.2x)</span>
              </div>
            </div>
          </div>

          {/* Test Voice Banner */}
          <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border-2 border-yellow-400/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-xs font-black text-yellow-300 flex items-center gap-1.5">
                <AudioWaveform className="w-4 h-4 text-yellow-400 animate-pulse" />
                Listen to MP's Natural Voice
              </div>
              <div className="text-[11px] text-slate-300 mt-0.5">
                Press to test how MP sounds with your current settings!
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                handleTestVoice("Hi friends! I am MP! Ready to learn good habits and spin the magical sweet machine?")
              }
              disabled={isPlayingTest}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-sky-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition-transform active:scale-95 shrink-0"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isPlayingTest ? 'Speaking...' : 'Test MP Voice ▶'}</span>
            </button>
          </div>
        </div>

        {/* Status notice */}
        {statusNotice && (
          <div className="mb-3 px-3 py-2 bg-emerald-500/20 border border-emerald-400 rounded-xl text-center text-xs text-emerald-300 font-bold animate-in fade-in">
            {statusNotice}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-sky-950 font-black text-xs sm:text-sm rounded-xl shadow-xl flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Apply Natural Voice</span>
          </button>
        </div>
      </div>
    </div>
  );
};
