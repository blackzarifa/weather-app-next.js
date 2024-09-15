import { WeatherData } from '@/lib/api';

export const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12h

export interface CacheItem {
  data: WeatherData;
  timestamp: number;
}

export function saveToLocalStorage(key: string, data: CacheItem) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getFromLocalStorage(key: string): CacheItem | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}
