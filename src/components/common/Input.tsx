// Custom Input component for Indie Pulse
import React, { useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { TextInput, HelperText } from 'react-native-paper';
import { colors, spacing, borderRadius } from '../../constants/theme';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 'email' | 'password' | 'name' | 'off';
  error?: string;
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  style?: ViewStyle;
  testID?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete = 'off',
  error,
  disabled = false,
  left,
  right,
  style,
  testID,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const renderPasswordToggle = () => {
    if (!secureTextEntry) return right;

    return (
      <TextInput.Icon
        icon={isPasswordVisible ? 'eye-off' : 'eye'}
        onPress={togglePasswordVisibility}
        color={colors.text.secondary}
      />
    );
  };

  return (
    <View style={[styles.container, style]}>
      <TextInput
        label={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        disabled={disabled}
        error={!!error}
        mode="outlined"
        left={left}
        right={renderPasswordToggle()}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.input}
        outlineColor={colors.border.primary}
        activeOutlineColor={colors.accent.primary}
        textColor={colors.text.primary}
        placeholderTextColor={colors.text.tertiary}
        theme={{
          colors: {
            surfaceVariant: colors.background.secondary,
            onSurfaceVariant: colors.text.secondary,
            error: colors.semantic.error,
          },
        }}
        testID={testID}
      />
      {error && (
        <HelperText type="error" visible={!!error} style={styles.errorText}>
          {error}
        </HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  input: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
  },
  errorText: {
    color: colors.semantic.error,
  },
});

export default Input;
