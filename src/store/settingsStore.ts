// Settings Store using Zustand for user preferences
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Currency } from '../types/metrics';

interface SettingsState {
  // Display preferences
  currency: Currency;
  language: 'ja' | 'en';
  timezone: string;

  // Theme
  isDarkMode: boolean;

  // Notifications
  pushNotificationsEnabled: boolean;
  emailNotificationsEnabled: boolean;

  // Actions
  setCurrency: (currency: Currency) => void;
  setLanguage: (language: 'ja' | 'en') => void;
  setTimezone: (timezone: string) => void;
  toggleDarkMode: () => void;
  togglePushNotifications: () => void;
  toggleEmailNotifications: () => void;
  resetSettings: () => void;
}

const defaultSettings = {
  currency: 'JPY' as Currency,
  language: 'ja' as const,
  timezone: 'Asia/Tokyo',
  isDarkMode: true,
  pushNotificationsEnabled: true,
  emailNotificationsEnabled: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setCurrency: (currency: Currency) => set({ currency }),

      setLanguage: (language: 'ja' | 'en') => set({ language }),

      setTimezone: (timezone: string) => set({ timezone }),

      toggleDarkMode: () =>
        set((state) => ({ isDarkMode: !state.isDarkMode })),

      togglePushNotifications: () =>
        set((state) => ({
          pushNotificationsEnabled: !state.pushNotificationsEnabled,
        })),

      toggleEmailNotifications: () =>
        set((state) => ({
          emailNotificationsEnabled: !state.emailNotificationsEnabled,
        })),

      resetSettings: () => set(defaultSettings),
    }),
    {
      name: 'indie-pulse-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useSettingsStore;
