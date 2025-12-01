import { HistoryItem } from '../types';

const HISTORY_KEY = 'glamstride_history_v1';

export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to parse history", e);
    return [];
  }
};

export const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
  try {
    const currentHistory = getHistory();
    const newItem: HistoryItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
    };

    // Keep only the last 50 items to prevent storage quota issues
    // Especially important if we store base64 images
    const updatedHistory = [newItem, ...currentHistory].slice(0, 50);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (e) {
    console.error("Failed to save history item", e);
    // If quota exceeded, we might want to try saving without the result (if it's an image)
    // but for now we just catch the error.
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

export const deleteHistoryItem = (id: string) => {
  const currentHistory = getHistory();
  const updatedHistory = currentHistory.filter(item => item.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
};