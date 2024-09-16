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
