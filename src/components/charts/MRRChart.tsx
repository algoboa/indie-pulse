// MRR Chart Component for Indie Pulse
import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { MRRTimeSeriesDataPoint } from '../../types/metrics';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface MRRChartProps {
  data: MRRTimeSeriesDataPoint[];
  height?: number;
  showLabels?: boolean;
}

const MRRChart: React.FC<MRRChartProps> = ({
  data,
  height = 220,
  showLabels = true,
}) => {
  const screenWidth = Dimensions.get('window').width - spacing.md * 2;

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [{ data: [0] }],
      };
    }

    // Get last 6 months for display
    const displayData = data.slice(-6);

    // Format labels (e.g., "1月", "2月")
    const labels = displayData.map((point) => {
      const date = new Date(point.date);
      return `${date.getMonth() + 1}月`;
    });

    // Get MRR values in man-yen (万円)
    const values = displayData.map((point) => point.value / 10000);

    return {
      labels,
      datasets: [
        {
          data: values,
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // Purple
          strokeWidth: 3,
        },
      ],
    };
  }, [data]);

  const formatYLabel = (value: string): string => {
    return `¥${parseFloat(value).toFixed(0)}万`;
  };

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={styles.noDataText}>データがありません</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={screenWidth - spacing.md * 2}
        height={height}
        yAxisLabel=""
        yAxisSuffix=""
        formatYLabel={formatYLabel}
        chartConfig={{
          backgroundColor: colors.background.secondary,
          backgroundGradientFrom: colors.background.secondary,
          backgroundGradientTo: colors.background.secondary,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(160, 160, 176, ${opacity})`,
          style: {
            borderRadius: borderRadius.md,
          },
          propsForDots: {
            r: '5',
            strokeWidth: '2',
            stroke: colors.accent.primary,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.chart.grid,
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withVerticalLabels={showLabels}
        withHorizontalLabels={showLabels}
        fromZero={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  noDataText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
  },
});

export default MRRChart;
