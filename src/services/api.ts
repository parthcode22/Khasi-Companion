import type {
  PhraseRecord,
  TranslationResponse,
  SystemHealthResponse,
  TourismSearchResponse,
  QuizGradeResponse,
} from '../types/khasi';
import {
  STARTER_TOURISM_KB,
  STARTER_PHRASEBOOK,
  FALLBACK_SYSTEM_HEALTH,
  FALLBACK_DICTIONARY,
  SAFETY_CRITICAL_KEYWORDS,
} from '../data/starterData';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
const DEFAULT_TIMEOUT_MS = 3500;

/**
 * Fetch wrapper with configurable abort timeout to prevent UI blocking
 * when the local Model A / Model B FastAPI server is unreachable.
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return response;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Checks if a given text string contains emergency or safety-critical keywords.
 */
export function detectSafetyCritical(text: string): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return SAFETY_CRITICAL_KEYWORDS.some((kw) => {
    const regex = new RegExp(`\\b${kw}\\b`, 'i');
    return regex.test(lower);
  });
}

/**
 * System Health Check (GET /api/health)
 * Probes the local FastAPI service hosting Model A (Translator) and Model B (Hybrid RAG).
 * Automatically falls back to offline status if unreachable.
 */
export async function checkSystemHealth(): Promise<SystemHealthResponse> {
  try {
    const response = await fetchWithTimeout(`${API_BASE}/health`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    return {
      ...data,
      is_live_backend: true,
    };
  } catch (error) {
    console.info('[Khasi API] Live backend unavailable, using client-side fallback:', error);
    return {
      ...FALLBACK_SYSTEM_HEALTH,
      is_live_backend: false,
    };
  }
}

/**
 * Translate Text (POST /api/translate)
 * Runs Model A neural translation with safety firewall and reverse-check verification.
 * Automatically falls back to starter verified lexicon if the backend is unreachable.
 */
export async function translateText(
  text: string,
  source_lang: 'en' | 'kha' = 'en',
  target_lang: 'kha' | 'en' = 'kha'
): Promise<TranslationResponse> {
  const trimmed = text.trim();
  const isSafetyCritical = detectSafetyCritical(trimmed);
  const safetyWarning = isSafetyCritical
    ? 'Safety Notice: For urgent medical or police emergencies, do not rely solely on translation. Dial National Emergency 112 directly.'
    : null;

  if (!trimmed) {
    return {
      input: '',
      translation: '',
      reverse_check: null,
      verification_status: 'unverified',
      source: 'none',
      is_safety_critical: false,
      safety_warning: null,
      notes: 'No text provided for translation.',
    };
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE}/translate`, {
      method: 'POST',
      body: JSON.stringify({
        text: trimmed,
        source_lang,
        target_lang,
      }),
    }, 20000); // 20s timeout for long multi-sentence paragraphs

    if (!response.ok) {
      throw new Error(`Translation endpoint returned ${response.status}`);
    }

    const data: TranslationResponse = await response.json();
    return {
      ...data,
      is_safety_critical: data.is_safety_critical ?? isSafetyCritical,
      safety_warning: data.safety_warning ?? safetyWarning,
    };
  } catch (error) {
    console.info('[Khasi API] Model A backend offline, utilizing starter lexicon fallback:', error);

    // Strict exact whole-string match ONLY for short inputs (word count <= 12)
    // Never hijack multi-sentence paragraphs with partial substring matching!
    const words = trimmed.split(/\s+/);
    let match: {
      khasi: string;
      reverse: string;
      status: 'verified_official' | 'verified_native_speaker';
      notes: string;
    } | null = null;

    if (words.length <= 12) {
      const normalizedKey = trimmed.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '').trim();

      // 1. Check direct offline dictionary exact match
      const dictMatch = FALLBACK_DICTIONARY[normalizedKey];
      if (dictMatch) {
        match = {
          khasi: dictMatch.khasi,
          reverse: dictMatch.reverse,
          status: dictMatch.status === 'verified_official' ? 'verified_official' : 'verified_native_speaker',
          notes: dictMatch.notes,
        };
      }

      // 2. Exact match against dictionary keys
      if (!match) {
        for (const [key, val] of Object.entries(FALLBACK_DICTIONARY)) {
          const cleanKey = key.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '').trim();
          if (cleanKey === normalizedKey) {
            match = {
              khasi: val.khasi,
              reverse: val.reverse,
              status: val.status === 'verified_official' ? 'verified_official' : 'verified_native_speaker',
              notes: val.notes,
            };
            break;
          }
        }
      }

      // 3. Exact match against STARTER_PHRASEBOOK
      if (!match) {
        const phraseMatch = STARTER_PHRASEBOOK.find((p) => {
          const cleanEn = p.english.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '').trim();
          const cleanKha = p.khasi.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, '').trim();
          return cleanEn === normalizedKey || cleanKha === normalizedKey;
        });

        if (phraseMatch && phraseMatch.khasi) {
          match = {
            khasi: phraseMatch.khasi,
            reverse: phraseMatch.english,
            status: phraseMatch.verification_status === 'verified_official' ? 'verified_official' : 'verified_native_speaker',
            notes: phraseMatch.notes || 'Curated starter phrasebook entry.',
          };
        }
      }
    }

    if (match) {
      const isEnglishToKhasi = source_lang === 'en';
      return {
        input: trimmed,
        translation: isEnglishToKhasi ? match.khasi : match.reverse,
        reverse_check: isEnglishToKhasi ? match.reverse : match.khasi,
        verification_status: match.status,
        source: 'Curated Native Phrasebook (Exact Match)',
        is_safety_critical: isSafetyCritical,
        safety_warning: safetyWarning,
        notes: match.notes,
      };
    }

    // Unmatched fallback for paragraphs or arbitrary sentences when backend is offline
    return {
      input: trimmed,
      translation: null,
      reverse_check: null,
      verification_status: 'unverified',
      source: 'Client Fallback (Model A Offline)',
      is_safety_critical: isSafetyCritical,
      safety_warning: safetyWarning || 'Model A translation engine is offline at http://localhost:8000. Start the local server to enable live neural translation of paragraphs and free-form text.',
      notes: 'Multi-sentence paragraphs and custom inputs require live Model A neural translation. Start the local server: uvicorn backend.main:app --reload --port 8000',
    };
  }
}

/**
 * Search Tourism Knowledge Base (GET /api/tourism?q=...)
 * Queries Model B (Hybrid Semantic RAG) with anti-hallucination fact boundary.
 * Falls back to verified starter records if the backend is unreachable.
 */
export async function searchTourismKB(query: string): Promise<TourismSearchResponse> {
  const trimmedQuery = query.trim();

  try {
    const url = `${API_BASE}/tourism${trimmedQuery ? `?q=${encodeURIComponent(trimmedQuery)}` : ''}`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Tourism endpoint returned ${response.status}`);
    }

    const data = await response.json();
    return {
      results: Array.isArray(data.results) ? data.results : [],
      count: data.count ?? (data.results ? data.results.length : 0),
      blocked_by_zero_hallucination: data.blocked_by_zero_hallucination ?? false,
      notice: data.notice,
      is_live_model_b: true,
    };
  } catch (error) {
    console.info('[Khasi API] Model B RAG backend offline, querying starter knowledge base:', error);

    // Client-side search through verified starter KB
    let matched = STARTER_TOURISM_KB;

    if (trimmedQuery && trimmedQuery !== '*') {
      const qLower = trimmedQuery.toLowerCase();
      const terms = qLower.split(/\s+/).filter(Boolean);

      matched = STARTER_TOURISM_KB.filter((item) => {
        const fullText = [
          item.title,
          item.location,
          item.category,
          item.content.en,
          item.content.kha || '',
          item.notes,
          item.safety_notes || '',
        ]
          .join(' ')
          .toLowerCase();

        return terms.some((term) => fullText.includes(term));
      });
    }

    const isBlocked = matched.length === 0 && Boolean(trimmedQuery && trimmedQuery !== '*');

    return {
      results: matched,
      count: matched.length,
      blocked_by_zero_hallucination: isBlocked,
      notice: isBlocked
        ? '🛡️ No verified records match your query. Khasi Companion adheres to a strict Zero-Hallucination policy and never invents ticket prices, timings, or unverified locations.'
        : 'Operating in Client Fallback Mode (Model B offline). Serving verified local knowledge base records.',
      is_live_model_b: false,
    };
  }
}

