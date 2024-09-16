import { format } from 'date-fns';

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  city: string;
  temperature: number;
  temperatureFahrenheit: number;
  description: string;
  icon: string;
  timestamp: number;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface ForecastData {
  date: string;
  temperature: number;
  temperatureFahrenheit: number;
  description: string;
  icon: string;
}

export interface WeatherForecast {
  city: string;
  forecast: ForecastData[];
  timestamp: number;
}

function celsiusToFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32);
}

export async function fetchWeatherData(city: string): Promise<WeatherData> {
  if (!API_KEY) throw new Error('Weather API key is not defined');

  const response = await fetch(
    `${BASE_URL}/weather?q=${city}&units=metric&lang=en&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data = await response.json();

  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    temperatureFahrenheit: celsiusToFahrenheit(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    timestamp: Date.now(),
  };
}

export async function fetchWeatherDataByCoords(coords: Coordinates): Promise<WeatherData> {
  if (!API_KEY) throw new Error('Weather API key is not defined');

  const response = await fetch(
    `${BASE_URL}/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&lang=en&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data = await response.json();

  return {
    city: data.name,
    temperature: Math.round(data.main.temp),
    temperatureFahrenheit: celsiusToFahrenheit(data.main.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    timestamp: Date.now(),
  };
}

export async function fetchWeatherForecast(city: string): Promise<WeatherForecast> {
  if (!API_KEY) throw new Error('Weather API key is not defined');

  const response = await fetch(
    `${BASE_URL}/forecast?q=${city}&units=metric&lang=en&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch weather forecast');

  const data = await response.json();

  const forecast = data.list
    .filter((_: any, index: number) => index % 8 === 0) // One forecast per day (every 8th item)
    .slice(0, 5) // Limit to 5 days
    .map((item: any) => {
      const forecastDate = new Date(item.dt * 1000);
      return {
        date: format(forecastDate, 'EEE, MMM d'),
        temperature: Math.round(item.main.temp),
        temperatureFahrenheit: celsiusToFahrenheit(item.main.temp),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
      };
    });

  return {
    city: data.city.name,
    forecast,
    timestamp: Date.now(),
  };
}

export async function fetchWeatherForecastByCoords(coords: Coordinates): Promise<WeatherForecast> {
  if (!API_KEY) throw new Error('Weather API key is not defined');

  const response = await fetch(
    `${BASE_URL}/forecast?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&lang=en&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch weather forecast');

  const data = await response.json();

  const forecast = data.list
    .filter((_: any, index: number) => index % 8 === 0)
    .slice(0, 5)
    .map((item: any) => ({
      date: format(new Date(item.dt * 1000), 'EEE, MMM d'),
      temperature: Math.round(item.main.temp),
      temperatureFahrenheit: celsiusToFahrenheit(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

  return {
    city: data.city.name,
    forecast,
    timestamp: Date.now(),
  };
}
