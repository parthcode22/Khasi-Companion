import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Languages,
  Compass,
  BookOpen,
  ShieldAlert,
  Server,
  Cpu,
  Database,
  ArrowRight,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Lock,
  Layers,
  Flame,
  GraduationCap,
} from 'lucide-react';
import WovenSilkDivider from '../components/layout/WovenSilkDivider';
import VerificationBadge from '../components/ui/VerificationBadge';
import { checkSystemHealth } from '../services/api';
import type { SystemHealthResponse } from '../types/khasi';

export const Home: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [lastChecked, setLastChecked] = useState<string>('');

  const runHealthCheck = async () => {
    setIsChecking(true);
    try {
      const data = await checkSystemHealth();
      setHealth(data);
      setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch {
      // Handled internally by api.ts fallback
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    checkSystemHealth()
      .then((data) => {
        if (isMounted) {
          setHealth(data);
          setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsChecking(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsChecking(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isLive = health?.is_live_backend ?? false;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-[#FAF9F6] border border-[#E8E2D5] p-6 sm:p-10 lg:p-14 shadow-silk">
        {/* Traditional Motif & Ambient Glow Accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-[#DAA520]/20 via-[#E97451]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-gradient-to-tr from-[#B22222]/15 via-[#DAA520]/10 to-transparent blur-3xl pointer-events-none" />
        
        {/* Subtle geometric motif pattern watermark */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#1A1A1A_1px,transparent_1px)] [background-size:16px_16px]" 
          aria-hidden="true" 
        />

        <div className="relative z-10 max-w-4xl">
          {/* Status Badge & Heritage Tag */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[#DAA520] text-[#1A1A1A] text-xs font-semibold tracking-wide uppercase shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#DAA520] animate-pulse" />
              <span>Ka Ktien Khasi • Meghalaya Heritage</span>
            </div>

            {/* Quick Live Backend Indicator Pill */}
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${
                isLive
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-900 border-amber-300'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              />
              <span>
                {isLive ? 'Live GPU Backend Active' : 'Offline Starter Demo Mode'}
              </span>
            </div>
          </div>

          {/* Main Title & Subtitle */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-[1.15] mb-5">
            Khasi Companion
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-[#B22222] font-serif italic mt-2">
              Your Cultural Guide &amp; Language Assistant for Meghalaya
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#1A1A1A]/85 leading-relaxed font-sans mb-8 max-w-3xl">
            Bridge language barriers with our custom-trained neural models while exploring verified Meghalaya tourism, cultural etiquette, and emergency support.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              to="/translate"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#B22222] hover:bg-[#E97451] text-[#FAF9F6] font-semibold text-sm transition-all duration-200 shadow-ceremonial hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Languages className="w-4 h-4 text-[#FAF9F6]" />
              <span>Launch Translator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/explore"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#DAA520] hover:bg-[#B8860B] text-[#1A1A1A] font-bold text-sm transition-all duration-200 shadow-sm hover:shadow-silk hover:-translate-y-0.5 active:translate-y-0 border border-[#DAA520]"
            >
              <Compass className="w-4 h-4 text-[#1A1A1A]" />
              <span>Explore Tourism KB</span>
            </Link>

            <Link
              to="/safety"
              className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-transparent hover:bg-[#B22222]/10 text-[#B22222] font-semibold text-sm transition-colors"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Emergency 112</span>
            </Link>
          </div>
        </div>

        {/* Hero Footer Meta Strip */}
        <div className="mt-10 pt-6 border-t border-[#E8E2D5] flex flex-wrap items-center justify-between gap-4 text-xs text-[#1A1A1A]/75">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#DAA520]" />
            <span>Strict Fact Separation: Zero Hallucinated Rates or Emergency Contacts</span>
          </div>
          <div className="flex items-center gap-3">
            <VerificationBadge status="verified_official" size="xs" />
            <VerificationBadge status="verified_native_speaker" size="xs" />
          </div>
        </div>
      </section>

      {/* Subtle Woven Silk Divider */}
      <WovenSilkDivider variant="standard" />

      {/* 2. FEATURE QUICK-NAVIGATION CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B22222] uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#DAA520]" />
              <span>Specialized Modules</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Essential Cultural &amp; Travel Capabilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 max-w-md">
            Click any module below to interact with our verified linguistic engine and Meghalaya knowledge base.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: /translate */}
          <Link
            to="/translate"
            className="group block p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E2D5] hover:border-[#B22222] transition-all duration-300 hover:scale-[1.02] shadow-silk hover:shadow-silk-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#B22222]/10 text-[#B22222] flex items-center justify-center mb-4 group-hover:bg-[#B22222] group-hover:text-[#FAF9F6] transition-colors">
                <Languages className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#B22222] transition-colors">
                  Translator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E2D5] text-[#1A1A1A]/70">
                  Model A
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/75 leading-relaxed">
                Bidirectional English ↔ Khasi translation with dialect awareness (Sohra/Shillong), grammatical honorifics, and reverse-verification.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D5] flex items-center justify-between text-xs font-semibold text-[#B22222] group-hover:text-[#E97451]">
              <span>Launch Translator</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: /explore */}
          <Link
            to="/explore"
            className="group block p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E2D5] hover:border-[#DAA520] transition-all duration-300 hover:scale-[1.02] shadow-silk hover:shadow-silk-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#DAA520]/15 text-[#B8860B] flex items-center justify-center mb-4 group-hover:bg-[#DAA520] group-hover:text-[#1A1A1A] transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#B8860B] transition-colors">
                  Tourism KB
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E2D5] text-[#1A1A1A]/70">
                  Model B RAG
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/75 leading-relaxed">
                Discover Living Root Bridges (Jingkieng Jri), Mawphlang Sacred Groves, and Sohra falls with verified taxi rates and Dorbar Shnong eco-rules.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D5] flex items-center justify-between text-xs font-semibold text-[#B8860B] group-hover:text-[#DAA520]">
              <span>Explore Knowledge Base</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: /phrasebook */}
          <Link
            to="/phrasebook"
            className="group block p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E2D5] hover:border-[#E97451] transition-all duration-300 hover:scale-[1.02] shadow-silk hover:shadow-silk-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#E97451]/15 text-[#E97451] flex items-center justify-center mb-4 group-hover:bg-[#E97451] group-hover:text-[#FAF9F6] transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#E97451] transition-colors">
                  Phrasebook
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E2D5] text-[#1A1A1A]/70">
                  Native Vetted
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/75 leading-relaxed">
                Essential vocabulary for Shillong markets (Iewduh), village homestays, and dining. Unvetted entries are withheld until native speaker review.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D5] flex items-center justify-between text-xs font-semibold text-[#E97451]">
              <span>Browse Phrasebook</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: /safety */}
          <Link
            to="/safety"
            className="group block p-6 rounded-2xl bg-[#FAF9F6] border border-[#E8E2D5] hover:border-[#B22222] transition-all duration-300 hover:scale-[1.02] shadow-silk hover:shadow-silk-lg flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-[#B22222]/10 text-[#B22222] flex items-center justify-center mb-4 group-hover:bg-[#B22222] group-hover:text-[#FAF9F6] transition-colors">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#B22222] transition-colors">
                  Safety &amp; SOS
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E2D5] text-[#1A1A1A]/70">
                  ERSS 112
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#1A1A1A]/75 leading-relaxed">
                Instant access to National Emergency 112, Meghalaya Tourism Police, Level-1 hospital casualty wards, and monsoon flash-flood advisories.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#E8E2D5] flex items-center justify-between text-xs font-semibold text-[#B22222]">
              <span>Emergency 112 Hub</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* LEARN KHASI DEDICATED SECTION BANNER */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF9F6] to-[#E8E2D5] dark:from-[#1A1A1A] dark:to-[#242424] border-2 border-[#DAA520]/60 p-6 sm:p-8 shadow-silk">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#B22222] uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#DAA520]" />
              <span>Khasi Khynnah • Community Education</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1A1A1A] dark:text-[#FAF9F6]">
              Hikai Khasi — Learn Khasi for Local Children
            </h3>
            <p className="text-sm text-[#1A1A1A]/75 dark:text-[#FAF9F6]/75 leading-relaxed">
              An ad-free, tracker-free learning space designed for local children and classroom teachers. Practice the Khasi alphabet, explore vocabulary, read traditional folklore, and recite rhymes.
            </p>
          </div>
          <Link
            to="/learn"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#B22222] hover:bg-[#8B0000] text-[#FAF9F6] font-semibold text-sm transition-all shadow-ceremonial active:scale-95 shrink-0 self-start md:self-center"
          >
            <span>Open Learning Corner</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 3. ARCHITECTURE INTEGRITY SHOWCASE */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6] to-[#E8E2D5]/40 border-2 border-[#DAA520] p-6 sm:p-10 shadow-silk">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B22222]">
              <Lock className="w-4 h-4 text-[#B22222]" />
              <span>Strict Fact-Separation Architecture</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
              Architectural Invariant: Zero Generative Hallucination
            </h2>

            <p className="text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
              To safeguard visitors and protect indigenous cultural dignity, our platform strictly decouples neural language prediction from real-world factual information. Generative AI is never allowed to fabricate emergency helplines, transport tariffs, or cultural permissions.
            </p>

            {/* Split Subsystem Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D5] space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#B22222]">
                  <Cpu className="w-4 h-4 text-[#B22222]" />
                  <span>System A: Language Models</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/75 leading-relaxed">
                  Bidirectional neural translation models trained exclusively on parallel linguistic corpora with Sohra dialect grammar and cultural honorific preservation.
                </p>
                <div className="pt-1">
                  <VerificationBadge status="unverified" size="xs" labelOverride="Model A Neural Guard" />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D5] space-y-2">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#DAA520]">
                  <Database className="w-4 h-4 text-[#DAA520]" />
                  <span>System B: Tourism Knowledge Base</span>
                </div>
                <p className="text-xs text-[#1A1A1A]/75 leading-relaxed">
                  Zero-hallucination hybrid retrieval grounded in verified tourism facts, Dorbar Shnong customary laws, and official government source links.
                </p>
                <div className="pt-1">
                  <VerificationBadge status="verified_official" size="xs" labelOverride="Model B Verified Fact Grounding" />
                </div>
              </div>
            </div>
          </div>

          {/* Side Graphic / Pillar Box */}
          <div className="lg:w-80 p-6 rounded-2xl bg-[#1A1A1A] text-[#FAF9F6] border border-[#DAA520]/50 shadow-xl space-y-4 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-[#DAA520]">
                Firewall Invariant
              </span>
              <Layers className="w-4 h-4 text-[#DAA520]" />
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DAA520] shrink-0 mt-0.5" />
                <span>Zero hallucinated phone numbers or emergency contacts</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DAA520] shrink-0 mt-0.5" />
                <span>Zero fabricated prices or taxi fares</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#DAA520] shrink-0 mt-0.5" />
                <span>Every tourism entry linked to authentic Meghalaya registries</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-[11px] text-[#FAF9F6]/60 flex items-center justify-between">
              <span>Status</span>
              <span className="text-emerald-400 font-mono font-semibold">ENFORCED</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE CONNECTION MONITOR */}
      <section className="rounded-2xl bg-[#FAF9F6] border border-[#E8E2D5] shadow-silk p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                  Backend Runtime Connection Monitor
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isLive
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  {isLive ? 'Live GPU Backend Mode' : 'Offline Starter Demo Mode'}
                </span>
              </div>
              <p className="text-xs text-[#1A1A1A]/70 mt-0.5">
                Probing FastAPI endpoints at <code className="font-mono text-[#B22222]">http://localhost:8000/api</code>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={runHealthCheck}
            disabled={isChecking}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E2D5] hover:border-[#DAA520] text-xs font-semibold text-[#1A1A1A] transition-all shadow-sm hover:shadow active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#DAA520] ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Probing...' : 'Re-check Connection'}</span>
          </button>
        </div>

        {/* Runtime Diagnostics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D5]">
            <span className="text-[11px] text-[#1A1A1A]/60 uppercase font-semibold">Active Mode</span>
            <div className="text-sm font-bold text-[#1A1A1A] mt-1 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>{isLive ? 'Live FastAPI' : 'Local Fallback'}</span>
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block mt-1">
              {health?.status || 'Active'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D5]">
            <span className="text-[11px] text-[#1A1A1A]/60 uppercase font-semibold">Host Device / GPU</span>
            <div className="text-sm font-bold text-[#1A1A1A] mt-1 truncate" title={health?.gpu_name || health?.device || 'Client Engine'}>
              {health?.gpu_name || health?.device || 'Browser / CPU'}
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block mt-1 truncate">
              {health?.device || 'Client-side WASM'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D5]">
            <span className="text-[11px] text-[#1A1A1A]/60 uppercase font-semibold">Models Status</span>
            <div className="text-sm font-bold text-[#1A1A1A] mt-1 flex items-center gap-2">
              <span className="text-xs">
                A: {health?.model_a_loaded ? '🟢 Ready' : '🟡 Standby'}
              </span>
              <span className="text-xs">
                B: {health?.model_b_loaded ? '🟢 Ready' : '🟡 Standby'}
              </span>
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block mt-1">
              Translator &amp; RAG
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D5]">
            <span className="text-[11px] text-[#1A1A1A]/60 uppercase font-semibold">Verified Records</span>
            <div className="text-sm font-bold text-[#B22222] mt-1 font-mono">
              {(health?.kb_records_count ?? 3)} KB • {(health?.phrasebook_records_count ?? 7)} Phrases
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block mt-1">
              Last checked: {lastChecked || 'Just now'}
            </span>
          </div>
        </div>

        {/* Informative Guidance Banner if in Offline Fallback */}
        {!isLive && (
          <div className="mt-5 p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Flame className="w-4 h-4 text-[#E97451] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">FastAPI backend is not detected at http://localhost:8000.</span>
                <span className="block text-amber-800/80 mt-0.5">
                  The frontend is automatically serving verified starter data (Nohkalikai Falls, ERSS 112, Sacred Groves) and offline translation lexicon without disruption.
                </span>
              </div>
            </div>
            <Link
              to="/system-status"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 hover:border-[#DAA520] text-amber-900 font-semibold text-xs shrink-0 self-start sm:self-auto transition-colors"
            >
              <span>View System Status</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
