// Period Filter Component for Dashboard
import React from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { PeriodFilter as PeriodFilterType } from '../../types/metrics';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

const periodOptions: { label: string; value: PeriodFilterType['type'] }[] = [
  { label: '今月', value: 'this_month' },
  { label: '先月', value: 'last_month' },
  { label: '3ヶ月', value: 'last_3_months' },
  { label: '6ヶ月', value: 'last_6_months' },
];

interface PeriodFilterProps {
  selectedPeriod: PeriodFilterType['type'];
  onPeriodChange: (period: PeriodFilterType['type']) => void;
}

const PeriodFilter: React.FC<PeriodFilterProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      accessibilityRole="tablist"
    >
      {periodOptions.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.button,
            selectedPeriod === option.value && styles.buttonActive,
          ]}
          onPress={() => onPeriodChange(option.value)}
          accessibilityRole="tab"
          accessibilityState={{ selected: selectedPeriod === option.value }}
          accessibilityLabel={`期間: ${option.label}`}
        >
          <Text
            style={[
              styles.buttonText,
              selectedPeriod === option.value && styles.buttonTextActive,
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.background.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  buttonActive: {
    backgroundColor: colors.accent.primary,
  },
  buttonText: {
    color: colors.text.secondary,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
  },
  buttonTextActive: {
    color: colors.text.primary,
  },
});

export default React.memo(PeriodFilter);
