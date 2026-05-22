import React, { useState } from 'react';
import { User, Mail, Lock, Loader2, AlertCircle, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../../entities/user/model/authStore';

interface RegisterFormProps {
  onSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const { register, isLoading } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'client' | 'worker'>('client');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }

    if (name.length < 2) {
      setError('Имя должно содержать не менее 2 символов.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Введите корректный email адрес.');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен состоять минимум из 6 символов.');
      return;
    }

    try {
      const success = await register(name, email, role);
      if (success) {
        onSuccess();
      } else {
        setError('Этот email адрес уже зарегистрирован.');
      }
    } catch (err) {
      console.error(err);
      setError('Произошла непредвиденная ошибка. Попробуйте еще раз.');
    }
  };

  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthLabels = ['Слишком легкий 🪵', 'Нормальный ⚔️', 'Хороший 🛡️', 'Легендарный 👑'];
  const strengthColors = ['bg-rose-500', 'bg-amber-500', 'bg-[#7ca656]', 'bg-blue-600'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left font-serif">
      {error && (
        <div className="flex items-center gap-2.5 p-3 border-3 border-rose-650 bg-rose-50 dark:bg-[#1d1813] text-rose-700 dark:text-rose-455 text-xs font-black animate-shake rounded-md">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-650" />
          <span>{error}</span>
        </div>
      )}

      {/* Класс героя (Роль) */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-sans font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
          Класс Вашего Героя
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`py-2 px-3 border-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              role === 'client'
                ? 'bg-[#ffd875] text-[#2e241c] border-[#2e241c] shadow-[inset_-3px_-3px_0_0_#dca626]'
                : 'bg-[#faf6ee] dark:bg-[#15110d] text-slate-500 dark:text-slate-400 border-[#bcaea2]'
            }`}
          >
            📝 Заказчик
          </button>
          <button
            type="button"
            onClick={() => setRole('worker')}
            className={`py-2 px-3 border-3 text-xs font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
              role === 'worker'
                ? 'bg-[#ffd875] text-[#2e241c] border-[#2e241c] shadow-[inset_-3px_-3px_0_0_#dca626]'
                : 'bg-[#faf6ee] dark:bg-[#15110d] text-slate-500 dark:text-slate-400 border-[#bcaea2]'
            }`}
          >
            🛠️ Исполнитель
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-sans font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
          Имя Персонажа
        </label>
        <div className="relative group">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7ca656]" />
          <input
            type="text"
            placeholder="Михаил"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="w-full pixel-input py-2.5 pl-11 pr-4 text-sm font-serif"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-sans font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
          Email свиток
        </label>
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7ca656]" />
          <input
            type="email"
            placeholder="misha@porsev.space"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full pixel-input py-2.5 pl-11 pr-4 text-sm font-serif"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-sans font-black text-slate-500 dark:text-slate-450 uppercase tracking-widest block ml-1">
          Защитный Шифр
        </label>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#7ca656]" />
          <input
            type="password"
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full pixel-input py-2.5 pl-11 pr-4 text-sm font-serif"
          />
        </div>

        {password && (
          <div className="space-y-1 pt-1 px-1">
            <div className="flex justify-between items-center text-[9px] font-sans font-black text-slate-500 uppercase tracking-widest">
              <span>Сложность шифра</span>
              <span className="text-[#2e241c] dark:text-[#ede4d8]">{strengthLabels[strength - 1] || 'Слишком короткий 🪵'}</span>
            </div>
            <div className="grid grid-cols-4 gap-1 h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full transition-all duration-500 ${
                    i < strength ? strengthColors[strength - 1] : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full pixel-button pixel-button-green text-xs flex items-center justify-center gap-2 mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            <span>Создание аккаунта...</span>
          </>
        ) : (
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 shrink-0" /> Присоединиться к Гильдии ⚔️
          </span>
        )}
      </button>
    </form>
  );
};
