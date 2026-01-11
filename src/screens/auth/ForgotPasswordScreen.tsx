// Forgot Password Screen for Indie Pulse
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

interface ForgotPasswordScreenProps {
  navigation: any;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const { sendPasswordReset, isLoading, error, clearError } = useAuthStore();

  const validateForm = (): boolean => {
    setEmailError('');
    clearError();

    if (!email.trim()) {
      setEmailError('メールアドレスを入力してください');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('有効なメールアドレスを入力してください');
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    try {
      await sendPasswordReset(email);
      setIsEmailSent(true);
    } catch (err) {
      // Error is handled by the store
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  if (isEmailSent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContent}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>メールを送信しました</Text>
          <Text style={styles.successMessage}>
            {email} にパスワードリセット用のリンクを送信しました。
            メールを確認して、リンクをクリックしてください。
          </Text>
          <Button
            onPress={navigateToLogin}
            style={styles.backButton}
          >
            ログイン画面に戻る
          </Button>
        </View>
      </SafeAreaView>
    );
  }

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
          <TouchableOpacity
            onPress={navigateToLogin}
            style={styles.backLink}
          >
            <Text style={styles.backLinkText}>← 戻る</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>パスワードをリセット</Text>
            <Text style={styles.description}>
              登録したメールアドレスを入力してください。
              パスワードリセット用のリンクをお送りします。
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="メールアドレス"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoComplete="email"
              error={emailError}
              testID="email-input"
            />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <Button
              onPress={handleResetPassword}
              loading={isLoading}
              style={styles.resetButton}
              testID="reset-button"
            >
              リセットリンクを送信
            </Button>
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
    padding: spacing.lg,
  },
  backLink: {
    marginBottom: spacing.xl,
  },
  backLinkText: {
    color: colors.accent.primary,
    fontSize: typography.fontSize.base,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  description: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    lineHeight: 24,
  },
  form: {
    marginBottom: spacing.xl,
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  resetButton: {
    marginTop: spacing.md,
  },
  successContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  successIcon: {
    fontSize: 64,
    color: colors.semantic.success,
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  successMessage: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  backButton: {
    minWidth: 200,
  },
});

export default ForgotPasswordScreen;
