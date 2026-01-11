// Cohorts Screen for Indie Pulse
import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDataStore } from '../../store/dataStore';
import { CohortHeatmap } from '../../components/charts';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const CohortsScreen: React.FC = () => {
  const {
    cohorts,
    isLoading,
    isRefreshing,
    error,
    fetchAnalysisData,
    refreshData,
  } = useDataStore();

  // Memoize summary calculations for performance
  const summaryStats = useMemo(() => {
    if (cohorts.length === 0) return null;

    const avgRetention = (
      cohorts.reduce((sum, c) => sum + (c.retentionRates[0] || 0), 0) / cohorts.length
    ).toFixed(1);

    const avgLtv = Math.round(
      cohorts.reduce((sum, c) => sum + c.ltv, 0) / cohorts.length
    );

    const totalUsers = cohorts.reduce((sum, c) => sum + c.totalUsers, 0);

    return {
      avgRetention,
      avgLtv,
      totalUsers,
      periodMonths: cohorts.length,
    };
  }, [cohorts]);

  useEffect(() => {
    if (cohorts.length === 0) {
      fetchAnalysisData();
    }
  }, [cohorts.length, fetchAnalysisData]);

  if (isLoading && cohorts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.accent.primary} />
          <Text style={styles.loadingText}>分析データを読み込み中...</Text>
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
        <View style={styles.header}>
          <Text style={styles.title}>コホート分析</Text>
          <Text style={styles.subtitle}>
            ユーザー獲得月ごとの継続率を分析
          </Text>
        </View>

        {/* Description */}
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            このチャートは、どの時期に獲得したユーザーが、より長くサービスを使い続けているかを示します。
            色が濃いほど継続率が高いことを意味します。
          </Text>
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>継続率の凡例</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.semantic.success }]} />
              <Text style={styles.legendText}>80%以上</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#22C55E80' }]} />
              <Text style={styles.legendText}>60-80%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.semantic.warning }]} />
              <Text style={styles.legendText}>40-60%</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.semantic.error }]} />
              <Text style={styles.legendText}>20%未満</Text>
            </View>
          </View>
        </View>

        {/* Heatmap */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>月別継続率</Text>
          <CohortHeatmap data={cohorts} />
        </View>

        {/* Summary Stats */}
        {summaryStats && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>サマリー</Text>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>平均初月継続率</Text>
                <Text style={styles.summaryValue}>
                  {summaryStats.avgRetention}%
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>平均LTV</Text>
                <Text style={styles.summaryValue}>
                  ¥{summaryStats.avgLtv.toLocaleString()}
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>総ユーザー数</Text>
                <Text style={styles.summaryValue}>
                  {summaryStats.totalUsers}人
                </Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryLabel}>分析期間</Text>
                <Text style={styles.summaryValue}>{summaryStats.periodMonths}ヶ月</Text>
              </View>
            </View>
          </View>
        )}

        {/* Pro Feature Badge */}
        <View style={styles.proBadge}>
          <Text style={styles.proBadgeText}>
            この機能はProプランで利用可能です
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
  infoCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 3,
    borderLeftColor: colors.accent.tertiary,
  },
  infoText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  legendContainer: {
    marginBottom: spacing.lg,
  },
  legendTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    marginBottom: spacing.sm,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    marginBottom: spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: borderRadius.sm,
    marginRight: spacing.xs,
  },
  legendText: {
    fontSize: typography.fontSize.sm,
    color: colors.text.tertiary,
  },
  chartContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  chartTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryContainer: {
    marginBottom: spacing.lg,
  },
  summaryTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.xs,
  },
  summaryCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    margin: spacing.xs,
    width: '47%',
  },
  summaryLabel: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  proBadge: {
    backgroundColor: colors.accent.primary + '20',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  proBadgeText: {
    fontSize: typography.fontSize.sm,
    color: colors.accent.primary,
    fontWeight: typography.fontWeight.medium,
  },
});

export default CohortsScreen;
