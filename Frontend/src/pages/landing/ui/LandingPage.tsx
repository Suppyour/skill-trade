import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Sparkles,
  CheckCircle,
  Laptop,
  Wrench,
  GraduationCap,
  Truck,
  Camera,
  Sprout,
  Database
} from 'lucide-react';
import { useAuthStore } from '../../../entities/user/model/authStore';
import { AuthModal } from '../../../widgets/auth-modal/ui/AuthModal';

type CategoryKey = 'it' | 'repair' | 'tutor' | 'delivery' | 'cleaning' | 'design' | 'garden';

interface CategoryConfig {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  activeTask: {
    title: string;
    budget: string;
    distance: string;
    client: string;
    avatar: string;
    status: string;
  };
  coords: { x: number; y: number };
}

const categoryDetails: Record<CategoryKey, CategoryConfig> = {
  it: {
    title: 'IT & Настройка техники 💻',
    description: 'От развертывания веб-приложений до чистки ноутбуков и настройки Wi-Fi роутеров прямо в вашем районе.',
    icon: Laptop,
    color: '#3b82f6',
    activeTask: {
      title: 'Настроить HTTPS и Nginx на VPS для 3x-ui',
      budget: '3 500 ₽',
      distance: '450 м от вас',
      client: 'Иван К.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
      status: 'Выполняется 🌿',
    },
    coords: { x: 82, y: 50 }
  },
  repair: {
    title: 'Ремонт & Мастер на час 🛠️',
    description: 'Услуги опытных электриков, надежных сантехников и домашних мастеров. Устранение неполадок за считанные минуты.',
    icon: Wrench,
    color: '#bf8d5c',
    activeTask: {
      title: 'Установить 4 розетки и новый выключатель',
      budget: '2 000 ₽',
      distance: '150 м от вас',
      client: 'Мария С.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      status: 'Поиск исполнителя 🌻',
    },
    coords: { x: 74, y: 78 }
  },
  tutor: {
    title: 'Обучение & Репетиторы 🎓',
    description: 'Репетиторы по математике, языкам, физике и программированию. Подготовка к экзаменам и помощь с домашними заданиями.',
    icon: GraduationCap,
    color: '#7ca656',
    activeTask: {
      title: 'Разговорный английский (подготовка к интервью)',
      budget: '1 500 ₽/ч',
      distance: '800 м от вас',
      client: 'Сергей Д.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sergey',
      status: 'Сделка завершена 💖',
    },
    coords: { x: 50, y: 88 }
  },
  delivery: {
    title: 'Доставка & Поручения 📦',
    description: 'Курьерская доставка документов, продуктов, посылок или цветов. Помощь с мелкими локальными покупками.',
    icon: Truck,
    color: '#8b5cf6',
    activeTask: {
      title: 'Забрать заказ из ПВЗ Яндекс.Маркет и принести домой',
      budget: '400 ₽',
      distance: '300 м от вас',
      client: 'Анна Т.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
      status: 'Выполняется 🐝',
    },
    coords: { x: 26, y: 78 }
  },
  cleaning: {
    title: 'Клининг & Уборка ✨',
    description: 'Быстрая уборка комнат, мытье окон, стирка белья и комплексная помощь по хозяйству от вежливых соседей.',
    icon: Sparkles,
    color: '#ec4899',
    activeTask: {
      title: 'Помыть 3 панорамных окна на лоджии',
      budget: '1 800 ₽',
      distance: '1.2 км от вас',
      client: 'Екатерина В.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kate',
      status: 'Поиск исполнителя 🏡',
    },
    coords: { x: 18, y: 50 }
  },
  design: {
    title: 'Дизайн & Фотосъемка 🎨',
    description: 'Обработка фотографий, ретушь, разработка локальных логотипов, визиток и профессиональные портретные сессии в парке.',
    icon: Camera,
    color: '#06b6d4',
    activeTask: {
      title: 'Провести семейную фотосессию в Сокольниках',
      budget: '4 000 ₽',
      distance: '950 м от вас',
      client: 'Михаил Ю.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mikhail',
      status: 'Сделка завершена 🌻',
    },
    coords: { x: 26, y: 22 }
  },
  garden: {
    title: 'Уход за садом & Растения 🌿',
    description: 'Стрижка газонов, полив домашних цветов на время отпусков, уход за кустарниками и благоустройство территории.',
    icon: Sprout,
    color: '#84cc16',
    activeTask: {
      title: 'Поливать комнатные цветы в квартире (5 дней)',
      budget: '1 500 ₽',
      distance: '200 м от вас',
      client: 'Ольга П.',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga',
      status: 'Ждет подтверждения 🌾',
    },
    coords: { x: 74, y: 22 }
  }
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('it');
  const [activeChapter, setActiveChapter] = useState<number>(1);

  const handleStart = () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      setAuthTab('login');
      setIsAuthModalOpen(true);
    }
  };

  const handleRegisterCTA = () => {
    setAuthTab('register');
    setIsAuthModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#faf6ee] dark:bg-[#15110d] text-[#2e241c] dark:text-[#ede4d8] overflow-x-hidden font-sans">
      
      {/* ГЛАВНЫЙ ГЕРОЙ-БЛОК В СТИЛЕ УЮТНОГО JRPG */}
      <section className="relative w-full pt-16 pb-20 md:pb-28 bg-gradient-to-b from-[#ebdcc8]/30 via-[#faf6ee]/10 to-transparent dark:from-[#2c241c]/30 dark:via-[#15110d]/10 dark:to-transparent border-b-4 border-dashed border-[#2e241c] dark:border-[#ede4d8]">
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Текстовая левая часть в стиле JRPG-квеста */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border-2 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] text-[#2e241c] rounded-md text-[10px] font-bold shadow-[2px_2px_0_0_#2e241c]">
              <Sparkles className="w-3.5 h-3.5 text-[#2e241c]" />
              <span>НОВЫЙ КВЕСТ НА КАРТЕ! 🗺️</span>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-black text-[#2e241c] dark:text-[#ede4d8] leading-[1.12] tracking-tight">
              Обменивайтесь услугами <span className="italic font-normal text-[#7ca656] dark:text-[#84cc16]">прямо у себя во дворе</span> 🏡
            </h1>

            <p className="text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-serif max-w-lg">
              Уютная локальная гильдия взаимопомощи. Находите задачи и верных соседей-исполнителей в своём радиусе благодаря пространственной магии.
            </p>

            {/* CTA Кнопки в стиле 16-бит */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <button
                onClick={handleStart}
                className="w-full sm:w-auto pixel-button pixel-button-green text-xs"
              >
                <span>Найти услуги рядом</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>

              <button
                onClick={handleRegisterCTA}
                className="w-full sm:w-auto pixel-button pixel-button-wood text-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#2e241c]" />
                <span>Стать исполнителе️м</span>
              </button>
            </div>
          </div>

          {/* Правая часть - Ноутбук + Иллюстрация + Панели выполненных задач */}
          <div className="lg:col-span-7 relative flex items-center justify-center">
            
            {/* Макет Ноутбука, стилизованный под ретро-аркаду */}
            <div className="relative w-full max-w-[560px] aspect-[16/10] pixel-panel p-2.5 shadow-2xl bg-[#2e241c] dark:bg-[#ede4d8] border-none group">
              <div className="relative w-full h-full rounded-md overflow-hidden bg-[#1d1813] border-4 border-[#2e241c] dark:border-[#ede4d8]">
                
                {/* Картинка уютного пиксель-арта */}
                <img
                  src="/hero_background.png"
                  alt="Cozy Pixel Meadow Landscape"
                  className="w-full h-full object-cover select-none pointer-events-none opacity-95 scale-100 group-hover:scale-103 transition-transform duration-1000"
                  style={{ imageRendering: 'pixelated' }}
                />

                {/* Сканирующие линии CRT */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_4px] mix-blend-overlay pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#7ca656]/5 to-white/15 mix-blend-overlay pointer-events-none" />
              </div>

              {/* Ножка ноутбука в стиле 16-бит */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[85%] h-3 bg-[#2e241c] dark:bg-[#ede4d8] rounded-b-md shadow-lg" />
            </div>

            {/* Плавающие JRPG квест-бабблы */}
            <div className="absolute right-[-10px] md:right-[-25px] top-[8%] flex flex-col gap-3.5 z-20 pointer-events-none">

              <div className="flex items-center gap-2.5 px-3 py-2 pixel-panel bg-white dark:bg-[#1d1813] border-3 text-[#2e241c] dark:text-[#ede4d8] shadow-lg animate-float">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-tight">Квест Сдан:</span>
                <span className="text-[9px] font-serif font-bold text-slate-600 dark:text-slate-300">Настройка HTTPS (Сергей, 450м) 🌻</span>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 pixel-panel bg-white dark:bg-[#1d1813] border-3 text-[#2e241c] dark:text-[#ede4d8] shadow-lg animate-float-delayed">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-tight">Квест Сдан:</span>
                <span className="text-[9px] font-serif font-bold text-slate-600 dark:text-slate-300">Ремонт розеток (Мария, 150м) 🛠️</span>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 pixel-panel bg-white dark:bg-[#1d1813] border-3 text-[#2e241c] dark:text-[#ede4d8] shadow-lg animate-float">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-tight">Квест Сдан:</span>
                <span className="text-[9px] font-serif font-bold text-slate-600 dark:text-slate-300">Полив цветов (Ольга, 200м) 🌿</span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ИНТЕРАКТИВНЫЙ MIND-MAP ПО КАТЕГОРИЯМ УСЛУГ */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-28 text-center space-y-16">

        <div className="space-y-4 max-w-3xl mx-auto">
          <div className="inline-block text-[#7ca656] dark:text-[#84cc16] text-3xl animate-pixel-bounce">🌿</div>
          <h2 className="font-serif text-3xl md:text-5xl font-black tracking-tight text-[#2e241c] dark:text-[#ede4d8] leading-tight">
            Карта Локальных Профессий
          </h2>
          <p className="text-sm font-serif text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
            Кликните по цветущим узлам нашей деревенской сети талантов, чтобы увидеть детали локальных квестов и пообщаться с соседями.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Схема Mind Map в стиле JRPG */}
          <div className="lg:col-span-7 relative aspect-square w-full max-w-[500px] mx-auto pixel-panel bg-[#fffdf9] dark:bg-[#1d1813] border-4 p-6 shadow-md overflow-hidden flex items-center justify-center">
            
            {/* Фоновая пиксельная координатная сетка */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#2e241c0a_2px,transparent_2px),linear-gradient(to_bottom,#2e241c0a_2px,transparent_2px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Зелёные извивающиеся лозы-связи */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {Object.entries(categoryDetails).map(([key, item]) => {
                const isActive = activeCategory === key;
                return (
                  <path
                    key={key}
                    d={`M 250 250 Q ${(250 + item.coords.x * 5) / 2} ${(250 + item.coords.y * 5) / 2 - 25} ${item.coords.x * 5} ${item.coords.y * 5}`}
                    fill="none"
                    stroke={isActive ? '#7ca656' : '#2e241c'}
                    strokeWidth={isActive ? '4' : '2'}
                    className="transition-all duration-300"
                    style={{
                      strokeDasharray: isActive ? 'none' : '4 4',
                      opacity: isActive ? 1 : 0.25,
                    }}
                  />
                );
              })}
            </svg>

            {/* ЦЕНТРАЛЬНЫЙ УЗЕЛ - КАРТА/ЯДРО */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center justify-center p-3.5 border-3 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] text-[#2e241c] rounded-xl shadow-[3px_3px_0_0_#2e241c] group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute w-3 h-3 bg-yellow-500 rounded-full animate-ping" />
                <MapPin className="w-7 h-7 text-[#2e241c] relative z-10 shrink-0" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-wider mt-1 font-serif">Таверна 🏡</span>
            </div>

            {/* ОКРУЖАЮЩИЕ ЦВЕТОЧНЫЕ УЗЛЫ КАТЕГОРИЙ */}
            {Object.entries(categoryDetails).map(([key, item]) => {
              const Icon = item.icon;
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key as CategoryKey)}
                  onMouseEnter={() => setActiveCategory(key as CategoryKey)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 z-10 p-3 rounded-xl border-3 transition-all duration-300 flex items-center justify-center cursor-pointer ${
                    isActive
                      ? 'scale-115 shadow-md text-white border-[#2e241c]'
                      : 'bg-[#faf6ee] dark:bg-[#1d1813] text-[#2e241c] dark:text-[#ede4d8] border-[#2e241c] dark:border-[#ede4d8] hover:scale-105 shadow-xs'
                  }`}
                  style={{
                    left: `${item.coords.x}%`,
                    top: `${item.coords.y}%`,
                    backgroundColor: isActive ? item.color : undefined,
                  }}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                </button>
              );
            })}

          </div>

          {/* JRPG Диалоговое окно (5/12 ширины) */}
          <div className="lg:col-span-5 text-left space-y-6">
            <div className="pixel-panel p-6 bg-[#faf6ee] dark:bg-[#1d1813] border-4 space-y-5">

              <div className="flex items-center gap-3">
                <div
                  className="p-3 border-3 border-[#2e241c] dark:border-[#ede4d8] text-white rounded-lg shadow-sm"
                  style={{ backgroundColor: categoryDetails[activeCategory].color }}
                >
                  {React.createElement(categoryDetails[activeCategory].icon, { className: "w-6 h-6 shrink-0" })}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-black text-[#2e241c] dark:text-[#ede4d8] leading-none">
                    {categoryDetails[activeCategory].title}
                  </h3>
                  <span className="text-[9px] font-black uppercase tracking-wider text-[#7ca656] mt-1 block">Доска Объявлений</span>
                </div>
              </div>

              <p className="text-xs font-serif text-slate-700 dark:text-slate-350 leading-relaxed">
                {categoryDetails[activeCategory].description}
              </p>

              {/* Симулированное JRPG окно диалога с заказчиком */}
              <div className="border-t-3 border-dashed border-[#2e241c] dark:border-[#ede4d8] pt-5 space-y-4">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Диалог квеста:</span>

                <div className="space-y-3">

                  {/* Сообщение Заказчика */}
                  <div className="flex items-start gap-3">
                    {/* Квадратный ретро аватар */}
                    <img
                      src={categoryDetails[activeCategory].activeTask.avatar}
                      alt={categoryDetails[activeCategory].activeTask.client}
                      className="w-10 h-10 border-3 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875] shrink-0"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    <div className="p-3 pixel-panel bg-white dark:bg-[#15110d] border-3 rounded-none relative text-xs leading-relaxed max-w-[80%] text-[#2e241c] dark:text-[#ede4d8]">
                      <div className="flex items-center justify-between gap-4 mb-1">
                        <span className="font-serif font-black text-[10px]">{categoryDetails[activeCategory].activeTask.client} 👤</span>
                        <span className="text-[8px] font-sans font-bold text-[#7ca656]">{categoryDetails[activeCategory].activeTask.distance}</span>
                      </div>
                      «{categoryDetails[activeCategory].activeTask.title}»
                    </div>
                  </div>

                  {/* Лог выполнения */}
                  <div className="flex items-center gap-2 pl-12">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-[9px] font-black font-mono text-slate-550 dark:text-slate-400 uppercase tracking-wider">
                      Статус: {categoryDetails[activeCategory].activeTask.status}
                    </span>
                    <span className="text-[10px] font-serif font-black text-[#7ca656] dark:text-[#84cc16] ml-auto">
                      Награда: {categoryDetails[activeCategory].activeTask.budget}
                    </span>
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ШАГИ И ТЕХНИЧЕСКИЙ РАЗДЕЛ (КВЕСТ-ЛОГ И CRT МОНИТОР) */}
      <section className="w-full py-20 md:py-28 bg-white dark:bg-[#1d1813] border-y-4 border-dashed border-[#2e241c] dark:border-[#ede4d8] relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

          {/* Левый сайдбар - Квест Лог */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            <div className="space-y-2">
              <span className="text-[9px] font-black uppercase tracking-widest text-[#7ca656]">Квест-бук игрока</span>
              <h3 className="font-serif text-3xl font-black tracking-tight text-[#2e241c] dark:text-[#ede4d8]">
                Как Начать Квест?
              </h3>
            </div>

            {/* Списочек глав */}
            <div className="flex flex-col gap-3 font-serif">
              <button
                onClick={() => setActiveChapter(1)}
                className={`w-full flex items-center gap-3.5 p-4 border-3 rounded-xl text-left transition-all cursor-pointer ${
                  activeChapter === 1
                    ? 'bg-[#ffd875] text-[#2e241c] border-[#2e241c] shadow-[inset_-3px_-3px_0_0_#dca626]'
                    : 'bg-[#faf6ee] dark:bg-[#15110d] text-slate-500 dark:text-slate-400 border-[#2e241c] dark:border-[#ede4d8] hover:bg-[#ebdcc8]/30'
                }`}
              >
                <span className="text-base">{activeChapter === 1 ? '🌻' : '🌿'}</span>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-sans font-black opacity-60">Глава I</span>
                  <span className="font-bold text-sm">Создание персонажа 👤</span>
                </div>
                <CheckCircle className={`w-4 h-4 ml-auto text-emerald-600 transition-opacity ${activeChapter === 1 ? 'opacity-100' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => setActiveChapter(2)}
                className={`w-full flex items-center gap-3.5 p-4 border-3 rounded-xl text-left transition-all cursor-pointer ${
                  activeChapter === 2
                    ? 'bg-[#ffd875] text-[#2e241c] border-[#2e241c] shadow-[inset_-3px_-3px_0_0_#dca626]'
                    : 'bg-[#faf6ee] dark:bg-[#15110d] text-slate-500 dark:text-slate-400 border-[#2e241c] dark:border-[#ede4d8] hover:bg-[#ebdcc8]/30'
                }`}
              >
                <span className="text-base">{activeChapter === 2 ? '🗺️' : '🌿'}</span>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-sans font-black opacity-60">Глава II</span>
                  <span className="font-bold text-sm">Выбор точки на карте 📍</span>
                </div>
                <CheckCircle className={`w-4 h-4 ml-auto text-emerald-600 transition-opacity ${activeChapter === 2 ? 'opacity-100' : 'opacity-0'}`} />
              </button>

              <button
                onClick={() => setActiveChapter(3)}
                className={`w-full flex items-center gap-3.5 p-4 border-3 rounded-xl text-left transition-all cursor-pointer ${
                  activeChapter === 3
                    ? 'bg-[#ffd875] text-[#2e241c] border-[#2e241c] shadow-[inset_-3px_-3px_0_0_#dca626]'
                    : 'bg-[#faf6ee] dark:bg-[#15110d] text-slate-500 dark:text-slate-400 border-[#2e241c] dark:border-[#ede4d8] hover:bg-[#ebdcc8]/30'
                }`}
              >
                <span className="text-base">{activeChapter === 3 ? '⚡' : '🌿'}</span>
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-sans font-black opacity-60">Глава III</span>
                  <span className="font-bold text-sm">Магия PostGIS 🪄</span>
                </div>
                <CheckCircle className={`w-4 h-4 ml-auto text-emerald-600 transition-opacity ${activeChapter === 3 ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            </div>
          </div>

          {/* Правая часть - CRT экран с описанием */}
          <div className="lg:col-span-8 pixel-panel p-6 md:p-8 bg-[#faf6ee] dark:bg-[#15110d] border-4 space-y-6">
            
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-550 dark:text-slate-400 bg-white dark:bg-[#1d1813] px-3 py-1 border-2 border-[#2e241c] dark:border-[#ede4d8] w-fit block rounded-md">
              Свиток {activeChapter === 1 ? 'I' : activeChapter === 2 ? 'II' : 'III'}
            </span>

            {activeChapter === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h4 className="font-serif text-2xl font-black text-[#2e241c] dark:text-[#ede4d8]">
                  Регистрация героя и выбор роли
                </h4>
                <p className="text-sm font-serif text-slate-700 dark:text-slate-350 leading-relaxed">
                  Начните за пару мгновений. Выберите свой класс: Заказчик (раздает задания-квесты) или Исполнитель (ищет приключения и заказы). Данные кэшируются через Zustand прямо на вашем устройстве.
                </p>
                <div className="p-4 border-2 border-[#2e241c] dark:border-[#ede4d8] bg-[#ffd875]/10 flex items-center gap-3 rounded-md">
                  <div className="p-2 border-2 border-[#2e241c] bg-[#ffd875] text-[#2e241c] rounded-md">
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                  </div>
                  <span className="text-xs font-serif font-bold text-[#2e241c] dark:text-[#ede4d8]">Безопасное сохранение прогресса и мгновенный кэш</span>
                </div>
              </div>
            )}

            {activeChapter === 2 && (
              <div className="space-y-5 animate-fade-in">
                <h4 className="font-serif text-2xl font-black text-[#2e241c] dark:text-[#ede4d8]">
                  Установка пина на интерактивной Яндекс.Карте
                </h4>
                <p className="text-sm font-serif text-slate-700 dark:text-slate-350 leading-relaxed">
                  С помощью уютно интегрированных Яндекс.Карт выбор геолокации максимально удобен. Кликните по карте при публикации — и система автоматически определит географические координаты для точного пространственного сопоставления.
                </p>
                <div className="p-4 border-2 border-[#2e241c] dark:border-[#ede4d8] bg-[#7ca656]/10 flex items-center gap-3 rounded-md">
                  <div className="p-2 border-2 border-[#2e241c] bg-[#7ca656] text-white rounded-md">
                    <MapPin className="w-5 h-5 shrink-0" />
                  </div>
                  <span className="text-xs font-serif font-bold text-[#2e241c] dark:text-[#ede4d8]">Удобная калибровка гео-координат WGS-84</span>
                </div>
              </div>
            )}

            {activeChapter === 3 && (
              <div className="space-y-5 animate-fade-in">
                <h4 className="font-serif text-2xl font-black text-[#2e241c] dark:text-[#ede4d8]">
                  Пространственное сопряжение на PostGIS
                </h4>
                <p className="text-sm font-serif text-slate-700 dark:text-slate-350 leading-relaxed">
                  Никаких текстовых совпадений или медленных вычислений. Наш бэкенд использует пространственный тип <strong className="text-slate-900 dark:text-white">Geography</strong> и индексы GiST в PostgreSQL для мгновенного нахождения задач в заданном радиусе (100м - 50км).
                </p>

                {/* Эффектный CRT терминал */}
                <div className="rounded-md overflow-hidden bg-[#121010] text-[#a3cb7c] border-4 border-[#2e241c] dark:border-[#ede4d8] shadow-[0_0_20px_rgba(124,166,86,0.25)] relative">
                  
                  {/* CRT Сетка */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.04),rgba(0,255,0,0.02),rgba(0,0,255,0.04))] bg-[size:100%_4px,6px_100%] pointer-events-none z-10" />

                  <div className="bg-[#1f1a17] px-4 py-2 border-b-2 border-[#2e241c] dark:border-[#ede4d8] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#7ca656] shrink-0" />
                    <span className="text-[9px] font-black font-mono tracking-widest text-[#a3cb7c]">SPATIAL_QUEST.SQL</span>
                    <div className="flex gap-1.5 ml-auto">
                      <span className="w-2.5 h-2.5 border border-[#2e241c] rounded-full bg-[#df3a30]" />
                      <span className="w-2.5 h-2.5 border border-[#2e241c] rounded-full bg-[#ffd875]" />
                      <span className="w-2.5 h-2.5 border border-[#2e241c] rounded-full bg-[#7ca656]" />
                    </div>
                  </div>
                  <pre className="p-4 text-[10px] leading-relaxed font-mono overflow-x-auto text-left text-[#a3cb7c] z-5 relative">
                    <code>
                      {`-- Поиск соседних квестов по индексу GiST
SELECT id, title, price, 
       ST_Distance(location, ST_MakePoint(30.31, 59.93)::geography) AS dist
FROM "Tasks"
WHERE ST_DWithin(location, ST_MakePoint(30.31, 59.93)::geography, 10000)
ORDER BY dist ASC
LIMIT 5;`}
                    </code>
                  </pre>
                </div>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* НИЖНИЙ CTA-БЛОК В ВИДЕ ДОСКИ ОБЪЯВЛЕНИЙ */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center z-10 relative">
        <div className="pixel-panel p-10 md:p-14 bg-[#bf8d5c] text-[#2e241c] border-4 space-y-6 shadow-xl relative overflow-hidden">
          
          {/* Декоративные текстуры дерева */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(46,36,28,0.03)_1px,transparent_1px)] bg-[size:10px_100%] pointer-events-none" />

          <h3 className="font-serif text-3xl md:text-5xl font-black tracking-tight">Готовы Вступить в Гильдию?</h3>
          <p className="text-xs md:text-sm font-serif max-w-xl mx-auto leading-relaxed text-[#403125]">
            Присоединяйтесь к уютной локальной сети обмена талантами прямо сейчас. Создавайте задания, выполняйте задачи и развивайте наше соседское поселение! 🌾
          </p>
          <div className="pt-2">
            <button
              onClick={handleStart}
              className="pixel-button pixel-button-green text-xs"
            >
              <span>Попробовать Бесплатно 🌻</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authTab}
      />
    </div>
  );
};
