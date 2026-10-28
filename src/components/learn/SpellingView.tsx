import React, { useState, useEffect, useMemo } from 'react';
import { Star, Lightbulb, RotateCcw, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { VocabCategory, VocabItem } from '../../types/learn';
import { addStars, getTotalStars } from '../../utils/learnProgress';

interface SpellingViewProps {
  categories: VocabCategory[];
}

interface Tile {
  id: string;
  char: string;
}

// Tokenizes Khasi word into tiles, treating "ng" as a single tile and supporting ï, ñ
function tokenizeKhasiWord(word: string): string[] {
  const clean = word.trim().toLowerCase();
  const tokens: string[] = [];
  let i = 0;
  while (i < clean.length) {
    if (clean.substring(i, i + 2) === 'ng') {
      tokens.push('ng');
      i += 2;
    } else {
      tokens.push(clean[i]);
      i++;
    }
  }
  return tokens;
}

export const SpellingView: React.FC<SpellingViewProps> = ({ categories }) => {
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [placedTiles, setPlacedTiles] = useState<Tile[]>([]);
  // Pool of words suitable for spelling (single words without spaces or slashes)
  const spellingPool: VocabItem[] = useMemo(() => {
    return categories
      .flatMap((c) => c.items)
      .filter((w) => !w.word.includes(' ') && !w.word.includes('/'));
  }, [categories]);

  const initTiles = (word?: VocabItem): Tile[] => {
    if (!word) return [];
    const tokens = tokenizeKhasiWord(word.word);
    return tokens.map((char, index) => ({
      id: `${char}-${index}-${Date.now()}-${Math.random()}`,
      char,
    })).sort(() => Math.random() - 0.5);
  };

  const [bankTiles, setBankTiles] = useState<Tile[]>(() => {
    const firstWord = categories
      .flatMap((c) => c.items)
      .find((w) => !w.word.includes(' ') && !w.word.includes('/'));
    return initTiles(firstWord);
  });
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [totalStars, setTotalStars] = useState<number>(() => getTotalStars());

  const currentWord = spellingPool[wordIndex] || spellingPool[0];

  const targetTokens = useMemo(() => {
    if (!currentWord) return [];
    return tokenizeKhasiWord(currentWord.word);
  }, [currentWord]);

  useEffect(() => {
    const handleUpdate = () => setTotalStars(getTotalStars());
    window.addEventListener('khasi-progress-updated', handleUpdate);
    return () => window.removeEventListener('khasi-progress-updated', handleUpdate);
  }, []);

  // Handle tile tap from bank to placed
  const handlePickBankTile = (tile: Tile) => {
    if (isSuccess) return;
    if (placedTiles.length >= targetTokens.length) return;

    setBankTiles((prev) => prev.filter((t) => t.id !== tile.id));
    const nextPlaced = [...placedTiles, tile];
    setPlacedTiles(nextPlaced);

    // Check if word completed
    if (nextPlaced.length === targetTokens.length) {
      const spelled = nextPlaced.map((t) => t.char).join('');
      const target = targetTokens.join('');
      if (spelled === target) {
        setIsSuccess(true);
        addStars(1);
      }
    }
  };

  // Handle tile tap to remove from placed back to bank
  const handleRemovePlacedTile = (index: number) => {
    if (isSuccess) return;
    const tile = placedTiles[index];
    if (!tile) return;

    setPlacedTiles((prev) => prev.filter((_, i) => i !== index));
    setBankTiles((prev) => [...prev, tile]);
  };

  // Hint button: places the next correct tile
  const handleHint = () => {
    if (isSuccess || placedTiles.length >= targetTokens.length) return;

    const neededIndex = placedTiles.length;
    const neededChar = targetTokens[neededIndex];

    const matchFromBank = bankTiles.find((t) => t.char === neededChar);
    if (matchFromBank) {
      handlePickBankTile(matchFromBank);
    } else {
      // If user had placed wrong tiles before, reset and place correct
      setBankTiles((prev) => [...prev, ...placedTiles]);
      setPlacedTiles([]);
    }
  };

  const handleNextWord = () => {
    const nextIdx = wordIndex + 1 < spellingPool.length ? wordIndex + 1 : 0;
    setWordIndex(nextIdx);
    setBankTiles(initTiles(spellingPool[nextIdx]));
    setPlacedTiles([]);
    setIsSuccess(false);
  };

  const handleResetCurrent = () => {
    if (!currentWord) return;
    setBankTiles(initTiles(currentWord));
    setPlacedTiles([]);
    setIsSuccess(false);
  };

  if (!currentWord) {
    return <div>No words available for spelling.</div>;
  }

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header with Star Counter */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333]">
        <div className="space-y-0.5">
          <span className="text-xs font-mono uppercase text-[#DAA520] font-semibold">
            Spelling Activity #{wordIndex + 1}
          </span>
          <h3 className="font-serif text-lg font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
            Thoh ïa ka Kyntien
          </h3>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#8B6508] dark:text-[#DAA520] font-mono text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-[#DAA520] text-[#DAA520]" />
          <span>{totalStars} Stars</span>
        </div>
      </div>

      {/* Target Clue Card */}
      <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520]/60 p-6 sm:p-8 text-center space-y-3 shadow-silk">
        <span className="text-xs font-mono uppercase text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 tracking-wider">
          English Clue
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#B22222] dark:text-[#E97451]">
          {currentWord.englishMeaning}
        </h2>
        <p className="text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
          Arrange the {targetTokens.length} letter tiles to spell the Khasi word
        </p>
      </div>

      {/* Answer Slots */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-2.5 flex-wrap min-h-[72px] p-4 rounded-2xl bg-white/60 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333]">
          {targetTokens.map((_, idx) => {
            const tile = placedTiles[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleRemovePlacedTile(idx)}
                className={`min-w-[54px] min-h-[58px] rounded-2xl border-2 font-serif font-bold text-2xl flex items-center justify-center transition-all ${
                  tile
                    ? isSuccess
                      ? 'bg-emerald-600 text-white border-emerald-600 scale-105'
                      : 'bg-[#B22222] text-[#FAF9F6] border-[#B22222] shadow-sm'
                    : 'bg-transparent border-dashed border-[#DAA520] text-transparent'
                }`}
                aria-label={tile ? `Remove tile ${tile.char}` : 'Empty slot'}
              >
                {tile ? tile.char : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Banner */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 flex items-center justify-between gap-3 text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Bha Bha! (Correct!)</p>
              <p className="text-xs font-mono">You earned +1 Star ⭐</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNextWord}
            className="min-h-[44px] px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
          >
            <span>Next Word (Nangto)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scrambled Letter Bank */}
      {!isSuccess && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70 px-1">
            <span>Tap a tile to place it:</span>
            <span className="text-[#DAA520]">Note: &ldquo;ng&rdquo; counts as 1 tile</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 flex-wrap min-h-[64px] p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333]">
            {bankTiles.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => handlePickBankTile(tile)}
                className="min-w-[52px] min-h-[56px] px-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#242424] border-2 border-[#DAA520] hover:border-[#B22222] text-[#1A1A1A] dark:text-[#FAF9F6] font-serif font-bold text-2xl flex items-center justify-center shadow-xs active:scale-95 transition-all"
              >
                {tile.char}
              </button>
            ))}
          </div>

          {/* Action Tools: Hint & Reset */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleHint}
              className="min-h-[44px] px-3.5 rounded-xl border border-[#DAA520] text-xs font-semibold text-[#B8860B] dark:text-[#DAA520] flex items-center gap-1.5 hover:bg-[#DAA520]/10"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>

            <button
              type="button"
              onClick={handleResetCurrent}
              className="min-h-[44px] px-3.5 rounded-xl border border-[#E8E2D5] dark:border-[#333333] text-xs font-semibold text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70 flex items-center gap-1.5 hover:bg-[#DAA520]/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Tiles</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpellingView;
