import React from 'react';
import WeatherCard from '@/components/WeatherCard';
import { ThemeToggle } from '@/components/ThemeToggle';

const Home: React.FC = () => {
  const mockData = {
    city: 'London',
    temperature: 15,
    description: 'Partly cloudy',
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-4xl font-bold">Weather App</h1>
        <ThemeToggle />
      </div>

      <WeatherCard data={mockData} />
    </main>
  );
};

export default Home;
