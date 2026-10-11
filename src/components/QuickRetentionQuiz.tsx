import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { Sparkles, CheckCircle2, RotateCcw, Brain, Award, ArrowRight } from 'lucide-react';
import { MPCharacter } from './ChrisCharacter';

export interface QuizQuestion {
  question: string;
  options: { text: string; icon: string; isCorrect: boolean }[];
  explanation: string;
}

interface QuickRetentionQuizProps {
  habitTitle: string;
  questions?: QuizQuestion[];
  onComplete: (score: number) => void;
  onClose: () => void;
}

const DEFAULT_QUESTIONS: QuizQuestion[] = [
  {
    question: "When should MP and friends brush their teeth to stop sugar bugs?",
    options: [
      { text: "Morning & Night!", icon: "🪥", isCorrect: true },
      { text: "Only on birthdays", icon: "🎂", isCorrect: false },
      { text: "Never at all", icon: "😴", isCorrect: false },
    ],
    explanation: "Brushing morning and night keeps teeth shiny and washes away sugar bugs!",
  },
  {
    question: "Which delicious foods give MP super energy and strong muscles?",
    options: [
      { text: "Crunchy Veggies & Fruit", icon: "🥦", isCorrect: true },
      { text: "Five giant candy bars", icon: "🍫", isCorrect: false },
      { text: "Salty potato chips", icon: "🍟", isCorrect: false },
    ],
    explanation: "Carrots, broccoli, and apples are rainbow foods that build super strength!",
  },
  {
    question: "Where do racecars and soccer balls go when playtime is finished?",
    options: [
      { text: "Tidied in the toy box!", icon: "🧸", isCorrect: true },
      { text: "Hidden under the bed", icon: "🛏️", isCorrect: false },
      { text: "Scattered in the hallway", icon: "🚪", isCorrect: false },
    ],
    explanation: "Tidying toys in the toy chest keeps everyone safe and makes tomorrow's play easy!",
  },
];

export const QuickRetentionQuiz: React.FC<QuickRetentionQuizProps> = ({
  habitTitle,
  questions = DEFAULT_QUESTIONS,
  onComplete,
  onClose,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuestion = questions[currentIdx] || questions[0];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);

    const isCorrect = activeQuestion.options[idx].isCorrect;
    if (isCorrect) {
      sound.playSfx('fanfare');
      sound.playSfx('sparkle');
      setScore((s) => s + 1);
    } else {
      sound.playSfx('boing');
    }

    sound.speak(
      isCorrect
        ? `That's right! ${activeQuestion.explanation}`
        : `Almost! ${activeQuestion.explanation}`
    );
  };

  const handleNext = () => {
    sound.playSfx('pop');
    setSelectedOption(null);
    setShowExplanation(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
      sound.playSfx('fanfare');
      sound.playSfx('cheer');
    }
  };

  const handleFinish = () => {
    sound.playSfx('sparkle');
    onComplete(score);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-sky-400 via-sky-500 to-blue-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl border-4 border-yellow-300 overflow-hidden">
        {/* Playful Floating Stars */}
        <div className="absolute -top-4 -right-4 text-yellow-300/30 text-7xl pointer-events-none select-none">
          ⭐
        </div>
        <div className="absolute -bottom-4 -left-4 text-yellow-300/30 text-7xl pointer-events-none select-none">
          ✨
        </div>

        {/* Header Ribbon */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-yellow-400 text-sky-950 font-black px-3 py-1 rounded-full text-xs uppercase tracking-wider shadow flex items-center gap-1">
              <Brain className="w-3.5 h-3.5" /> Quick Quiz
            </span>
            <span className="text-xs text-sky-100 font-semibold hidden sm:inline">
              Retention Memory Game
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-xs font-bold text-sky-100 hover:text-white bg-sky-700/60 hover:bg-sky-700 px-3 py-1 rounded-lg transition-colors cursor-pointer"
          >
            Skip ⏭️
          </button>
        </div>

        {!isFinished ? (
          <div>
            {/* Question Progress Meter */}
            <div className="flex items-center justify-between text-xs font-bold text-yellow-200 mb-2">
              <span>Question {currentIdx + 1} of {questions.length}</span>
              <span>Memory Score: {score} ⭐</span>
            </div>
            <div className="w-full h-3 bg-sky-950/60 rounded-full overflow-hidden border border-sky-300/40 mb-5">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-sky-900/70 rounded-2xl p-4 sm:p-5 border-2 border-sky-300/40 mb-5 text-center shadow-inner">
              <div className="text-xs uppercase font-extrabold text-yellow-300 mb-1">
                {habitTitle}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                "{activeQuestion.question}"
              </h3>
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const showStatus = selectedOption !== null;
                let btnStyle = 'bg-white/15 hover:bg-white/25 border-white/20 text-white';

                if (showStatus) {
                  if (opt.isCorrect) {
                    btnStyle = 'bg-emerald-500 text-sky-950 border-white font-black scale-102 shadow-lg';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'bg-rose-500/80 text-white border-rose-300 opacity-80';
                  } else {
                    btnStyle = 'bg-white/10 opacity-50 border-transparent';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={selectedOption !== null}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer transform hover:scale-105 active:scale-95 text-center ${btnStyle}`}
                  >
                    <span className="text-3xl mb-1">{opt.icon}</span>
                    <span className="text-xs sm:text-sm font-bold leading-tight">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Explanation & Continue Button */}
            {showExplanation && (
              <div className="bg-yellow-300 text-sky-950 p-3.5 rounded-2xl mb-4 font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">💡</span>
                  <span>{activeQuestion.explanation}</span>
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="shrink-0 ml-3 bg-sky-900 text-yellow-300 hover:bg-sky-950 font-black px-4 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Victory / Quiz Complete View */
          <div className="text-center py-4 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-yellow-300 border-4 border-white flex items-center justify-center text-4xl shadow-xl animate-bounce mb-3">
              🏆
            </div>
            <h3 className="text-2xl font-black text-yellow-300 font-['Fredoka']">
              Memory Master Challenge Complete!
            </h3>
            <p className="text-sky-100 text-sm mt-1 max-w-sm">
              You scored {score} of {questions.length} correct! MP is so proud of your memory power!
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={handleFinish}
                className="bg-yellow-400 hover:bg-yellow-300 text-sky-950 font-black px-6 py-2.5 rounded-2xl shadow-xl border-2 border-white flex items-center gap-2 cursor-pointer transform hover:scale-105 transition-all"
              >
                <Sparkles className="w-4 h-4 text-sky-950" />
                <span>Claim Habit Memory Badge! 🚀</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
