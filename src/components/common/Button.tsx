// Custom Button component for Indie Pulse
import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface ButtonProps {
  onPress: () => void;
  children: string;
  mode?: 'contained' | 'outlined' | 'text';
  variant?: 'primary' | 'secondary' | 'success' | 'error';
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  onPress,
  children,
  mode = 'contained',
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  labelStyle,
  testID,
}) => {
  const getButtonColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.accent.secondary;
      case 'success':
        return colors.semantic.success;
      case 'error':
        return colors.semantic.error;
      case 'primary':
      default:
        return colors.accent.primary;
    }
  };

  const buttonColor = getButtonColor();

  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      buttonColor={mode === 'contained' ? buttonColor : undefined}
      textColor={mode === 'contained' ? colors.text.primary : buttonColor}
      style={[styles.button, style]}
      labelStyle={[styles.label, labelStyle]}
      testID={testID}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Button;
