const STORAGE_KEYS = {
  LEARNED_LETTERS: 'khasi_learn_letters',
  KNOWN_FLASHCARDS: 'khasi_known_flashcards',
  TOTAL_STARS: 'khasi_total_stars',
  GAMES_PLAYED: 'khasi_games_played',
};

const notifyUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('khasi-progress-updated'));
  }
};

export const getLearnedLetters = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LEARNED_LETTERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const toggleLearnedLetter = (letterId: string): string[] => {
  const current = getLearnedLetters();
  const exists = current.includes(letterId);
  const updated = exists ? current.filter((id) => id !== letterId) : [...current, letterId];
  try {
    localStorage.setItem(STORAGE_KEYS.LEARNED_LETTERS, JSON.stringify(updated));
    notifyUpdate();
  } catch {
    // ignore quota errors
  }
  return updated;
};

export const getKnownFlashcards = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.KNOWN_FLASHCARDS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setFlashcardKnown = (wordId: string, known: boolean): string[] => {
  const current = getKnownFlashcards();
  const updated = known
    ? Array.from(new Set([...current, wordId]))
    : current.filter((id) => id !== wordId);
  try {
    localStorage.setItem(STORAGE_KEYS.KNOWN_FLASHCARDS, JSON.stringify(updated));
    notifyUpdate();
  } catch {
    // ignore
  }
  return updated;
};

export const getTotalStars = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOTAL_STARS);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

export const addStars = (amount: number): number => {
  const current = getTotalStars();
  const updated = Math.max(0, current + amount);
  try {
    localStorage.setItem(STORAGE_KEYS.TOTAL_STARS, updated.toString());
    notifyUpdate();
  } catch {
    // ignore
  }
  return updated;
};

export const getGamesPlayed = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAMES_PLAYED);
    return raw ? parseInt(raw, 10) || 0 : 0;
  } catch {
    return 0;
  }
};

export const recordGamePlayed = (): number => {
  const current = getGamesPlayed();
  const updated = current + 1;
  try {
    localStorage.setItem(STORAGE_KEYS.GAMES_PLAYED, updated.toString());
    notifyUpdate();
  } catch {
    // ignore
  }
  return updated;
};

export const resetAllProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LEARNED_LETTERS);
    localStorage.removeItem(STORAGE_KEYS.KNOWN_FLASHCARDS);
    localStorage.removeItem(STORAGE_KEYS.TOTAL_STARS);
    localStorage.removeItem(STORAGE_KEYS.GAMES_PLAYED);
    notifyUpdate();
  } catch {
    // ignore
  }
};
