// Web Audio API Synthesizer for Chris Kids Show
// Produces playful sound effects and upbeat preschool background music without external audio files

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private isBgmPlaying = false;
  private bgmTimer: number | null = null;
  private isMuted = false;
  private isVoiceMuted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.12;
      this.bgmGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.35;
      this.sfxGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play short synthesized sound effects
  playSfx(type: 'pop' | 'boing' | 'sparkle' | 'coin' | 'crank' | 'fanfare' | 'brush' | 'crunch' | 'bell' | 'cheer') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.sfxGain) return;
      const t = this.ctx.currentTime;

      switch (type) {
        case 'pop': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400, t);
          osc.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
          gain.gain.setValueAtTime(0.4, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.1);
          break;
        }

        case 'boing': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(220, t);
          osc.frequency.linearRampToValueAtTime(580, t + 0.15);
          osc.frequency.linearRampToValueAtTime(320, t + 0.3);
          gain.gain.setValueAtTime(0.4, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.35);
          break;
        }

        case 'sparkle': {
          const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.51];
          freqs.forEach((f, idx) => {
            if (!this.ctx || !this.sfxGain) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, t + idx * 0.05);
            gain.gain.setValueAtTime(0.2, t + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.25);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(t + idx * 0.05);
            osc.stop(t + idx * 0.05 + 0.25);
          });
          break;
        }

        case 'coin': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(987.77, t);
          osc.frequency.setValueAtTime(1318.51, t + 0.08);
          gain.gain.setValueAtTime(0.3, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.3);
          break;
        }

        case 'crank': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(120, t);
          osc.frequency.linearRampToValueAtTime(280, t + 0.08);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.09);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.09);
          break;
        }

        case 'brush': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(350, t);
          osc.frequency.linearRampToValueAtTime(650, t + 0.06);
          osc.frequency.linearRampToValueAtTime(400, t + 0.12);
          gain.gain.setValueAtTime(0.25, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.14);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.14);
          break;
        }

        case 'crunch': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(300, t);
          osc.frequency.exponentialRampToValueAtTime(120, t + 0.1);
          gain.gain.setValueAtTime(0.35, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.12);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.12);
          break;
        }

        case 'fanfare': {
          const notes = [
            { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 783.99, d: 0.15 },
            { f: 1046.5, d: 0.4 },
          ];
          let curTime = t;
          notes.forEach((n) => {
            if (!this.ctx || !this.sfxGain) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(n.f, curTime);
            gain.gain.setValueAtTime(0.3, curTime);
            gain.gain.exponentialRampToValueAtTime(0.01, curTime + n.d);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(curTime);
            osc.stop(curTime + n.d);
            curTime += n.d;
          });
          break;
        }

        case 'bell': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1760, t);
          osc.frequency.exponentialRampToValueAtTime(880, t + 0.4);
          gain.gain.setValueAtTime(0.4, t);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
          osc.connect(gain);
          gain.connect(this.sfxGain);
          osc.start(t);
          osc.stop(t + 0.5);
          break;
        }

        case 'cheer': {
          // Play mini celebration sparkles
          for (let i = 0; i < 5; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            const f = 600 + Math.random() * 600;
            const startTime = t + i * 0.08;
            osc.frequency.setValueAtTime(f, startTime);
            osc.frequency.exponentialRampToValueAtTime(f * 1.5, startTime + 0.15);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.18);
            osc.connect(gain);
            gain.connect(this.sfxGain);
            osc.start(startTime);
            osc.stop(startTime + 0.18);
          }
          break;
        }
      }
    } catch {
      // AudioContext could fail gracefully if user hasn't interacted
    }
  }

  // Play continuous upbeat playful nursery background music (marimba / xylophone style)
  startBgm() {
    if (this.isBgmPlaying || this.isMuted) return;
    this.initContext();
    this.isBgmPlaying = true;

    // Upbeat C-major preschool melody loop
    const melody = [
      523.25, 659.25, 783.99, 659.25,
      523.25, 659.25, 783.99, 1046.5,
      880.00, 783.99, 659.25, 587.33,
      523.25, 587.33, 659.25, 523.25
    ];
    let noteIdx = 0;

    const playNextNote = () => {
      if (!this.isBgmPlaying || !this.ctx || !this.bgmGain) return;
      const t = this.ctx.currentTime;
      const freq = melody[noteIdx];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start(t);
      osc.stop(t + 0.3);

      noteIdx = (noteIdx + 1) % melody.length;
      this.bgmTimer = window.setTimeout(playNextNote, 320);
    };

    playNextNote();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  toggleVoice(): boolean {
    this.isVoiceMuted = !this.isVoiceMuted;
    if (this.isVoiceMuted) {
      this.stopSpeech();
    }
    return this.isVoiceMuted;
  }

  getVoiceMuted(): boolean {
    return this.isVoiceMuted;
  }

  // --- NATURAL VOICE CONFIGURATION ---
  private voiceConfig: VoiceConfig = (() => {
    try {
      const saved = localStorage.getItem('mp_voice_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore storage errors
    }
    return {
      engine: 'gemini',
      geminiVoice: 'Puck',
      browserVoiceURI: '',
      pitch: 1.0, // Natural human pitch
      rate: 1.0,  // Natural storytelling cadence
    };
  })();

  private clientAudioCache = new Map<string, string>();
  private currentAudioElement: HTMLAudioElement | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null;

  getVoiceConfig(): VoiceConfig {
    return { ...this.voiceConfig };
  }

  setVoiceConfig(partial: Partial<VoiceConfig>) {
    this.voiceConfig = { ...this.voiceConfig, ...partial };
    try {
      localStorage.setItem('mp_voice_config', JSON.stringify(this.voiceConfig));
    } catch {
      // Ignore storage errors
    }
  }

  stopSpeech() {
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
      } catch {
        // Ignore
      }
      this.currentAudioElement = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.activeUtterance = null;
  }

  getBestNaturalVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    if (this.voiceConfig.browserVoiceURI) {
      const match = voices.find(
        (v) => v.voiceURI === this.voiceConfig.browserVoiceURI || v.name === this.voiceConfig.browserVoiceURI
      );
      if (match) return match;
    }

    // Priority keywords for natural/neural voices in modern browsers & OS
    const priorityKeywords = [
      'natural',
      'neural',
      'google us english',
      'google uk english female',
      'google',
      'enhanced',
      'samantha',
      'jenny',
      'guy',
      'aria',
      'ava',
      'alex',
    ];

    for (const kw of priorityKeywords) {
      const found = voices.find(
        (v) => v.lang.startsWith('en') && v.name.toLowerCase().includes(kw)
      );
      if (found) return found;
    }

    const englishVoice = voices.find((v) => v.lang.startsWith('en'));
    return englishVoice || voices[0] || null;
  }

  getAvailableBrowserVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    const all = window.speechSynthesis.getVoices();
    return all.filter((v) => v.lang.startsWith('en'));
  }

  async speak(text: string): Promise<void> {
    if (this.isVoiceMuted || !text || typeof window === 'undefined') return;

    this.stopSpeech();

    // 1. Try Gemini AI Ultra-Natural Voice (Human Studio Audio)
    if (this.voiceConfig.engine === 'gemini') {
      try {
        const cacheKey = `${this.voiceConfig.geminiVoice}:${text.trim()}`;
        let base64Audio = this.clientAudioCache.get(cacheKey);

        if (!base64Audio) {
          const res = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: text.trim(),
              voiceName: this.voiceConfig.geminiVoice,
              style: 'Warm, cheerful, natural, and expressive animated show narrator and child named MP',
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (typeof data?.audio === 'string') {
              base64Audio = data.audio;
              this.clientAudioCache.set(cacheKey, data.audio);
            }
          }
        }

        if (base64Audio) {
          const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
          this.currentAudioElement = audio;
          audio.playbackRate = Math.min(1.5, Math.max(0.7, this.voiceConfig.rate));
          audio.onended = () => {
            if (this.currentAudioElement === audio) {
              this.currentAudioElement = null;
            }
          };
          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('Gemini TTS unavailable, falling back to natural browser speech:', err);
      }
    }

    // 2. High-Quality Natural Browser Web Speech Fallback
    this.speakBrowser(text);
  }

  speakBrowser(text: string) {
    if (this.isVoiceMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const naturalVoice = this.getBestNaturalVoice();
      if (naturalVoice) {
        utterance.voice = naturalVoice;
      }

      // Natural acoustic parameters:
      utterance.pitch = Math.min(1.4, Math.max(0.7, this.voiceConfig.pitch)); // Natural human pitch
      utterance.rate = Math.min(1.4, Math.max(0.7, this.voiceConfig.rate));   // Natural conversational speed
      utterance.volume = 0.95;

      this.activeUtterance = utterance;
      utterance.onend = () => {
        if (this.activeUtterance === utterance) {
          this.activeUtterance = null;
        }
      };
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore if speech not supported or blocked
    }
  }

  testVoice(customText?: string) {
    const phrase = customText || "Hi friends! I am MP! Let's learn good habits together!";
    this.speak(phrase);
  }
}

export interface VoiceConfig {
  engine: 'gemini' | 'browser';
  geminiVoice: 'Puck' | 'Zephyr' | 'Kore' | 'Charon' | 'Fenrir';
  browserVoiceURI: string;
  pitch: number;
  rate: number;
}

export const sound = new SoundEngine();
