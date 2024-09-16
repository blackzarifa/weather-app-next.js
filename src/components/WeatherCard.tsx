import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { WeatherData } from '@/lib/api';

interface WeatherCardProps {
  data: WeatherData;
  tempUnit: 'C' | 'F';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, tempUnit }) => {
  const temperature = tempUnit === 'C' ? data.temperature : data.temperatureFahrenheit;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {data.city}
          <Image
            src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
            alt={data.description}
            width={50}
            height={50}
          />
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p>
          Temperature: {temperature} º{tempUnit}
        </p>
        <p>Description: {data.description}</p>
        {data.timestamp && (
          <p className="text-sm text-muted-foreground mt-2">
            Last updated: {new Date(data.timestamp).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
