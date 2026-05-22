import React from 'react';
import { ShieldCheck, Star } from 'lucide-react';
import type { Task } from '../model/types';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

// Предопределенные аватары и имена для воссоздания уютного ретро-стиля
const MOCK_PROFILES: Record<string, { name: string; rating: string; avatarUrl: string; label: string }> = {
  active: {
    name: 'Валентин 🧔',
    rating: '5.0',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    label: 'Мастер 🛠️'
  },
  'in-progress': {
    name: 'Илона 👩‍🌾',
    rating: '5.0',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    label: 'Гильдия 🌿'
  },
  completed: {
    name: 'Алия 🧙‍♀️',
    rating: '4.9',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=100',
    label: 'Легенда 🏆'
  },
  cancelled: {
    name: 'Марат 🧑‍🚀',
    rating: '4.7',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    label: 'Новичок 🌾'
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const profile = MOCK_PROFILES[task.status] || MOCK_PROFILES.active;

  return (
    <div
      onClick={onClick}
      className="group relative flex flex-col justify-between p-5 pixel-panel bg-[#faf6ee] dark:bg-[#1d1813] border-4 transition-all duration-300 cursor-pointer overflow-hidden text-left"
    >
      <div className="space-y-4">
        {/* Хэдер: Аватар, Имя, Рейтинг */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative shrink-0">
              {/* Квадратный ретро аватар */}
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-10 h-10 border-3 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] object-cover"
                style={{ imageRendering: 'pixelated' }}
              />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#2e241c] dark:border-[#ede4d8]" />
            </div>
            <div>
              <h5 className="font-serif font-black text-sm text-[#2e241c] dark:text-[#ede4d8] leading-tight group-hover:text-[#7ca656] dark:group-hover:text-[#84cc16] transition-colors duration-300">
                {profile.name}
              </h5>
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-[#ffd875] text-[#2e241c]" />
                <span className="text-[11px] font-bold text-[#2e241c] dark:text-[#ede4d8] leading-none">
                  {profile.rating}
                </span>
                <span className="text-[8px] font-sans font-black uppercase tracking-wider text-[#7ca656] dark:text-[#84cc16] bg-[#7ca656]/10 px-1.5 py-0.5 rounded-md ml-1 shadow-[1px_1px_0_0_#2e241c] dark:shadow-none">
                  {profile.label}
                </span>
              </div>
            </div>
          </div>

          {/* Премиальный ретро-бейдж верификации */}
          <div className="flex items-center gap-1 border-2 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] text-[#2e241c] text-[8px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-[2px_2px_0_0_#2e241c] dark:shadow-none shrink-0">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>ПИНВЕРИФЕД</span>
          </div>
        </div>

        {/* Заголовок квеста и Бюджет */}
        <div className="space-y-2.5 pt-1">
          <h3 className="font-serif font-black text-lg text-[#2e241c] dark:text-[#ede4d8] leading-snug group-hover:translate-x-0.5 transition-transform duration-300">
            {task.title}
          </h3>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl font-serif font-black text-[#7ca656] dark:text-[#84cc16]">
              {task.price.amount.toLocaleString('ru-RU')}
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#2e241c] dark:text-[#ede4d8] bg-[#ebdcc8] dark:bg-[#2c241c] px-2 py-0.5 rounded-md border-2 border-[#2e241c] dark:border-[#ede4d8]">
              {task.price.currency === 'RUB' ? 'ЗОЛОТА 🪙' : task.price.currency}
            </span>
          </div>

          <div className="text-[11px] font-serif text-slate-655 dark:text-slate-400 space-y-0.5 border-t-2 border-dashed border-[#2e241c] dark:border-[#ede4d8] pt-2">
            <p>📍 Расстояние: {task.distanceKm} км от вас</p>
            <p className="font-mono text-[9px] tracking-wide text-slate-500 dark:text-slate-500 mt-1">[{task.coords.lat.toFixed(4)}, {task.coords.lng.toFixed(4)}]</p>
          </div>
        </div>
      </div>

      {/* Кнопки JRPG Принять/Отклонить */}
      <div className="grid grid-cols-2 gap-3 mt-5 pt-3.5 border-t-2 border-dashed border-[#2e241c] dark:border-[#ede4d8]">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Квест отклонён: ${task.title}`);
          }}
          className="pixel-button pixel-button-secondary text-[10px] py-2 px-1"
        >
          Пропустить ✕
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            alert(`Квест принят в журнал! Награда: ${task.price.amount} золотых!`);
          }}
          className="pixel-button pixel-button-green text-[10px] py-2 px-1"
        >
          Взять квест ⚔️
        </button>
      </div>
    </div>
  );
};
