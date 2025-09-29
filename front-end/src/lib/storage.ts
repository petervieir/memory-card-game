// Safe storage access for SSR compatibility
export const safeStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
      return null;
    }
  },
  
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn('Error writing to localStorage:', error);
    }
  },
  
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn('Error removing from localStorage:', error);
    }
  }
};

// Custom storage for Zustand persist middleware
export const createJSONStorage = () => ({
  getItem: (name: string): string | null => {
    return safeStorage.getItem(name);
  },
  setItem: (name: string, value: string): void => {
    safeStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    safeStorage.removeItem(name);
  },
});
