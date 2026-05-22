import React, { useState } from 'react';
import { Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../../entities/user/model/authStore';

interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Введите корректный email адрес.');
      return;
    }

    if (password.length < 4) {
      setError('Пароль должен быть не менее 4 символов.');
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        onSuccess();
      } else {
        setError('Неверный email или пароль.');
      }
    } catch (err) {
      console.error(err);
      setError('Произошла непредвиденная ошибка. Попробуйте еще раз.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-left">
      {error && (
        <div className="flex items-center gap-2.5 p-3 border-3 border-rose-650 bg-rose-50 dark:bg-[#1d1813] text-rose-700 dark:text-rose-400 text-xs font-serif font-black animate-shake rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-650" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label className="text-[10px] font-sans font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
          Email свиток
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7ca656]" />
          <input
            type="email"
            placeholder="example@porsev.space"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full pixel-input py-2.5 pl-11 pr-4 text-sm font-serif"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center px-1">
          <label className="text-[10px] font-sans font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block">
            Защитный шифр (Пароль)
          </label>
          <a href="#" className="text-[9px] font-sans font-black text-[#7ca656] dark:text-[#84cc16] hover:underline uppercase tracking-wider">
            Забыли?
          </a>
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7ca656]" />
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full pixel-input py-2.5 pl-11 pr-4 text-sm font-serif"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full pixel-button pixel-button-green text-xs flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Входим в таверну...</span>
          </>
        ) : (
          <span>Войти в систему 🚪</span>
        )}
      </button>
    </form>
  );
};
