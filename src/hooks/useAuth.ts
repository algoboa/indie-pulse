// Custom hook for authentication state and actions
import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    sendPasswordReset,
    clearError,
  } = useAuthStore();

  // Derived state
  const isAuthenticated = !!user;

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login({ email, password });
        return { success: true };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [login]
  );

  const handleRegister = useCallback(
    async (email: string, password: string, displayName: string) => {
      try {
        await register({ email, password, displayName });
        return { success: true };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [register]
  );

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [logout]);

  const handleResetPassword = useCallback(
    async (email: string) => {
      try {
        await sendPasswordReset(email);
        return { success: true };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [sendPasswordReset]
  );

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    resetPassword: handleResetPassword,
    clearError,
  };
};

export default useAuth;
