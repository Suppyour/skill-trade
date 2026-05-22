import { create } from 'zustand';

export interface User {
  name: string;
  email: string;
  avatar: string;
  role: 'client' | 'worker';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, role: 'client' | 'worker') => Promise<boolean>;
  logout: () => void;
}

// Загружаем начальное состояние из localStorage
const getInitialState = () => {
  if (typeof window === 'undefined') return { isAuthenticated: false, user: null };
  try {
    const stored = localStorage.getItem('skillswap_session');
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        isAuthenticated: true,
        user: parsed,
      };
    }
  } catch (err) {
    console.error('Ошибка чтения сессии из localStorage:', err);
  }
  return { isAuthenticated: false, user: null };
};

export const useAuthStore = create<AuthState>((set) => ({
  ...getInitialState(),
  isLoading: false,

  login: async (email, _password) => {
    set({ isLoading: true });
    // Симулируем сетевую задержку для реалистичного UX лоадера
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Создаем демо-пользователя на основе введенного email
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    
    // Генерируем красивую аватарку по первой букве имени
    const mockUser: User = {
      name: formattedName,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${formattedName}&backgroundColor=0f62fe&textColor=ffffff`,
      role: 'client',
    };

    localStorage.setItem('skillswap_session', JSON.stringify(mockUser));
    set({ isAuthenticated: true, user: mockUser, isLoading: false });
    return true;
  },

  register: async (name, email, role) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockUser: User = {
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${name}&backgroundColor=0f62fe&textColor=ffffff`,
      role,
    };

    localStorage.setItem('skillswap_session', JSON.stringify(mockUser));
    set({ isAuthenticated: true, user: mockUser, isLoading: false });
    return true;
  },

  logout: () => {
    localStorage.removeItem('skillswap_session');
    set({ isAuthenticated: false, user: null });
  },
}));
