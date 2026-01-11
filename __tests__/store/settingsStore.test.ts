import { act, renderHook } from '@testing-library/react-native';
import { useSettingsStore } from '../../src/store/settingsStore';

describe('settingsStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    act(() => {
      useSettingsStore.setState({
        currency: 'JPY',
        language: 'ja',
        timezone: 'Asia/Tokyo',
        isDarkMode: true,
        pushNotificationsEnabled: true,
        emailNotificationsEnabled: true,
      });
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.currency).toBe('JPY');
      expect(result.current.language).toBe('ja');
      expect(result.current.timezone).toBe('Asia/Tokyo');
      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.pushNotificationsEnabled).toBe(true);
      expect(result.current.emailNotificationsEnabled).toBe(true);
    });
  });

  describe('setCurrency', () => {
    it('should update currency to USD', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setCurrency('USD');
      });

      expect(result.current.currency).toBe('USD');
    });

    it('should update currency to EUR', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setCurrency('EUR');
      });

      expect(result.current.currency).toBe('EUR');
    });

    it('should update currency back to JPY', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setCurrency('USD');
        result.current.setCurrency('JPY');
      });

      expect(result.current.currency).toBe('JPY');
    });
  });

  describe('setLanguage', () => {
    it('should update language to English', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setLanguage('en');
      });

      expect(result.current.language).toBe('en');
    });

    it('should update language back to Japanese', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setLanguage('en');
        result.current.setLanguage('ja');
      });

      expect(result.current.language).toBe('ja');
    });
  });

  describe('setTimezone', () => {
    it('should update timezone', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setTimezone('America/New_York');
      });

      expect(result.current.timezone).toBe('America/New_York');
    });

    it('should accept various timezone formats', () => {
      const { result } = renderHook(() => useSettingsStore());

      const timezones = [
        'UTC',
        'America/Los_Angeles',
        'Europe/London',
        'Asia/Singapore',
      ];

      timezones.forEach((tz) => {
        act(() => {
          result.current.setTimezone(tz);
        });
        expect(result.current.timezone).toBe(tz);
      });
    });
  });

  describe('toggleDarkMode', () => {
    it('should toggle dark mode off', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.isDarkMode).toBe(true);

      act(() => {
        result.current.toggleDarkMode();
      });

      expect(result.current.isDarkMode).toBe(false);
    });

    it('should toggle dark mode back on', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleDarkMode(); // off
        result.current.toggleDarkMode(); // on
      });

      expect(result.current.isDarkMode).toBe(true);
    });
  });

  describe('togglePushNotifications', () => {
    it('should toggle push notifications off', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.pushNotificationsEnabled).toBe(true);

      act(() => {
        result.current.togglePushNotifications();
      });

      expect(result.current.pushNotificationsEnabled).toBe(false);
    });

    it('should toggle push notifications back on', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.togglePushNotifications(); // off
        result.current.togglePushNotifications(); // on
      });

      expect(result.current.pushNotificationsEnabled).toBe(true);
    });
  });

  describe('toggleEmailNotifications', () => {
    it('should toggle email notifications off', () => {
      const { result } = renderHook(() => useSettingsStore());

      expect(result.current.emailNotificationsEnabled).toBe(true);

      act(() => {
        result.current.toggleEmailNotifications();
      });

      expect(result.current.emailNotificationsEnabled).toBe(false);
    });

    it('should toggle email notifications back on', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.toggleEmailNotifications(); // off
        result.current.toggleEmailNotifications(); // on
      });

      expect(result.current.emailNotificationsEnabled).toBe(true);
    });
  });

  describe('resetSettings', () => {
    it('should reset all settings to defaults', () => {
      const { result } = renderHook(() => useSettingsStore());

      // Change all settings
      act(() => {
        result.current.setCurrency('USD');
        result.current.setLanguage('en');
        result.current.setTimezone('America/New_York');
        result.current.toggleDarkMode(); // false
        result.current.togglePushNotifications(); // false
        result.current.toggleEmailNotifications(); // false
      });

      // Verify changes
      expect(result.current.currency).toBe('USD');
      expect(result.current.language).toBe('en');
      expect(result.current.timezone).toBe('America/New_York');
      expect(result.current.isDarkMode).toBe(false);
      expect(result.current.pushNotificationsEnabled).toBe(false);
      expect(result.current.emailNotificationsEnabled).toBe(false);

      // Reset
      act(() => {
        result.current.resetSettings();
      });

      // Verify defaults
      expect(result.current.currency).toBe('JPY');
      expect(result.current.language).toBe('ja');
      expect(result.current.timezone).toBe('Asia/Tokyo');
      expect(result.current.isDarkMode).toBe(true);
      expect(result.current.pushNotificationsEnabled).toBe(true);
      expect(result.current.emailNotificationsEnabled).toBe(true);
    });
  });

  describe('multiple settings changes', () => {
    it('should handle multiple rapid changes correctly', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        result.current.setCurrency('USD');
        result.current.setCurrency('EUR');
        result.current.setCurrency('JPY');
        result.current.setLanguage('en');
        result.current.setLanguage('ja');
      });

      expect(result.current.currency).toBe('JPY');
      expect(result.current.language).toBe('ja');
    });

    it('should handle multiple toggles correctly', () => {
      const { result } = renderHook(() => useSettingsStore());

      act(() => {
        // Toggle 3 times
        result.current.toggleDarkMode();
        result.current.toggleDarkMode();
        result.current.toggleDarkMode();
      });

      // Should be opposite of initial (true -> false)
      expect(result.current.isDarkMode).toBe(false);

      act(() => {
        // Toggle 2 more times
        result.current.toggleDarkMode();
        result.current.toggleDarkMode();
      });

      // Should be back to false (3 + 2 = 5 toggles, odd number)
      expect(result.current.isDarkMode).toBe(false);
    });
  });
});
