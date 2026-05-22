import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TaskRepository } from './task.repository';
import type { GetNearbyTasksParams } from './task.repository';

export const taskQueries = {
  // Хук-запрос (Query) на получение гео-списка задач с кэшированием на 5 минут
  useNearbyList: (params: GetNearbyTasksParams, enabled: boolean = true) => {
    return useQuery({
      queryKey: ['tasks', 'nearby', params.latitude, params.longitude, params.radiusInMeters],
      queryFn: () => TaskRepository.getNearby(params),
      placeholderData: (previousData) => previousData, // Сглаживает переходы при смене фильтров
      enabled: enabled && params.latitude !== 0 && params.longitude !== 0,
      staleTime: 1000 * 60 * 5, // 5 минут
    });
  },

  // Хук-мутация (Command) на создание новой задачи с автоматическим сбросом кэша запросов задач
  useCreateTaskMutation: () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: TaskRepository.create,
      onSuccess: () => {
        // Очищаем кэш запросов списка задач, чтобы данные обновились на клиенте
        queryClient.invalidateQueries({
          queryKey: ['tasks'],
        });
      },
    });
  }
};
