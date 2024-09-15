'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import WeatherCard from '@/components/WeatherCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useUserCoordinates } from '@/utils/location';
import { Coordinates } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Home() {
  const t = useTranslations('Home');
  console.log('Translations:', t('title'), t('inputPlaceholder'));
  const router = useRouter();
  const [searchParam, setSearchParam] = useState<string | Coordinates>('');
  const [inputCity, setInputCity] = useState('');
  const { coordinates, error: locationError } = useUserCoordinates();
  const { data: weatherData, loading, error, refetch } = useWeatherData(searchParam);

  useEffect(() => {
    if (coordinates) {
      setSearchParam(coordinates);
    }
  }, [coordinates]);

  const changeCity = () => {
    if (!inputCity) return;
    setSearchParam(inputCity);
    setInputCity('');
  };

  const changeLanguage = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-5xl flex flex-row justify-between items-center mb-8 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0 mr-auto">{t('title')}</h1>

        <ThemeToggle />

        <select onChange={e => changeLanguage(e.target.value)} className="p-2 rounded">
          <option value="en">English</option>
          <option value="pt">Português</option>
        </select>
      </div>

      <div className="w-full max-w-[350px] mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="text"
            value={inputCity}
            onChange={e => setInputCity(e.target.value)}
            placeholder={t('inputPlaceholder')}
            className="flex-grow"
          />

          <Button onClick={changeCity} className="w-full sm:w-auto">
            {t('searchButton')}
          </Button>
        </div>
      </div>

      {!weatherData && locationError && <p className="text-red-500 mb-4">{t('error')}</p>}
      {error && <p className="text-red-500 justify-center">{t('error')}</p>}
      {loading && <p>{t('loading')}</p>}

      <div className="w-full max-w-[350px]">
        {weatherData && (
          <>
            <WeatherCard data={weatherData} />
            <Button onClick={refetch} className="mt-4 w-full">
              {t('refreshButton')}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
