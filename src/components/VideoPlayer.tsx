import React, { useState, useEffect, useRef } from 'react';
import { Episode, EpisodeChapter } from '../data/episodes';
import { ChrisCharacter } from './ChrisCharacter';
import { SweetMachineGraphic } from './SweetMachineGraphic';
import { StoryGameOverlay } from './StoryGameOverlay';
import { VoiceSettingsModal } from './VoiceSettingsModal';
import { sound } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  Subtitles,
  Music,
  Gamepad2,
  SkipForward,
  Sliders,
} from 'lucide-react';

interface VideoPlayerProps {
  episode: Episode;
  onNextEpisode: () => void;
  onEarnSticker?: (stickerId: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  episode,
  onNextEpisode,
  onEarnSticker,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [isInteractiveMode, setIsInteractiveMode] = useState(true);
  const [activeStep, setActiveStep] = useState<EpisodeChapter['interactiveStep'] | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCaptions, setShowCaptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [dispensedTreat, setDispensedTreat] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const duration = episode.durationSeconds;
  const currentChapter = episode.chapters[activeChapterIndex] || episode.chapters[0];

  // Habits tracked for Sweet Machine
  const habitsStatus = {
    teeth: completedSteps.includes('step-teeth'),
    veggies: completedSteps.includes('step-veggies'),
    toys: completedSteps.includes('step-toys'),
  };

  // Timer loop for video playback
  useEffect(() => {
    let interval: number;
    if (isPlaying && !activeStep) {
      interval = window.setInterval(() => {
        setCurrentTime((prev) => {
          const next = prev + 1 * playbackSpeed;
          if (next >= duration) {
            setIsPlaying(false);
            sound.playSfx('cheer');
            return duration;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, activeStep, playbackSpeed, duration]);

  // Determine current chapter & trigger interactive steps
  useEffect(() => {
    const chapIdx = episode.chapters.findIndex((c, i) => {
      const nextChap = episode.chapters[i + 1];
      if (nextChap) {
        return currentTime >= c.seconds && currentTime < nextChap.seconds;
      }
      return currentTime >= c.seconds;
    });

    if (chapIdx !== -1 && chapIdx !== activeChapterIndex) {
      setActiveChapterIndex(chapIdx);
      const newChap = episode.chapters[chapIdx];

      // Voice read narrative
      if (voiceEnabled && newChap.narrativeText) {
        sound.speak(newChap.narrativeText);
      }

      // If interactive step exists and hasn't been completed yet
      if (isInteractiveMode && newChap.interactiveStep && !completedSteps.includes(newChap.interactiveStep.id)) {
        setIsPlaying(false);
        setActiveStep(newChap.interactiveStep);
      }
    }
  }, [currentTime, episode.chapters, activeChapterIndex, isInteractiveMode, completedSteps, voiceEnabled]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      setActiveChapterIndex(0);
    }
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      sound.playSfx('pop');
      if (isMusicPlaying) sound.startBgm();
      if (voiceEnabled && currentChapter?.narrativeText && currentTime === 0) {
        sound.speak(currentChapter.narrativeText);
      }
    } else {
      sound.stopBgm();
    }
  };

  // Handle Scrub
  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentTime(val);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Complete interactive step
  const handleStepComplete = () => {
    if (activeStep) {
      setCompletedSteps((prev) => [...prev, activeStep.id]);
      if (activeStep.id === 'step-crank') {
        setDispensedTreat('🍭');
        if (onEarnSticker) onEarnSticker('stk-4');
      } else if (activeStep.id === 'step-teeth') {
        if (onEarnSticker) onEarnSticker('stk-1');
      } else if (activeStep.id === 'step-veggies') {
        if (onEarnSticker) onEarnSticker('stk-2');
      } else if (activeStep.id === 'step-toys') {
        if (onEarnSticker) onEarnSticker('stk-3');
      }
      setActiveStep(null);
      setIsPlaying(true);
      if (isMusicPlaying) sound.startBgm();
    }
  };

  const handleStepSkip = () => {
    setActiveStep(null);
    setIsPlaying(true);
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Mouse movement hides controls after 3s
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  // Determine Chris expression by chapter
  const getChrisExpression = () => {
    if (currentChapter.id === 'c2') return 'brushing';
    if (currentChapter.id === 'c3') return 'eating';
    if (currentChapter.id === 'c5' || currentChapter.id === 'c6') return 'cheering';
    return isPlaying ? 'excited' : 'happy';
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-4 border-sky-400 select-none group aspect-video max-h-[80vh] flex items-center justify-center ${
        isFullscreen ? 'rounded-none border-0' : ''
      }`}
    >
      {/* ================= STAGE AREA ================= */}
      {/* 1. INITIAL COVER / THUMBNAIL (Exactly matching the screenshot aesthetic!) */}
      {!isPlaying && currentTime === 0 && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 cursor-pointer overflow-hidden flex items-center justify-center bg-[#00c4f4]"
        >
          {/* Cyan Background Pattern: Rockets, Stars, Cars, Soccer balls, T-Shirts, Lightning */}
          <div className="absolute inset-0 opacity-20 pointer-events-none grid grid-cols-6 grid-rows-4 gap-8 p-6 text-white text-3xl font-black">
            <span>🚀</span>
            <span>⭐</span>
            <span>🚗</span>
            <span>⚽</span>
            <span>👕</span>
            <span>⚡</span>
            <span>⭐</span>
            <span>🚗</span>
            <span>⚡</span>
            <span>🚀</span>
            <span>⚽</span>
            <span>👕</span>
            <span>⚡</span>
            <span>🚀</span>
            <span>⭐</span>
            <span>👕</span>
            <span>🚗</span>
            <span>⚡</span>
            <span>🚗</span>
            <span>⚽</span>
            <span>🚀</span>
            <span>⭐</span>
            <span>⚡</span>
            <span>🚀</span>
          </div>

          {/* Yellow Lightning Bolts & Star Accents matching thumbnail */}
          <div className="absolute top-8 left-12 text-yellow-300 text-6xl drop-shadow-lg transform -rotate-12 animate-pulse">
            ⚡
          </div>
          <div className="absolute bottom-16 left-8 text-yellow-300 text-6xl drop-shadow-lg transform rotate-12">
            ⚡
          </div>
          <div className="absolute top-10 left-1/3 text-yellow-300 text-5xl drop-shadow-lg">
            ⭐
          </div>

          {/* Rocket Blasting off at bottom-left (matching screenshot) */}
          <div className="absolute bottom-10 left-16 sm:left-28 flex items-center gap-2 transform -rotate-45 hover:scale-110 transition-transform">
            <span className="text-6xl sm:text-7xl drop-shadow-xl">🚀</span>
            <span className="text-3xl text-white/70 animate-ping">💨</span>
          </div>

          {/* Candy Confetti Streamers */}
          <div className="absolute top-1/4 left-1/4 text-red-400 text-3xl transform rotate-45">🍬</div>
          <div className="absolute top-1/3 left-1/2 text-orange-400 text-3xl">🍭</div>
          <div className="absolute bottom-1/4 left-1/2 text-emerald-300 text-3xl">⭐</div>

          {/* --- BIG 3D COMIC BUBBLE TITLE (MP KIDS SHOW) --- */}
          <div className="absolute top-12 sm:top-20 left-6 sm:left-14 z-10 flex flex-col items-start">
            <div className="relative">
              {/* "MP" in 3D glossy bubble comic letters */}
              <div
                className="text-6xl sm:text-8xl md:text-9xl font-black tracking-wider text-white drop-shadow-[0_8px_0_#0d47a1] [text-shadow:_0_4px_0_#1565c0,_0_8px_0_#0d47a1,_0_12px_18px_rgba(0,0,0,0.5)] font-['Fredoka']"
              >
                MP
              </div>
              {/* Glowing Yellow Star atop the P */}
              <div className="absolute -top-3 -right-6 sm:-top-5 sm:-right-8 text-yellow-300 text-4xl sm:text-6xl drop-shadow-[0_4px_0_#e65100] animate-bounce">
                ⭐
              </div>
            </div>

            {/* "KIDS SHOW" in Orange/Yellow 3D Bubble text */}
            <div
              className="mt-1 sm:mt-2 text-2xl sm:text-4xl md:text-5xl font-black text-yellow-300 tracking-wide [text-shadow:_0_3px_0_#e65100,_0_6px_0_#b71c1c,_0_8px_12px_rgba(0,0,0,0.4)] font-['Fredoka']"
            >
              KIDS SHOW
            </div>
          </div>

          {/* --- CHRIS (Right side of thumbnail, exactly matching user image!) --- */}
          <div className="absolute -bottom-4 right-2 sm:right-10 md:right-16 z-10 transform scale-110 sm:scale-125 md:scale-150 origin-bottom-right">
            <ChrisCharacter expression="happy" size="xl" />
          </div>

          {/* YouTube Red Play Button in Center */}
          <div className="relative z-20 flex flex-col items-center group-hover:scale-110 transition-transform">
            <div className="w-20 h-14 sm:w-24 sm:h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white/50 group-hover:bg-red-500 transition-colors">
              <Play className="w-8 h-8 sm:w-10 sm:h-10 text-white fill-current ml-1" />
            </div>
            <span className="mt-3 bg-black/70 text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full backdrop-blur-md border border-white/20">
              Click to Start Show! 🎬
            </span>
          </div>
        </div>
      )}

      {/* 2. ACTIVE ANIMATED SHOW STAGE */}
      {(isPlaying || currentTime > 0) && (
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-400 to-indigo-500 overflow-hidden flex items-center justify-between px-6 sm:px-14">
          {/* Playroom Wall / Window & Rainbow Doodles */}
          <div className="absolute top-0 inset-x-0 h-40 bg-white/20 backdrop-blur-xs flex items-center justify-around pointer-events-none">
            <div className="w-24 h-24 rounded-full border-4 border-yellow-300 bg-sky-200/50 flex items-center justify-center">
              <span className="text-4xl">☀️</span>
            </div>
            <div className="text-3xl text-yellow-200">✨</div>
            <div className="text-4xl text-pink-300">🌈</div>
            <div className="text-3xl text-emerald-200">⭐</div>
          </div>

          {/* Playroom Floor Line */}
          <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-amber-800/80 via-amber-700/60 to-transparent border-t-4 border-amber-600/40 pointer-events-none" />

          {/* --- LEFT: The Magical Sweet Machine --- */}
          <div className="relative z-10 transform scale-90 sm:scale-100 md:scale-110 origin-bottom-left">
            <SweetMachineGraphic
              habitsCompleted={habitsStatus}
              hasCoin={habitsStatus.teeth && habitsStatus.veggies && habitsStatus.toys}
              dispensingCandy={dispensedTreat}
              onTurnCrank={() => {
                if (habitsStatus.teeth && habitsStatus.veggies && habitsStatus.toys) {
                  sound.playSfx('crank');
                  sound.playSfx('sparkle');
                  setDispensedTreat('🍭');
                } else {
                  sound.playSfx('boing');
                  sound.speak("Complete all 3 good habits first to unlock the sweet machine!");
                }
              }}
            />
            {/* Sweet Machine Label */}
            <div className="absolute -bottom-2 inset-x-0 text-center">
              <span className="bg-yellow-400 text-sky-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow border border-yellow-200">
                Sweet Machine 🍬
              </span>
            </div>
          </div>

          {/* --- CENTER: Scene Items / Interactive Props --- */}
          <div className="relative z-10 flex flex-col items-center max-w-[280px] sm:max-w-xs text-center">
            {/* Story Dialogue / Speech Bubble */}
            <div className="bg-white/95 text-sky-950 p-4 rounded-3xl shadow-2xl border-4 border-yellow-300 relative animate-in zoom-in duration-300 mb-4">
              <div className="text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                {currentChapter.title.split('-')[1]?.trim() || currentChapter.title}
              </div>
              <p className="text-sm sm:text-base font-extrabold leading-snug">
                "{currentChapter.narrativeText}"
              </p>
              {/* Speech triangle tail */}
              <div className="absolute -bottom-3 right-8 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[12px] border-t-yellow-300" />
            </div>

            {/* Current Chapter Badge */}
            <div className="flex items-center gap-2 bg-sky-900/80 text-yellow-300 text-xs px-3 py-1.5 rounded-full border border-sky-400 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Chapter {activeChapterIndex + 1} of {episode.chapters.length}</span>
            </div>
          </div>

          {/* --- RIGHT: Animated Chris Character --- */}
          <div className="relative z-10 transform scale-100 sm:scale-120 md:scale-130 origin-bottom-right">
            <ChrisCharacter expression={getChrisExpression()} size="lg" />
            {/* MP Name Tag */}
            <div className="absolute -bottom-1 inset-x-0 text-center">
              <span className="bg-yellow-400 text-sky-950 font-extrabold text-xs px-3 py-0.5 rounded-full shadow border border-yellow-200">
                MP ⭐
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 3. INTERACTIVE MINIGAME CHALLENGE MODAL */}
      {activeStep && (
        <StoryGameOverlay
          step={activeStep}
          onComplete={handleStepComplete}
          onSkip={handleStepSkip}
        />
      )}

      {/* 4. YELLOW SUBTITLES / CAPTIONS OVERLAY (YouTube Kids Style) */}
      {showCaptions && (isPlaying || currentTime > 0) && !activeStep && currentChapter && (
        <div className="absolute bottom-16 sm:bottom-20 inset-x-0 flex justify-center z-20 pointer-events-none px-4">
          <div className="bg-black/85 text-yellow-300 font-extrabold text-sm sm:text-lg md:text-xl px-4 py-1.5 rounded-xl shadow-lg border border-yellow-400/40 text-center max-w-2xl [text-shadow:_0_1px_3px_rgba(0,0,0,0.8)]">
            {currentChapter.narrativeText}
          </div>
        </div>
      )}

      {/* 5. PLAYER CONTROLS BAR (Auto-hiding, sleek YouTube-style UI) */}
      <div
        className={`absolute bottom-0 inset-x-0 z-30 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-8 pb-3 px-4 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubbing Bar */}
        <div className="relative mb-2 flex items-center group/scrub">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 group-hover/scrub:h-2.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-red-600 transition-all"
          />
          {/* Chapter Markers on Scrubber */}
          {episode.chapters.map((ch, idx) => (
            <div
              key={idx}
              className="absolute top-0 bottom-0 w-1 bg-yellow-400 pointer-events-none"
              style={{ left: `${(ch.seconds / duration) * 100}%` }}
              title={ch.title}
            />
          ))}
        </div>

        {/* Control Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs sm:text-sm">
          {/* Left Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />}
            </button>

            {/* Next Episode */}
            <button
              onClick={onNextEpisode}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Next Episode"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Replay */}
            <button
              onClick={() => {
                setCurrentTime(0);
                setActiveChapterIndex(0);
                setIsPlaying(true);
              }}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer hidden sm:block"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Volume Mute */}
            <button
              onClick={() => {
                const muted = sound.toggleMute();
                setIsMuted(muted);
              }}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Mute / Unmute"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Time Stamp */}
            <span className="text-xs text-slate-300 font-medium">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Interactive Play-Along Toggle */}
            <button
              onClick={() => {
                setIsInteractiveMode(!isInteractiveMode);
                sound.playSfx('pop');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                isInteractiveMode
                  ? 'bg-yellow-400 text-sky-950 shadow'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title="Toggle interactive in-video games"
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Play Along: {isInteractiveMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Background Music Toggle */}
            <button
              onClick={() => {
                if (isMusicPlaying) {
                  sound.stopBgm();
                  setIsMusicPlaying(false);
                } else {
                  sound.startBgm();
                  setIsMusicPlaying(true);
                }
              }}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                isMusicPlaying ? 'text-yellow-300 bg-white/10' : 'text-slate-400 hover:bg-white/10'
              }`}
              title="Preschool BGM Music"
            >
              <Music className="w-4 h-4" />
            </button>

            {/* Voiceover Speech Toggle & Natural Voice Settings */}
            <div className="flex items-center gap-1 bg-white/10 rounded-full p-0.5">
              <button
                onClick={() => {
                  const voiceMuted = sound.toggleVoice();
                  setVoiceEnabled(!voiceMuted);
                }}
                className={`p-1 rounded-full transition-colors cursor-pointer text-xs font-bold px-2 flex items-center gap-1 ${
                  voiceEnabled ? 'text-emerald-400 bg-white/10' : 'text-slate-400 hover:bg-white/10'
                }`}
                title="Toggle Narrator Voice"
              >
                <span>🗣️</span>
                <span>{voiceEnabled ? 'Voice' : 'Mute'}</span>
              </button>

              <button
                onClick={() => {
                  sound.playSfx('pop');
                  setIsVoiceSettingsOpen(true);
                }}
                className="p-1 text-slate-300 hover:text-yellow-300 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
                title="Natural Voice Settings (Gemini AI & Browser Tuning)"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Subtitles CC */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                showCaptions ? 'text-yellow-400 bg-white/10' : 'text-slate-400 hover:bg-white/10'
              }`}
              title="Subtitles (CC)"
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <button
              onClick={() => {
                const speeds = [1, 1.25, 1.5, 0.75];
                const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
                setPlaybackSpeed(speeds[nextIdx]);
              }}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-xs font-bold cursor-pointer"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Natural Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />
    </div>
  );
};
