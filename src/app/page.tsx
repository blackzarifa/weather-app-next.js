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
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-5xl flex justify-between items-center">
        <h1 className="text-4xl font-bold">Weather App</h1>
        <ThemeToggle />
      </div>

      <div className="py-24">
        <WeatherCard data={mockData} />
      </div>
    </main>
  );
};

export default Home;