/**
 * Get Phrasebook Records (GET /api/phrasebook?category=...)
 * Retrieves cultural phrasebook entries with native review status.
 * Falls back to starter phrasebook if the backend is unreachable.
 */
export async function getPhrasebook(category?: string): Promise<PhraseRecord[]> {
  try {
    const url = `${API_BASE}/phrasebook${
      category && category !== 'All' ? `?category=${encodeURIComponent(category)}` : ''
    }`;
    const response = await fetchWithTimeout(url);

    if (!response.ok) {
      throw new Error(`Phrasebook endpoint returned ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : (data.results || []);
  } catch (error) {
    console.info('[Khasi API] Phrasebook backend offline, serving starter phrasebook records:', error);

    if (!category || category === 'All') {
      return STARTER_PHRASEBOOK;
    }

    const catLower = category.toLowerCase();
    return STARTER_PHRASEBOOK.filter(
      (p) => p.category.toLowerCase().includes(catLower) || catLower.includes(p.category.toLowerCase())
    );
  }
}

/**
 * Grade Khasi Attempt with AI Tutor (POST /api/quiz-grade)
 * Calls Model A + Model B to evaluate semantic accuracy, calculate match score, and provide feedback.
 * Includes graceful client-side fallback if the local Python server is offline.
 */
export async function gradeKhasiAttempt(
  english_prompt: string,
  user_khasi_attempt: string
): Promise<QuizGradeResponse> {
  const cleanPrompt = english_prompt.trim();
  const cleanAttempt = user_khasi_attempt.trim();

  if (!cleanPrompt || !cleanAttempt) {
    return {
      score: 0,
      reference_khasi: '',
      feedback: 'Please enter both the English prompt and your Khasi translation attempt.',
      reverse_check: null,
      model_used: 'Validation Check',
    };
  }

  try {
    const response = await fetchWithTimeout(`${API_BASE}/quiz-grade`, {
      method: 'POST',
      body: JSON.stringify({
        english_prompt: cleanPrompt,
        user_khasi_attempt: cleanAttempt,
      }),
    });

    if (!response.ok) {
      throw new Error(`Quiz grade endpoint returned ${response.status}`);
    }

    const data: QuizGradeResponse = await response.json();
    return data;
  } catch (error) {
    console.info('[Khasi API] Live grading server offline, using client-side semantic heuristic:', error);

    // Find reference Khasi from starter phrasebook or fallback dictionary
    let refKhasi = '';
    const pbMatch = STARTER_PHRASEBOOK.find(
      (p) => p.english.toLowerCase().trim() === cleanPrompt.toLowerCase() && p.khasi
    );
    if (pbMatch) {
      refKhasi = pbMatch.khasi;
    } else {
      const dictMatch = FALLBACK_DICTIONARY[cleanPrompt.toLowerCase()];
      if (dictMatch) {
        refKhasi = dictMatch.khasi;
      } else {
        refKhasi = 'Khublei shibun';
      }
    }

    // Heuristic lexical + particle matching
    const attemptTokens = cleanAttempt.toLowerCase().split(/\s+/).filter(Boolean);
    const refTokens = refKhasi.toLowerCase().split(/\s+/).filter(Boolean);

    const overlap = attemptTokens.filter((t) => refTokens.includes(t)).length;
    const similarity = refTokens.length > 0 ? overlap / refTokens.length : 0;
    const rawScore = Math.min(100, Math.round(similarity * 100));

    let feedback = '';
    if (rawScore >= 80) {
      feedback = 'Bha bha! Excellent attempt! Strong semantic alignment with verified Khasi phrasing.';
    } else if (rawScore >= 50) {
      feedback = 'Good attempt! Understandable phrasing. Pay attention to noun prefixes (Ka/U) and word order.';
    } else {
      feedback = 'Keep practicing! Review Khasi honorifics and compare with the reference translation.';
    }

    return {
      score: rawScore,
      reference_khasi: refKhasi,
      feedback: `${feedback} (Client Fallback — Model A/B offline at localhost:8000)`,
      reverse_check: cleanPrompt,
      model_used: 'Client Offline Fallback (Model A + Model B Offline)',
    };
  }
}

/**
 * Convenience helper to inspect current API Base configuration.
 */
export function getApiBaseUrl(): string {
  return API_BASE;
}

