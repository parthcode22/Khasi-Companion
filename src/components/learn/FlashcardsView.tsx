import React, { useState, useEffect } from 'react';
import {
  PawPrint,
  Users,
  Trees,
  Binary,
  Palette,
  RotateCw,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { VocabCategory, VocabItem } from '../../types/learn';
import ReviewStatusBadge from './ReviewStatusBadge';
import { getKnownFlashcards, setFlashcardKnown } from '../../utils/learnProgress';

interface FlashcardsViewProps {
  categories: VocabCategory[];
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  PawPrint,
  Users,
  Trees,
  Binary,
  Palette,
};

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({ categories }) => {
  const [activeCatId, setActiveCatId] = useState<string>('cat-animals');
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [hideEnglish, setHideEnglish] = useState<boolean>(false);
  const [knownList, setKnownList] = useState<string[]>(() => getKnownFlashcards());

  useEffect(() => {
    const handleUpdate = () => {
      setKnownList(getKnownFlashcards());
    };

    window.addEventListener('khasi-progress-updated', handleUpdate);
    return () => window.removeEventListener('khasi-progress-updated', handleUpdate);
  }, []);

  const activeCategory = categories.find((c) => c.id === activeCatId) || categories[0];
  const items: VocabItem[] = activeCategory?.items || [];
  const currentItem = items[currentCardIndex] || items[0];

  const isCurrentKnown = currentItem ? knownList.includes(currentItem.id) : false;

  const handleSelectCategory = (catId: string) => {
    setActiveCatId(catId);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
  };

  const handleMarkKnown = (known: boolean) => {
    if (currentItem) {
      const updated = setFlashcardKnown(currentItem.id, known);
      setKnownList(updated);
      handleNext();
    }
  };

  const knownCountInTopic = items.filter((it) => knownList.includes(it.id)).length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.iconName] || PawPrint;
          const isActive = cat.id === activeCatId;
          const isColors = cat.id === 'cat-colors';

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleSelectCategory(cat.id)}
              className={`min-h-[48px] px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-[#B22222] text-[#FAF9F6] shadow-ceremonial ring-2 ring-[#DAA520]'
                  : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10'
              }`}
            >
              <Icon className="w-4 h-4 text-[#DAA520]" />
              <span>{cat.categoryEnglish}</span>
              {isColors ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E97451]/20 text-[#C85A38] dark:text-[#F39C7F]">
                  Soon
                </span>
              ) : (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-[#E8E2D5] dark:bg-[#333333]'
                  }`}
                >
                  {cat.items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Check if Category has words or is Coming Soon */}
      {items.length === 0 ? (
        <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#E8E2D5] dark:border-[#333333] p-10 text-center space-y-4 shadow-silk">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#DAA520]/15 flex items-center justify-center text-[#B8860B] dark:text-[#DAA520]">
            <Palette className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
            Colors Topic • Coming Soon
          </h3>
          <p className="text-sm text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70 max-w-md mx-auto leading-relaxed">
            Verified Khasi words for colors are being compiled with local Khasi teachers and will be added here soon.
          </p>
        </div>
      ) : (
        <>
          {/* Controls Bar: Progress & Hide English Toggle */}
          <div className="flex items-center justify-between gap-3 px-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
                Card {currentCardIndex + 1} of {items.length}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {knownCountInTopic} / {items.length} Known
              </span>
            </div>

            <button
              type="button"
              onClick={() => setHideEnglish(!hideEnglish)}
              className="text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2D5] dark:border-[#333333] bg-[#FAF9F6] dark:bg-[#242424] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10"
            >
              {hideEnglish ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-[#B22222]" />
                  <span>Hidden English</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Show English</span>
                </>
              )}
            </button>
          </div>

          {/* Interactive Flip Card Container */}
          <div
            tabIndex={0}
            role="button"
            aria-label="Flashcard. Click or press Enter to flip."
            onClick={() => setIsFlipped(!isFlipped)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsFlipped(!isFlipped);
              }
            }}
            className="group min-h-[300px] sm:min-h-[340px] cursor-pointer rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520] p-6 sm:p-10 shadow-silk hover:shadow-silk-lg transition-all duration-300 flex flex-col justify-between relative overflow-hidden select-none outline-none focus:ring-2 focus:ring-[#B22222]"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase font-semibold text-[#DAA520]">
                {activeCategory?.categoryEnglish}
              </span>
              <ReviewStatusBadge status={currentItem.reviewStatus} size="sm" />
            </div>

            {/* Card Body (Flips between Khasi Word and English Meaning) */}
            <div className="text-center my-auto py-6 space-y-4">
              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#1A1A1A]/50 dark:text-[#FAF9F6]/50">
                    Khasi Word
                  </span>
                  <h2 className="font-serif text-4xl sm:text-5xl font-extrabold text-[#B22222] dark:text-[#E97451] tracking-wide">
                    {currentItem.word}
                  </h2>
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Tap card to see meaning</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-[#DAA520]">
                    English Meaning
                  </span>
                  {hideEnglish ? (
                    <div className="p-4 rounded-xl bg-white/60 dark:bg-[#242424] border border-dashed border-[#DAA520] text-sm text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
                      English hidden for challenge mode. Tap to reveal!
                    </div>
                  ) : (
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6] leading-snug">
                      {currentItem.englishMeaning}
                    </h2>
                  )}
                  <p className="text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 font-mono">
                    Khasi: <strong className="text-[#B22222]">{currentItem.word}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Card Footer Indicator */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E2D5] dark:border-[#333333] text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
              <span>{isCurrentKnown ? '⭐ Marked as Known' : 'Practice in progress'}</span>
              <span className="font-mono text-[11px]">Flip for answer ↺</span>
            </div>
          </div>

          {/* Action Buttons: "Practice again" vs "I know this" */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleMarkKnown(false)}
              className="min-h-[52px] rounded-2xl border-2 border-[#E97451] bg-[#FAF9F6] dark:bg-[#242424] text-[#C85A38] dark:text-[#F39C7F] font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xs hover:bg-[#E97451]/10"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Practice Again</span>
            </button>

            <button
              type="button"
              onClick={() => handleMarkKnown(true)}
              className="min-h-[52px] rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>I Know This!</span>
            </button>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrev}
              className="min-h-[46px] px-4 rounded-xl border border-[#E8E2D5] dark:border-[#333333] bg-[#FAF9F6] dark:bg-[#242424] text-xs font-semibold flex items-center gap-1.5 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="min-h-[46px] px-4 rounded-xl bg-[#B22222] text-[#FAF9F6] text-xs font-semibold flex items-center gap-1.5 shadow-ceremonial active:scale-95"
            >
              <span>Next Card</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardsView;
