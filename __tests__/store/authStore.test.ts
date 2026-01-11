import { act, renderHook } from '@testing-library/react-native';
import { useAuthStore } from '../../src/store/authStore';

// Mock the auth service
jest.mock('../../src/services/authService', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  resetPassword: jest.fn(),
  subscribeToAuthState: jest.fn(() => jest.fn()),
  getAuthErrorMessage: jest.fn((code: string) => {
    const messages: Record<string, string> = {
      'auth/invalid-email': 'Invalid email',
      'auth/wrong-password': 'Wrong password',
      'auth/user-not-found': 'User not found',
    };
    return messages[code] || 'An error occurred';
  }),
}));

import {
  signIn,
  signUp,
  signOut,
  resetPassword,
  subscribeToAuthState,
  getAuthErrorMessage,
} from '../../src/services/authService';

describe('authStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      useAuthStore.setState({
        user: null,
        isLoading: false,
        isInitialized: false,
        error: null,
      });
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isInitialized).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('initialize', () => {
    it('should subscribe to auth state and return unsubscribe function', () => {
      const unsubscribeMock = jest.fn();
      (subscribeToAuthState as jest.Mock).mockReturnValue(unsubscribeMock);

      const { result } = renderHook(() => useAuthStore());

      let unsubscribe: () => void;
      act(() => {
        unsubscribe = result.current.initialize();
      });

      expect(subscribeToAuthState).toHaveBeenCalled();
      expect(typeof unsubscribe!).toBe('function');
    });

    it('should update state when auth state changes', () => {
      const mockUser = { uid: '123', email: 'test@example.com' };
      let authCallback: (user: any) => void;

      (subscribeToAuthState as jest.Mock).mockImplementation((callback) => {
        authCallback = callback;
        return jest.fn();
      });

      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.initialize();
      });

      act(() => {
        authCallback!(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isInitialized).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('login', () => {
    it('should call signIn with correct credentials', async () => {
      (signIn as jest.Mock).mockResolvedValue({ user: { uid: '123' } });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.login({
          email: 'test@example.com',
          password: 'password123',
        });
      });

      expect(signIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should set error on login failure', async () => {
      const error = { code: 'auth/wrong-password' };
      (signIn as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.login({
            email: 'test@example.com',
            password: 'wrongpassword',
          });
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Wrong password');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('register', () => {
    it('should call signUp with correct data', async () => {
      (signUp as jest.Mock).mockResolvedValue({ user: { uid: '123' } });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.register({
          email: 'new@example.com',
          password: 'password123',
          displayName: 'New User',
        });
      });

      expect(signUp).toHaveBeenCalledWith({
        email: 'new@example.com',
        password: 'password123',
        displayName: 'New User',
      });
    });

    it('should set error on registration failure', async () => {
      const error = { code: 'auth/invalid-email' };
      (signUp as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.register({
            email: 'invalid',
            password: 'password123',
          });
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('Invalid email');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('logout', () => {
    it('should call signOut and reset user', async () => {
      (signOut as jest.Mock).mockResolvedValue(undefined);

      // Set initial user
      act(() => {
        useAuthStore.setState({ user: { uid: '123' } as any });
      });

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.logout();
      });

      expect(signOut).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isLoading).toBe(false);
    });

    it('should set error on logout failure', async () => {
      const error = { code: 'auth/network-error' };
      (signOut as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.logout();
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('An error occurred');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('sendPasswordReset', () => {
    it('should call resetPassword with email', async () => {
      (resetPassword as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        await result.current.sendPasswordReset('test@example.com');
      });

      expect(resetPassword).toHaveBeenCalledWith('test@example.com');
      expect(result.current.isLoading).toBe(false);
    });

    it('should set error on password reset failure', async () => {
      const error = { code: 'auth/user-not-found' };
      (resetPassword as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthStore());

      await act(async () => {
        try {
          await result.current.sendPasswordReset('notfound@example.com');
        } catch (e) {
          // Expected error
        }
      });

      expect(result.current.error).toBe('User not found');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      // Set initial error
      act(() => {
        useAuthStore.setState({ error: 'Some error' });
      });

      const { result } = renderHook(() => useAuthStore());

      expect(result.current.error).toBe('Some error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
