'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchWeatherData,
  fetchWeatherDataByCoords,
  fetchWeatherForecast,
  fetchWeatherForecastByCoords,
  WeatherData,
  WeatherForecast,
  Coordinates,
} from '@/lib/api';
import { CACHE_DURATION, CacheItem, saveToLocalStorage, getFromLocalStorage } from '@/lib/cache';

export function useWeatherData(cityOrCoords: string | Coordinates) {
  return useQuery<{ current: WeatherData; forecast: WeatherForecast }, Error>({
    queryKey: ['weather', cityOrCoords],
    queryFn: async () => {
      const cacheKey =
        typeof cityOrCoords === 'string'
          ? cityOrCoords
          : `${cityOrCoords.latitude},${cityOrCoords.longitude}`;
      const cachedData = getFromLocalStorage(cacheKey);

      if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
        return cachedData.data;
      }

      const [currentData, forecastData] =
        typeof cityOrCoords === 'string'
          ? await Promise.all([fetchWeatherData(cityOrCoords), fetchWeatherForecast(cityOrCoords)])
          : await Promise.all([
              fetchWeatherDataByCoords(cityOrCoords),
              fetchWeatherForecastByCoords(cityOrCoords),
            ]);

      const data = { current: currentData, forecast: forecastData };

      const cacheItem: CacheItem = {
        data,
        timestamp: Date.now(),
      };
      saveToLocalStorage(cacheKey, cacheItem);

      return data;
    },
  });
}
