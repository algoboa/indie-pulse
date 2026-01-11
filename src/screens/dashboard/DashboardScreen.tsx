// Dashboard Screen for Indie Pulse
import React, { useEffect } from 'react';
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
import { KPICard } from '../../components/cards';
import { MRRChart } from '../../components/charts';
import { AIInsightsPanel } from '../../components/dashboard';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';
import { PeriodFilter } from '../../types/metrics';

const periodOptions: { label: string; value: PeriodFilter['type'] }[] = [
  { label: '今月', value: 'this_month' },
  { label: '先月', value: 'last_month' },
  { label: '3ヶ月', value: 'last_3_months' },
  { label: '6ヶ月', value: 'last_6_months' },
];

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

  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString()}`;
  };

  const handlePeriodChange = (type: PeriodFilter['type']) => {
    setPeriodFilter({ type });
  };

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
          <TouchableOpacity style={styles.retryButton} onPress={fetchDashboard}>
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {periodOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.filterButton,
                periodFilter.type === option.value && styles.filterButtonActive,
              ]}
              onPress={() => handlePeriodChange(option.value)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  periodFilter.type === option.value && styles.filterButtonTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* KPI Cards */}
        {metrics && (
          <>
            <View style={styles.kpiGrid}>
              {/* MRR Card - Featured */}
              <KPICard
                label="MRR"
                value={formatCurrency(metrics.mrr.value)}
                change={metrics.mrr.changePercent}
                trend={metrics.mrr.trend}
                isFeatured
                style={styles.mrrCard}
                testID="mrr-card"
              />

              {/* Churn Rate */}
              <KPICard
                label="解約率"
                value={metrics.churnRate.value}
                suffix="%"
                change={metrics.churnRate.changePercent}
                trend={metrics.churnRate.trend}
                isNegativeGood
                style={styles.kpiCard}
              />

              {/* LTV */}
              <KPICard
                label="LTV"
                value={formatCurrency(metrics.ltv.value)}
                change={metrics.ltv.changePercent}
                trend={metrics.ltv.trend}
                style={styles.kpiCard}
              />

              {/* ARPU */}
              <KPICard
                label="ARPU"
                value={formatCurrency(metrics.arpu.value)}
                change={metrics.arpu.changePercent}
                trend={metrics.arpu.trend}
                style={styles.kpiCard}
              />

              {/* New Customers */}
              <KPICard
                label="新規顧客"
                value={metrics.customers.newCustomers}
                suffix="人"
                style={styles.kpiCard}
              />

              {/* Active Users */}
              <KPICard
                label="アクティブ"
                value={metrics.customers.activeUsers}
                suffix="人"
                style={styles.kpiCard}
              />
            </View>

            {/* MRR Chart */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>MRR推移</Text>
              <MRRChart data={metrics.mrrHistory} />

              {/* MRR Breakdown */}
              <View style={styles.breakdownContainer}>
                <View style={styles.breakdownItem}>
                  <View style={[styles.breakdownDot, { backgroundColor: colors.chart.newMrr }]} />
                  <Text style={styles.breakdownLabel}>新規</Text>
                  <Text style={styles.breakdownValue}>
                    {formatCurrency(metrics.mrrBreakdown.newMrr)}
                  </Text>
                </View>
                <View style={styles.breakdownItem}>
                  <View style={[styles.breakdownDot, { backgroundColor: colors.chart.expansion }]} />
                  <Text style={styles.breakdownLabel}>拡大</Text>
                  <Text style={styles.breakdownValue}>
                    {formatCurrency(metrics.mrrBreakdown.expansionMrr)}
                  </Text>
                </View>
                <View style={styles.breakdownItem}>
                  <View style={[styles.breakdownDot, { backgroundColor: colors.chart.contraction }]} />
                  <Text style={styles.breakdownLabel}>縮小</Text>
                  <Text style={styles.breakdownValue}>
                    -{formatCurrency(metrics.mrrBreakdown.contractionMrr)}
                  </Text>
                </View>
                <View style={styles.breakdownItem}>
                  <View style={[styles.breakdownDot, { backgroundColor: colors.chart.churn }]} />
                  <Text style={styles.breakdownLabel}>解約</Text>
                  <Text style={styles.breakdownValue}>
                    -{formatCurrency(metrics.mrrBreakdown.churnMrr)}
                  </Text>
                </View>
              </View>
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
  filterContainer: {
    marginBottom: spacing.lg,
  },
  filterButton: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: colors.accent.primary,
  },
  filterButtonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  filterButtonTextActive: {
    color: colors.text.primary,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  kpiCard: {
    margin: spacing.xs,
    flex: 1,
    minWidth: '45%',
  },
  mrrCard: {
    margin: spacing.xs,
    width: '97%',
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
  breakdownContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  breakdownItem: {
    alignItems: 'center',
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  breakdownLabel: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  breakdownValue: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});

export default DashboardScreen;
