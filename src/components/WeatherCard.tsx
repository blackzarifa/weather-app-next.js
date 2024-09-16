import React from 'react';
import Image from 'next/image';
import { WeatherData } from '@/lib/api';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherCardProps {
  data: WeatherData;
  tempUnit: 'C' | 'F';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ data, tempUnit }) => {
  const t = useTranslations('Home');
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
          {t('temperature')}: {temperature} º{tempUnit}
        </p>

        {data.timestamp && (
          <p className="text-sm text-muted-foreground mt-2">
            {t('lastUpdated')}: {new Date(data.timestamp).toLocaleString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
