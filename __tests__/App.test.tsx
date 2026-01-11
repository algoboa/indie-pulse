import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import App from '../App';

// Mock Firebase
jest.mock('../src/services/firebase', () => ({
  auth: {
    currentUser: null,
  },
  db: {},
  app: {},
}));

// Mock Firebase Auth
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(() => ({})),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simulate no user logged in
    callback(null);
    return jest.fn(); // Return unsubscribe function
  }),
  createUserWithEmailAndPassword: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  signOut: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
  updateProfile: jest.fn(),
}));

// Mock Firestore
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({})),
  doc: jest.fn(),
  setDoc: jest.fn(),
  getDoc: jest.fn(),
  serverTimestamp: jest.fn(() => new Date().toISOString()),
}));

describe('App', () => {
  it('renders without crashing', async () => {
    const { getAllByText } = render(<App />);

    // Wait for auth state to be initialized and show login screen
    await waitFor(() => {
      // Use getAllByText since there might be multiple elements with this text
      const elements = getAllByText('Indie Pulse');
      expect(elements.length).toBeGreaterThan(0);
    });
  });

  it('shows login screen when user is not authenticated', async () => {
    const { getAllByText, getAllByTestId } = render(<App />);

    await waitFor(() => {
      // Check for login-related elements
      const loginElements = getAllByText('ログイン');
      expect(loginElements.length).toBeGreaterThan(0);

      // Use getAllByTestId since the mock renders all screens
      const emailInputs = getAllByTestId('email-input');
      const passwordInputs = getAllByTestId('password-input');
      expect(emailInputs.length).toBeGreaterThan(0);
      expect(passwordInputs.length).toBeGreaterThan(0);
    });
  });

  it('shows login button', async () => {
    const { getByTestId } = render(<App />);

    await waitFor(() => {
      expect(getByTestId('login-button')).toBeTruthy();
    });
  });
});
