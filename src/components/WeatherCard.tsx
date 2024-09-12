import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  city: string;
  temperature: number;
  description: string;
}

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>{data.city}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Temperature: {data.temperature}°C</p>
        <p>Description: {data.description}</p>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
