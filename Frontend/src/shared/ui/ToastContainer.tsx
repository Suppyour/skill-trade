import { useToastStore } from '../lib/toastStore';
import { Coins, X, MapPin, Sparkles } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pixel-panel p-4 bg-[#faf6ee] dark:bg-[#1d1813] border-4 border-[#2e241c] dark:border-[#ede4d8] rounded-lg shadow-lg relative flex flex-col gap-2 pointer-events-auto cursor-default hover:scale-[1.02] transition-transform duration-200"
          style={{
            animation: 'fadeIn 0.4s ease-out forwards',
          }}
        >
          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            className="absolute top-2 right-2 p-1 text-[#2e241c] dark:text-[#ede4d8] hover:bg-[#ebdcc8] dark:hover:bg-[#2c241c] rounded transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge */}
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center p-1 bg-[#ffd875] border-2 border-[#2e241c] rounded animate-pixel-bounce text-[#2e241c]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#3e612c] dark:text-[#84cc16]">
              {toast.type === 'task_created' ? '🌿 Новый Квест Доступен!' : '📢 Вестник Гильдии'}
            </span>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-sm text-[#2e241c] dark:text-[#ede4d8] leading-tight">
              {toast.title}
            </h4>
            <p className="text-xs text-[#2e241c]/80 dark:text-[#ede4d8]/80 line-clamp-2">
              {toast.description}
            </p>
          </div>

          {/* Footer Info (Price / Location) */}
          <div className="flex items-center justify-between border-t border-[#2e241c]/10 dark:border-[#ede4d8]/10 pt-2 mt-1 text-xs">
            {toast.priceAmount !== undefined && (
              <div className="flex items-center gap-1 font-serif font-bold text-[#b45309] dark:text-[#fbbf24]">
                <Coins className="w-3.5 h-3.5" />
                <span>{toast.priceAmount} {toast.currency || 'монет'}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-slate-550 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-[#7ca656] dark:text-[#84cc16]" />
              <span>Рядом с вами</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
