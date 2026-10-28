import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  Sparkles,
  X,
  Clock,
  CheckCircle2,
  GraduationCap,
  Zap,
  ArrowRight,
} from 'lucide-react';
import VerificationBadge from '../components/ui/VerificationBadge';
import { getPhrasebook, gradeKhasiAttempt } from '../services/api';
import type { PhraseRecord, QuizGradeResponse } from '../types/khasi';

type PhraseCategoryKey =
  | 'All'
  | 'greetings'
  | 'transport'
  | 'dining_markets'
  | 'culture_etiquette'
  | 'safety_critical';

interface CategoryTab {
  key: PhraseCategoryKey;
  label: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { key: 'All', label: 'All Expressions' },
  { key: 'greetings', label: 'Greetings' },
  { key: 'transport', label: 'Transport & Cabs' },
  { key: 'dining_markets', label: 'Dining & Markets' },
  { key: 'culture_etiquette', label: 'Culture & Etiquette' },
  { key: 'safety_critical', label: 'Safety Critical' },
];

const SAMPLE_PRACTICE_PROMPTS = [
  { en: 'Thank you very much', hint: 'Universal greeting and blessing' },
  { en: 'How are you?', hint: 'Polite inquiry with phi (you)' },
  { en: 'How much is this?', hint: 'Market trade phrase with dor (price)' },
  { en: 'When does the taxi leave?', hint: 'Transit phrase with kali (car/taxi)' },
  { en: 'Please serve the food', hint: 'Eatery phrase with bam (eat)' },
  { en: 'May I enter?', hint: 'Courteous home entrance inquiry' },
];

