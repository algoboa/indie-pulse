// Sign Up Screen for Indie Pulse
import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { colors, spacing, typography } from '../../constants/theme';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateDisplayName,
} from '../../utils/validation';

interface SignUpScreenProps {
  navigation: any;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({ navigation }) => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const { register, isLoading, error, clearError } = useAuthStore();

  const validateForm = (): boolean => {
    let isValid = true;
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    clearError();

    const nameResult = validateDisplayName(displayName);
    if (!nameResult.isValid) {
      setNameError(nameResult.error || '');
      isValid = false;
    }

    const emailResult = validateEmail(email);
    if (!emailResult.isValid) {
      setEmailError(emailResult.error || '');
      isValid = false;
    }

    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      setPasswordError(passwordResult.error || '');
      isValid = false;
    }

    const confirmResult = validatePasswordConfirm(password, confirmPassword);
    if (!confirmResult.isValid) {
      setConfirmPasswordError(confirmResult.error || '');
      isValid = false;
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      await register({ email, password, displayName });
    } catch (err) {
      // Error is handled by the store
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.logo}>Indie Pulse</Text>
            <Text style={styles.tagline}>14日間の無料トライアルを開始</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.title}>新規登録</Text>

            <Input
              label="名前"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
              autoComplete="name"
              error={nameError}
              testID="name-input"
            />

            <Input
              label="メールアドレス"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              error={emailError}
              testID="email-input"
            />

            <Input
              label="パスワード"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              error={passwordError}
              testID="password-input"
            />

            <Input
              label="パスワード（確認）"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              error={confirmPasswordError}
              testID="confirm-password-input"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              onPress={handleSignUp}
              loading={isLoading}
              style={styles.signUpButton}
              testID="signup-button"
            >
              アカウントを作成
            </Button>

            <Text style={styles.termsText}>
              アカウントを作成することで、
              <Text style={styles.termsLink}>利用規約</Text>と
              <Text style={styles.termsLink}>プライバシーポリシー</Text>
              に同意したものとみなされます。
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>すでにアカウントをお持ちですか？</Text>
            <TouchableOpacity onPress={navigateToLogin}>
              <Text style={styles.loginLink}>ログイン</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.accent.primary,
    marginBottom: spacing.sm,
  },
  tagline: {
    fontSize: typography.fontSize.base,
    color: colors.accent.secondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  signUpButton: {
    marginTop: spacing.md,
  },
  termsText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.accent.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginRight: spacing.xs,
  },
  loginLink: {
    color: colors.accent.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default SignUpScreen;
