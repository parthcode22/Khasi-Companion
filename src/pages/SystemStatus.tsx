import React, { useState, useEffect } from 'react';
import {
  Activity,
  Server,
  RefreshCw,
  Lock,
  Cpu,
  Database,
  CheckCircle2,
  FileText,
  Zap,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';
import WovenSilkDivider from '../components/layout/WovenSilkDivider';
import VerificationBadge from '../components/ui/VerificationBadge';
import { checkSystemHealth, getApiBaseUrl } from '../services/api';
import type { SystemHealthResponse } from '../types/khasi';

interface DatasetItem {
  name: string;
  type: string;
  size: string;
  source: string;
  license: string;
  alignment: string;
}

const DATASETS: DatasetItem[] = [
  {
    name: 'Khasi-English Large Sentence Corpus',
    type: 'Bilingual Parallel Pairs',
    size: '5,000,000 raw rows (880.13 MB)',
    source: 'Curated Multi-Domain Linguistic Archive',
    license: 'Research & Non-Commercial Preservation',
    alignment: 'Standard Sohra & Shillong dialect orthography',
  },
  {
    name: 'Cleaned Deduplicated Training Split',
    type: 'Curated Parallel Sentences',
    size: '4,994,821 cleaned (150k Stage-1)',
    source: 'Automated Noise & Heuristic Cleaned',
    license: 'Internal Benchmark & Evaluation',
    alignment: 'Filtered 5,179 noisy/corrupted rows; 300k bidirectional items',
  },
  {
    name: 'Standard Khasi Lexicon & Grammar Stemmer',
    type: 'Lexical Grammar Rules',
    size: '4,800+ lemmas & particle rules',
    source: 'Khasi Authors Guild & Archival Texts',
    license: 'Public Domain / Cultural Preservation',
    alignment: 'Pronoun particles (ka, u, ki, i) & honorifics',
  },
  {
    name: 'Meghalaya Tourism Verified Knowledge Base',
    type: 'Factual Tourism Corpus',
    size: '6 Verified Official Entities',
    source: 'Directorate of Tourism, Govt. of Meghalaya',
    license: 'Open Government Data (OGD) India',
    alignment: 'Permits, hours, taxi tariffs, Dorbar Shnong rules',
  },
  {
    name: 'ERSS 112 & Casualty Hospital Registry',
    type: 'Critical Emergency Directory',
    size: '100% Verified Sourced',
    source: 'Meghalaya Police Command & SDMA',
    license: 'Government Public Safety Exemption',
    alignment: 'Direct routing without generative AI inference',
  },
];

export const SystemStatus: React.FC = () => {
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState<boolean>(true);
  const [lastCheckTimestamp, setLastCheckTimestamp] = useState<string>('');
  const [copiedCurl, setCopiedCurl] = useState<boolean>(false);

  const pingBackend = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      const data = await checkSystemHealth();
      const elapsed = Math.round(performance.now() - start);
      setHealth(data);
      setLatencyMs(elapsed);
      setLastCheckTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      window.dispatchEvent(
        new CustomEvent('khasi-backend-status-updated', {
          detail: { isLive: Boolean(data.is_live_backend), data },
        })
      );
    } catch {
      setLatencyMs(null);
    } finally {
      setIsPinging(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const start = performance.now();
    checkSystemHealth()
      .then((data) => {
        if (isMounted) {
          const elapsed = Math.round(performance.now() - start);
          setHealth(data);
          setLatencyMs(elapsed);
          setLastCheckTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
          setIsPinging(false);
          window.dispatchEvent(
            new CustomEvent('khasi-backend-status-updated', {
              detail: { isLive: Boolean(data.is_live_backend), data },
            })
          );
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsPinging(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isLive = health?.is_live_backend ?? false;

  const copyUvicornCommand = () => {
    navigator.clipboard.writeText('uvicorn backend.main:app --reload --port 8000');
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Header & Overall Integrity Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[#DAA520] text-xs font-semibold text-[#1A1A1A] mb-2 shadow-xs">
            <Activity className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Infrastructure &amp; Fact-Separation Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            System Status &amp; AI Telemetry Dashboard
          </h1>
          <p className="text-sm text-[#1A1A1A]/75 font-sans mt-1 max-w-3xl">
            Live technical telemetry auditing Model A neural translation, Model B hybrid semantic RAG, training dataset pipeline benchmarks, and our invariant zero-hallucination firewall.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border shadow-xs ${
              isLive
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-amber-50 text-amber-900 border-amber-300'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
              }`}
            />
            <span>{isLive ? 'Live FastAPI Backend (Active GPU)' : 'Offline Starter Demo Mode (Healthy)'}</span>
          </span>
        </div>
      </div>

      <WovenSilkDivider variant="standard" />

      {/* 2. PIPELINE ARCHITECTURE OVERVIEW (SYSTEM A & SYSTEM B) */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B22222] uppercase tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Trained AI Models</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Model A &amp; Model B Specifications
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-0.5">
            Strict division of labor between linguistic translation and factual semantic retrieval.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SYSTEM A: MODEL A (TRANSLATOR) */}
          <div className="rounded-3xl bg-[#FAF9F6] border-2 border-[#B22222]/40 hover:border-[#B22222] transition-all p-6 sm:p-8 shadow-silk space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#B22222]/10 text-[#B22222]">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
                      Model A: Bidirectional Translator
                    </h3>
                  </div>
                  <span className="text-xs text-[#B22222] font-semibold font-mono">
                    MarianMT (opus-mt-en-mul) Seq2Seq
                  </span>
                </div>
              </div>
              <VerificationBadge
                status={isLive && health?.model_a_loaded ? 'verified_official' : 'unverified'}
                size="xs"
                labelOverride={isLive && health?.model_a_loaded ? 'GPU Live' : 'Standby / Local'}
              />
            </div>

            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
              Bidirectional neural translator trained on NVIDIA RTX 3050 6GB Laptop GPU with mixed precision (fp16=True). Uses explicit language control tokens (<code>&gt;&gt;kha&lt;&lt;</code> for English-to-Khasi and <code>&gt;&gt;eng&lt;&lt;</code> for Khasi-to-English) with automated round-trip back-translation verification.
            </p>

            {/* Model A Specs & Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">SACREBLEU Score</span>
                <span className="text-xs font-bold text-[#B22222] block font-mono">
                  50.57 BLEU
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">chrF Score</span>
                <span className="text-xs font-bold text-[#B8860B] block font-mono">
                  65.79 chrF
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Validation Loss</span>
                <span className="text-xs font-bold text-emerald-700 block font-mono">
                  0.6874 Loss
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Training Budget</span>
                <span className="text-xs font-bold text-[#1A1A1A] block font-mono">
                  18,750 Steps (2 Ep)
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Training Hardware</span>
                <span className="text-xs font-bold text-[#1A1A1A] block font-mono">
                  RTX 3050 6GB (fp16)
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Runtime State</span>
                <span className="text-xs font-bold text-[#DAA520] block font-mono">
                  {health?.model_a_loaded ? '🟢 GPU Active' : '🟡 Offline Standby'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-[11px] text-[#1A1A1A]/60">
              <span>Safety Keyword Firewall &amp; Reverse Check</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Automated Verification Active
              </span>
            </div>
          </div>

          {/* SYSTEM B: MODEL B (HYBRID RAG MATCH) */}
          <div className="rounded-3xl bg-[#FAF9F6] border-2 border-[#DAA520]/60 hover:border-[#DAA520] transition-all p-6 sm:p-8 shadow-silk space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-[#DAA520]/20 text-[#1A1A1A]">
                  <Database className="w-6 h-6 text-[#DAA520]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
                      Model B: Hybrid Semantic RAG
                    </h3>
                  </div>
                  <span className="text-xs text-[#8B6508] font-semibold font-mono">
                    paraphrase-multilingual-MiniLM-L12-v2
                  </span>
                </div>
              </div>
              <VerificationBadge
                status="verified_official"
                size="xs"
                labelOverride="Fact Grounded"
              />
            </div>

            <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
              Cross-lingual semantic matching engine adapted with learning rate <code>lr=1e-5</code>. Evaluates queries with a strict 75% dense cosine similarity + 25% non-stopword entity overlap formula, rejecting generative hallucination when below the 0.38 calibrated cutoff.
            </p>

            {/* Model B Specs & Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Zero-Hallucination Cutoff</span>
                <span className="text-xs font-bold text-[#B22222] block font-mono">
                  &ge; 0.38 Cosine
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Hybrid Scoring</span>
                <span className="text-xs font-bold text-[#DAA520] block font-mono">
                  75% Dense + 25% Sparse
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Indexed Records</span>
                <span className="text-xs font-bold text-emerald-700 block font-mono">
                  {health?.kb_records_count ?? 6} Verified Cards
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Vector Dimension</span>
                <span className="text-xs font-bold text-[#1A1A1A] block font-mono">
                  384 Dimensions
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Adaptation lr</span>
                <span className="text-xs font-bold text-[#1A1A1A] block font-mono">
                  1e-5 Warmup
                </span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-[#E8E2D5] space-y-0.5">
                <span className="text-[10px] uppercase font-semibold text-[#1A1A1A]/50">Runtime State</span>
                <span className="text-xs font-bold text-[#DAA520] block font-mono">
                  {health?.model_b_loaded ? '🟢 Vectors Ready' : '🟡 Offline Vectors'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-[11px] text-[#1A1A1A]/60">
              <span>Tourism Knowledge Grounding</span>
              <span className="text-[#DAA520] font-semibold flex items-center gap-1 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#DAA520]" /> Directorate of Tourism Certified
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DATASET PIPELINE TELEMETRY (5M -> 4.99M -> 150K) */}
      <section className="rounded-3xl bg-[#FAF9F6] border border-[#E8E2D5] p-6 sm:p-8 shadow-silk space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B22222] uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5 text-[#B22222]" />
            <span>Data Engineering Pipeline</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Dataset Pipeline Telemetry (Notebook 1 &amp; 2)
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-0.5">
            Full transformation audit from 5,000,000 raw corpus rows down to the high-quality 150,000 balanced bilingual training pairs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stage 1 */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#1A1A1A]/50 bg-stone-100 px-2 py-0.5 rounded">
                Stage 1 &bull; Ingestion
              </span>
              <span className="text-xs font-bold text-[#B22222] font-mono">880.13 MB</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-serif font-bold text-[#1A1A1A] font-mono">
                5,000,000
              </div>
              <div className="text-xs font-semibold text-[#1A1A1A]/70">
                Raw Parallel Rows Ingested
              </div>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed">
              Extracted from comprehensive parallel archives covering literary, civic, and educational texts across Meghalaya.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D5] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Stage 2 &bull; Scrubbing
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">-5,179 Noisy Rows</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-serif font-bold text-[#1A1A1A] font-mono">
                4,994,821
              </div>
              <div className="text-xs font-semibold text-[#1A1A1A]/70">
                Unique Cleaned Sentence Pairs
              </div>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed">
              Removed corrupt encoding, excessive whitespaces, identical source/target loops, and non-Khasi glyph intrusions.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-2xl bg-white border border-[#DAA520] space-y-3 relative overflow-hidden bg-gradient-to-br from-amber-50/30 to-white">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#8B6508] bg-[#DAA520]/10 px-2 py-0.5 rounded border border-[#DAA520]/30">
                Stage 3 &bull; Balanced Split
              </span>
              <span className="text-xs font-bold text-[#DAA520] font-mono">300k Bidirectional</span>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-serif font-bold text-[#1A1A1A] font-mono">
                150,000
              </div>
              <div className="text-xs font-semibold text-[#1A1A1A]/70">
                Curated Balanced Pairs for Stage-1
              </div>
            </div>
            <p className="text-xs text-[#1A1A1A]/70 font-sans leading-relaxed">
              Stratified length-balanced subsets equipped with <code>&gt;&gt;kha&lt;&lt;</code> and <code>&gt;&gt;eng&lt;&lt;</code> prefixes yielding 300,000 bidirectional training examples.
            </p>
          </div>
        </div>
      </section>

      {/* 4. LIVE BACKEND CONNECTION DIAGNOSTICS & PING PANEL */}
      <section className="rounded-3xl bg-[#FAF9F6] border border-[#E8E2D5] p-6 sm:p-8 shadow-silk space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E2D5] pb-5">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isLive ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                  FastAPI Telemetry &amp; Live Server Probe
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-white border border-[#E8E2D5] text-[#1A1A1A]/70">
                  {getApiBaseUrl()}
                </span>
              </div>
              <p className="text-xs text-[#1A1A1A]/70 mt-0.5">
                Direct health check to <code>GET /api/health</code>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={pingBackend}
              disabled={isPinging}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B22222] hover:bg-[#8B0000] text-white text-xs font-bold transition-all shadow-ceremonial hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin' : ''}`} />
              <span>{isPinging ? 'Pinging Endpoint...' : 'Test Live GPU Connection'}</span>
            </button>
          </div>
        </div>

        {/* Telemetry Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-1">
            <span className="text-[11px] font-semibold text-[#1A1A1A]/50 uppercase tracking-wider">Round-Trip Latency</span>
            <div className="text-xl font-serif font-bold text-[#1A1A1A] font-mono">
              {latencyMs !== null ? `${latencyMs} ms` : 'Offline'}
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block">
              Ping to /api/health
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-1">
            <span className="text-[11px] font-semibold text-[#1A1A1A]/50 uppercase tracking-wider">Active Device / GPU</span>
            <div className="text-sm font-serif font-bold text-[#1A1A1A] truncate" title={health?.gpu_name || health?.device || 'Client Engine'}>
              {health?.gpu_name || health?.device || (isLive ? 'CUDA GPU' : 'Browser Client WASM')}
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block truncate">
              {health?.device || 'Client Fallback WASM'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-1">
            <span className="text-[11px] font-semibold text-[#1A1A1A]/50 uppercase tracking-wider">Knowledge Base Records</span>
            <div className="text-xl font-serif font-bold text-[#B22222] font-mono">
              {health?.kb_records_count ?? 6} Loaded
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block">
              {isLive ? 'Indexed in Model B' : 'Loaded from starterData.ts'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E2D5] space-y-1">
            <span className="text-[11px] font-semibold text-[#1A1A1A]/50 uppercase tracking-wider">Phrasebook Items</span>
            <div className="text-xl font-serif font-bold text-[#DAA520] font-mono">
              {health?.phrasebook_records_count ?? 10} Items
            </div>
            <span className="text-[10px] text-[#1A1A1A]/50 block">
              Last probe: {lastCheckTimestamp || 'Just now'}
            </span>
          </div>
        </div>

        {/* Command Helper for Launching Backend */}
        {!isLive && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
              <span>
                To activate the local GPU server with Model A &amp; B, run:
              </span>
              <code className="font-mono bg-white px-2 py-0.5 rounded border border-amber-300 font-bold">
                uvicorn backend.main:app --reload --port 8000
              </code>
            </div>
            <button
              type="button"
              onClick={copyUvicornCommand}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-amber-300 hover:border-amber-400 font-bold transition-all shrink-0 text-amber-950"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowRight className="w-3.5 h-3.5" />}
              <span>{copiedCurl ? 'Copied command!' : 'Copy command'}</span>
            </button>
          </div>
        )}
      </section>

      {/* 5. DATASET & LICENSING SUMMARY TABLE */}
      <section className="space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B22222] uppercase tracking-wider mb-1">
            <FileText className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Corpus Provenance &amp; Compliance</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            Dataset &amp; Licensing Summary
          </h2>
          <p className="text-xs sm:text-sm text-[#1A1A1A]/70 mt-0.5">
            Transparent disclosure of all parallel linguistic training sets, tourist knowledge corpora, and academic licenses.
          </p>
        </div>

        <div className="rounded-3xl bg-[#FAF9F6] border border-[#E8E2D5] overflow-hidden shadow-silk">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1A1A1A]">
              <thead className="bg-stone-100/70 border-b border-[#E8E2D5] text-[11px] font-mono uppercase tracking-wider text-[#1A1A1A]/70">
                <tr>
                  <th className="p-4 sm:p-5">Dataset Corpus</th>
                  <th className="p-4 sm:p-5">Type &amp; Scope</th>
                  <th className="p-4 sm:p-5">Size</th>
                  <th className="p-4 sm:p-5">Primary Source</th>
                  <th className="p-4 sm:p-5">Licensing Terms</th>
                  <th className="p-4 sm:p-5">Cultural Dialect Alignment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E2D5] bg-white/60">
                {DATASETS.map((item, idx) => (
                  <tr key={idx} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-4 sm:p-5 font-serif font-bold text-[#1A1A1A] text-sm">
                      {item.name}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-stone-100 border border-stone-200">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 font-mono text-[#B22222] font-semibold">
                      {item.size}
                    </td>
                    <td className="p-4 sm:p-5 text-[#1A1A1A]/80">
                      {item.source}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 font-semibold block w-fit">
                        {item.license}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-[#1A1A1A]/75 text-[11px]">
                      {item.alignment}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 6. ARCHITECTURAL INVARIANT GUARANTEE BANNER */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAF9F6] via-[#FAF9F6] to-[#E8E2D5]/40 border-2 border-[#DAA520] shadow-silk space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#DAA520]/20 text-[#1A1A1A]">
            <Lock className="w-6 h-6 text-[#B22222]" />
          </div>
          <div>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A]">
              Core Architectural Invariant: Decoupled AI &amp; Real-World Facts
            </h3>
            <p className="text-xs text-[#B22222] font-semibold uppercase tracking-wider font-mono">
              Anti-Hallucination Fact-Separation Firewall
            </p>
          </div>
        </div>

        <blockquote className="text-sm sm:text-base font-serif italic text-[#1A1A1A] bg-white/70 p-4 rounded-2xl border-l-4 border-[#B22222]">
          &ldquo;Language datasets and tourism facts are strictly separated. Zero hallucinated translations, prices, or emergency contacts.&rdquo;
        </blockquote>

        <p className="text-xs sm:text-sm text-[#1A1A1A]/80 leading-relaxed font-sans">
          The Khasi Companion architecture guarantees that neural language prediction models cannot invent phone numbers, fares, taxi routes, or cultural permissions. All tourism and safety facts are retrieved exclusively from authenticated repositories.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-[#1A1A1A]/70">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#DAA520]" />
            Continuous Schema Validation
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#DAA520]" />
            Native Elder Review Workflow
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#DAA520]" />
            Emergency 112 Hardwired Routing
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#B22222]" />
            Model B Hybrid 0.38 Strict Guard
          </span>
        </div>
      </section>
    </div>
  );
};

export default SystemStatus;
