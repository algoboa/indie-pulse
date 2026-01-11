// MRR Breakdown Component for Dashboard
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { MRRBreakdown as MRRBreakdownType } from '../../types/metrics';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface MRRBreakdownProps {
  breakdown: MRRBreakdownType;
}

const MRRBreakdown: React.FC<MRRBreakdownProps> = ({ breakdown }) => {
  const formatCurrency = (value: number): string => {
    return `¥${value.toLocaleString()}`;
  };

  const items = [
    {
      label: '新規',
      value: formatCurrency(breakdown.newMrr),
      color: colors.chart.newMrr,
      isNegative: false,
    },
    {
      label: '拡大',
      value: formatCurrency(breakdown.expansionMrr),
      color: colors.chart.expansion,
      isNegative: false,
    },
    {
      label: '縮小',
      value: `-${formatCurrency(breakdown.contractionMrr)}`,
      color: colors.chart.contraction,
      isNegative: true,
    },
    {
      label: '解約',
      value: `-${formatCurrency(breakdown.churnMrr)}`,
      color: colors.chart.churn,
      isNegative: true,
    },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.primary,
  },
  item: {
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  label: {
    fontSize: typography.fontSize.xs,
    color: colors.text.tertiary,
    marginBottom: 2,
  },
  value: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
});

export default React.memo(MRRBreakdown);
