import { apiClient } from '@/shared/api/apiClient';
import type { TaskDto, Task } from '../model/types';
import { mapTaskDtoToEntity } from '../lib/mapTask';

export interface GetNearbyTasksParams {
  latitude: number;
  longitude: number;
  radiusInMeters: number;
}

export const TaskRepository = {
  // Вызов Query-эндпоинта (Бэкенд Чтение)
  async getNearby(params: GetNearbyTasksParams): Promise<Task[]> {
    const { data } = await apiClient.get<TaskDto[]>('/tasks/nearby', { params });
    return data.map(mapTaskDtoToEntity);
  },

  // Вызов Command-эндпоинта (Бэкенд Запись)
  async create(command: {
    title: string;
    description: string;
    priceAmount: number;
    currency: string;
    latitude: number;
    longitude: number;
    creatorId: string;
  }): Promise<string> {
    const { data } = await apiClient.post<string>('/tasks', command);
    return data; // Возвращает ID созданной задачи
  }
};
