'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import WeatherCard from '@/components/WeatherCard';
import ForecastCard from '@/components/ForecastCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWeatherData } from '@/hooks/useWeatherData';
import { useUserCoordinates } from '@/utils/location';
import { Coordinates } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

export default function Home() {
  const t = useTranslations('Home');
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [searchParam, setSearchParam] = useState<string | Coordinates>('');
  const [inputCity, setInputCity] = useState('');
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');

  const { coordinates, error: locationError } = useUserCoordinates();
  const { data: weatherData, isLoading, error, refetch } = useWeatherData(searchParam);

  useEffect(() => {
    if (!coordinates) return;
    setSearchParam(coordinates);
  }, [coordinates]);

  const changeCity = () => {
    if (!inputCity) return;
    setSearchParam(inputCity);
    setInputCity('');
  };

  const toggleTempUnit = () => {
    setTempUnit(prevUnit => (prevUnit === 'C' ? 'F' : 'C'));
  };

  const changeLanguage = (newLocale: string) => {
    const currentPath = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${currentPath}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-5xl flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0">{t('title')}</h1>

        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <Select onValueChange={changeLanguage} defaultValue={locale}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder={t('languagePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="pt">Português</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={toggleTempUnit} variant="outline">
            {tempUnit === 'C' ? '°C' : '°F'}
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[350px] lg:max-w-[600px]">
        <div className="w-full mb-8">
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

        <div className="flex flex-col items-center">
          {!weatherData && locationError && (
            <p className="text-red-500 mb-4">{t('locationError')}</p>
          )}
          {error && <p className="text-red-500">{t('error')}</p>}
          {isLoading && <p>{t('loading')}</p>}
        </div>

        {weatherData && (
          <>
            <WeatherCard data={weatherData.current} tempUnit={tempUnit} />

            <h2 className="text-2xl font-semibold mt-8 mb-4">{t('forecast')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {weatherData.forecast.forecast.map((day, index) => (
                <ForecastCard key={index} data={day} tempUnit={tempUnit} />
              ))}
            </div>

            <Button onClick={() => refetch()} className="mt-4 w-full">
              {t('refreshButton')}
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
