import React, { useState, useEffect } from 'react';
import { LoginForm } from '../../../features/auth/ui/LoginForm';
import { RegisterForm } from '../../../features/auth/ui/RegisterForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialTab = 'login' }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [isRendered, setIsRendered] = useState(isOpen);

  // Синхронизация открытия и плавных анимаций
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      document.body.style.overflow = 'hidden'; // Запрет скролла при открытом модальном окне
    } else {
      const timer = setTimeout(() => setIsRendered(false), 200);
      document.body.style.overflow = 'unset';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Затемняющий задний фон в пиксельном/уютном полумраке таверны */}
      <div
        className="absolute inset-0 bg-[#16120e]/80 dark:bg-black/90 backdrop-blur-md cursor-pointer transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Окно формы (Премиальная ретро JRPG панель) */}
      <div
        className={`relative w-full max-w-md pixel-panel p-6 shadow-2xl transition-all duration-300 z-10 text-left ${
          isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
        }`}
      >
        {/* Кнопка закрытия - Ретро квадратный крестик */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 w-8 h-8 flex items-center justify-center pixel-button pixel-button-secondary p-0 text-sm cursor-pointer"
        >
          ✕
        </button>

        {/* Логотип бренда - Pixel Sprout */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="p-1 border-2 border-[#2e241c] dark:border-[#ede4d8] rounded-xl bg-[#863bff]/10 flex items-center justify-center w-10 h-10">
            <img
              src="/favicon.svg"
              alt="SkillSwap Sprout Logo"
              className="w-7 h-7 object-contain animate-pixel-bounce"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg tracking-tight text-[#2e241c] dark:text-[#ede4d8] leading-none">
              SkillSwap 🌿
            </span>
            <span className="text-[8px] font-sans font-black tracking-widest text-[#7ca656] dark:text-[#84cc16] uppercase mt-0.5">
              Вход в Гильдию
            </span>
          </div>
        </div>

        {/* Заголовок свитка */}
        <div className="space-y-1.5 mb-6">
          <h2 className="text-2xl font-serif font-black text-[#2e241c] dark:text-[#ede4d8] tracking-tight leading-none">
            {activeTab === 'login' ? (
              <span>С возвращением <span className="italic font-normal text-[#7ca656]">в таверну!</span> 🏡</span>
            ) : (
              <span>Записать <span className="italic font-normal text-[#7ca656]">нового героя!</span> 📝</span>
            )}
          </h2>
          <p className="text-[11px] text-slate-550 dark:text-slate-400 font-serif">
            {activeTab === 'login'
              ? 'Авторизуйтесь в журнале, чтобы брать квесты поблизости.'
              : 'Введите данные о своём герое для вступления в гильдию.'}
          </p>
        </div>

        {/* Табы выбора действия в стиле JRPG */}
        <div className="relative flex gap-2 mb-6 font-sans font-bold text-xs uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 text-center border-3 transition-colors cursor-pointer rounded-lg ${
              activeTab === 'login'
                ? 'bg-[#ffd875] text-[#2e241c] border-[#2e241c] shadow-[inset_-3px_-3px_0_0_#dca626]'
                : 'bg-[#faf6ee] dark:bg-[#15110d] text-[#8c7b6e] border-[#bcaea2] hover:bg-[#ebdcc8]/50 dark:hover:bg-[#2c241c]/50'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 text-center border-3 transition-colors cursor-pointer rounded-lg ${
              activeTab === 'register'
                ? 'bg-[#ffd875] text-[#2e241c] border-[#2e241c] shadow-[inset_-3px_-3px_0_0_#dca626]'
                : 'bg-[#faf6ee] dark:bg-[#15110d] text-[#8c7b6e] border-[#bcaea2] hover:bg-[#ebdcc8]/50 dark:hover:bg-[#2c241c]/50'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Контент формы с плавным рендером */}
        <div className="font-sans">
          {activeTab === 'login' ? (
            <LoginForm onSuccess={onClose} />
          ) : (
            <RegisterForm onSuccess={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};
