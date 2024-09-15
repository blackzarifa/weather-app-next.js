import React from 'react';
import { render, screen } from '@testing-library/react';
import WeatherCard from '../src/components/WeatherCard';
import '@testing-library/jest-dom';

const mockWeatherData = {
  city: 'London',
  temperature: 15,
  description: 'Cloudy',
  icon: '04d',
  timestamp: 1687621200000,
};

describe('WeatherCard', () => {
  it('renders weather information correctly', () => {
    render(<WeatherCard data={mockWeatherData} />);

    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Temperature: 15°C')).toBeInTheDocument();
    expect(screen.getByText('Description: Cloudy')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', expect.stringContaining('04d'));
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });
});
