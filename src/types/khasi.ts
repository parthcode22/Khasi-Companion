/**
 * Khasi Companion - TypeScript Definitions
 * Standardized data models for Model A (Translator) and Model B (Hybrid Semantic RAG)
 */

export type VerificationStatus =
  | 'verified_official'
  | 'verified_native_speaker'
  | 'needs_review'
  | 'unverified'
  | 'outdated';

export interface TourismRecord {
  id: string;
  category: string;
  title: string;
  content: {
    en: string;
    kha?: string;
  };
  language: string;
  location: string;
  opening_hours?: string;
  price_info?: string;
  safety_notes?: string;
  source_name: string;
  source_url: string;
  verification_status: VerificationStatus;
  last_reviewed: string;
  notes: string;
  confidence_score?: number;
}

export interface PhraseRecord {
  id: string;
  category: string;
  english: string;
  khasi: string;
  pronunciation_guide: string;
  dialect: string;
  reviewer: string;
  verification_status: VerificationStatus;
  last_reviewed: string;
  notes: string;
}

export interface TranslationRequest {
  text: string;
  source_lang: 'en' | 'kha';
  target_lang: 'kha' | 'en';
}

export interface TranslationResponse {
  input: string;
  translation: string | null;
  reverse_check?: string | null;
  verification_status: string;
  source: string;
  is_safety_critical?: boolean;
  safety_warning?: string | null;
  notes?: string;
}

export interface TourismSearchResponse {
  results: TourismRecord[];
  count: number;
  blocked_by_zero_hallucination: boolean;
  notice?: string;
  is_live_model_b: boolean;
}

export interface SystemHealthResponse {
  status: string;
  device: string;
  gpu_name: string;
  model_a_loaded: boolean;
  model_b_loaded: boolean;
  kb_records_count: number;
  phrasebook_records_count: number;
  is_live_backend: boolean;
}

export interface QuizGradeRequest {
  english_prompt: string;
  user_khasi_attempt: string;
}

export interface QuizGradeResponse {
  score: number;
  reference_khasi: string;
  feedback: string;
  reverse_check?: string | null;
  model_used?: string;
}

