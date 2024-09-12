import React from 'react';
import WeatherCard from '@/components/WeatherCard';

const Home: React.FC = () => {
  const mockData = {
    city: 'London',
    temperature: 15,
    description: 'Partly cloudy',
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold mb-8">Weather App</h1>
      <WeatherCard data={mockData} />
    </main>
  );
};

export default Home;
