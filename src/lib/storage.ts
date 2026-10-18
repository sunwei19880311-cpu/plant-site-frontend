import type { FavoriteItem } from '@/types';

const getStorage = (): Storage | null => {
  if (typeof window !== 'undefined') {
    return window.localStorage;
  }
  return null;
};

const FAVORITES_KEY = 'plante_favorites_v1';

export const getFavorites = (): FavoriteItem[] => {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const raw = storage.getItem(FAVORITES_KEY);
    return raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
  } catch {
    return [];
  }
};

export const isFavorite = (id: string): boolean => {
  const favorites = getFavorites();
  return favorites.some((f) => f.id === id);
};

export const addFavorite = (id: string): FavoriteItem[] => {
  const favorites = getFavorites();
  if (!favorites.some((f) => f.id === id)) {
    favorites.push({ id, type: 'plant', addedAt: Date.now() });
    const storage = getStorage();
    storage?.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
  return favorites;
};

export const removeFavorite = (id: string): FavoriteItem[] => {
  const favorites = getFavorites();
  const filtered = favorites.filter((f) => f.id !== id);
  const storage = getStorage();
  storage?.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  return filtered;
};

export const toggleFavorite = (
  id: string
): { favorites: FavoriteItem[]; isFavorited: boolean } => {
  const favorited = isFavorite(id);
  const favorites = favorited ? removeFavorite(id) : addFavorite(id);
  return { favorites, isFavorited: !favorited };
};
