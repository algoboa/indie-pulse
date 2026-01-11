// Authentication state store using Zustand
import { create } from 'zustand';
import { User } from 'firebase/auth';
import {
  signIn,
  signUp,
  signOut,
  resetPassword,
  subscribeToAuthState,
  SignInData,
  SignUpData,
  getAuthErrorMessage,
} from '../services/authService';

interface AuthState {
  // State
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  initialize: () => () => void;
  login: (data: SignInData) => Promise<void>;
  register: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialize auth state listener
  initialize: () => {
    const unsubscribe = subscribeToAuthState((user) => {
      set({ user, isInitialized: true, isLoading: false });
    });
    return unsubscribe;
  },

  // Login with email and password
  login: async (data: SignInData) => {
    set({ isLoading: true, error: null });
    try {
      await signIn(data);
      // User state will be updated by the auth state listener
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Register new user
  register: async (data: SignUpData) => {
    set({ isLoading: true, error: null });
    try {
      await signUp(data);
      // User state will be updated by the auth state listener
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Logout
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await signOut();
      set({ user: null, isLoading: false });
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Send password reset email
  sendPasswordReset: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await resetPassword(email);
      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage = getAuthErrorMessage(error.code);
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;
