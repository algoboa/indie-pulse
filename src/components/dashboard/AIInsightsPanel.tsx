// AI Insights Panel Component
import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { AIInsight } from '../../types/metrics';
import { colors, spacing, typography, borderRadius } from '../../constants/theme';

interface AIInsightsPanelProps {
  insights: AIInsight[];
  maxDisplay?: number;
}

const AIInsightsPanel: React.FC<AIInsightsPanelProps> = ({
  insights,
  maxDisplay = 4,
}) => {
  const getTypeColor = (type: AIInsight['type']): string => {
    switch (type) {
      case 'positive':
        return colors.semantic.success;
      case 'negative':
        return colors.semantic.error;
      case 'warning':
        return colors.semantic.warning;
      case 'neutral':
      default:
        return colors.accent.primary;
    }
  };

  const getTypeIcon = (type: AIInsight['type']): string => {
    switch (type) {
      case 'positive':
        return '✓';
      case 'negative':
        return '!';
      case 'warning':
        return '⚠';
      case 'neutral':
      default:
        return '•';
    }
  };

  const displayInsights = insights.slice(0, maxDisplay);

  if (displayInsights.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>AIインサイト</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            データを分析中です...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>AIインサイト</Text>
        <Text style={styles.badge}>Pro</Text>
      </View>
      <ScrollView horizontal={false} showsVerticalScrollIndicator={false}>
        {displayInsights.map((insight) => (
          <View
            key={insight.id}
            style={[
              styles.insightCard,
              { borderLeftColor: getTypeColor(insight.type) },
            ]}
          >
            <View style={styles.insightHeader}>
              <Text
                style={[
                  styles.insightIcon,
                  { color: getTypeColor(insight.type) },
                ]}
              >
                {getTypeIcon(insight.type)}
              </Text>
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  badge: {
    marginLeft: spacing.sm,
    backgroundColor: colors.accent.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: colors.text.primary,
    overflow: 'hidden',
  },
  emptyCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.tertiary,
    fontSize: typography.fontSize.base,
  },
  insightCard: {
    backgroundColor: colors.background.secondary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  insightIcon: {
    fontSize: typography.fontSize.lg,
    marginRight: spacing.xs,
    fontWeight: typography.fontWeight.bold,
  },
  insightTitle: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.semibold,
    color: colors.text.primary,
  },
  insightDescription: {
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    lineHeight: 20,
    marginLeft: spacing.lg,
  },
});

export default React.memo(AIInsightsPanel);
