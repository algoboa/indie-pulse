// Settings Screen for Indie Pulse
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface SettingsItem {
  label: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  isEnabled: boolean;
  onPress?: () => void;
}

const SettingsScreen: React.FC = () => {
  const { user, logout, isLoading } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'ログアウト確認',
      'ログアウトしてもよろしいですか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Toast.show({
                type: 'success',
                text1: 'ログアウトしました',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'エラー',
                text2: 'ログアウトに失敗しました',
              });
            }
          },
        },
      ]
    );
  };

  const handleComingSoon = (label: string) => {
    Toast.show({
      type: 'info',
      text1: 'Coming Soon',
      text2: `${label}機能は近日公開予定です`,
    });
  };

  const settingsItems: SettingsItem[] = [
    { label: 'プロフィール編集', icon: 'account-edit', isEnabled: false },
    { label: 'サブスクリプション管理', icon: 'credit-card', isEnabled: false },
    { label: '連携アカウント', icon: 'link-variant', isEnabled: false },
    { label: '通知設定', icon: 'bell-outline', isEnabled: false },
    { label: '利用規約', icon: 'file-document-outline', isEnabled: false },
    { label: 'プライバシーポリシー', icon: 'shield-lock-outline', isEnabled: false },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>設定</Text>

        {/* User Info */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0) || user?.email?.charAt(0) || '?'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.displayName || 'ユーザー'}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>
        </View>

        {/* Subscription Badge */}
        <View style={styles.subscriptionCard}>
          <Text style={styles.subscriptionLabel}>現在のプラン</Text>
          <View style={styles.planBadge}>
            <Text style={styles.planText}>Starter</Text>
          </View>
          <Text style={styles.trialText}>トライアル期間中</Text>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.settingsItem,
                !item.isEnabled && styles.settingsItemDisabled,
              ]}
              onPress={() =>
                item.isEnabled && item.onPress
                  ? item.onPress()
                  : handleComingSoon(item.label)
              }
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityHint={
                item.isEnabled ? `${item.label}を開く` : '近日公開予定'
              }
              accessibilityState={{ disabled: !item.isEnabled }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={item.isEnabled ? colors.text.primary : colors.text.tertiary}
                style={styles.settingsIcon}
              />
              <Text
                style={[
                  styles.settingsLabel,
                  !item.isEnabled && styles.settingsLabelDisabled,
                ]}
              >
                {item.label}
              </Text>
              {!item.isEnabled && (
                <View style={styles.comingSoonBadge}>
                  <Text style={styles.comingSoonText}>準備中</Text>
                </View>
              )}
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.text.tertiary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <Button
          onPress={handleLogout}
          mode="outlined"
          variant="error"
          loading={isLoading}
          style={styles.logoutButton}
        >
          ログアウト
        </Button>

        {/* Version */}
        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    padding: spacing.md,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    textTransform: 'uppercase',
  },
  userInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  userEmail: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginTop: 2,
  },
  subscriptionCard: {
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  subscriptionLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  planBadge: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  planText: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  trialText: {
    fontSize: typography.fontSize.sm,
    color: colors.accent.secondary,
    marginTop: spacing.sm,
  },
  settingsList: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.primary,
  },
  settingsItemDisabled: {
    opacity: 0.7,
  },
  settingsIcon: {
    marginRight: spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
  },
  settingsLabelDisabled: {
    color: colors.text.tertiary,
  },
  comingSoonBadge: {
    backgroundColor: colors.background.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  comingSoonText: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  logoutButton: {
    marginBottom: spacing.lg,
  },
  version: {
    textAlign: 'center',
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
});

export default SettingsScreen;
