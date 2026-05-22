import { useEffect, useRef } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '../../../shared/lib/toastStore';

export const useRealTimeTasks = () => {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5107/api';
    const hubUrl = apiBaseUrl.replace(/\/api$/, '') + '/hubs/tasks';

    console.log('[SignalR] Connecting to Task Hub:', hubUrl);

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Слушаем событие создания новой задачи с бэкенда
    connection.on('OnTaskCreated', (task: {
      taskId: string;
      title: string;
      description: string;
      latitude: number;
      longitude: number;
      priceAmount: number;
      currency: string;
      creatorId: string;
      createdAt: string;
    }) => {
      console.log('[SignalR] Live Quest Announcement: OnTaskCreated', task);

      // 1. Мгновенно инвалидируем кэш TanStack Query, чтобы обновить карту и списки квестов
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });

      // 2. Инициируем золотое JRPG-уведомление для пользователя
      addToast({
        title: task.title,
        description: task.description,
        priceAmount: task.priceAmount,
        currency: task.currency,
        creatorId: task.creatorId,
        createdAt: task.createdAt,
        type: 'task_created',
      });
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log('[SignalR] WebSocket handshaked. Connected to real-time Hub successfully.');
      } catch (err) {
        console.error('[SignalR] Error establishing websocket connection:', err);
      }
    };

    startConnection();
    connectionRef.current = connection;

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
        console.log('[SignalR] Connection stopped.');
      }
    };
  }, [queryClient, addToast]);
};
