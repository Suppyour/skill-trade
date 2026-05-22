import React, { useState, useEffect } from 'react';
import { Sliders, Search, Navigation } from 'lucide-react';
import { useGeolocation } from '@/shared/hooks/useGeolocation';
import { taskQueries } from '@/entities/task/api/queries';
import { TaskCard } from '@/entities/task/ui/TaskCard';
import { TaskMapViewer } from '@/widgets/task-map-viewer/ui/TaskMapViewer';

interface SearchNearbyTasksProps {
  onMapClick?: (lat: number, lng: number) => void;
  selectedFormCoords?: { lat: number; lng: number } | null;
}

export const SearchNearbyTasks: React.FC<SearchNearbyTasksProps> = ({
  onMapClick,
  selectedFormCoords
}) => {
  const { coords, error: geoError, loading: geoLoading } = useGeolocation();
  const [radiusKm, setRadiusKm] = useState<number>(10);

  // API Query хук с PostGIS
  const {
    data: tasks,
    isLoading: tasksLoading,
    isFetching: tasksFetching,
    error: tasksError,
  } = taskQueries.useNearbyList(
    {
      latitude: coords?.latitude ?? 0,
      longitude: coords?.longitude ?? 0,
      radiusInMeters: radiusKm * 1000,
    },
    !!coords
  );

  // Слушатель выбора карточки через Яндекс.Карты
  useEffect(() => {
    const handleMapSelectTask = (e: Event) => {
      const taskId = (e as CustomEvent).detail;
      const matchedTask = tasks?.find(t => t.id === taskId);
      if (matchedTask) {
        alert(
          `Сведения о квесте "${matchedTask.title}":\n\n` +
          `Награда: ${matchedTask.price.amount.toLocaleString('ru-RU')} ${matchedTask.price.currency}\n` +
          `Статус: ${matchedTask.status}\n` +
          `Дистанция: ${matchedTask.distanceKm} км\n` +
          `Координаты: [${matchedTask.coords.lat.toFixed(4)}, ${matchedTask.coords.lng.toFixed(4)}]`
        );
      }
    };

    window.addEventListener('map-select-task', handleMapSelectTask);
    return () => {
      window.removeEventListener('map-select-task', handleMapSelectTask);
    };
  }, [tasks]);

  const mapCenter = coords ? { lat: coords.latitude, lng: coords.longitude } : null;

  return (
    <div className="space-y-8 font-serif text-left">
      {/* Секция управления радиусом поиска */}
      <div className="pixel-panel p-6 bg-[#faf6ee] dark:bg-[#1d1813] border-4 shadow-md">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-3.5 shrink-0 w-full md:w-auto">
            <div className="p-2 border-3 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] text-[#2e241c] rounded-xl shadow-[2px_2px_0_0_#2e241c] shrink-0">
              <Sliders className="w-5 h-5 animate-pixel-bounce" />
            </div>
            <div>
              <h4 className="font-serif font-black text-lg text-[#2e241c] dark:text-[#ede4d8]">Дальность Поиска 🌾</h4>
              <p className="text-[10px] text-slate-550 dark:text-slate-400 font-sans tracking-wide uppercase">Радиус обнаружения квестов</p>
            </div>
          </div>

          {/* Ползунок в стиле retro progress bar */}
          <div className="flex-1 w-full space-y-2">
            <div className="flex items-center justify-between text-[10px] font-sans font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <span>Радиус обзора</span>
              <span className="text-[#7ca656] dark:text-[#84cc16] font-serif font-black text-xs bg-[#ebdcc8] dark:bg-[#2c241c] px-2 py-0.5 border-2 border-[#2e241c] dark:border-[#ede4d8] rounded-md">{radiusKm} КМ 🌳</span>
            </div>
            <input
              type="range"
              min={1}
              max={50}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full h-3.5 bg-[#ebdcc8] dark:bg-[#2c241c] border-3 border-[#2e241c] dark:border-[#ede4d8] rounded-md appearance-none cursor-pointer outline-none"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 text-[10px] font-sans font-black uppercase tracking-wider px-3.5 py-2 border-3 border-[#2e241c] dark:border-[#ede4d8] bg-[#bf8d5c] text-[#2e241c] dark:text-white rounded-lg shadow-[2px_2px_0_0_#2e241c] dark:shadow-none">
            <Navigation className="w-3.5 h-3.5 text-[#2e241c] dark:text-white animate-pulse" />
            <span>
              {geoLoading ? 'GPS...' : coords ? `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}` : 'Позиция: Н/Д'}
            </span>
          </div>
        </div>
      </div>

      {/* Ошибки геолокации */}
      {geoError && (
        <div className="p-4 border-3 border-rose-650 bg-rose-50 dark:bg-[#1d1813] text-rose-700 dark:text-rose-455 text-xs font-black animate-shake rounded-md">
          ⚠️ Компас GPS сбился: {geoError.message}
        </div>
      )}

      {/* Интерактивный виджет Яндекс.Карты */}
      <div className="border-4 border-[#2e241c] dark:border-[#ede4d8] rounded-xl overflow-hidden shadow-md">
        <TaskMapViewer
          center={mapCenter}
          radiusInMeters={radiusKm * 1000}
          tasks={tasks}
          onMapClick={onMapClick}
          selectedFormCoords={selectedFormCoords}
        />
      </div>

      {/* Заголовки ленты */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-[#7ca656] dark:text-[#84cc16]" />
          <h2 className="font-serif font-black text-2xl text-[#2e241c] dark:text-[#ede4d8]">
            Доска Квестов Рядом <span className="font-serif italic font-normal text-slate-500 dark:text-slate-400">({tasks?.length ?? 0})</span>
          </h2>
        </div>
        {tasksFetching && (
          <span className="text-[10px] font-sans font-black text-[#7ca656] dark:text-[#84cc16] animate-pulse uppercase tracking-wider">Синхронизируем свитки...</span>
        )}
      </div>

      {/* Сетевые ошибки */}
      {tasksError && (
        <div className="p-5 border-3 border-rose-650 bg-rose-50 dark:bg-[#1d1813] text-rose-700 dark:text-rose-400 text-xs font-black rounded-md">
          Ошибка связи: Не удалось подключиться к таверне API. Убедитесь, что сервер бэкенда (Scalar) запущен.
        </div>
      )}

      {/* Скелетоны */}
      {tasksLoading && (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 bg-[#ebdcc8]/30 dark:bg-[#2c241c]/30 border-3 border-[#2e241c] dark:border-[#ede4d8] rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Пустое состояние */}
      {tasks && tasks.length === 0 && (
        <div className="text-center py-16 pixel-panel bg-[#faf6ee] dark:bg-[#1d1813] border-4 border-dashed border-[#2e241c] dark:border-[#ede4d8] rounded-xl">
          <p className="text-slate-500 dark:text-slate-400 text-lg font-black">Нет квестов в радиусе {radiusKm} км 📭</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Создайте первое поручение на карте или увеличьте радиус обзора!</p>
        </div>
      )}

      {/* Список квестов */}
      <div className="grid gap-6 md:grid-cols-2">
        {tasks?.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => alert(`Просмотр сведений о квесте "${task.title}" (ID: ${task.id})`)}
          />
        ))}
      </div>
    </div>
  );
};
