import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Star,
  CheckCircle2,
  RotateCcw,
  Award,
  AlertTriangle,
} from 'lucide-react';
import type { AlphabetItem, VocabCategory } from '../../types/learn';
import {
  getLearnedLetters,
  getKnownFlashcards,
  getTotalStars,
  getGamesPlayed,
  resetAllProgress,
} from '../../utils/learnProgress';

interface ProgressViewProps {
  alphabetItems: AlphabetItem[];
  vocabCategories: VocabCategory[];
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  alphabetItems,
  vocabCategories,
}) => {
  const [learnedLetters, setLearnedLetters] = useState<string[]>(() => getLearnedLetters());
  const [knownFlashcards, setKnownFlashcards] = useState<string[]>(() => getKnownFlashcards());
  const [stars, setStars] = useState<number>(() => getTotalStars());
  const [gamesPlayed, setGamesPlayed] = useState<number>(() => getGamesPlayed());
  const [showResetModal, setShowResetModal] = useState<boolean>(false);

  const loadData = () => {
    setLearnedLetters(getLearnedLetters());
    setKnownFlashcards(getKnownFlashcards());
    setStars(getTotalStars());
    setGamesPlayed(getGamesPlayed());
  };

  useEffect(() => {
    window.addEventListener('khasi-progress-updated', loadData);
    return () => window.removeEventListener('khasi-progress-updated', loadData);
  }, []);

  const totalWords = vocabCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  const handleConfirmReset = () => {
    resetAllProgress();
    setShowResetModal(false);
    loadData();
  };

  // Milestone badges
  const badges = [
    {
      id: 'badge-1',
      title: 'Khasi Beginner',
      desc: 'Earn 5 Stars',
      target: 5,
      isUnlocked: stars >= 5,
      color: 'from-amber-600 to-amber-700',
    },
    {
      id: 'badge-2',
      title: 'Word Explorer',
      desc: 'Earn 15 Stars',
      target: 15,
      isUnlocked: stars >= 15,
      color: 'from-slate-400 to-slate-600',
    },
    {
      id: 'badge-3',
      title: 'Heritage Champion',
      desc: 'Earn 30 Stars',
      target: 30,
      isUnlocked: stars >= 30,
      color: 'from-[#DAA520] to-[#B8860B]',
    },
    {
      id: 'badge-4',
      title: 'Master of Khasi',
      desc: 'Earn 50 Stars',
      target: 50,
      isUnlocked: stars >= 50,
      color: 'from-[#B22222] to-[#8B0000]',
    },
  ];

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Overview Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] shadow-silk text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
            Letters Learned
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#B22222]">
            {learnedLetters.length} / {alphabetItems.length}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] shadow-silk text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
            Flashcards Known
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#DAA520]">
            {knownFlashcards.length} / {totalWords}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] shadow-silk text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
            Games Played
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
            {gamesPlayed}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] shadow-silk text-center space-y-1">
          <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
            Total Stars
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-[#DAA520] flex items-center justify-center gap-1">
            <Star className="w-5 h-5 fill-[#DAA520] text-[#DAA520]" />
            <span>{stars}</span>
          </p>
        </div>
      </div>

      {/* Milestone Badges Section */}
      <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520]/60 p-6 sm:p-8 space-y-4 shadow-silk">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#DAA520]" />
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
              Milestone Badges
            </h3>
          </div>
          <span className="text-xs font-mono text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
            {badges.filter((b) => b.isUnlocked).length} / {badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border flex items-center gap-3.5 transition-all ${
                badge.isUnlocked
                  ? 'bg-white/80 dark:bg-[#242424] border-[#DAA520] shadow-sm'
                  : 'bg-white/30 dark:bg-[#242424]/40 border-[#E8E2D5] dark:border-[#333333] opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
              >
                <Award className="w-6 h-6" />
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-serif font-bold text-sm text-[#1A1A1A] dark:text-[#FAF9F6]">
                    {badge.title}
                  </h4>
                  {badge.isUnlocked && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </div>
                <p className="text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 font-mono">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learned Letters Visual Matrix */}
      <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] p-6 space-y-3 shadow-silk">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-base font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
            Alphabet Mastery (Dak Thoh)
          </h4>
          <span className="text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
            {learnedLetters.length} / {alphabetItems.length} Learned
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 pt-2">
          {alphabetItems.map((item) => {
            const isLearned = learnedLetters.includes(item.id);
            return (
              <div
                key={item.id}
                className={`h-11 rounded-xl flex items-center justify-center font-serif font-bold text-sm border ${
                  isLearned
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white/40 dark:bg-[#242424] text-[#1A1A1A]/40 dark:text-[#FAF9F6]/40 border-[#E8E2D5] dark:border-[#333333]'
                }`}
                title={`Dak ${item.letter}: ${isLearned ? 'Learned' : 'Not yet marked'}`}
              >
                {item.letter}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Section with Confirmation */}
      <div className="pt-4 flex justify-center">
        <button
          type="button"
          onClick={() => setShowResetModal(true)}
          className="min-h-[46px] px-4 rounded-xl border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-2 active:scale-95 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Learning Progress</span>
        </button>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#B22222] rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#B22222]/10 text-[#B22222] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                Reset Learning Progress?
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70 leading-relaxed">
                This will reset all your learned letters, flashcard mastery, games played, and stars on this device.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="min-h-[46px] rounded-xl border border-[#E8E2D5] dark:border-[#333333] text-xs font-semibold hover:bg-[#DAA520]/10"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="min-h-[46px] rounded-xl bg-[#B22222] text-[#FAF9F6] text-xs font-bold shadow-ceremonial active:scale-95"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressView;
