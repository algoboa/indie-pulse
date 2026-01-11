// Integrations Screen for Indie Pulse
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIntegrationsStore } from '../../store/integrationsStore';
import { PlatformCard } from '../../components/integrations';
import { PlatformType, PLATFORM_CONFIGS } from '../../types/platform';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const availablePlatforms: PlatformType[] = ['stripe', 'app_store', 'google_play', 'revenuecat'];

const IntegrationsScreen: React.FC = () => {
  const {
    connections,
    syncStatuses,
    isConnecting,
    error,
    connectPlatform,
    disconnectPlatform,
    syncPlatform,
    syncAllPlatforms,
    clearError,
  } = useIntegrationsStore();

  // Check if a platform is connected
  const isConnected = (platform: PlatformType): boolean => {
    return connections.some((c) => c.platform === platform);
  };

  // Get connection for a platform
  const getConnection = (platform: PlatformType) => {
    return connections.find((c) => c.platform === platform);
  };

  // Handle connect
  const handleConnect = async (platform: PlatformType) => {
    // In a real app, this would open OAuth flow
    Alert.alert(
      '連携を開始',
      `${PLATFORM_CONFIGS[platform].name}との連携を開始します。\n\n※デモ版のため、自動的に連携が完了します。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '連携する',
          onPress: () => connectPlatform(platform),
        },
      ]
    );
  };

  // Handle disconnect
  const handleDisconnect = (connectionId: string, platformName: string) => {
    Alert.alert(
      '連携を解除',
      `${platformName}との連携を解除してもよろしいですか？\n\nデータは削除されませんが、自動同期が停止します。`,
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '解除する',
          style: 'destructive',
          onPress: () => disconnectPlatform(connectionId),
        },
      ]
    );
  };

  // Handle sync
  const handleSync = (connectionId: string) => {
    syncPlatform(connectionId);
  };

  // Handle sync all
  const handleSyncAll = () => {
    if (connections.length === 0) {
      Alert.alert('連携なし', '連携しているプラットフォームがありません。');
      return;
    }
    syncAllPlatforms();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>プラットフォーム連携</Text>
          <Text style={styles.subtitle}>
            収益データを取得するプラットフォームを連携します
          </Text>
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={clearError}>
              <MaterialCommunityIcons
                name="close"
                size={20}
                color={colors.semantic.error}
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Connected Platforms Section */}
        {connections.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>連携中のプラットフォーム</Text>
              <TouchableOpacity style={styles.syncAllButton} onPress={handleSyncAll}>
                <MaterialCommunityIcons
                  name="refresh"
                  size={16}
                  color={colors.accent.primary}
                />
                <Text style={styles.syncAllText}>すべて同期</Text>
              </TouchableOpacity>
            </View>

            {connections.map((connection) => (
              <PlatformCard
                key={connection.id}
                platform={connection.platform}
                isConnected={true}
                isSyncing={syncStatuses[connection.id]?.isSyncing || connection.status === 'syncing'}
                lastSyncAt={connection.lastSyncAt}
                onConnect={() => {}}
                onDisconnect={() =>
                  handleDisconnect(connection.id, PLATFORM_CONFIGS[connection.platform].name)
                }
                onSync={() => handleSync(connection.id)}
              />
            ))}
          </View>
        )}

        {/* Available Platforms Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {connections.length > 0 ? '追加で連携可能' : '連携可能なプラットフォーム'}
          </Text>

          {availablePlatforms
            .filter((platform) => !isConnected(platform))
            .map((platform) => (
              <PlatformCard
                key={platform}
                platform={platform}
                isConnected={false}
                isConnecting={isConnecting}
                onConnect={() => handleConnect(platform)}
              />
            ))}

          {availablePlatforms.every((platform) => isConnected(platform)) && (
            <View style={styles.allConnectedCard}>
              <MaterialCommunityIcons
                name="check-circle"
                size={48}
                color={colors.semantic.success}
              />
              <Text style={styles.allConnectedText}>
                すべてのプラットフォームと連携済みです
              </Text>
            </View>
          )}
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={20}
            color={colors.text.tertiary}
          />
          <Text style={styles.helpText}>
            各プラットフォームとの連携にはそれぞれのアカウントが必要です。
            連携は安全なOAuth認証を使用しており、パスワードが共有されることはありません。
          </Text>
        </View>
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
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  errorBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${colors.semantic.error}20`,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  errorText: {
    flex: 1,
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
    marginRight: spacing.sm,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  syncAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  syncAllText: {
    color: colors.accent.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
  },
  allConnectedCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  allConnectedText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  helpSection: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  helpText: {
    flex: 1,
    color: colors.text.tertiary,
    fontSize: typography.fontSize.sm,
    lineHeight: 20,
    marginLeft: spacing.sm,
  },
});

export default IntegrationsScreen;
