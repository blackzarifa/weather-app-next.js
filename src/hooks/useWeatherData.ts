import { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchWeatherData, WeatherData, fetchWeatherDataByCoords, Coordinates } from '@/lib/api';
import { CACHE_DURATION, CacheItem, saveToLocalStorage, getFromLocalStorage } from '@/lib/cache';

const cache: Record<string, CacheItem> = {};

export interface WeatherHookResult {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useWeatherData(cityOrCoords: string | Coordinates): WeatherHookResult {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (typeof cityOrCoords === 'string') {
        // Check js object cache
        if (cache[cityOrCoords] && Date.now() - cache[cityOrCoords].timestamp < CACHE_DURATION) {
          setData(cache[cityOrCoords].data);
          setLoading(false);
          return;
        }

        // Check localStorage
        const localData = getFromLocalStorage(cityOrCoords);
        if (localData && Date.now() - localData.timestamp < CACHE_DURATION) {
          setData(localData.data);
          cache[cityOrCoords] = localData;
          setLoading(false);
          return;
        }

        const data = await fetchWeatherData(cityOrCoords);
        setData(data);

        // Save city to cache
        const cacheItem = { data: data, timestamp: Date.now() };
        cache[cityOrCoords] = cacheItem;
        saveToLocalStorage(cityOrCoords, cacheItem);
      } else {
        console.log('aaa', cityOrCoords);
        const data = await fetchWeatherDataByCoords(cityOrCoords);
        setData(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [cityOrCoords]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const memoizedData = useMemo(
    () => ({ data, loading, error, refetch: fetchData }),
    [data, loading, error, fetchData]
  );

  return memoizedData;
}
