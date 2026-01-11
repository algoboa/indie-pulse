// KPI Card Component for Indie Pulse
import React from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface KPICardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  isNegativeGood?: boolean;
  isFeatured?: boolean;
  prefix?: string;
  suffix?: string;
  style?: ViewStyle;
  testID?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  change,
  trend = 'stable',
  isNegativeGood = false,
  isFeatured = false,
  prefix = '',
  suffix = '',
  style,
  testID,
}) => {
  const getTrendColor = (): string => {
    if (trend === 'stable') return colors.text.secondary;
    const isPositive = trend === 'up';
    if (isNegativeGood) {
      return isPositive ? colors.semantic.error : colors.semantic.success;
    }
    return isPositive ? colors.semantic.success : colors.semantic.error;
  };

  const formatChange = (): string => {
    if (change === undefined) return '';
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getTrendIcon = (): string => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  return (
    <View
      style={[
        styles.card,
        isFeatured && styles.featuredCard,
        style,
      ]}
      testID={testID}
    >
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, isFeatured && styles.featuredValue]}>
        {prefix}
        {typeof value === 'number' ? value.toLocaleString() : value}
        {suffix}
      </Text>
      {change !== undefined && (
        <View style={styles.changeContainer}>
          <Text style={[styles.changeText, { color: getTrendColor() }]}>
            {getTrendIcon()} {formatChange()}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    minWidth: '47%',
  },
  featuredCard: {
    backgroundColor: colors.background.tertiary,
    borderWidth: 1,
    borderColor: colors.accent.primary,
  },
  label: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
  },
  featuredValue: {
    fontSize: typography.fontSize['3xl'],
    color: colors.accent.primary,
  },
  changeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  changeText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
});

export default KPICard;
