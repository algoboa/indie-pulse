// Platform Card Component for Integrations
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PlatformType, PlatformConfig, PLATFORM_CONFIGS } from '../../types/platform';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface PlatformCardProps {
  platform: PlatformType;
  isConnected: boolean;
  isConnecting?: boolean;
  isSyncing?: boolean;
  lastSyncAt?: string | null;
  onConnect: () => void;
  onDisconnect?: () => void;
  onSync?: () => void;
}

const getIconName = (platform: PlatformType): keyof typeof MaterialCommunityIcons.glyphMap => {
  const icons: Record<PlatformType, keyof typeof MaterialCommunityIcons.glyphMap> = {
    stripe: 'credit-card-outline',
    app_store: 'apple',
    google_play: 'google-play',
    revenuecat: 'cat',
  };
  return icons[platform];
};

const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  isConnected,
  isConnecting = false,
  isSyncing = false,
  lastSyncAt,
  onConnect,
  onDisconnect,
  onSync,
}) => {
  const config = PLATFORM_CONFIGS[platform];

  const formatLastSync = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '未同期';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}時間前`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}日前`;
  };

  return (
    <View
      style={styles.card}
      accessible={true}
      accessibilityLabel={`${config.name}: ${isConnected ? '連携中' : '未連携'}`}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: config.color }]}>
          <MaterialCommunityIcons
            name={getIconName(platform)}
            size={24}
            color={colors.text.primary}
          />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{config.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {config.description}
          </Text>
        </View>
      </View>

      {isConnected ? (
        <View style={styles.connectedContent}>
          <View style={styles.statusRow}>
            <View style={styles.statusBadge}>
              <View style={[styles.statusDot, { backgroundColor: colors.semantic.success }]} />
              <Text style={styles.statusText}>連携中</Text>
            </View>
            <Text style={styles.lastSync}>
              最終同期: {formatLastSync(lastSyncAt)}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.syncButton}
              onPress={onSync}
              disabled={isSyncing}
              accessibilityRole="button"
              accessibilityLabel={`${config.name}を同期`}
              accessibilityHint="プラットフォームからデータを取得します"
              accessibilityState={{ disabled: isSyncing }}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.accent.primary} />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="refresh"
                    size={18}
                    color={colors.accent.primary}
                  />
                  <Text style={styles.syncButtonText}>同期</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.disconnectButton}
              onPress={onDisconnect}
              accessibilityRole="button"
              accessibilityLabel={`${config.name}の連携を解除`}
              accessibilityHint="このプラットフォームとの連携を解除します"
            >
              <Text style={styles.disconnectButtonText}>連携解除</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.connectButton}
          onPress={onConnect}
          disabled={isConnecting}
          accessibilityRole="button"
          accessibilityLabel={`${config.name}と連携する`}
          accessibilityHint="このプラットフォームとの連携を開始します"
          accessibilityState={{ disabled: isConnecting }}
        >
          {isConnecting ? (
            <ActivityIndicator size="small" color={colors.text.primary} />
          ) : (
            <Text style={styles.connectButtonText}>連携する</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
  },
  name: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  description: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  connectedContent: {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  statusText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.success,
    fontWeight: typography.fontWeight.medium,
  },
  lastSync: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    minWidth: 80,
    justifyContent: 'center',
  },
  syncButtonText: {
    color: colors.accent.primary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    marginLeft: spacing.xs,
  },
  disconnectButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.semantic.error,
  },
  disconnectButtonText: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  connectButton: {
    backgroundColor: colors.accent.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  connectButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
});

export default React.memo(PlatformCard);
