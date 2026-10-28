import React, { useState } from 'react';
import { PawPrint, Palette, Binary, Users, Trees, Sparkles, Tag } from 'lucide-react';
import type { VocabCategory } from '../../types/learn';
import ReviewStatusBadge from './ReviewStatusBadge';

interface VocabExplorerProps {
  categories: VocabCategory[];
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  PawPrint,
  Palette,
  Binary,
  Users,
  Trees,
};

export const VocabExplorer: React.FC<VocabExplorerProps> = ({ categories }) => {
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id || '');

  const activeCategory = categories.find((c) => c.id === selectedCatId) || categories[0];

  return (
    <div className="space-y-6">
      {/* Category Pills / Large Mobile-First Touch Targets */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const Icon = CATEGORY_ICONS[cat.iconName] || Tag;
          const isActive = cat.id === activeCategory?.id;
          const isColors = cat.id === 'cat-colors';

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCatId(cat.id)}
              className={`min-h-[50px] px-4 py-2.5 rounded-2xl flex items-center gap-2.5 whitespace-nowrap text-sm font-semibold transition-all active:scale-95 shrink-0 ${
                isActive
                  ? 'bg-[#B22222] text-[#FAF9F6] shadow-ceremonial ring-2 ring-[#DAA520]'
                  : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10 hover:border-[#DAA520]'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF9F6]' : 'text-[#DAA520]'}`} />
              <span>{cat.categoryEnglish}</span>
              {isColors ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#E97451]/20 text-[#C85A38] dark:text-[#F39C7F]">
                  Soon
                </span>
              ) : (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#E8E2D5] dark:bg-[#333333] text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70'
                  }`}
                >
                  {cat.items.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category Header */}
      {activeCategory && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333]">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-[#DAA520] font-semibold">
              Ka Kyrdan (Category)
            </span>
            <h3 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
              {activeCategory.categoryEnglish}
            </h3>
            {activeCategory.categoryKhasi && (
              <p className="text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 mt-0.5">
                {activeCategory.categoryKhasi}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
            <Sparkles className="w-4 h-4 text-[#DAA520]" />
            <span>{activeCategory.items.length} words in this topic</span>
          </div>
        </div>
      )}

      {/* Empty State for Colors Topic */}
      {activeCategory?.items.length === 0 ? (
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
        /* Words Grid (Large Card Layout) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategory?.items.map((word) => (
            <div
              key={word.id}
              className="rounded-2xl bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] p-5 shadow-silk hover:border-[#DAA520] transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono uppercase text-[#DAA520] font-semibold">
                    {word.id}
                  </span>
                  <ReviewStatusBadge status={word.reviewStatus} size="sm" />
                </div>

                {/* Khasi Word */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#1A1A1A]/50 dark:text-[#FAF9F6]/50">
                    Kyntien Khasi
                  </span>
                  <h4 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6] group-hover:text-[#B22222] transition-colors leading-snug">
                    {word.word || word.wordPlaceholder}
                  </h4>
                </div>

                {/* Pronunciation / Phonetic Hint - ONLY if present */}
                {word.phonetic && word.phonetic.trim() !== '' && (
                  <div className="p-2 rounded-xl bg-white/70 dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] text-xs font-mono text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80">
                    <span className="text-[#DAA520] font-bold mr-1">Rwai:</span>
                    {word.phonetic}
                  </div>
                )}

                {/* English Meaning */}
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#1A1A1A]/50 dark:text-[#FAF9F6]/50">
                    English Meaning
                  </span>
                  <p className="text-sm font-medium text-[#1A1A1A]/90 dark:text-[#FAF9F6]/90">
                    {word.englishMeaning || word.englishMeaningPlaceholder}
                  </p>
                </div>
              </div>

              {/* Teacher Notes Footer - ONLY if present and not empty */}
              {word.teacherNotes && word.teacherNotes.trim() !== '' && (
                <div className="pt-3 border-t border-[#E8E2D5] dark:border-[#333333] text-[11px] text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 italic">
                  Note: {word.teacherNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VocabExplorer;
