import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchWeatherData, WeatherData } from '@/lib/api';
import { CACHE_DURATION, CacheItem, saveToLocalStorage, getFromLocalStorage } from '@/lib/cache';

const cache: Record<string, CacheItem> = {};

export interface WeatherHookResult {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWeatherData(city: string): WeatherHookResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Check js object cache
      if (cache[city] && Date.now() - cache[city].timestamp < CACHE_DURATION) {
        setData(cache[city].data);
        setLoading(false);
        return;
      }

      // Check localStorage
      const localData = getFromLocalStorage(city);
      if (localData && Date.now() - localData.timestamp < CACHE_DURATION) {
        setData(localData.data);
        cache[city] = localData;
        setLoading(false);
        return;
      }

      // Fetch data
      const newData = await fetchWeatherData(city);
      setData(newData);

      // Update cache
      const cacheItem = { data: newData, timestamp: Date.now() };
      cache[city] = cacheItem;
      saveToLocalStorage(city, cacheItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [city]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedData = useMemo(
    () => ({ data, loading, error, refetch: fetchData }),
    [data, loading, error, fetchData]
  );

  return memoizedData;
}
