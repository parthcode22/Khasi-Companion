import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Sparkles,
  Gamepad2,
  Trophy,
  Star,
  ShieldCheck,
  HeartHandshake,
  BookMarked,
  Layers,
} from 'lucide-react';
import type { AlphabetItem, VocabCategory } from '../types/learn';

import alphabetJson from '../data/learn/alphabet.json';
import vocabJson from '../data/learn/vocabulary.json';

import AlphabetGrid from '../components/learn/AlphabetGrid';
import FlashcardsView from '../components/learn/FlashcardsView';
import GamesView from '../components/learn/GamesView';
import SpellingView from '../components/learn/SpellingView';
import StoriesComingSoon from '../components/learn/StoriesComingSoon';
import ProgressView from '../components/learn/ProgressView';
import { getTotalStars } from '../utils/learnProgress';

type LearnTab = 'alphabet' | 'flashcards' | 'games' | 'spelling' | 'stories' | 'progress';

export const LearnKhasi: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [totalStars, setTotalStars] = useState<number>(() => getTotalStars());

  const alphabetItems = alphabetJson as AlphabetItem[];
  const vocabCategories = vocabJson as VocabCategory[];

  useEffect(() => {
    const handleUpdate = () => setTotalStars(getTotalStars());
    window.addEventListener('khasi-progress-updated', handleUpdate);
    return () => window.removeEventListener('khasi-progress-updated', handleUpdate);
  }, []);

  // Determine active tab from pathname (/learn/flashcards -> flashcards)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const subRoute = pathParts[1] as LearnTab | undefined;

  const validTabs: LearnTab[] = ['alphabet', 'flashcards', 'games', 'spelling', 'stories', 'progress'];
  const activeTab: LearnTab = subRoute && validTabs.includes(subRoute) ? subRoute : 'alphabet';

  const handleTabChange = (tab: LearnTab) => {
    navigate(`/learn/${tab}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Header Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#FAF9F6] via-[#FAF9F6] to-[#E8E2D5] dark:from-[#1A1A1A] dark:via-[#1A1A1A] dark:to-[#242424] border-2 border-[#DAA520]/40 p-6 sm:p-10 shadow-silk overflow-hidden">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-64 h-64 rounded-full bg-[#DAA520]/10 pointer-events-none blur-2xl" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#B22222] text-[#FAF9F6] uppercase tracking-wider shadow-xs">
              Khasi Khynnah
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#DAA520]/20 text-[#1A1A1A] dark:text-[#FAF9F6] border border-[#DAA520]/40 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Child-Safe • No Trackers • Ad-Free
            </span>

            {/* Total Stars Counter Pill */}
            <div className="px-3 py-1 rounded-full bg-[#DAA520]/25 text-[#8B6508] dark:text-[#DAA520] border border-[#DAA520]/50 font-mono text-xs font-bold flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 fill-[#DAA520] text-[#DAA520]" />
              <span>{totalStars} Stars</span>
            </div>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1A1A1A] dark:text-[#FAF9F6] tracking-tight">
            Hikai Khasi
          </h1>
          <p className="text-base sm:text-lg text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80 font-sans leading-relaxed">
            An interactive learning hub for local Khasi children to practice the 23-letter alphabet, master everyday words with flashcards, solve word quizzes, and assemble spelling tiles.
          </p>
        </div>
      </section>

      {/* Navigation Sub-Tabs (Large Touch Targets for Children) */}
      <nav aria-label="Learn Navigation" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <button
          type="button"
          onClick={() => handleTabChange('alphabet')}
          className={`min-h-[60px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-sans font-bold text-xs transition-all active:scale-95 shadow-xs ${
            activeTab === 'alphabet'
              ? 'bg-[#B22222] text-[#FAF9F6] ring-2 ring-[#DAA520] shadow-ceremonial'
              : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10 hover:border-[#DAA520]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Dak Thoh</span>
          </div>
          <span className={`text-[10px] font-normal ${activeTab === 'alphabet' ? 'text-white/80' : 'text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60'}`}>
            Alphabet (23)
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('flashcards')}
          className={`min-h-[60px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-sans font-bold text-xs transition-all active:scale-95 shadow-xs ${
            activeTab === 'flashcards'
              ? 'bg-[#B22222] text-[#FAF9F6] ring-2 ring-[#DAA520] shadow-ceremonial'
              : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10 hover:border-[#DAA520]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Flashcards</span>
          </div>
          <span className={`text-[10px] font-normal ${activeTab === 'flashcards' ? 'text-white/80' : 'text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60'}`}>
            Flip &amp; Learn
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('games')}
          className={`min-h-[60px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-sans font-bold text-xs transition-all active:scale-95 shadow-xs ${
            activeTab === 'games'
              ? 'bg-[#B22222] text-[#FAF9F6] ring-2 ring-[#DAA520] shadow-ceremonial'
              : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10 hover:border-[#DAA520]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Gamepad2 className="w-4 h-4" />
            <span>Games</span>
          </div>
          <span className={`text-[10px] font-normal ${activeTab === 'games' ? 'text-white/80' : 'text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60'}`}>
            Quizzes &amp; Match
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('spelling')}
          className={`min-h-[60px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-sans font-bold text-xs transition-all active:scale-95 shadow-xs ${
            activeTab === 'spelling'
              ? 'bg-[#B22222] text-[#FAF9F6] ring-2 ring-[#DAA520] shadow-ceremonial'
              : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10 hover:border-[#DAA520]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Spelling</span>
          </div>
          <span className={`text-[10px] font-normal ${activeTab === 'spelling' ? 'text-white/80' : 'text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60'}`}>
            Tile Assembly
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('stories')}
          className={`min-h-[60px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-sans font-bold text-xs transition-all active:scale-95 shadow-xs ${
            activeTab === 'stories'
              ? 'bg-[#B22222] text-[#FAF9F6] ring-2 ring-[#DAA520] shadow-ceremonial'
              : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10 hover:border-[#DAA520]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <BookMarked className="w-4 h-4" />
            <span>Puriskam</span>
          </div>
          <span className={`text-[10px] font-normal ${activeTab === 'stories' ? 'text-white/80' : 'text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60'}`}>
            Stories &amp; Rhymes
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('progress')}
          className={`min-h-[60px] p-3 rounded-2xl flex flex-col items-center justify-center gap-1 font-sans font-bold text-xs transition-all active:scale-95 shadow-xs ${
            activeTab === 'progress'
              ? 'bg-[#B22222] text-[#FAF9F6] ring-2 ring-[#DAA520] shadow-ceremonial'
              : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10 hover:border-[#DAA520]'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4" />
            <span>Progress</span>
          </div>
          <span className={`text-[10px] font-normal ${activeTab === 'progress' ? 'text-white/80' : 'text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60'}`}>
            Badges &amp; Stars
          </span>
        </button>
      </nav>

      {/* Dynamic Tab View Content */}
      <section className="pt-2">
        {activeTab === 'alphabet' && <AlphabetGrid items={alphabetItems} />}
        {activeTab === 'flashcards' && <FlashcardsView categories={vocabCategories} />}
        {activeTab === 'games' && <GamesView categories={vocabCategories} />}
        {activeTab === 'spelling' && <SpellingView categories={vocabCategories} />}
        {activeTab === 'stories' && <StoriesComingSoon />}
        {activeTab === 'progress' && (
          <ProgressView alphabetItems={alphabetItems} vocabCategories={vocabCategories} />
        )}
      </section>

      {/* Cultural Preservation Card Footer */}
      <footer className="mt-12 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-5 h-5 text-[#B22222] shrink-0" />
          <span>
            Dedicated to local Khasi children, language revitalization, and school classrooms across Meghalaya.
          </span>
        </div>
        <div className="font-mono text-[11px] text-[#DAA520] font-semibold">
          Ka Jingshai Jong Ka Ri
        </div>
      </footer>
    </div>
  );
};

export default LearnKhasi;
