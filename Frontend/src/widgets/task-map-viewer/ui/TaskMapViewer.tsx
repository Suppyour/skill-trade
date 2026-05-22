import React, { useEffect, useRef, useState } from 'react';
import { Loader2, AlertTriangle, MapPin } from 'lucide-react';
import type { Task } from '@/entities/task/model/types';

// Динамический синглтон-загрузчик Yandex Maps v2.1 (без ключа для localhost)
let ymapsPromise: Promise<any> | null = null;

const loadYandexMaps = (): Promise<any> => {
  if (ymapsPromise) return ymapsPromise;

  ymapsPromise = new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && (window as any).ymaps) {
      resolve((window as any).ymaps);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api-maps.yandex.ru/2.1/?lang=ru_RU&apikey=';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = () => {
      const ymaps = (window as any).ymaps;
      ymaps.ready(() => resolve(ymaps));
    };
    script.onerror = (err) => reject(err);
    document.body.appendChild(script);
  });

  return ymapsPromise;
};

interface TaskMapViewerProps {
  center: { lat: number; lng: number } | null;
  radiusInMeters: number;
  tasks: Task[] | undefined;
  onMapClick?: (lat: number, lng: number) => void;
  selectedFormCoords?: { lat: number; lng: number } | null;
}

export const TaskMapViewer: React.FC<TaskMapViewerProps> = ({
  center,
  radiusInMeters,
  tasks,
  onMapClick,
  selectedFormCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ymaps, setYmaps] = useState<any>(null);

  // Ссылки на внутренние объекты YMaps для реактивного обновления без перерисовки карты
  const mapRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const placemarksRef = useRef<Map<string, any>>(new Map());
  const selectedPinRef = useRef<any>(null);

  // 1. Инициализация YMaps API
  useEffect(() => {
    loadYandexMaps()
      .then((loadedYmaps) => {
        setYmaps(loadedYmaps);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки Яндекс.Карт:', err);
        setError('Не удалось загрузить Яндекс.Карты. Проверьте интернет-соединение.');
        setLoading(false);
      });
  }, []);

  // 2. Создание инстанса карты
  useEffect(() => {
    if (!ymaps || !mapContainerRef.current || mapRef.current) return;

    const defaultCenter = center ? [center.lat, center.lng] : [55.7558, 37.6173]; // Москва по умолчанию

    try {
      const map = new ymaps.Map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
      }, {
        searchControlProvider: 'yandex#search'
      });

      // Слушатель клика по карте для выбора координат публикации
      if (onMapClick) {
        map.events.add('click', (e: any) => {
          const coords = e.get('coords');
          onMapClick(coords[0], coords[1]);
        });
      }

      mapRef.current = map;
    } catch (err) {
      console.error('Ошибка создания карты YMaps:', err);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [ymaps]);

  // 3. Синхронизация центра карты при получении GPS
  useEffect(() => {
    if (!mapRef.current || !center) return;
    mapRef.current.setCenter([center.lat, center.lng], mapRef.current.getZoom(), {
      duration: 300
    });
  }, [center]);

  // 4. Синхронизация круга радиуса поиска
  useEffect(() => {
    if (!ymaps || !mapRef.current) return;

    const map = mapRef.current;
    const circleCenter = center ? [center.lat, center.lng] : null;

    if (!circleCenter) {
      if (circleRef.current) {
        map.geoObjects.remove(circleRef.current);
        circleRef.current = null;
      }
      return;
    }

    if (circleRef.current) {
      // Обновляем координаты и радиус существующего круга
      circleRef.current.geometry.setCoordinates(circleCenter);
      circleRef.current.geometry.setRadius(radiusInMeters);
    } else {
      // Создаем новый круг радиуса
      const circle = new ymaps.Circle([circleCenter, radiusInMeters], {}, {
        fillColor: 'rgba(15, 98, 254, 0.08)',
        strokeColor: '#0f62fe',
        strokeOpacity: 0.5,
        strokeWidth: 2,
        coordSystem: ymaps.coordSystem.geo
      });

      map.geoObjects.add(circle);
      circleRef.current = circle;
    }
  }, [ymaps, center, radiusInMeters]);

  // 5. Синхронизация пина, выбранного в форме создания задачи
  useEffect(() => {
    if (!ymaps || !mapRef.current) return;

    const map = mapRef.current;

    if (!selectedFormCoords) {
      if (selectedPinRef.current) {
        map.geoObjects.remove(selectedPinRef.current);
        selectedPinRef.current = null;
      }
      return;
    }

    const pinPos = [selectedFormCoords.lat, selectedFormCoords.lng];

    if (selectedPinRef.current) {
      selectedPinRef.current.geometry.setCoordinates(pinPos);
    } else {
      const pin = new ymaps.Placemark(pinPos, {
        iconContent: '📍',
        balloonContent: '<strong>Локация нового заказа</strong><br/>Координаты будут переданы в форму публикации.'
      }, {
        preset: 'islands#violetStretchyIcon',
        draggable: true
      });

      // Перетаскивание пина обновляет координаты в форме!
      pin.events.add('dragend', () => {
        const newCoords = pin.geometry.getCoordinates();
        if (onMapClick) {
          onMapClick(newCoords[0], newCoords[1]);
        }
      });

      map.geoObjects.add(pin);
      selectedPinRef.current = pin;
    }
  }, [ymaps, selectedFormCoords]);

  // 6. Синхронизация маркеров задач
  useEffect(() => {
    if (!ymaps || !mapRef.current) return;

    const map = mapRef.current;
    const currentTasks = tasks || [];
    const currentTaskIds = new Set(currentTasks.map(t => t.id));

    // А) Удаляем маркеры задач, которых больше нет в списке
    placemarksRef.current.forEach((placemark, taskId) => {
      if (!currentTaskIds.has(taskId)) {
        map.geoObjects.remove(placemark);
        placemarksRef.current.delete(taskId);
      }
    });

    // Б) Добавляем или обновляем маркеры для текущих задач
    currentTasks.forEach((task) => {
      const taskPos = [task.coords.lat, task.coords.lng];

      if (placemarksRef.current.has(task.id)) {
        const placemark = placemarksRef.current.get(task.id);
        placemark.geometry.setCoordinates(taskPos);
      } else {
        const placemark = new ymaps.Placemark(taskPos, {
          hintContent: task.title,
          balloonContent: `
            <div style="font-family: sans-serif; padding: 4px; min-width: 150px;">
              <h4 style="margin: 0 0 6px 0; font-weight: bold; font-size: 14px; color: #1e293b;">${task.title}</h4>
              <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 600; color: #0f62fe;">
                ${task.price.amount.toLocaleString('ru-RU')} ${task.price.currency}
              </p>
              <div style="font-size: 11px; color: #64748b; margin-bottom: 8px;">
                Дистанция: ${task.distanceKm} км
              </div>
              <button 
                onclick="window.dispatchEvent(new CustomEvent('map-select-task', { detail: '${task.id}' }))"
                style="width: 100%; border: none; background: #0f62fe; color: white; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer; text-align: center;"
              >
                Подробнее
              </button>
            </div>
          `
        }, {
          preset: 'islands#blueCircleDotIconWithContent',
          iconColor: '#0f62fe'
        });

        map.geoObjects.add(placemark);
        placemarksRef.current.set(task.id, placemark);
      }
    });
  }, [ymaps, tasks]);

  return (
    <div className="relative w-full h-[400px] rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-md bg-slate-50 dark:bg-slate-900/10 overflow-hidden group">
      {/* Контейнер самой Яндекс.Карты */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Лоадер */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/90 dark:bg-slate-950/90 backdrop-blur-xs z-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Загрузка Яндекс.Карт...</span>
        </div>
      )}

      {/* Ошибка */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-950 text-center z-50">
          <AlertTriangle className="w-10 h-10 text-amber-500 mb-3 animate-bounce" />
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-sm">{error}</p>
        </div>
      )}

      {/* Инструкция на карте */}
      {!loading && !error && (
        <div className="absolute bottom-4 left-4 right-4 md:right-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 pointer-events-none transition-all duration-300 group-hover:translate-y-0 translate-y-1">
          <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Кликните на карту, чтобы установить место публикации новой задачи.</span>
        </div>
      )}
    </div>
  );
};
