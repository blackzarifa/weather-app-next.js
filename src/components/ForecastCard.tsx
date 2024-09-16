import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { ForecastData } from '@/lib/api';
import { useTranslations } from 'next-intl';

interface ForecastCardProps {
  data: ForecastData;
  tempUnit: 'C' | 'F';
}

const ForecastCard: React.FC<ForecastCardProps> = ({ data, tempUnit }) => {
  const t = useTranslations('ForecastCard');
  const locale = useTranslations('Locale');
  const temperature = tempUnit === 'C' ? data.temperature : data.temperatureFahrenheit;

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center p-4">
        <p className="font-semibold">{data.date}</p>
        <Image
          src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
          alt={data.description}
          width={50}
          height={50}
        />
        <p>
          {temperature} º{tempUnit}
        </p>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
