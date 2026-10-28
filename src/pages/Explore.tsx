import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Compass,
  Search,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
} from 'lucide-react';
import WovenSilkDivider from '../components/layout/WovenSilkDivider';
import TourismCard from '../components/tourism/TourismCard';
import { searchTourismKB } from '../services/api';
import type { TourismRecord } from '../types/khasi';

type CategoryFilterKey =
  | 'All'
  | 'tourism_destination'
  | 'culture_and_etiquette'
  | 'safety_and_emergency'
  | 'transport';

interface CategoryPill {
  key: CategoryFilterKey;
  label: string;
}

const CATEGORY_PILLS: CategoryPill[] = [
  { key: 'All', label: 'All Categories' },
  { key: 'tourism_destination', label: 'Tourism Destinations' },
  { key: 'culture_and_etiquette', label: 'Culture & Etiquette' },
  { key: 'safety_and_emergency', label: 'Safety & Emergency' },
  { key: 'transport', label: 'Transport & Cabs' },
];

export const Explore: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilterKey>('All');
  const [rawRecords, setRawRecords] = useState<TourismRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLiveModelB, setIsLiveModelB] = useState<boolean>(false);
  const [blockedByZeroHallucination, setBlockedByZeroHallucination] = useState<boolean>(false);

  // Perform search via Model B API / Fallback layer
  const fetchTourismData = useCallback(async (query: string) => {
    setIsLoading(true);
    try {
      const response = await searchTourismKB(query);
      setRawRecords(response.results);
      setIsLiveModelB(response.is_live_model_b);
      setBlockedByZeroHallucination(response.blocked_by_zero_hallucination);
    } catch (err) {
      console.error('Error querying tourism knowledge base:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    let isMounted = true;
    searchTourismKB('')
      .then((response) => {
        if (isMounted) {
          setRawRecords(response.results);
          setIsLiveModelB(response.is_live_model_b);
          setBlockedByZeroHallucination(response.blocked_by_zero_hallucination);
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
  }, []);

  // Debounced search trigger when searchQuery changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTourismData(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchTourismData]);

  // Client-side category filtering
  const filteredRecords = useMemo(() => {
    if (activeCategory === 'All') {
      return rawRecords;
    }
    return rawRecords.filter((rec) => rec.category === activeCategory);
  }, [rawRecords, activeCategory]);

  const hasNoMatches = !isLoading && filteredRecords.length === 0;
  const isZeroHallucinationActive = blockedByZeroHallucination || hasNoMatches;

  const handleResetSearch = () => {
    setSearchQuery('');
    setActiveCategory('All');
    fetchTourismData('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Header & Title Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF9F6] border border-[#DAA520] text-xs font-semibold text-[#1A1A1A] mb-2 shadow-xs">
            <Compass className="w-3.5 h-3.5 text-[#DAA520]" />
            <span>Model B Hybrid Semantic Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A1A1A]">
            Explore Meghalaya — Verified Tourism &amp; Safety Guide
          </h1>
          <p className="text-sm text-[#1A1A1A]/75 font-sans mt-1 max-w-3xl">
            Curated destinations, cultural etiquette, and emergency protocols backed by official Meghalaya Tourism sources.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 shadow-xs ${
              isLiveModelB
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white text-[#1A1A1A] border-[#DAA520]'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${isLiveModelB ? 'text-emerald-600' : 'text-[#DAA520]'}`} />
            <span>{isLiveModelB ? 'Live Model B Semantic RAG' : 'Official Meghalaya Tourism Data'}</span>
          </span>
        </div>
      </div>

      <WovenSilkDivider variant="subtle" />

      {/* 2. Cultural Search & Category Filters */}
      <div className="space-y-4">
        {/* Real-Time Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[#DAA520]" />
          </div>
          <input
            id="tourism-search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search verified trails, Living Root Bridges, sacred groves, Sohra fares, ERSS 112..."
            className="w-full pl-11 pr-24 py-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8E2D5] focus:border-[#E97451] focus:ring-1 focus:ring-[#E97451] text-sm text-[#1A1A1A] placeholder:text-[#1A1A1A]/40 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 my-auto h-7 px-2.5 rounded-lg text-xs text-[#1A1A1A]/60 hover:text-[#B22222] hover:bg-stone-200/50 transition-colors font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {CATEGORY_PILLS.map((pill) => {
            const isActive = activeCategory === pill.key;
            return (
              <button
                key={pill.key}
                type="button"
                onClick={() => setActiveCategory(pill.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shadow-2xs active:scale-95 ${
                  isActive
                    ? 'bg-[#B22222] text-[#FAF9F6] shadow-ceremonial hover:bg-[#8B0000]'
                    : 'bg-[#FAF9F6] border border-[#E8E2D5] text-[#1A1A1A]/80 hover:border-[#DAA520] hover:text-[#1A1A1A]'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header Count & Info Strip */}
      <div className="flex items-center justify-between text-xs text-[#1A1A1A]/60 pt-2 border-t border-[#E8E2D5]/70">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-[#DAA520]" />
          <span>
            {isLoading ? 'Querying verified knowledge base...' : `Showing ${filteredRecords.length} verified records`}
          </span>
        </div>
        <div className="text-[11px] font-mono text-[#DAA520]">
          Zero-Hallucination Firewall Active
        </div>
      </div>

      {/* 2. ZERO-HALLUCINATION GUARD BANNER */}
      {isZeroHallucinationActive && (
        <div className="p-6 sm:p-8 rounded-3xl bg-amber-50/80 border-2 border-[#DAA520] shadow-silk space-y-4 animate-fadeIn">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-[#DAA520]/20 text-[#1A1A1A] shrink-0 mt-0.5">
              <ShieldCheck className="w-6 h-6 text-[#B22222]" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                🛡️ Zero-Hallucination Policy Enforced
              </h3>
              <p className="text-sm text-[#1A1A1A]/85 leading-relaxed font-sans">
                🛡️ No verified records match your query. Khasi Companion adheres to a strict Zero-Hallucination policy and never invents ticket prices, timings, or unverified locations.
              </p>
              <p className="text-xs text-[#1A1A1A]/70 leading-relaxed font-sans">
                All records in this repository are cross-verified with the Directorate of Tourism, Meghalaya Police ERSS, and local Dorbar Shnongs. Generative speculation on travel rates, directions, or emergency contacts is blocked by design.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-3 pl-0 sm:pl-16">
            <button
              type="button"
              onClick={handleResetSearch}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B22222] hover:bg-[#E97451] text-[#FAF9F6] font-semibold text-xs transition-all shadow-ceremonial active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Search &amp; Show All Records</span>
            </button>
            <span className="text-xs text-[#1A1A1A]/60">
              Try searching for &ldquo;Nohkalikai&rdquo;, &ldquo;Mawphlang&rdquo;, &ldquo;Root Bridge&rdquo;, or &ldquo;112&rdquo;.
            </span>
          </div>
        </div>
      )}

      {/* Loading Skeleton State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-[#FAF9F6] border border-[#E8E2D5] space-y-4 animate-pulse"
            >
              <div className="h-4 bg-stone-200 rounded w-1/3" />
              <div className="h-6 bg-stone-200 rounded w-3/4" />
              <div className="h-16 bg-stone-200 rounded w-full" />
              <div className="h-8 bg-stone-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      )}

      {/* 3. TOURISM CARD GRID */}
      {!isLoading && filteredRecords.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.map((record) => (
            <TourismCard key={record.id} record={record} />
          ))}
        </div>
      )}

      {/* Cultural Etiquette Notice Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#FAF9F6] to-[#E8E2D5]/30 border border-[#DAA520]/40 shadow-silk flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#DAA520]/20 text-[#B22222] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-serif font-bold text-[#1A1A1A]">
              Visiting Sacred Sites (Law Kyntang) &amp; Villages
            </h4>
            <p className="text-xs text-[#1A1A1A]/70 mt-0.5">
              Always engage a registered local Dorbar Shnong guide. Never remove plants, stones, or artifacts from sacred groves.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#B22222] shrink-0">
          <Info className="w-4 h-4 text-[#DAA520]" />
          <span>Dorbar Shnong Protected</span>
        </div>
      </div>
    </div>
  );
};

export default Explore;
