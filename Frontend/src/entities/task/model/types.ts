// Контракт от бэкенда (соответствует TaskLookupDto / Task aggregate в C#)
export interface TaskDto {
  id: string;
  title: string;
  price: number;
  currency: string;
  latitude: number;
  longitude: number;
  distanceInMeters: number;
  status: 'Active' | 'InProgress' | 'Completed' | 'Cancelled';
}

// Чистый интерфейс доменной сущности для использования на фронтенде
export interface Task {
  id: string;
  title: string;
  price: {
    amount: number;
    currency: string;
  };
  coords: {
    lat: number;
    lng: number;
  };
  distanceKm: number;
  status: 'active' | 'in-progress' | 'completed' | 'cancelled';
}
