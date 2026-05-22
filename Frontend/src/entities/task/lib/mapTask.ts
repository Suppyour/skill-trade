import type { TaskDto, Task } from '../model/types';

export const mapTaskDtoToEntity = (dto: TaskDto): Task => {
  return {
    id: dto.id,
    title: dto.title,
    price: {
      amount: dto.price,
      currency: dto.currency,
    },
    coords: {
      lat: dto.latitude,
      lng: dto.longitude,
    },
    distanceKm: Math.round((dto.distanceInMeters / 1000) * 10) / 10, // переводим в км с 1 знаком после запятой
    status: mapStatus(dto.status),
  };
};

const mapStatus = (status: TaskDto['status']): Task['status'] => {
  const statusMap: Record<TaskDto['status'], Task['status']> = {
    Active: 'active',
    InProgress: 'in-progress',
    Completed: 'completed',
    Cancelled: 'cancelled',
  };
  return statusMap[status] || 'active';
};