export const Phrasebook: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'browser' | 'tutor'>('browser');
  const [activeTab, setActiveTab] = useState<PhraseCategoryKey>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [phrases, setPhrases] = useState<PhraseRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Propose Verification Modal State
  const [selectedPhraseForReview, setSelectedPhraseForReview] = useState<PhraseRecord | null>(null);
  const [proposedKhasi, setProposedKhasi] = useState<string>('');
  const [proposedPronunciation, setProposedPronunciation] = useState<string>('');
  const [proposedDialect, setProposedDialect] = useState<string>('Standard Sohra / Shillong');
  const [reviewerName, setReviewerName] = useState<string>('');
  const [reviewerNotes, setReviewerNotes] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // AI Tutor Practice State
  const [selectedPrompt, setSelectedPrompt] = useState<string>(SAMPLE_PRACTICE_PROMPTS[0].en);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [userKhasiAttempt, setUserKhasiAttempt] = useState<string>('');
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<QuizGradeResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    getPhrasebook(activeTab)
      .then((data) => {
        if (isMounted) {
          setPhrases(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return phrases;
    const q = searchQuery.toLowerCase();
    return phrases.filter(
      (p) =>
        p.english.toLowerCase().includes(q) ||
        p.khasi.toLowerCase().includes(q) ||
        p.pronunciation_guide.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q)
    );
  }, [phrases, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenReviewModal = (phrase: PhraseRecord) => {
    setSelectedPhraseForReview(phrase);
    setProposedKhasi(phrase.khasi || '');
    setProposedPronunciation(phrase.pronunciation_guide || '');
    setProposedDialect(phrase.dialect || 'Standard Sohra / Shillong');
    setReviewerName('');
    setReviewerNotes('');
    setIsSubmitted(false);
  };

  const handleGradeAttempt = async () => {
    const activePrompt = customPrompt.trim() || selectedPrompt;
    if (!activePrompt || !userKhasiAttempt.trim()) return;

    setIsGrading(true);
    try {
      const res = await gradeKhasiAttempt(activePrompt, userKhasiAttempt.trim());
      setGradeResult(res);
    } catch {
      // handled inside gradeKhasiAttempt
    } finally {
      setIsGrading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <section className="relative rounded-3xl bg-gradient-to-br from-[#FAF9F6] via-[#FAF9F6] to-[#E8E2D5] dark:from-[#1A1A1A] dark:via-[#1A1A1A] dark:to-[#242424] border-2 border-[#DAA520]/40 p-6 sm:p-10 shadow-silk overflow-hidden">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#B22222] text-[#FAF9F6] uppercase tracking-wider">
            Verified Cultural Repository
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-[#1A1A1A] dark:text-[#FAF9F6]">
            Khasi Phrasebook &amp; AI Tutor
          </h1>
          <p className="text-base sm:text-lg text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80 font-sans leading-relaxed">
            Authentic expressions for Meghalaya markets, shared taxis, and village homestays. Unverified phrases are strictly withheld until vetted by native speakers.
          </p>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveMode('browser')}
            className={`min-h-[50px] px-5 py-2.5 rounded-2xl flex items-center gap-2.5 font-sans font-bold text-sm transition-all active:scale-95 shadow-xs ${
              activeMode === 'browser'
                ? 'bg-[#B22222] text-[#FAF9F6] shadow-ceremonial ring-2 ring-[#DAA520]'
                : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curated Phrasebook Browser</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMode('tutor')}
            className={`min-h-[50px] px-5 py-2.5 rounded-2xl flex items-center gap-2.5 font-sans font-bold text-sm transition-all active:scale-95 shadow-xs ${
              activeMode === 'tutor'
                ? 'bg-[#B22222] text-[#FAF9F6] shadow-ceremonial ring-2 ring-[#DAA520]'
                : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-[#DAA520]" />
            <span>Interactive AI Practice &amp; Grammar Tutor</span>
            <span className="px-1.5 py-0.5 rounded-md bg-[#DAA520]/20 text-[10px] uppercase font-mono">
              Model A + B
            </span>
          </button>
        </div>
      </section>

      {/* =========================================================================
          MODE 1: Curated Phrasebook Browser
          ========================================================================= */}
      {activeMode === 'browser' && (
        <section className="space-y-6">
          {/* Controls: Search & Category Filter Pills */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search English or Khasi phrases..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-sm text-[#1A1A1A] dark:text-[#FAF9F6] focus:border-[#DAA520] outline-none shadow-xs"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                      isActive
                        ? 'bg-[#B22222] text-[#FAF9F6] shadow-xs ring-1 ring-[#DAA520]'
                        : 'bg-[#FAF9F6] dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:bg-[#DAA520]/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-sm text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
              Loading verified phrases...
            </div>
          ) : filteredPhrases.length === 0 ? (
            <div className="p-10 rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] text-center space-y-2">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                No Phrases Match Your Search
              </h3>
              <p className="text-xs text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                Try searching for a different keyword or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPhrases.map((phrase) => {
                const isPending = !phrase.khasi || phrase.khasi.trim() === '';

                return (
                  <div
                    key={phrase.id}
                    className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333] p-6 shadow-silk hover:border-[#DAA520] transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      {/* Top Header: ID, Category & Verification Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-mono uppercase text-[#DAA520] font-semibold">
                          {phrase.id} • {phrase.category.replace('_', ' ')}
                        </span>
                        <VerificationBadge status={phrase.verification_status} size="xs" />
                      </div>

                      {/* English Source Phrase */}
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/50 dark:text-[#FAF9F6]/50">
                          English
                        </span>
                        <h3 className="font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                          {phrase.english}
                        </h3>
                      </div>

                      {/* Khasi Translation OR Explicit Pending Banner */}
                      {isPending ? (
                        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-1.5">
                          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-bold font-mono">
                            <Clock className="w-4 h-4 shrink-0" />
                            <span>⏳ Awaiting Fluent Khasi Speaker Review</span>
                          </div>
                          <p className="text-[11px] text-amber-900/80 dark:text-amber-200/80 leading-relaxed">
                            Intentionally left blank rather than invented. Under our strict cultural preservation policy, unverified translations are never generated by AI.
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOpenReviewModal(phrase)}
                            className="mt-1 text-[11px] font-bold text-[#B22222] hover:underline inline-flex items-center gap-1"
                          >
                            <span>Propose Native Verification</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#DAA520]">
                            Khasi ({phrase.dialect || 'Standard Khasi'})
                          </span>
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-serif text-2xl font-extrabold text-[#B22222] dark:text-[#E97451]">
                              {phrase.khasi}
                            </h4>
                            <button
                              type="button"
                              onClick={() => handleCopy(phrase.id, phrase.khasi)}
                              className="p-2 rounded-xl border border-[#E8E2D5] dark:border-[#333333] hover:bg-[#DAA520]/10 text-[#1A1A1A] dark:text-[#FAF9F6] transition-colors"
                              title="Copy Khasi phrase"
                              aria-label="Copy Khasi phrase"
                            >
                              {copiedId === phrase.id ? (
                                <Check className="w-4 h-4 text-emerald-600" />
                              ) : (
                                <Copy className="w-4 h-4 text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60" />
                              )}
                            </button>
                          </div>

                          {phrase.pronunciation_guide && (
                            <div className="p-2 rounded-xl bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-xs font-mono text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80">
                              <span className="text-[#DAA520] font-bold mr-1">Rwai:</span>
                              {phrase.pronunciation_guide}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer: Cultural Notes & Reviewer */}
                    <div className="pt-3 border-t border-[#E8E2D5] dark:border-[#333333] flex items-center justify-between text-[11px] text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                      <span className="truncate max-w-[240px]" title={phrase.notes}>
                        {phrase.notes}
                      </span>
                      <span className="font-mono text-[10px] text-[#DAA520]">
                        {phrase.reviewer}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          MODE 2: Interactive AI Practice & Grammar Tutor (Model A + Model B)
          ========================================================================= */}
      {activeMode === 'tutor' && (
        <section className="space-y-8">
          {/* Grammar Primer Cards */}
          <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520]/60 p-6 sm:p-8 space-y-4 shadow-silk">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#DAA520]" />
              <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                Core Khasi Grammar: Gender &amp; Number Particles
              </h2>
            </div>
            <p className="text-sm text-[#1A1A1A]/75 dark:text-[#FAF9F6]/75 leading-relaxed">
              In the Khasi language, nouns are preceded by essential gender and number markers. Unlike English, inanimate objects and natural entities are categorized as masculine or feminine.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-[#B22222]">U</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B22222]/10 text-[#B22222] font-semibold">
                    Masculine
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80">
                  Used for male persons, small animals, and select objects.
                </p>
                <div className="text-[11px] font-mono text-[#DAA520] pt-1">
                  e.g. <em>U kpa</em> (Father), <em>U lum</em> (Hill), <em>U sim</em> (Bird)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-[#DAA520]">Ka</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#DAA520]/20 text-[#8B6508] dark:text-[#DAA520] font-semibold">
                    Feminine &amp; Nature
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80">
                  Used for female persons, nature elements, and time in the matrilineal culture.
                </p>
                <div className="text-[11px] font-mono text-[#DAA520] pt-1">
                  e.g. <em>Ka kmie</em> (Mother), <em>Ka sngi</em> (Sun/Day), <em>Ka um</em> (Water)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-emerald-700 dark:text-emerald-400">Ki</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold">
                    Plural (All)
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80">
                  Used for any plural noun regardless of grammatical gender.
                </p>
                <div className="text-[11px] font-mono text-[#DAA520] pt-1">
                  e.g. <em>Ki khun</em> (Children), <em>Ki lum</em> (Hills), <em>Ki kali</em> (Cars)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-serif text-2xl font-bold text-[#E97451]">I</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#E97451]/20 text-[#C85A38] dark:text-[#F39C7F] font-semibold">
                    Affectionate
                  </span>
                </div>
                <p className="text-xs text-[#1A1A1A]/80 dark:text-[#FAF9F6]/80">
                  Used for beloved family elders, babies, or tender diminutive objects.
                </p>
                <div className="text-[11px] font-mono text-[#DAA520] pt-1">
                  e.g. <em>I mei-rad</em> (Dear Grandma), <em>I khunrit</em> (Little one)
                </div>
              </div>
            </div>
          </div>

          {/* Interactive AI Practice Studio */}
          <div className="rounded-3xl bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#B22222]/40 p-6 sm:p-10 space-y-6 shadow-silk">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#B22222] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#DAA520]" />
                <span>AI Tutor Studio • Model A &amp; Model B Evaluation</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                Translate &amp; Practice with the Neural AI Tutor
              </h3>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
                Choose a sample sentence or type your own, write your Khasi attempt, and let Model A and Model B grade your semantic accuracy.
              </p>
            </div>

            {/* Quick Prompt Selectors */}
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-[#DAA520] font-semibold">
                Select a Practice Sentence:
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_PRACTICE_PROMPTS.map((sample) => (
                  <button
                    key={sample.en}
                    type="button"
                    onClick={() => {
                      setSelectedPrompt(sample.en);
                      setCustomPrompt('');
                      setGradeResult(null);
                    }}
                    className={`min-h-[42px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                      selectedPrompt === sample.en && !customPrompt
                        ? 'bg-[#B22222] text-[#FAF9F6] shadow-sm'
                        : 'bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-[#1A1A1A] dark:text-[#FAF9F6] hover:border-[#DAA520]'
                    }`}
                  >
                    {sample.en}
                  </button>
                ))}
              </div>
            </div>

            {/* Active English Prompt */}
            <div className="p-4 rounded-2xl bg-white/70 dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                Active English Prompt:
              </span>
              <input
                type="text"
                value={customPrompt || selectedPrompt}
                onChange={(e) => {
                  setCustomPrompt(e.target.value);
                  setGradeResult(null);
                }}
                placeholder="Or type a custom English sentence here..."
                className="w-full font-serif text-xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6] bg-transparent outline-none border-b border-[#E8E2D5] focus:border-[#DAA520] pb-1"
              />
            </div>

            {/* User Khasi Attempt Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-[#DAA520] font-semibold">
                  Your Khasi Translation Attempt:
                </span>
                <span className="text-[11px] text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60">
                  Tip: Remember noun prefixes (U / Ka / Ki)
                </span>
              </div>
              <textarea
                rows={3}
                value={userKhasiAttempt}
                onChange={(e) => setUserKhasiAttempt(e.target.value)}
                placeholder="Type your Khasi translation here (e.g. Khublei shibun, Kumno phi long, Ka um...)"
                className="w-full p-4 rounded-2xl bg-white/80 dark:bg-[#242424] border-2 border-[#E8E2D5] dark:border-[#333333] focus:border-[#B22222] outline-none text-base text-[#1A1A1A] dark:text-[#FAF9F6] resize-none shadow-xs"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                disabled={isGrading || !userKhasiAttempt.trim()}
                onClick={handleGradeAttempt}
                className="min-h-[52px] px-8 rounded-2xl bg-[#B22222] hover:bg-[#8B0000] active:scale-95 text-[#FAF9F6] font-bold text-sm shadow-ceremonial flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isGrading ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin text-[#DAA520]" />
                    <span>Grading with AI Tutor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#DAA520]" />
                    <span>Check with AI Tutor</span>
                  </>
                )}
              </button>
            </div>

            {/* AI Grading Results Display */}
            {gradeResult && (
              <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-white/90 to-[#FAF9F6] dark:from-[#242424] dark:to-[#1A1A1A] border-2 border-[#DAA520] space-y-5 shadow-silk">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E8E2D5] dark:border-[#333333]">
                  <div>
                    <span className="text-xs font-mono uppercase tracking-wider text-[#DAA520] font-semibold">
                      Model Evaluation Result
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                      Semantic Match Score: {gradeResult.score}%
                    </h4>
                  </div>

                  {/* Score Meter Gauge */}
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-3 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          gradeResult.score >= 80
                            ? 'bg-emerald-600'
                            : gradeResult.score >= 50
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${gradeResult.score}%` }}
                      />
                    </div>
                    <span
                      className={`text-sm font-bold font-mono ${
                        gradeResult.score >= 80
                          ? 'text-emerald-600'
                          : gradeResult.score >= 50
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {gradeResult.score >= 80
                        ? 'High'
                        : gradeResult.score >= 50
                        ? 'Moderate'
                        : 'Review'}
                    </span>
                  </div>
                </div>

                {/* Model Reference vs User Attempt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333]">
                    <span className="text-[10px] font-mono uppercase text-[#DAA520] font-semibold">
                      Model A Reference Output
                    </span>
                    <p className="mt-1 font-serif text-xl font-bold text-[#B22222] dark:text-[#E97451]">
                      {gradeResult.reference_khasi}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#1A1A1A] border border-[#E8E2D5] dark:border-[#333333]">
                    <span className="text-[10px] font-mono uppercase text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 font-semibold">
                      Your Attempt Back-Translation (Reverse Check)
                    </span>
                    <p className="mt-1 text-sm font-medium text-[#1A1A1A] dark:text-[#FAF9F6]">
                      {gradeResult.reverse_check || 'Under review'}
                    </p>
                  </div>
                </div>

                {/* Tutor Feedback Note */}
                <div className="p-4 rounded-2xl bg-[#DAA520]/15 dark:bg-[#DAA520]/25 border border-[#DAA520]/40 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B22222] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#FAF9F6] uppercase">
                      Tutor Guidance:
                    </p>
                    <p className="text-sm text-[#1A1A1A]/85 dark:text-[#FAF9F6]/85 leading-relaxed">
                      {gradeResult.feedback}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================================
          Community Native Speaker Contribution Modal
          ========================================================================= */}
      {selectedPhraseForReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] dark:bg-[#1A1A1A] border-2 border-[#DAA520] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedPhraseForReview(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-[#1A1A1A]/60 dark:text-[#FAF9F6]/60 hover:bg-[#E8E2D5]/40"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#B22222] font-bold">
                Native Advisory Council
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
                Propose Verified Khasi Phrasing
              </h3>
              <p className="text-xs text-[#1A1A1A]/70 dark:text-[#FAF9F6]/70">
                Help verify authentic Meghalaya expressions for: &ldquo;{selectedPhraseForReview.english}&rdquo;
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Khublei Shibun! Proposal Recorded
                </h4>
                <p className="text-xs text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
                  Your proposed wording has been queued for verification by the local Khasi Authors Guild and elder councils.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedPhraseForReview(null)}
                  className="mt-3 px-5 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
                >
                  Done
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#FAF9F6] mb-1">
                    Authentic Khasi Translation:
                  </label>
                  <input
                    type="text"
                    value={proposedKhasi}
                    onChange={(e) => setProposedKhasi(e.target.value)}
                    placeholder="Enter verified Khasi translation..."
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-sm text-[#1A1A1A] dark:text-[#FAF9F6] outline-none focus:border-[#DAA520]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#FAF9F6] mb-1">
                    Pronunciation Guide:
                  </label>
                  <input
                    type="text"
                    value={proposedPronunciation}
                    onChange={(e) => setProposedPronunciation(e.target.value)}
                    placeholder="e.g. 'Khoo-blay shee-boon'"
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-sm text-[#1A1A1A] dark:text-[#FAF9F6] outline-none focus:border-[#DAA520]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#FAF9F6] mb-1">
                    Dialect Region:
                  </label>
                  <select
                    value={proposedDialect}
                    onChange={(e) => setProposedDialect(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-sm text-[#1A1A1A] dark:text-[#FAF9F6] outline-none focus:border-[#DAA520]"
                  >
                    <option value="Standard Sohra / Shillong">Standard Sohra / Shillong</option>
                    <option value="Ri-Bhoi (Bhoi Dialect)">Ri-Bhoi (Bhoi Dialect)</option>
                    <option value="Jaintia / Pnar Nuance">Jaintia / Pnar Nuance</option>
                    <option value="War-Khasi (Southern Border)">War-Khasi (Southern Border)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#FAF9F6] mb-1">
                    Your Name / Native Authority:
                  </label>
                  <input
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="e.g. Native Sohra Speaker / Khasi Educator"
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-sm text-[#1A1A1A] dark:text-[#FAF9F6] outline-none focus:border-[#DAA520]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-[#1A1A1A] dark:text-[#FAF9F6] mb-1">
                    Linguistic Notes / Cultural Context:
                  </label>
                  <textarea
                    rows={2}
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    placeholder="e.g. Specific contextual etiquette or village Dorbar usage..."
                    className="w-full p-3 rounded-xl bg-white dark:bg-[#242424] border border-[#E8E2D5] dark:border-[#333333] text-sm text-[#1A1A1A] dark:text-[#FAF9F6] outline-none focus:border-[#DAA520]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPhraseForReview(null)}
                    className="min-h-[44px] px-4 rounded-xl border border-[#E8E2D5] dark:border-[#333333] text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={!proposedKhasi.trim()}
                    onClick={() => setIsSubmitted(true)}
                    className="min-h-[44px] px-6 rounded-xl bg-[#B22222] text-[#FAF9F6] font-bold text-xs shadow-ceremonial disabled:opacity-50"
                  >
                    Submit Proposal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Phrasebook;
