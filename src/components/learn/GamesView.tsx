import React, { useState, useEffect, useMemo } from 'react';
import {
  Gamepad2,
  Trophy,
  Star,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import type { VocabCategory } from '../../types/learn';
import { addStars, recordGamePlayed, getTotalStars } from '../../utils/learnProgress';

interface GamesViewProps {
  categories: VocabCategory[];
}

type GameMode = 'meaning' | 'reverse' | 'memory' | 'numbers';

interface Question {
  prompt: string;
  subPrompt: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
}

interface MemoryCard {
  id: string;
  text: string;
  matchId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

function buildQuestions(
  gameMode: GameMode,
  words: { id: string; word: string; englishMeaning: string }[],
  numberCat?: VocabCategory
): Question[] {
  if (words.length === 0) return [];
  const list: Question[] = [];
  const pool = gameMode === 'numbers' && numberCat ? numberCat.items : words;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const roundCount = Math.min(5, shuffled.length);

  for (let i = 0; i < roundCount; i++) {
    const target = shuffled[i];
    const otherWords = pool.filter((w) => w.id !== target.id);
    const wrongSlice = [...otherWords].sort(() => Math.random() - 0.5).slice(0, 3);

    if (gameMode === 'meaning') {
      const prompt = target.word;
      const subPrompt = 'Choose the English meaning of this Khasi word:';
      const correctAnswer = target.englishMeaning;
      const explanation = `"${target.word}" means "${target.englishMeaning}"`;
      const options = [correctAnswer, ...wrongSlice.map((w) => w.englishMeaning)].sort(
        () => Math.random() - 0.5
      );
      list.push({ prompt, subPrompt, correctAnswer, options, explanation });
    } else if (gameMode === 'reverse') {
      const prompt = target.englishMeaning;
      const subPrompt = 'Choose the correct Khasi word for:';
      const correctAnswer = target.word;
      const explanation = `"${target.englishMeaning}" in Khasi is "${target.word}"`;
      const options = [correctAnswer, ...wrongSlice.map((w) => w.word)].sort(
        () => Math.random() - 0.5
      );
      list.push({ prompt, subPrompt, correctAnswer, options, explanation });
    } else if (gameMode === 'numbers') {
      const prompt = target.englishMeaning;
      const subPrompt = 'How do you say this number in Khasi?';
      const correctAnswer = target.word;
      const explanation = `Number ${target.englishMeaning} is "${target.word}"`;
      const options = [correctAnswer, ...wrongSlice.map((w) => w.word)].sort(
        () => Math.random() - 0.5
      );
      list.push({ prompt, subPrompt, correctAnswer, options, explanation });
    }
  }
  return list;
}

export const GamesView: React.FC<GamesViewProps> = ({ categories }) => {
  const allWords = useMemo(() => {
    return categories.flatMap((cat) => cat.items);
  }, [categories]);

  const numberCategory = useMemo(() => {
    return categories.find((c) => c.id === 'cat-numbers');
  }, [categories]);

  const [mode, setMode] = useState<GameMode>('meaning');
  const [questions, setQuestions] = useState<Question[]>(() =>
    buildQuestions('meaning', categories.flatMap((c) => c.items), categories.find((c) => c.id === 'cat-numbers'))
  );
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [starsThisRound, setStarsThisRound] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [totalStars, setTotalStars] = useState<number>(() => getTotalStars());

  // Memory match state
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMatchesFound, setMemoryMatchesFound] = useState<number>(0);

  useEffect(() => {
    const handleUpdate = () => setTotalStars(getTotalStars());
    window.addEventListener('khasi-progress-updated', handleUpdate);
    return () => window.removeEventListener('khasi-progress-updated', handleUpdate);
  }, []);

  // Setup memory game cards
  const setupMemoryCards = () => {
    if (allWords.length < 4) return;
    const chosen = [...allWords].sort(() => Math.random() - 0.5).slice(0, 4);
    const cards: MemoryCard[] = [];

    chosen.forEach((w) => {
      // Khasi card
      cards.push({
        id: `khasi-${w.id}`,
        text: w.word,
        matchId: w.id,
        isFlipped: false,
        isMatched: false,
      });
      // English card
      cards.push({
        id: `eng-${w.id}`,
        text: w.englishMeaning,
        matchId: w.id,
        isFlipped: false,
        isMatched: false,
      });
    });

    setMemoryCards(cards.sort(() => Math.random() - 0.5));
    setFlippedIndices([]);
    setMemoryMatchesFound(0);
  };

  const startNewGame = (newMode?: GameMode) => {
    const selectedMode = newMode || mode;
    setCurrentRoundIndex(0);
    setScore(0);
    setStarsThisRound(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setFeedback(null);

    if (selectedMode === 'memory') {
      setupMemoryCards();
    } else {
      setQuestions(buildQuestions(selectedMode, allWords, numberCategory));
    }
  };

  const handleSelectMode = (newMode: GameMode) => {
    setMode(newMode);
    startNewGame(newMode);
  };

  // Handle standard quiz answer selection
  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    const currentQ = questions[currentRoundIndex];
    if (!currentQ) return;

    setSelectedOption(option);
    setIsAnswered(true);

    if (option === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
      setStarsThisRound((prev) => prev + 1);
      addStars(1);
      setFeedback({
        isCorrect: true,
        text: 'Bha bha! (Excellent!) Correct answer +1 ⭐',
      });
    } else {
      setFeedback({
        isCorrect: false,
        text: `Pyrshang biang! (Try again!) Correct: ${currentQ.correctAnswer}`,
      });
    }
  };

  const handleNextQuestion = () => {
    if (currentRoundIndex + 1 < questions.length) {
      setCurrentRoundIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
    } else {
      recordGamePlayed();
      setIsGameOver(true);
    }
  };

  // Handle memory card flip
  const handleFlipMemoryCard = (index: number) => {
    if (flippedIndices.length === 2) return;
    const card = memoryCards[index];
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...flippedIndices, index];
    const updatedCards = memoryCards.map((c, i) => (i === index ? { ...c, isFlipped: true } : c));
    setMemoryCards(updatedCards);
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const first = updatedCards[newFlipped[0]];
      const second = updatedCards[newFlipped[1]];

      if (first.matchId === second.matchId) {
        // Match!
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c) =>
              c.matchId === first.matchId ? { ...c, isMatched: true, isFlipped: true } : c
            )
          );
          setFlippedIndices([]);
          setMemoryMatchesFound((m) => {
            const nextCount = m + 1;
            addStars(1);
            setStarsThisRound((s) => s + 1);
            if (nextCount === 4) {
              recordGamePlayed();
              setIsGameOver(true);
            }
            return nextCount;
          });
        }, 600);
      } else {
        // No match -> flip back
        setTimeout(() => {
          setMemoryCards((prev) =>
            prev.map((c, idx) =>
              newFlipped.includes(idx) ? { ...c, isFlipped: false } : c
            )
          );
          setFlippedIndices([]);
        }, 1100);
      }
    }
  };

  const currentQ = questions[currentRoundIndex];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Game Mode Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'meaning', label: 'Picture / Meaning Quiz' },
          { id: 'reverse', label: 'Reverse Quiz' },
          { id: 'memory', label: 'Memory Match' },
          { id: 'numbers', label: 'Number Quiz' },
        ].map((tab) => {
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectMode(tab.id as GameMode)}
              className={`min-h-[48px] px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-[#B22222] text-[#FAF9F6] shadow-ceremonial ring-2 ring-[#DAA520]'
                  : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-[#DAA520]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Header Bar with Total Stars & Encouragement */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#DAA520]" />
          <span className="text-xs font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
            Khasi Word Games
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DAA520]/20 border border-[#DAA520]/40 text-[#8B6508] dark:text-[#DAA520] font-mono text-xs font-bold">
          <Star className="w-3.5 h-3.5 fill-[#DAA520] text-[#DAA520]" />
          <span>{totalStars} Stars</span>
        </div>
      </div>

      {/* Results Screen when game is over */}
      {isGameOver ? (
        <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520] p-8 text-center space-y-6 shadow-silk">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-[#DAA520]/20 to-[#E97451]/20 flex items-center justify-center text-[#B22222]">
            <Trophy className="w-10 h-10 text-[#DAA520]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-serif text-3xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
              Bha Bha! Khublei Shibun!
            </h3>
            <p className="text-sm text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
              You completed this learning round!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333]">
              <span className="text-[11px] font-mono text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                Correct Answers
              </span>
              <p className="font-serif text-2xl font-bold text-[#B22222]">
                {mode === 'memory' ? '4 / 4 Pairs' : `${score} / ${questions.length}`}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333]">
              <span className="text-[11px] font-mono text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                Stars Earned
              </span>
              <p className="font-serif text-2xl font-bold text-[#DAA520] flex items-center justify-center gap-1">
                <span>+{starsThisRound}</span>
                <Star className="w-5 h-5 fill-[#DAA520] text-[#DAA520]" />
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => startNewGame()}
            className="min-h-[52px] px-8 rounded-2xl bg-[#B22222] hover:bg-[#8B0000] active:scale-95 text-[#FAF9F6] font-bold text-sm shadow-ceremonial inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again (Pyrshang Biang)</span>
          </button>
        </div>
      ) : mode === 'memory' ? (
        /* Memory Match Game View */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70 px-1">
            <span>Match 4 Pairs (Khasi ↔ English)</span>
            <span className="font-bold text-[#DAA520]">{memoryMatchesFound} / 4 Matched</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {memoryCards.map((card, idx) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleFlipMemoryCard(idx)}
                className={`min-h-[90px] sm:min-h-[100px] p-3 rounded-2xl border-2 font-serif font-bold text-base transition-all duration-300 flex items-center justify-center text-center shadow-xs ${
                  card.isMatched
                    ? 'bg-emerald-600 text-white border-emerald-600 scale-95 opacity-90'
                    : card.isFlipped
                    ? 'bg-[#FAF9F6] dark:bg-[#242424] text-[#B22222] border-[#DAA520] shadow-md scale-105'
                    : 'bg-[#FAF9F6] dark:bg-[#1A1A1A] border-[#E8E2D5] dark:border-[#333333] text-transparent hover:border-[#DAA520]'
                }`}
                aria-label={`Memory card ${idx + 1}`}
              >
                {card.isFlipped || card.isMatched ? (
                  <span>{card.text}</span>
                ) : (
                  <span className="text-xl text-[#DAA520]/60">?</span>
                )}
              </button>
            ))}
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
              Tap two cards to find matching Khasi words and English meanings!
            </p>
          </div>
        </div>
      ) : (
        /* Standard Quiz Modes (Meaning, Reverse, Numbers) */
        currentQ && (
          <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520]/60 p-6 sm:p-8 shadow-silk space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
              <span>
                Question {currentRoundIndex + 1} of {questions.length}
              </span>
              <span className="font-bold text-[#B22222]">Score: {score}</span>
            </div>

            <div className="text-center py-2 space-y-2">
              <span className="text-xs font-mono uppercase text-[#DAA520] font-semibold">
                {currentQ.subPrompt}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-[#B22222] dark:text-[#E97451]">
                {currentQ.prompt}
              </h2>
            </div>

            {/* 4 Large Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentQ.correctAnswer;

                let btnStyle =
                  'bg-[#FAF9F6] dark:bg-[#242424] border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:border-[#DAA520] hover:bg-[#DAA520]/10';

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-md';
                  } else if (isSelected) {
                    btnStyle = 'bg-red-600 text-white border-red-600';
                  } else {
                    btnStyle = 'opacity-40 border-[#E8E2D5] dark:border-[#333333]';
                  }
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={isAnswered}
                    onClick={() => handleAnswer(opt)}
                    className={`min-h-[58px] p-4 rounded-2xl border-2 font-sans font-semibold text-sm flex items-center justify-between text-left transition-all active:scale-95 ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-white" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Feedback & Next Button */}
            {feedback && (
              <div
                className={`p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-semibold ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700'
                }`}
              >
                <span>{feedback.text}</span>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="min-h-[44px] px-4 rounded-xl bg-[#B22222] hover:bg-[#8B0000] active:scale-95 text-[#FAF9F6] font-bold text-xs flex items-center justify-center gap-1.5 shadow-ceremonial self-end sm:self-auto"
                >
                  <span>
                    {currentRoundIndex + 1 < questions.length ? 'Next Question' : 'View Results'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default GamesView;
