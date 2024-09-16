'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchWeatherData, fetchWeatherDataByCoords, WeatherData, Coordinates } from '@/lib/api';
import { CACHE_DURATION, CacheItem, saveToLocalStorage, getFromLocalStorage } from '@/lib/cache';

export function useWeatherData(cityOrCoords: string | Coordinates) {
  return useQuery<WeatherData, Error>({
    queryKey: ['weather', cityOrCoords],
    queryFn: async () => {
      const cacheKey =
        typeof cityOrCoords === 'string'
          ? cityOrCoords
          : `${cityOrCoords.latitude},${cityOrCoords.longitude}`;
      const cachedData = getFromLocalStorage(cacheKey);

      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return {
          ...cachedData.data,
        };
      }

      const fetchedData =
        typeof cityOrCoords === 'string'
          ? await fetchWeatherData(cityOrCoords)
          : await fetchWeatherDataByCoords(cityOrCoords);

      const cacheItem: CacheItem = {
        data: fetchedData,
        timestamp: Date.now(),
      };
      saveToLocalStorage(cacheKey, cacheItem);

      return fetchedData;
    },
  });
}
