import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import type { AlphabetItem } from '../../types/learn';
import ReviewStatusBadge from './ReviewStatusBadge';
import { getLearnedLetters, toggleLearnedLetter } from '../../utils/learnProgress';

interface AlphabetGridProps {
  items: AlphabetItem[];
}

export const AlphabetGrid: React.FC<AlphabetGridProps> = ({ items }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [learnedList, setLearnedList] = useState<string[]>(() => getLearnedLetters());

  useEffect(() => {
    const handleUpdate = () => {
      setLearnedList(getLearnedLetters());
    };

    window.addEventListener('khasi-progress-updated', handleUpdate);
    return () => window.removeEventListener('khasi-progress-updated', handleUpdate);
  }, []);

  const selectedItem = items[selectedIndex] || items[0];
  const isLearned = selectedItem ? learnedList.includes(selectedItem.id) : false;

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handleToggleLearned = () => {
    if (selectedItem) {
      const updated = toggleLearnedLetter(selectedItem.id);
      setLearnedList(updated);
    }
  };

  const hasExampleWord = Boolean(selectedItem?.exampleWord && selectedItem.exampleWord.trim() !== '');

  return (
    <div className="space-y-6">
      {/* Learned Counter Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#DAA520]/20 flex items-center justify-center text-[#B8860B] dark:text-[#DAA520]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
              Dak Thoh Khasi
            </h3>
            <p className="text-xs text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
              Standard 23-letter Khasi Alphabet
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-full bg-[#DAA520]/15 text-[#8B6508] dark:text-[#DAA520] border border-[#DAA520]/30">
            {learnedList.length} / {items.length} Lah Nang (Learned)
          </span>
        </div>
      </div>

      {/* Active Letter Spotlight Card */}
      {selectedItem && (
        <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520]/60 p-6 sm:p-8 shadow-silk relative overflow-hidden transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Big Letter Display */}
            <div className="flex items-center gap-5 sm:gap-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#FAF9F6] to-[#E8E2D5] dark:from-[#242424] dark:to-[#1A1A1A] border-2 border-[#B22222] flex items-center justify-center shadow-md">
                <span className="font-serif text-5xl sm:text-6xl font-bold text-[#B22222] dark:text-[#E97451]">
                  {selectedItem.letter}
                </span>
                {isLearned && (
                  <span
                    className="absolute -top-2 -right-2 p-1 rounded-full bg-emerald-600 text-white shadow-md ring-2 ring-[#FAF9F6]"
                    title="Marked as learned"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                    Dak #{selectedIndex + 1}
                  </span>
                  <ReviewStatusBadge status={selectedItem.reviewStatus} size="sm" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                  Dak {selectedItem.letter}
                </h3>
                {selectedItem.phoneticHint && (
                  <p className="text-sm font-mono text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80 bg-[#DAA520]/15 px-2.5 py-0.5 rounded-md inline-block">
                    {selectedItem.phoneticHint}
                  </p>
                )}
              </div>
            </div>

            {/* Actions: Mark Learned + Prev/Next Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
              <button
                type="button"
                onClick={handleToggleLearned}
                className={`min-h-[50px] px-4 rounded-2xl font-semibold text-xs flex items-center gap-2 transition-all active:scale-95 border ${
                  isLearned
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-[#FAF9F6] dark:bg-[#242424] text-[#1A1A1A] dark:text-[#FAF9F6] border-[#E8E2D5] dark:border-[#333333] hover:border-[#DAA520]'
                }`}
              >
                {isLearned ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>Lah Nang (Learned)</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4 text-[#DAA520]" />
                    <span>Duh ban nang (Mark Learned)</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="min-h-[50px] min-w-[50px] px-3 rounded-2xl border border-[#E8E2D5] dark:border-[#333333] bg-[#FAF9F6] dark:bg-[#242424] hover:bg-[#DAA520]/10 active:scale-95 text-[#1A1A1A] dark:text-[#FAF9F6] font-semibold flex items-center justify-center shadow-xs"
                  aria-label="Previous letter"
                >
                  <ChevronLeft className="w-5 h-5 text-[#B22222]" />
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  className="min-h-[50px] min-w-[50px] px-3 rounded-2xl bg-[#B22222] hover:bg-[#8B0000] active:scale-95 text-[#FAF9F6] font-semibold flex items-center justify-center shadow-ceremonial"
                  aria-label="Next letter"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Example Word & Meaning Box - Render ONLY if present */}
          {hasExampleWord && (
            <div className="mt-6 pt-6 border-t border-[#E8E2D5] dark:border-[#333333] grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333]">
                <span className="text-xs uppercase font-mono tracking-wider text-[#DAA520] font-semibold">
                  Kyntien Nuksa (Example Word)
                </span>
                <p className="mt-1 font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                  {selectedItem.exampleWord}
                </p>
              </div>

              {selectedItem.meaning && (
                <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333]">
                  <span className="text-xs uppercase font-mono tracking-wider text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 font-semibold">
                    Jingmut (Meaning)
                  </span>
                  <p className="mt-1 text-base font-semibold text-[#1A1A1A] dark:text-[#FAF9F6]">
                    {selectedItem.meaning}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Grid of all 23 Letters (Large Touch Targets) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-semibold tracking-wider uppercase font-mono text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
            Jied ïa u Dak (Tap any letter tile)
          </h4>
          <span className="text-xs font-mono text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
            23 Dak Thoh
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 sm:gap-3">
          {items.map((item, index) => {
            const isSelected = index === selectedIndex;
            const learned = learnedList.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative min-h-[64px] rounded-2xl flex flex-col items-center justify-center p-2 font-serif font-bold text-2xl transition-all active:scale-95 shadow-xs ${
                  isSelected
                    ? 'bg-[#B22222] text-[#FAF9F6] ring-3 ring-[#DAA520] shadow-md scale-105 z-10'
                    : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:border-[#DAA520] hover:bg-[#DAA520]/10'
                }`}
                aria-label={`Select letter ${item.letter}`}
              >
                <span>{item.letter}</span>
                <span
                  className={`text-[9px] font-sans font-normal mt-0.5 ${
                    isSelected ? 'text-[#FAF9F6]/80' : 'text-[#1A1A1A]/50 dark:text-[#FAF9F6]/50'
                  }`}
                >
                  #{index + 1}
                </span>

                {learned && (
                  <span
                    className={`absolute top-1 right-1 w-2.5 h-2.5 rounded-full ${
                      isSelected ? 'bg-[#DAA520]' : 'bg-emerald-600'
                    }`}
                    title="Learned"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AlphabetGrid;
