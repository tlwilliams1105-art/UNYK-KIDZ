import React, { useState } from 'react';
import { MPCharacter } from './ChrisCharacter';
import { sound } from '../utils/audio';
import { Play, Wand2 } from 'lucide-react';

interface CreateEpisodeStudioProps {
  onPlayGeneratedEpisode: (title: string, description: string, habit: string) => void;
}

export const CreateEpisodeStudio: React.FC<CreateEpisodeStudioProps> = ({
  onPlayGeneratedEpisode,
}) => {
  const [selectedOutfit, setSelectedOutfit] = useState('Classic Yellow Polo');
  const [selectedHabit, setSelectedHabit] = useState('Brushing Teeth & Sugar Bugs');
  const [selectedMachine, setSelectedMachine] = useState('Magical Sweet Machine');
  const [selectedTreat, setSelectedTreat] = useState('Rainbow Swirl Lollipop');
  const [isGenerated, setIsGenerated] = useState(false);

  const outfits = [
    { id: 'polo', name: 'Classic Yellow Polo', icon: '👕', desc: 'MP’s signature bright style' },
    { id: 'fire', name: 'Firefighter Hero', icon: '🧑‍🚒', desc: 'Rescue hat & safety boots' },
    { id: 'super', name: 'Super Good-Habit Cape', icon: '🦸', desc: 'Flying hero of clean habits' },
    { id: 'pajamas', name: 'Cozy Bear Pajamas', icon: '🐻', desc: 'Soft and warm for bedtime' },
  ];

  const habits = [
    { id: 'teeth', name: 'Brushing Teeth & Sugar Bugs', icon: '🪥', lesson: 'Brush morning & night for sparkling teeth' },
    { id: 'veggies', name: 'Eating Rainbow Veggies', icon: '🥦', lesson: 'Broccoli & carrots build muscle power' },
    { id: 'toys', name: 'Tidy Toy Room Challenge', icon: '🧸', lesson: 'Pack racecars and blocks safely in the chest' },
    { id: 'share', name: 'Sharing Toys with Friends', icon: '🤝', lesson: 'Taking turns makes playing twice as fun' },
    { id: 'wash', name: 'Hand Washing Bubble Song', icon: '🫧', lesson: 'Sing twice to wash away tiny germs' },
  ];

  const machines = [
    { id: 'sweet', name: 'Magical Sweet Machine', icon: '🍬', desc: 'Dispenses treats for good habits' },
    { id: 'train', name: 'Rainbow Toy Train', icon: '🚂', desc: 'Choo-choo through color stations' },
    { id: 'robot', name: 'Robo-Vacuum Cleaner', icon: '🤖', desc: 'Beeps and cleans the playroom floor' },
    { id: 'star', name: 'Starlight Dream Projector', icon: '🌙', desc: 'Spins soothing stars on the ceiling' },
  ];

  const treats = [
    { id: 'lollipop', name: 'Rainbow Swirl Lollipop', icon: '🍭' },
    { id: 'gummy', name: 'Fruit Gummy Stars', icon: '⭐' },
    { id: 'apple', name: 'Crispy Honeycrisp Apple', icon: '🍎' },
    { id: 'cookie', name: 'Golden Smile Cookie', icon: '🍪' },
  ];

  const handleGenerate = () => {
    sound.playSfx('fanfare');
    sound.playSfx('sparkle');
    setIsGenerated(true);
    sound.speak(`Episode ready! MP wears his ${selectedOutfit} and masters ${selectedHabit} using the ${selectedMachine}!`);
  };

  const generatedTitle = `MP learns ${selectedHabit.toLowerCase()} with the ${selectedMachine.toLowerCase()}!`;
  const generatedDesc = `In this brand new custom story, MP puts on his ${selectedOutfit} to tackle ${selectedHabit}! With the help of the ${selectedMachine}, MP earns a delicious ${selectedTreat} and sings the happy victory song!`;

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 text-white animate-in fade-in duration-300">
      {/* Studio Header */}
      <div className="text-center mb-8">
        <span className="bg-emerald-400 text-sky-950 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow">
          MP Story Studio 🎬
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 mt-2 font-['Fredoka'] drop-shadow-md">
          Make Your Own MP Kids Episode! ✨
        </h2>
        <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mt-1">
          Pick MP's clothes, good habit mission, and magical toy machine to generate a custom episode!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-neutral-900/90 border-2 border-yellow-400/50 p-6 sm:p-8 rounded-3xl shadow-2xl">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: MP's Outfit */}
          <div>
            <label className="block text-xs uppercase font-extrabold text-yellow-300 mb-2">
              1. Choose MP’s Outfit:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {outfits.map((outfit) => (
                <button
                  key={outfit.id}
                  onClick={() => {
                    setSelectedOutfit(outfit.name);
                    sound.playSfx('pop');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    selectedOutfit === outfit.name
                      ? 'bg-sky-500/20 border-sky-400 shadow-md scale-102'
                      : 'bg-neutral-800/60 border-white/10 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-2xl">{outfit.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{outfit.name}</div>
                    <div className="text-[10px] text-slate-400">{outfit.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Good Habit Mission */}
          <div>
            <label className="block text-xs uppercase font-extrabold text-yellow-300 mb-2">
              2. Choose Good Habit Mission:
            </label>
            <div className="space-y-2">
              {habits.map((h) => (
                <button
                  key={h.id}
                  onClick={() => {
                    setSelectedHabit(h.name);
                    sound.playSfx('pop');
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    selectedHabit === h.name
                      ? 'bg-yellow-400/20 border-yellow-400 shadow-md'
                      : 'bg-neutral-800/60 border-white/10 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-2xl">{h.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">{h.name}</div>
                    <div className="text-[10px] text-slate-300">{h.lesson}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Magic Machine */}
          <div>
            <label className="block text-xs uppercase font-extrabold text-yellow-300 mb-2">
              3. Magical Machine:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {machines.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMachine(m.name);
                    sound.playSfx('pop');
                  }}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                    selectedMachine === m.name
                      ? 'bg-emerald-500/20 border-emerald-400 shadow-md'
                      : 'bg-neutral-800/60 border-white/10 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div>
                    <div className="text-xs font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-slate-400">{m.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            className="w-full py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 hover:from-yellow-300 hover:to-orange-300 text-sky-950 font-black text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 transform active:scale-98 transition-transform cursor-pointer"
          >
            <Wand2 className="w-5 h-5 text-sky-950" />
            <span>Generate Custom MP Episode!</span>
          </button>
        </div>

        {/* Right Column: Episode Preview Card */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center bg-black/60 rounded-3xl p-6 border border-white/10 text-center">
          {/* Cover Art Preview */}
          <div className="w-full aspect-video bg-gradient-to-tr from-sky-400 via-cyan-400 to-blue-500 rounded-2xl border-4 border-yellow-300 shadow-2xl relative overflow-hidden flex items-center justify-between p-4 mb-4">
            <div className="text-left z-10 max-w-[55%]">
              <span className="bg-yellow-400 text-sky-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                MP CUSTOM SHOW
              </span>
              <div className="text-sm font-black text-white mt-1 leading-tight line-clamp-2 drop-shadow">
                {generatedTitle}
              </div>
            </div>
            <div className="relative z-10 transform scale-110 origin-bottom-right">
              <MPCharacter expression="excited" size="md" />
            </div>
          </div>

          {/* Episode Info */}
          <h4 className="text-base sm:text-lg font-black text-yellow-300 mb-1">
            {generatedTitle}
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {generatedDesc}
          </p>

          {isGenerated && (
            <button
              onClick={() => onPlayGeneratedEpisode(generatedTitle, generatedDesc, selectedHabit)}
              className="flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm rounded-full shadow-lg transition-colors cursor-pointer animate-bounce"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch This Episode Now!</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
