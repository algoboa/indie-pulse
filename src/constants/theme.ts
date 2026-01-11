// Indie Pulse Theme Constants
// Dark mode as default, inspired by Stripe Dashboard and Baremetrics

export const colors = {
  // Base colors (Dark mode)
  background: {
    primary: '#0A0A0F',      // Main background
    secondary: '#14141F',     // Card backgrounds
    tertiary: '#1E1E2E',      // Elevated elements
  },

  // Text colors
  text: {
    primary: '#FFFFFF',       // Primary text
    secondary: '#A0A0B0',     // Secondary text
    tertiary: '#6B6B7B',      // Muted text
    inverse: '#0A0A0F',       // Text on light backgrounds
  },

  // Accent colors
  accent: {
    primary: '#8B5CF6',       // Purple - primary actions
    secondary: '#06D6A0',     // Green - positive metrics
    tertiary: '#3B82F6',      // Blue - informational
  },

  // Semantic colors
  semantic: {
    success: '#10B981',       // Positive change, growth
    warning: '#F59E0B',       // Caution
    error: '#EF4444',         // Negative change, errors
    info: '#3B82F6',          // Informational
  },

  // Chart colors
  chart: {
    mrr: '#8B5CF6',           // Purple for MRR
    newMrr: '#10B981',        // Green for new MRR
    expansion: '#06D6A0',     // Teal for expansion
    contraction: '#F59E0B',   // Amber for contraction
    churn: '#EF4444',         // Red for churn
    line: '#A78BFA',          // Line chart color
    grid: '#2E2E3E',          // Grid lines
  },

  // Border colors
  border: {
    primary: '#2E2E3E',
    secondary: '#3E3E4E',
    focus: '#8B5CF6',
  },

  // Platform brand colors
  platform: {
    stripe: '#635BFF',
    appStore: '#0D96F6',
    googlePlay: '#01875F',
    revenueCat: '#F2545B',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  // Font families
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'monospace',
  },

  // Font sizes
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};

// React Native Paper theme configuration
export const paperTheme = {
  dark: true,
  colors: {
    primary: colors.accent.primary,
    secondary: colors.accent.secondary,
    tertiary: colors.accent.tertiary,
    surface: colors.background.secondary,
    surfaceVariant: colors.background.tertiary,
    background: colors.background.primary,
    error: colors.semantic.error,
    onPrimary: colors.text.primary,
    onSecondary: colors.text.primary,
    onTertiary: colors.text.primary,
    onSurface: colors.text.primary,
    onSurfaceVariant: colors.text.secondary,
    onBackground: colors.text.primary,
    onError: colors.text.primary,
    outline: colors.border.primary,
    outlineVariant: colors.border.secondary,
    inverseSurface: colors.text.primary,
    inverseOnSurface: colors.background.primary,
    inversePrimary: colors.accent.primary,
    elevation: {
      level0: 'transparent',
      level1: colors.background.secondary,
      level2: colors.background.tertiary,
      level3: colors.background.tertiary,
      level4: colors.background.tertiary,
      level5: colors.background.tertiary,
    },
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  paperTheme,
};
