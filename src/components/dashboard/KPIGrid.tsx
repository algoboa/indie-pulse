// KPI Grid Component for Dashboard
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { KPICard } from '../cards';
import { DashboardMetrics } from '../../types/metrics';
import { spacing } from '../../constants/theme';

interface KPIGridProps {
  metrics: DashboardMetrics;
}

const KPIGrid: React.FC<KPIGridProps> = ({ metrics }) => {
  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString()}`;
  };

  // Memoize the KPI data to prevent unnecessary recalculations
  const kpiData = useMemo(() => ({
    mrr: {
      label: 'MRR',
      value: formatCurrency(metrics.mrr.value),
      change: metrics.mrr.changePercent,
      trend: metrics.mrr.trend,
    },
    churnRate: {
      label: '解約率',
      value: metrics.churnRate.value,
      suffix: '%',
      change: metrics.churnRate.changePercent,
      trend: metrics.churnRate.trend,
      isNegativeGood: true,
    },
    ltv: {
      label: 'LTV',
      value: formatCurrency(metrics.ltv.value),
      change: metrics.ltv.changePercent,
      trend: metrics.ltv.trend,
    },
    arpu: {
      label: 'ARPU',
      value: formatCurrency(metrics.arpu.value),
      change: metrics.arpu.changePercent,
      trend: metrics.arpu.trend,
    },
    newCustomers: {
      label: '新規顧客',
      value: metrics.customers.newCustomers,
      suffix: '人',
    },
    activeUsers: {
      label: 'アクティブ',
      value: metrics.customers.activeUsers,
      suffix: '人',
    },
  }), [metrics]);

  return (
    <View style={styles.grid}>
      {/* MRR Card - Featured */}
      <KPICard
        label={kpiData.mrr.label}
        value={kpiData.mrr.value}
        change={kpiData.mrr.change}
        trend={kpiData.mrr.trend}
        isFeatured
        style={styles.mrrCard}
        testID="mrr-card"
      />

      {/* Churn Rate */}
      <KPICard
        label={kpiData.churnRate.label}
        value={kpiData.churnRate.value}
        suffix={kpiData.churnRate.suffix}
        change={kpiData.churnRate.change}
        trend={kpiData.churnRate.trend}
        isNegativeGood={kpiData.churnRate.isNegativeGood}
        style={styles.kpiCard}
      />

      {/* LTV */}
      <KPICard
        label={kpiData.ltv.label}
        value={kpiData.ltv.value}
        change={kpiData.ltv.change}
        trend={kpiData.ltv.trend}
        style={styles.kpiCard}
      />

      {/* ARPU */}
      <KPICard
        label={kpiData.arpu.label}
        value={kpiData.arpu.value}
        change={kpiData.arpu.change}
        trend={kpiData.arpu.trend}
        style={styles.kpiCard}
      />

      {/* New Customers */}
      <KPICard
        label={kpiData.newCustomers.label}
        value={kpiData.newCustomers.value}
        suffix={kpiData.newCustomers.suffix}
        style={styles.kpiCard}
      />

      {/* Active Users */}
      <KPICard
        label={kpiData.activeUsers.label}
        value={kpiData.activeUsers.value}
        suffix={kpiData.activeUsers.suffix}
        style={styles.kpiCard}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
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
});

export default React.memo(KPIGrid);
