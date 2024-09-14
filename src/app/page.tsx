'use client';

import React, { useState, useEffect } from 'react';
import WeatherCard from '@/components/WeatherCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useWeatherData } from '@/lib/api';

const Home: React.FC = () => {
  const { data: weatherData, loading, error, refetch } = useWeatherData('London');

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-4xl font-bold">Weather App</h1>
        <ThemeToggle />
      </div>

      <div className="py-24">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {weatherData && (
          <>
            <WeatherCard data={weatherData} />
            <button onClick={refetch} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
              Refresh
            </button>
          </>
        )}
      </div>
    </main>
  );
};

export default Home;
