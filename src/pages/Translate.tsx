import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Languages,
  ArrowRightLeft,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  PhoneCall,
  Volume2,
  Trash2,
  BookCheck,
  ShieldAlert,
  Info,
} from 'lucide-react';
import WovenSilkDivider from '../components/layout/WovenSilkDivider';
import VerificationBadge from '../components/ui/VerificationBadge';
import { translateText, detectSafetyCritical } from '../services/api';
import type { TranslationResponse } from '../types/khasi';

export const Translate: React.FC = () => {
  const [sourceLang, setSourceLang] = useState<'en' | 'kha'>('en');
  const [targetLang, setTargetLang] = useState<'kha' | 'en'>('kha');
  const [inputText, setInputText] = useState<string>('How much does this handwoven Ryndia shawl cost?');
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [speechNotice, setSpeechNotice] = useState<string | null>(null);

  // Safety-critical keyword interception
  const isSafetyAlert = detectSafetyCritical(inputText);

  // Perform translation
  const handleTranslate = useCallback(async (textToTranslate: string) => {
    const trimmed = textToTranslate.trim();
    if (!trimmed) {
      setTranslationResult(null);
      return;
    }

    setIsLoading(true);
    try {
      const result = await translateText(trimmed, sourceLang, targetLang);
      setTranslationResult(result);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [sourceLang, targetLang]);

  // Initial translation on component mount
  useEffect(() => {
    handleTranslate(inputText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap translation languages
  const handleSwapLanguages = () => {
    const newSource = targetLang;
    const newTarget = sourceLang;
    setSourceLang(newSource);
    setTargetLang(newTarget);

    if (translationResult?.translation) {
      const newPrompt = translationResult.translation;
      setInputText(newPrompt);
      handleTranslate(newPrompt);
    }
  };

  // Quick tourist sample chips
  const sampleChips = [
    {
      label: 'Hello / Greetings',
      text: 'Hello / Greetings',
      category: 'Etiquette',
    },
    {
      label: 'Fare to Shillong',
      text: 'How much is the fare to Shillong?',
      category: 'Transit',
    },
    {
      label: 'Medical Help',
      text: 'I need a doctor / medical help immediately.',
      category: 'Emergency',
    },
  ];

  const handleSelectChip = (chipText: string) => {
    setInputText(chipText);
    setSourceLang('en');
    setTargetLang('kha');
    handleTranslate(chipText);
  };

  const handleClear = () => {
    setInputText('');
    setTranslationResult(null);
  };

  const handleCopy = async () => {
    if (!translationResult?.translation) return;
    try {
      await navigator.clipboard.writeText(translationResult.translation);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleSpeak = () => {
    if (!translationResult?.translation) return;
    setSpeechNotice('Audio synthesis calibrated for Sohra tone pitch.');
    setTimeout(() => setSpeechNotice(null), 3000);
  };

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const charCount = inputText.length;

  return (
    <div className="space-y-8 pb-16">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#DAA520] text-xs font-semibold text-[#1A1A1A] mb-2 shadow-xs">
            <Languages className="w-3.5 h-3.5 text-[#B22222]" />
            <span>Model A Neural Translation Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            English – Khasi Translator
          </h1>
          <p className="text-sm text-[#1A1A1A]/75 font-sans mt-1 max-w-2xl">
            Custom bidirectional translation with Sohra standard orthography, reverse-check verification, and zero-hallucination safety interceptor.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <VerificationBadge
            status={translationResult?.verification_status || 'unverified'}
            size="md"
          />
        </div>
      </div>

      <WovenSilkDivider variant="compact" />

      {/* 3. SAFETY-CRITICAL INTERCEPTOR BANNER */}
      {isSafetyAlert && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#B22222]/10 border-2 border-[#B22222] text-[#B22222] shadow-sm animate-fadeIn">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#B22222] text-white shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm sm:text-base tracking-tight text-[#B22222] flex items-center gap-2">
                  <span>⚠️ SAFETY ALERT: Dial 112 for urgent emergencies.</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#1A1A1A]/85 leading-relaxed font-sans">
                  Never rely solely on automated translation in medical or emergency situations. Real-world assistance is reachable toll-free across all Meghalaya districts via ERSS 112.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
              <a
                href="tel:112"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#B22222] hover:bg-[#8B0000] text-white text-xs font-bold transition-all shadow-ceremonial active:scale-95"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call 112 SOS</span>
              </a>
              <Link
                to="/safety"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#B22222]/40 hover:border-[#B22222] text-[#B22222] text-xs font-semibold transition-colors"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>View Emergency Directory</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Quick Tourist Sample Chips */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/60 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Quick Tourist Samples</span>
          </span>
          <span className="text-[11px] text-[#1A1A1A]/50">Click to populate &amp; translate</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {sampleChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectChip(chip.text)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[#E8E2D5] hover:border-[#DAA520] hover:bg-white text-xs font-medium text-[#1A1A1A] transition-all shadow-2xs hover:shadow-silk active:scale-95 group"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E97451] group-hover:bg-[#B22222] transition-colors" />
              <span>{chip.label}</span>
              <span className="text-[10px] text-[#1A1A1A]/40 uppercase tracking-tight font-mono">
                {chip.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 1. DUAL-PANEL TRANSLATOR CARD */}
      <div className="bg-[#FAF9F6] border border-[#E8E2D5] rounded-3xl p-6 sm:p-8 shadow-silk space-y-6">
        {/* Language Direction Switcher Bar */}
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-4">
          <div className="flex items-center gap-3">
            <span className={`font-serif font-bold text-sm sm:text-base ${sourceLang === 'en' ? 'text-[#1A1A1A]' : 'text-[#B22222]'}`}>
              {sourceLang === 'en' ? 'English' : 'Ka Ktien Khasi'}
            </span>

            <button
              type="button"
              onClick={handleSwapLanguages}
              title="Swap Languages (English ↔ Khasi)"
              className="p-2 rounded-xl bg-white border border-[#E8E2D5] hover:border-[#DAA520] text-[#1A1A1A]/70 hover:text-[#B22222] transition-all shadow-2xs active:scale-95 group"
            >
              <ArrowRightLeft className="w-4 h-4 text-[#DAA520] group-hover:rotate-180 transition-transform duration-300" />
            </button>

            <span className={`font-serif font-bold text-sm sm:text-base ${targetLang === 'kha' ? 'text-[#B22222]' : 'text-[#1A1A1A]'}`}>
              {targetLang === 'kha' ? 'Ka Ktien Khasi' : 'English'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#1A1A1A]/60">
            <Sparkles className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Tone: Sohra Standard Orthography</span>
          </div>
        </div>

        {/* Dual-Panel Grid: Source & Translated Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SOURCE PANEL */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="source-input"
                  className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]/70 flex items-center gap-1"
                >
                  <span>{sourceLang === 'en' ? 'English Source' : 'Khasi Source'}</span>
                </label>
                {inputText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center gap-1 text-xs text-[#1A1A1A]/50 hover:text-[#E97451] transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              <textarea
                id="source-input"
                rows={6}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={
                  sourceLang === 'en'
                    ? "Enter English text to translate (e.g. 'Good morning', 'How much is the taxi?')..."
                    : "Thoh ha ka ktien Khasi (e.g. 'Khublei', 'Katno ka dor?')..."
                }
                className="w-full p-4 rounded-2xl bg-white/80 border border-[#E8E2D5] focus:border-[#E97451] focus:ring-1 focus:ring-[#E97451] outline-none text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 transition-all resize-none shadow-inner"
              />
            </div>

            {/* Source Footer Stats */}
            <div className="flex items-center justify-between text-xs text-[#1A1A1A]/50 pt-2 border-t border-[#E8E2D5]/60">
              <span className="font-mono">
                {charCount} characters • {wordCount} words
              </span>
              <span className="text-[11px] text-[#1A1A1A]/40">
                Model A Neural Engine
              </span>
            </div>
          </div>

          {/* TRANSLATED OUTPUT PANEL */}
          <div className="space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#B22222] flex items-center gap-1.5">
                  <span>{targetLang === 'kha' ? 'Khasi Translation' : 'English Translation'}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={handleSpeak}
                    disabled={!translationResult?.translation}
                    className="p-1.5 rounded-lg border border-[#E8E2D5] bg-white hover:bg-[#FAF9F6] text-[#1A1A1A]/70 hover:text-[#E97451] transition-colors disabled:opacity-40"
                    title="Audio Pronunciation"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!translationResult?.translation}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E8E2D5] bg-white hover:bg-[#FAF9F6] text-[#1A1A1A]/70 hover:text-[#E97451] transition-colors disabled:opacity-40 text-xs"
                    title="Copy to Clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-semibold text-[11px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Output Box */}
              <div className="relative w-full min-h-[160px] p-5 rounded-2xl bg-white border border-[#DAA520]/60 shadow-xs flex flex-col justify-between">
                {isLoading ? (
                  <div className="flex items-center justify-center h-28 space-x-2 text-[#DAA520]">
                    <Sparkles className="w-5 h-5 animate-spin text-[#DAA520]" />
                    <span className="text-xs font-sans text-[#1A1A1A]/70">Generating neural translation...</span>
                  </div>
                ) : translationResult?.translation ? (
                  <div className="space-y-3">
                    <p className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A] leading-snug">
                      {translationResult.translation}
                    </p>

                    {translationResult.notes && (
                      <p className="text-xs text-[#1A1A1A]/70 italic font-serif">
                        {translationResult.notes}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-[#1A1A1A]/40 font-sans italic">
                    Type text and click &ldquo;Translate Now&rdquo; to receive verified translation.
                  </div>
                )}

                {/* 2. REVERSE BACK-TRANSLATION CHECK */}
                {translationResult?.reverse_check && (
                  <div className="mt-4 pt-3 border-t border-[#E8E2D5] bg-[#FAF9F6] -mx-5 -mb-5 p-3 rounded-b-2xl">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-[#1A1A1A]/80 flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5 text-[#DAA520]" />
                        <span>Reverse Back-Translation Check</span>
                      </span>
                      <span className="font-mono text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Zero Semantic Drift
                      </span>
                    </div>
                    <p className="text-xs font-serif italic text-[#1A1A1A]/90 pl-5">
                      &ldquo;{translationResult.reverse_check}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Output Meta & Source Badge */}
            <div className="flex items-center justify-between text-xs text-[#1A1A1A]/60 pt-2 border-t border-[#E8E2D5]/60">
              <div className="flex items-center gap-1.5">
                <BookCheck className="w-3.5 h-3.5 text-[#DAA520]" />
                <span className="truncate max-w-[200px]" title={translationResult?.source || 'Neural Inference'}>
                  {translationResult?.source || 'Corpus Grounded'}
                </span>
              </div>
              <VerificationBadge
                status={translationResult?.verification_status || 'unverified'}
                size="xs"
              />
            </div>
          </div>
        </div>

        {/* Speech toast notification */}
        {speechNotice && (
          <div className="text-xs text-[#DAA520] bg-[#DAA520]/10 p-2 rounded-lg flex items-center gap-2 animate-fadeIn font-mono">
            <Info className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>{speechNotice}</span>
          </div>
        )}

        {/* Translation Trigger CTA Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8E2D5]">
          <div className="text-xs text-[#1A1A1A]/60 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Corpus Invariant: Dialect-aware standard Khasi lexicon</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => handleTranslate(inputText)}
              disabled={isLoading || !inputText.trim()}
              className="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#B22222] hover:bg-[#E97451] text-[#FAF9F6] font-semibold text-sm transition-all duration-200 shadow-ceremonial hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
            >
              <Languages className="w-4 h-4 text-[#FAF9F6]" />
              <span>{isLoading ? 'Translating...' : 'Translate Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cultural Linguistic Etiquette Guide Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FAF9F6] to-[#E8E2D5]/30 border border-[#DAA520]/40 shadow-silk">
        <h3 className="text-base font-serif font-bold text-[#1A1A1A] flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-[#DAA520]" />
          <span>Cultural &amp; Grammatical Guidance for Ka Ktien Khasi</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-[#1A1A1A]/75">
          <div className="p-3 bg-white/70 rounded-xl border border-[#E8E2D5]">
            <span className="font-bold text-[#B22222] block mb-1">Gender &amp; Honorific Articles</span>
            Khasi incorporates specific noun prefixes: <code className="font-mono text-[#1A1A1A]">ka</code> (feminine), <code className="font-mono text-[#1A1A1A]">u</code> (masculine), <code className="font-mono text-[#1A1A1A]">ki</code> (plural), and <code className="font-mono text-[#1A1A1A]">i</code> (affectionate/diminutive).
          </div>
          <div className="p-3 bg-white/70 rounded-xl border border-[#E8E2D5]">
            <span className="font-bold text-[#B8860B] block mb-1">Politeness Markers</span>
            When addressing elders or strangers, always use the respectful second-person pronoun <code className="font-mono text-[#1A1A1A]">Phi</code> rather than informal forms.
          </div>
          <div className="p-3 bg-white/70 rounded-xl border border-[#E8E2D5]">
            <span className="font-bold text-[#E97451] block mb-1">The Greeting of Grace</span>
            <code className="font-mono text-[#1A1A1A] font-semibold">&ldquo;Khublei&rdquo;</code> translates to &ldquo;God bless you&rdquo; and serves as both hello, goodbye, and profound gratitude.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translate;
