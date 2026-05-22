import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, User as UserIcon, LogIn, Sparkles, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../../entities/user/model/authStore';
import { AuthModal } from '../../auth-modal/ui/AuthModal';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthStore();
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleOpenAuth = (tab: 'login' | 'register') => {
    setModalTab(tab);
    setIsAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const isLanding = location.pathname === '/';
  const isMarketplace = location.pathname === '/app';

  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf6ee]/90 dark:bg-[#15110d]/95 backdrop-blur-md transition-all duration-300 pb-3.5 relative border-b-2 border-[#2e241c] dark:border-[#ede4d8]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Логотип с милым 8-битным ростком из favicon.svg */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 cursor-pointer select-none group"
        >
          <div className="p-1 bg-[#863bff]/10 border-2 border-[#2e241c] dark:border-[#ede4d8] rounded-xl group-hover:scale-105 transition-all duration-300 flex items-center justify-center w-10 h-10">
            <img 
              src="/favicon.svg" 
              alt="SkillSwap Sprout Logo" 
              className="w-7 h-7 object-contain"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-black text-lg tracking-tight text-[#2e241c] dark:text-[#ede4d8] leading-none flex items-center gap-1">
              SkillSwap <span className="text-xs">🌿</span>
            </span>
            <span className="text-[8px] font-sans font-bold tracking-widest text-[#7ca656] dark:text-[#84cc16] uppercase mt-0.5">
              Cozy Pixel Hub
            </span>
          </div>
        </div>

        {/* Навигация - JRPG Меню Вкладки */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className={`pixel-button ${
              isLanding
                ? 'pixel-button-green'
                : 'pixel-button-secondary'
            }`}
          >
            Главная 🏡
          </button>
          <button
            onClick={() => navigate('/app')}
            className={`pixel-button ${
              isMarketplace
                ? 'pixel-button-green'
                : 'pixel-button-secondary'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            Биржа Услуг 🌻
          </button>
        </nav>

        {/* Правый блок авторизации / Личного кабинета */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated && user ? (
            /* Авторизованный пользователь */
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2.5 p-1 px-3 border-2 border-[#2e241c] dark:border-[#ede4d8] rounded-lg bg-[#faf6ee] dark:bg-[#1d1813] hover:bg-[#ebdcc8]/50 dark:hover:bg-[#2c241c]/50 transition-all cursor-pointer select-none"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-7 h-7 rounded-md object-cover border-2 border-[#2e241c] dark:border-[#ede4d8] shadow-sm"
                />
                <div className="flex flex-col items-start leading-none text-left">
                  <span className="text-xs font-bold text-[#2e241c] dark:text-[#ede4d8] font-serif">
                    {user.name}
                  </span>
                  <span className="text-[8px] font-sans font-bold text-slate-500 dark:text-slate-450 tracking-wider uppercase mt-0.5">
                    {user.role === 'worker' ? 'Исполнитель 🛠️' : 'Заказчик 📝'}
                  </span>
                </div>
              </button>

              {/* Выпадающий список */}
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10 cursor-default" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 pixel-panel py-2 animate-fade-in z-20 text-left">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate('/app');
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold font-serif text-slate-700 dark:text-slate-200 hover:bg-[#ebdcc8]/40 dark:hover:bg-[#2c241c]/40 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                      Панель управления
                    </button>
                    <div className="border-t border-[#2e241c] dark:border-[#ede4d8] my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold font-serif text-red-650 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-950/20 flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Неавторизованный пользователь */
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleOpenAuth('login')}
                className="flex items-center gap-2 text-xs font-bold font-serif text-[#2e241c] dark:text-[#ede4d8] hover:text-[#7ca656] dark:hover:text-[#84cc16] py-2 px-4 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Войти
              </button>
              <button
                onClick={() => handleOpenAuth('register')}
                className="pixel-button pixel-button-green"
              >
                <UserIcon className="w-3.5 h-3.5" />
                Регистрация
              </button>
            </div>
          )}
        </div>

        {/* Кнопка мобильного меню */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex md:hidden p-2 border-2 border-[#2e241c] dark:border-[#ede4d8] rounded-lg bg-[#faf6ee] dark:bg-[#1d1813] text-[#2e241c] dark:text-[#ede4d8] cursor-pointer"
        >
          {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

      </div>

      {/* Мобильное меню навигации */}
      {isMobileMenuOpen && (
        <div className="md:hidden w-full border-t border-[#2e241c] dark:border-[#ede4d8] bg-[#faf6ee] dark:bg-[#15110d] py-4 px-6 space-y-4 animate-fade-in text-left">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                navigate('/');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-4 rounded-lg text-left text-xs font-bold font-serif transition-all cursor-pointer ${
                isLanding
                  ? 'bg-[#7ca656] text-white'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-[#ebdcc8]/30 dark:hover:bg-[#2c241c]/30'
              }`}
            >
              Главная 🏡
            </button>
            <button
              onClick={() => {
                navigate('/app');
                setIsMobileMenuOpen(false);
              }}
              className={`w-full py-2.5 px-4 rounded-lg text-left text-xs font-bold font-serif transition-all cursor-pointer flex items-center gap-2 ${
                isMarketplace
                  ? 'bg-[#7ca656] text-white'
                  : 'text-slate-600 dark:text-slate-350 hover:bg-[#ebdcc8]/30 dark:hover:bg-[#2c241c]/30'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#7ca656]" />
              Биржа Услуг 🌻
            </button>
          </div>

          <div className="border-t border-[#2e241c] dark:border-[#ede4d8] pt-4">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-md object-cover border-2 border-[#2e241c] dark:border-[#ede4d8]"
                  />
                  <div className="flex flex-col leading-none">
                    <span className="text-sm font-bold text-[#2e241c] dark:text-[#ede4d8] font-serif">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-sans font-bold text-slate-500 dark:text-slate-450 mt-1 uppercase tracking-wide">
                      {user.role === 'worker' ? 'Исполнитель 🛠️' : 'Заказчик 📝'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 bg-red-100 hover:bg-red-200 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 rounded-lg font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all border-2 border-[#2e241c] dark:border-red-900"
                >
                  <LogOut className="w-4 h-4" />
                  Выйти из аккаунта
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="w-full py-2.5 px-4 text-center rounded-lg text-xs font-bold font-serif border-2 border-[#2e241c] dark:border-[#ede4d8] text-[#2e241c] dark:text-[#ede4d8] cursor-pointer"
                >
                  Войти
                </button>
                <button
                  onClick={() => handleOpenAuth('register')}
                  className="w-full py-2.5 px-4 text-center rounded-lg text-xs font-bold bg-[#7ca656] text-white border-2 border-[#2e241c] dark:border-[#ede4d8] cursor-pointer shadow-sm"
                >
                  Регистрация
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={modalTab}
      />

      {/* 8-битная лоза снизу шапки */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2.5 bg-repeat-x pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='10' viewBox='0 0 32 10'%3E%3Crect x='0' y='4' width='32' height='2' fill='%233e612c'/%3E%3Crect x='6' y='6' width='2' height='2' fill='%235a823e'/%3E%3Crect x='8' y='6' width='4' height='2' fill='%237ca656'/%3E%3Crect x='8' y='8' width='2' height='2' fill='%235a823e'/%3E%3Crect x='10' y='6' width='2' height='2' fill='%23a3cb7c'/%3E%3Crect x='20' y='2' width='4' height='2' fill='%237ca656'/%3E%3Crect x='22' y='0' width='2' height='2' fill='%23a3cb7c'/%3E%3Crect x='20' y='2' width='2' height='2' fill='%235a823e'/%3E%3Crect x='20' y='4' width='2' height='2' fill='%233e612c'/%3E%3C/svg%3E")`,
          imageRendering: 'pixelated',
          backgroundSize: '32px 10px'
        }}
      />
    </header>
  );
};
