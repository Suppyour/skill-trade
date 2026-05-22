import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './widgets/navigation/ui/Header';
import { LandingPage } from './pages/landing/ui/LandingPage';
import { MarketplacePage } from './pages/marketplace/ui/MarketplacePage';

// Создаем инстанс QueryClient для управления кэшем TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Отключаем рефетч при смене вкладки
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#faf6ee] dark:bg-[#15110d] text-[#2e241c] dark:text-[#ede4d8] transition-colors duration-300">
          
          {/* Универсальная шапка сайта */}
          <Header />

          {/* Маршрутизация страниц */}
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<MarketplacePage />} />
            </Routes>
          </div>

          {/* Подвал с милыми 8-битными лозами */}
          <footer className="w-full relative bg-[#faf6ee] dark:bg-[#15110d] mt-auto pt-0 pb-10 border-t-2 border-[#2e241c] dark:border-[#ede4d8]">
            {/* 8-битная лоза сверху подвала */}
            <div 
              className="w-full h-2.5 bg-repeat-x pointer-events-none mb-8" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='10' viewBox='0 0 32 10'%3E%3Crect x='0' y='4' width='32' height='2' fill='%233e612c'/%3E%3Crect x='6' y='6' width='2' height='2' fill='%235a823e'/%3E%3Crect x='8' y='6' width='4' height='2' fill='%237ca656'/%3E%3Crect x='8' y='8' width='2' height='2' fill='%235a823e'/%3E%3Crect x='10' y='6' width='2' height='2' fill='%23a3cb7c'/%3E%3Crect x='20' y='2' width='4' height='2' fill='%237ca656'/%3E%3Crect x='22' y='0' width='2' height='2' fill='%23a3cb7c'/%3E%3Crect x='20' y='2' width='2' height='2' fill='%235a823e'/%3E%3Crect x='20' y='4' width='2' height='2' fill='%233e612c'/%3E%3C/svg%3E")`,
                imageRendering: 'pixelated',
                backgroundSize: '32px 10px'
              }}
            />
            
            <div className="max-w-7xl mx-auto px-6 text-center space-y-4 font-sans">
              <div className="flex justify-center items-center gap-2 text-[#7ca656] dark:text-[#84cc16]">
                {/* Симпатичный 8-битный росток по центру */}
                <svg className="w-5 h-5 animate-pixel-bounce" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ imageRendering: 'pixelated' }}>
                  <rect x="7" y="6" width="2" height="10" fill="#3e612c" />
                  <rect x="5" y="4" width="2" height="2" fill="#7ca656" />
                  <rect x="3" y="3" width="2" height="2" fill="#a3cb7c" />
                  <rect x="9" y="3" width="2" height="2" fill="#7ca656" />
                  <rect x="11" y="2" width="2" height="2" fill="#a3cb7c" />
                </svg>
                <span className="font-serif italic text-sm text-[#2e241c] dark:text-[#ede4d8]">Уютный обмен опытом поблизости</span>
              </div>
              
              <div className="text-xs text-slate-550 dark:text-slate-400 space-y-1">
                <p>© {new Date().getFullYear()} SkillSwap-Local. Все права защищены. 🌿</p>
                <p className="tracking-wide">Спроектировано с любовью с использованием React 19, TypeScript 6.0, Yandex Maps API, .NET 10 & PostgreSQL (PostGIS).</p>
              </div>
            </div>
          </footer>

        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
