'use client';

import React, { useState } from 'react';
import WeatherCard from '@/components/WeatherCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWeatherData } from '@/hooks/useWeatherData';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const [city, setCity] = useState('London');
  const [inputCity, setInputCity] = useState('');
  const { data: weatherData, loading, error, refetch } = useWeatherData(city);

  const changeCity = (): void => {
    if (!inputCity) return;
    setCity(inputCity);
    setInputCity('');
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="w-full max-w-5xl flex flex-row justify-between items-center mb-8 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-0 mr-auto">Weather App</h1>

        <ThemeToggle />
      </div>

      <div className="w-full max-w-[350px] mb-8">
        <div className="flex flex-col sm:flex-row gap-2">
          {/* TODO: Change to a select input */}
          <Input
            type="text"
            value={inputCity}
            onChange={e => setInputCity(e.target.value)}
            placeholder="Enter city name"
            className="flex-grow"
          />
          <Button onClick={changeCity} className="w-full sm:w-auto">
            Change City
          </Button>
        </div>
      </div>

      <div className="w-full max-w-[350px]">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {weatherData && (
          <>
            <WeatherCard data={weatherData} />
            <Button onClick={refetch} className="mt-4 w-full">
              Refresh
            </Button>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
