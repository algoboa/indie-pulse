// Cohort Heatmap Component
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { CohortData } from '../../types/metrics';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface CohortHeatmapProps {
  data: CohortData[];
}

const CohortHeatmap: React.FC<CohortHeatmapProps> = ({ data }) => {
  // Get max months to display
  const maxMonths = Math.max(...data.map((d) => d.retentionRates.length));

  // Get color based on retention rate
  const getColor = (rate: number): string => {
    if (rate >= 80) return colors.semantic.success;
    if (rate >= 60) return '#22C55E80';
    if (rate >= 40) return colors.semantic.warning;
    if (rate >= 20) return '#F59E0B80';
    return colors.semantic.error;
  };

  // Format month label
  const formatMonth = (monthStr: string): string => {
    const [year, month] = monthStr.split('-');
    return `${month}月`;
  };

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>コホートデータがありません</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header Row */}
        <View style={styles.row}>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>獲得月</Text>
          </View>
          <View style={styles.headerCell}>
            <Text style={styles.headerText}>ユーザー数</Text>
          </View>
          {Array.from({ length: maxMonths }, (_, i) => (
            <View key={i} style={styles.headerCell}>
              <Text style={styles.headerText}>{i === 0 ? '初月' : `${i}ヶ月後`}</Text>
            </View>
          ))}
        </View>

        {/* Data Rows */}
        {data.map((cohort) => (
          <View key={cohort.cohortMonth} style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>{formatMonth(cohort.cohortMonth)}</Text>
            </View>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>{cohort.totalUsers}</Text>
            </View>
            {cohort.retentionRates.map((rate, index) => (
              <View
                key={index}
                style={[styles.dataCell, { backgroundColor: getColor(rate) }]}
              >
                <Text style={styles.dataText}>{rate.toFixed(0)}%</Text>
              </View>
            ))}
            {/* Fill empty cells */}
            {Array.from({ length: maxMonths - cohort.retentionRates.length }, (_, i) => (
              <View key={`empty-${i}`} style={styles.emptyCell} />
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.sm,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  headerCell: {
    width: 70,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  labelCell: {
    width: 70,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.tertiary,
    borderRadius: borderRadius.sm,
    marginRight: 2,
  },
  labelText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.text.primary,
  },
  dataCell: {
    width: 70,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    marginRight: 2,
  },
  dataText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  emptyCell: {
    width: 70,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    marginRight: 2,
  },
});

export default CohortHeatmap;
