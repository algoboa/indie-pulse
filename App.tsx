// Indie Pulse - Main App Entry Point
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { AppNavigator } from './src/navigation';
import { paperTheme, colors } from './src/constants/theme';
import { ErrorBoundary } from './src/components/common';

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <PaperProvider theme={paperTheme}>
          <StatusBar style="light" />
          <AppNavigator />
          <Toast
            position="top"
            topOffset={60}
            visibilityTime={3000}
          />
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
