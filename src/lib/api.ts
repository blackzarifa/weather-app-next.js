import { useEffect, useState, useCallback, useMemo } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

const CACHE_DURATION = 12 * 60 * 60 * 1000; // 12h

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
  timestamp: number;
}

interface CacheItem {
  data: WeatherData;
  timestamp: number;
}

const cache: Record<string, CacheItem> = {};

function saveToLocalStorage(key: string, data: CacheItem) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key: string): CacheItem | null {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

async function fetchWeatherData(city: string): Promise<WeatherData> {
  if (!API_KEY) throw new Error('Weather API key is not defined');

  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&lang=en&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data = await response.json();

  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    timestamp: Date.now(),
  };
}

function useWeatherData(city: string) {
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

export type { WeatherData };
export { useWeatherData };
