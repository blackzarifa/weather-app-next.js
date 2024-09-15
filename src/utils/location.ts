import { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface LocationState {
  coordinates: Coordinates | null;
  error: string | null;
}

export function useUserCoordinates() {
  const [location, setLocation] = useState<LocationState>({ coordinates: null, error: null });

  useEffect(() => {
    if ('geolocation' in navigator) {
      console.log('test-1');
      console.log(navigator.geolocation);
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setLocation({ coordinates: { latitude, longitude }, error: null });
        },
        error => {
          setLocation({
            coordinates: null,
            error: `Unable to retrieve your location: ${error.message}`,
          });
        }
      );
    } else {
      setLocation({ coordinates: null, error: 'Geolocation is not supported by your browser' });
    }
  }, []);

  return location;
}
