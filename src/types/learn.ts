export type ReviewStatus = 'needs_review' | 'verified';

export interface AlphabetItem {
  id: string;
  letter: string;
  letterName: string;
  exampleWord?: string;
  exampleWordPlaceholder?: string;
  meaning?: string;
  meaningPlaceholder?: string;
  phoneticHint?: string;
  reviewStatus: ReviewStatus;
  teacherNotes?: string;
}

export interface VocabCategory {
  id: string;
  categoryKhasi: string;
  categoryEnglish: string;
  iconName: string;
  items: VocabItem[];
}

export interface VocabItem {
  id: string;
  word: string;
  wordPlaceholder?: string;
  englishMeaning: string;
  englishMeaningPlaceholder?: string;
  phonetic?: string;
  phoneticPlaceholder?: string;
  reviewStatus: ReviewStatus;
  teacherNotes?: string;
}

export interface StoryItem {
  id: string;
  titleKhasi?: string;
  titleEnglish?: string;
  paragraphs?: string[];
  moral?: string;
  reviewStatus: ReviewStatus;
}

export interface RhymeItem {
  id: string;
  titleKhasi?: string;
  titleEnglish?: string;
  lines?: string[];
  themeOrRhythmNotes?: string;
  reviewStatus: ReviewStatus;
}

export interface LearnProgressState {
  learnedLetters: string[]; // letter IDs, e.g. "dak-02"
  knownFlashcards: string[]; // word IDs, e.g. "animal-01"
  gamesPlayed: number;
  totalStars: number;
}
