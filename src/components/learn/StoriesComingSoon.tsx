import React from 'react';
import { BookMarked, Music, HeartHandshake } from 'lucide-react';

export const StoriesComingSoon: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520]/60 p-8 sm:p-12 text-center space-y-6 shadow-silk">
        {/* Cultural Icon Emblem */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-[#DAA520]/15 flex items-center justify-center text-[#B8860B] dark:text-[#DAA520]">
            <BookMarked className="w-8 h-8" />
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#B22222]/15 flex items-center justify-center text-[#B22222]">
            <Music className="w-8 h-8" />
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#B22222] font-bold">
            Puriskam &amp; Jingrwai Khynnah
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
            Stories &amp; Rhymes Coming Soon
          </h2>
          <p className="text-base text-[#1A1A1A]/75 dark:text-[#FAF9F6]/75 max-w-lg mx-auto leading-relaxed">
            Stories and rhymes will be added together with local Khasi teachers and community elders to ensure authentic storytelling, correct dialect phrasing, and cultural respect.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] max-w-md mx-auto flex items-center gap-3 text-xs text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70 text-left">
          <HeartHandshake className="w-6 h-6 text-[#DAA520] shrink-0" />
          <span>
            Strict Fact Preservation: We never generate or invent indigenous folklore or song lyrics with artificial intelligence.
          </span>
        </div>
      </div>
    </div>
  );
};

export default StoriesComingSoon;
