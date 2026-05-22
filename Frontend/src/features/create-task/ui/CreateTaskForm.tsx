import React, { useState, useEffect } from 'react';
import { PlusCircle, Loader2, Check } from 'lucide-react';
import { useGeolocation } from '@/shared/hooks/useGeolocation';
import { taskQueries } from '@/entities/task/api/queries';

interface CreateTaskFormProps {
  selectedCoords?: { lat: number; lng: number } | null;
  onCoordsChange?: (coords: { lat: number; lng: number } | null) => void;
}

export const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ selectedCoords, onCoordsChange }) => {
  const { coords } = useGeolocation();
  const createTaskMutation = taskQueries.useCreateTaskMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(500);
  const [currency, setCurrency] = useState('RUB');
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [success, setSuccess] = useState(false);

  // Синхронизация координат карты с локальной формой
  useEffect(() => {
    if (selectedCoords) {
      setLat(selectedCoords.lat);
      setLng(selectedCoords.lng);
    }
  }, [selectedCoords]);

  const handleLatChange = (value: number) => {
    setLat(value);
    if (onCoordsChange) {
      onCoordsChange({ lat: value, lng });
    }
  };

  const handleLngChange = (value: number) => {
    setLng(value);
    if (onCoordsChange) {
      onCoordsChange({ lat, lng: value });
    }
  };

  const useCurrentGps = () => {
    if (coords) {
      const newLat = coords.latitude;
      const newLng = coords.longitude;
      setLat(newLat);
      setLng(newLng);
      if (onCoordsChange) {
        onCoordsChange({ lat: newLat, lng: newLng });
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Заполните обязательные поля');
      return;
    }

    const finalLat = lat || (coords?.latitude ?? 55.7558);
    const finalLng = lng || (coords?.longitude ?? 37.6173);

    createTaskMutation.mutate(
      {
        title,
        description,
        priceAmount: price,
        currency,
        latitude: finalLat,
        longitude: finalLng,
        creatorId: 'd820d867-b8f9-43c3-888e-49b8219c623a',
      },
      {
        onSuccess: () => {
          setSuccess(true);
          setTitle('');
          setDescription('');
          setPrice(500);
          setLat(0);
          setLng(0);
          if (onCoordsChange) {
            onCoordsChange(null);
          }
          setTimeout(() => setSuccess(false), 3000);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="pixel-panel p-6 bg-[#faf6ee] dark:bg-[#1d1813] border-4 space-y-5 text-left font-serif">
      <div className="flex items-center gap-3.5">
        <div className="p-2 border-3 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] text-[#2e241c] rounded-xl shadow-[2px_2px_0_0_#2e241c] shrink-0">
          <PlusCircle className="w-5 h-5 animate-pixel-bounce" />
        </div>
        <div>
          <h4 className="font-serif font-black text-lg text-[#2e241c] dark:text-[#ede4d8]">Записать Квест 📜</h4>
          <p className="text-[10px] text-slate-550 dark:text-slate-400 font-sans tracking-wide uppercase">Опубликовать новое поручение</p>
        </div>
      </div>

      <div className="space-y-4 font-sans text-xs">
        {/* Заголовок */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
            Название Квеста *
          </label>
          <input
            type="text"
            required
            placeholder="Например: Полив рассады тыквы 🎃"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full pixel-input py-2.5 px-4 text-sm font-serif"
          />
        </div>

        {/* Описание */}
        <div className="space-y-1.5 text-left">
          <label className="text-[10px] font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
            Свиток с Описанием *
          </label>
          <textarea
            required
            rows={3}
            placeholder="Опишите суть задания, требования к герою и сроки..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full pixel-input py-2.5 px-4 text-sm font-serif resize-none"
          />
        </div>

        {/* Стоимость и Валюта */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
              Награда
            </label>
            <input
              type="number"
              min={1}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full pixel-input py-2.5 px-4 text-sm font-serif"
            />
          </div>
          <div className="space-y-1.5 text-left">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
              Валюта
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full pixel-input py-2.5 pl-4 pr-8 text-sm font-serif cursor-pointer appearance-none"
              >
                <option value="RUB">ЗОЛОТО (₽)</option>
                <option value="USD">БАКСЫ ($)</option>
                <option value="EUR">ЕВРО (€)</option>
              </select>
              <div className="absolute right-4.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#2e241c] dark:text-[#ede4d8] text-xs">▼</div>
            </div>
          </div>
        </div>

        {/* Гео-координаты */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <label className="text-[10px] font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block">
              Координаты WGS-84
            </label>
            <button
              type="button"
              onClick={useCurrentGps}
              className="pixel-button pixel-button-secondary text-[8px] py-1 px-2.5 uppercase font-sans font-black"
            >
              Компас GPS 🧭
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="any"
              placeholder={coords ? `Широта: ${coords.latitude.toFixed(4)}` : "Широта (Lat)"}
              value={lat || ''}
              onChange={(e) => handleLatChange(Number(e.target.value))}
              className="w-full pixel-input py-2.5 px-4 text-sm font-serif"
            />
            <input
              type="number"
              step="any"
              placeholder={coords ? `Долгота: ${coords.longitude.toFixed(4)}` : "Долгота (Lng)"}
              value={lng || ''}
              onChange={(e) => handleLngChange(Number(e.target.value))}
              className="w-full pixel-input py-2.5 px-4 text-sm font-serif"
            />
          </div>
        </div>
      </div>

      {/* Кнопка отправки */}
      <button
        type="submit"
        disabled={createTaskMutation.isPending || success}
        className="w-full pixel-button pixel-button-green text-xs"
      >
        {createTaskMutation.isPending ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Пишем свиток...</span>
          </>
        ) : success ? (
          <>
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Квест Опубликован!</span>
          </>
        ) : (
          <span>Развесить На Доске 📢</span>
        )}
      </button>

      {createTaskMutation.isError && (
        <div className="text-[10px] font-black text-rose-500 uppercase tracking-widest text-center mt-2 animate-shake">
          Ошибка свитка: {(createTaskMutation.error as any)?.response?.data?.error || createTaskMutation.error.message}
        </div>
      )}
    </form>
  );
};
