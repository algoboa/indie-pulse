// Dashboard Screen for Indie Pulse
import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataStore } from '../../store/dataStore';
import { useAuthStore } from '../../store/authStore';
import { MRRChart } from '../../components/charts';
import {
  AIInsightsPanel,
  PeriodFilter,
  KPIGrid,
  MRRBreakdown,
} from '../../components/dashboard';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { PeriodFilter as PeriodFilterType } from '../../types/metrics';

const DashboardScreen: React.FC = () => {
  const { user } = useAuthStore();
  const {
    metrics,
    insights,
    isLoading,
    isRefreshing,
    error,
    periodFilter,
    fetchDashboard,
    refreshData,
    setPeriodFilter,
  } = useDataStore();

  // Fetch data on mount
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handlePeriodChange = useCallback((type: PeriodFilterType['type']) => {
    setPeriodFilter({ type });
  }, [setPeriodFilter]);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'おはようございます';
    if (hour < 18) return 'こんにちは';
    return 'こんばんは';
  };

  // Loading state
  if (isLoading && !metrics) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>データを読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && !metrics) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchDashboard}
            accessibilityRole="button"
            accessibilityLabel="再試行"
          >
            <Text style={styles.retryButtonText}>再試行</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshData}
            tintColor={colors.accent.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {getGreeting()}、{user?.displayName || 'ユーザー'}さん
          </Text>
          <Text style={styles.title}>ダッシュボード</Text>
        </View>

        {/* Period Filter */}
        <PeriodFilter
          selectedPeriod={periodFilter.type}
          onPeriodChange={handlePeriodChange}
        />

        {/* KPI Cards and Charts */}
        {metrics && (
          <>
            <KPIGrid metrics={metrics} />

            {/* MRR Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>MRR推移</Text>
              <MRRChart data={metrics.mrrHistory} />
              <MRRBreakdown breakdown={metrics.mrrBreakdown} />
            </View>

            {/* AI Insights */}
            <AIInsightsPanel insights={insights} />
          </>
        )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.secondary,
    marginTop: spacing.md,
    fontSize: typography.fontSize.base,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: colors.semantic.error,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  retryButton: {
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  retryButtonText: {
    color: colors.text.primary,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
  },
  header: {
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: typography.fontSize.base,
    color: colors.text.secondary,
  },
  title: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  chartContainer: {
    marginTop: spacing.lg,
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  chartTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
});

export default DashboardScreen;
