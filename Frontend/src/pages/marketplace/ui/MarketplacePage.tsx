import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuthStore } from '../../../entities/user/model/authStore';
import { CreateTaskForm } from '../../../features/create-task/ui/CreateTaskForm';
import { SearchNearbyTasks } from '../../../features/search-nearby-tasks/ui/SearchNearbyTasks';

export const MarketplacePage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthStore();
  
  // Состояние выбранных на карте координат
  const [mapSelectedCoords, setMapSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Защита роута
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, isAuthLoading, navigate]);

  if (isAuthLoading || !isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#faf6ee] dark:bg-[#15110d] text-[#2e241c] dark:text-[#ede4d8]">
        <img
          src="/favicon.svg"
          alt="Loading Sprout"
          className="w-12 h-12 object-contain animate-pixel-bounce mb-4"
          style={{ imageRendering: 'pixelated' }}
        />
        <span className="text-xs font-serif font-black">Сверяем списки гильдии... 📜</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#faf6ee] dark:bg-[#15110d] text-[#2e241c] dark:text-[#ede4d8] min-h-screen">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Информационный JRPG заголовок */}
        <div className="mb-10 text-center sm:text-left space-y-3 relative">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 border-3 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] text-[#2e241c] rounded-xl shadow-[3px_3px_0_0_#2e241c] shrink-0">
              <Compass className="w-8 h-8 shrink-0 animate-spin" style={{ animationDuration: '20s' }} />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-serif font-black tracking-tight text-[#2e241c] dark:text-[#ede4d8]">
                Соседская Таверна Квестов 🗺️
              </h1>
              <span className="text-[9px] font-sans font-black tracking-widest uppercase text-[#7ca656] dark:text-[#84cc16]">
                Панель управления героя
              </span>
            </div>
          </div>
          <p className="text-xs md:text-sm font-serif text-slate-750 dark:text-slate-350 max-w-3xl leading-relaxed pt-1">
            Используйте высокопроизводительную локальную магию PostGIS. Кликните по интерактивной Яндекс.Карте, чтобы автоматически настроить координаты WGS-84 и передать их в свиток публикации нового квеста.
          </p>
        </div>

        {/* Сетка макета */}
        <div className="grid gap-8 lg:grid-cols-3 items-start">
          
          {/* Левая колонка - Форма публикации */}
          <div className="lg:col-span-1 lg:sticky lg:top-24">
            <CreateTaskForm 
              selectedCoords={mapSelectedCoords}
              onCoordsChange={setMapSelectedCoords}
            />
          </div>

          {/* Правая колонка - Карта и Поиск */}
          <div className="lg:col-span-2">
            <SearchNearbyTasks 
              selectedFormCoords={mapSelectedCoords}
              onMapClick={(lat, lng) => setMapSelectedCoords({ lat, lng })}
            />
          </div>

        </div>
      </main>
    </div>
  );
};
