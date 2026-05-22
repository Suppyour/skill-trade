import { useState, useEffect } from 'react';

interface GeolocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  loading: boolean;
  error: Error | null;
}

export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        coords: null,
        loading: false,
        error: new Error('Геолокация не поддерживается вашим браузером'),
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
        });
      },
      (error) => {
        // Дефолтные координаты (Москва, центр), если доступ заблокирован
        setState({
          coords: {
            latitude: 55.7558,
            longitude: 37.6173,
          },
          loading: false,
          error: new Error(`Ошибка получения координат: ${error.message}. Использованы координаты по умолчанию.`),
        });
      }
    );
  }, []);

  return state;
};
