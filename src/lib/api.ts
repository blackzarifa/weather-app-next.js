const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/3.0';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export interface WeatherData {
  city: string;
  temperature: number;
  description: string;
  icon: string;
}

async function getCoordinates(city: string): Promise<{ lat: number; lon: number }> {
  if (!API_KEY) throw new Error('Weather API key is not defined');

  const response = await fetch(`${GEO_URL}/direct?q=${city}&limit=1&appid=${API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch coordinates');

  const data = await response.json();
  if (data.length === 0) throw new Error('City not found');

  return { lat: data[0].lat, lon: data[0].lon };
}

export async function getWeatherData(city: string): Promise<WeatherData> {
  if (!API_KEY) throw new Error('Weather API key is not defined');

  const { lat, lon } = await getCoordinates(city);

  const response = await fetch(
    `${BASE_URL}/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${API_KEY}`
  );
  if (!response.ok) throw new Error('Failed to fetch weather data');

  const data = await response.json();

  return {
    city: data.name,
    temperature: Math.round(data.current.temp),
    description: data.weather[0].description,
    icon: data.weather[0].icon,
  };
}
