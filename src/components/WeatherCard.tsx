import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { WeatherData } from '@/lib/api';

interface WeatherCardProps {
  data: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data }) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>
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
        <p>Temperature: {data.temperature}°C</p>
        <p>Description: {data.description}</p>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
