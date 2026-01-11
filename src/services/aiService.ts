// AI Service for Indie Pulse
// Mock implementation of AI-powered insights generation

import { DashboardMetrics, AIInsight, CohortData } from '../types/metrics';

// Simulate AI processing delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate insights based on metrics data
export const generateInsights = async (
  metrics: DashboardMetrics
): Promise<AIInsight[]> => {
  await delay(500);

  const insights: AIInsight[] = [];
  const now = new Date().toISOString();

  // MRR Analysis
  if (metrics.mrr.changePercent > 10) {
    insights.push({
      id: `insight_mrr_growth_${Date.now()}`,
      type: 'positive',
      title: 'MRR成長好調',
      description: `MRRが先月比${metrics.mrr.changePercent.toFixed(1)}%増加しています。このペースを維持すれば、年間${(metrics.mrr.value * 12 * (1 + metrics.mrr.changePercent / 100)).toLocaleString()}円の収益が見込めます。`,
      metric: 'mrr',
      changeValue: metrics.mrr.changePercent,
      createdAt: now,
    });
  } else if (metrics.mrr.changePercent < -5) {
    insights.push({
      id: `insight_mrr_decline_${Date.now()}`,
      type: 'negative',
      title: 'MRR減少傾向',
      description: `MRRが先月比${Math.abs(metrics.mrr.changePercent).toFixed(1)}%減少しています。解約率の確認と顧客へのフォローアップを推奨します。`,
      metric: 'mrr',
      changeValue: metrics.mrr.changePercent,
      createdAt: now,
    });
  }

  // Churn Rate Analysis
  if (metrics.churnRate.value < 3) {
    insights.push({
      id: `insight_churn_excellent_${Date.now()}`,
      type: 'positive',
      title: '低解約率',
      description: `解約率${metrics.churnRate.value}%は業界平均（5%）を大きく下回っています。顧客満足度が高いことを示しています。`,
      metric: 'churn_rate',
      changeValue: metrics.churnRate.changePercent,
      createdAt: now,
    });
  } else if (metrics.churnRate.value > 7) {
    insights.push({
      id: `insight_churn_warning_${Date.now()}`,
      type: 'warning',
      title: '解約率上昇',
      description: `解約率${metrics.churnRate.value}%は注意が必要です。解約理由の分析と改善施策の検討を推奨します。`,
      metric: 'churn_rate',
      changeValue: metrics.churnRate.changePercent,
      createdAt: now,
    });
  }

  // New Customer Analysis
  if (metrics.customers.newCustomers > 20) {
    insights.push({
      id: `insight_new_customers_${Date.now()}`,
      type: 'positive',
      title: '新規顧客獲得好調',
      description: `今月の新規顧客${metrics.customers.newCustomers}名は順調なペースです。現在のマーケティング施策を継続することを推奨します。`,
      metric: 'new_customers',
      createdAt: now,
    });
  }

  // LTV Analysis
  if (metrics.ltv.changePercent > 5) {
    insights.push({
      id: `insight_ltv_up_${Date.now()}`,
      type: 'positive',
      title: 'LTV向上',
      description: `顧客生涯価値が${metrics.ltv.changePercent.toFixed(1)}%向上しました。アップセルや継続率改善の効果が表れています。`,
      metric: 'ltv',
      changeValue: metrics.ltv.changePercent,
      createdAt: now,
    });
  }

  // Conversion Rate Analysis
  if (metrics.customers.conversionRate < 60) {
    insights.push({
      id: `insight_cvr_warning_${Date.now()}`,
      type: 'warning',
      title: 'トライアル転換率',
      description: `トライアルからの有料転換率${metrics.customers.conversionRate}%は改善の余地があります。オンボーディングフローの最適化を検討してください。`,
      metric: 'conversion_rate',
      createdAt: now,
    });
  }

  // Add a neutral insight if no other insights
  if (insights.length === 0) {
    insights.push({
      id: `insight_stable_${Date.now()}`,
      type: 'neutral',
      title: '安定した状態',
      description: '現在、主要な指標は安定しています。引き続き現在の施策を維持し、成長機会を探索することを推奨します。',
      createdAt: now,
    });
  }

  return insights.slice(0, 5); // Return max 5 insights
};

// Generate cohort-based insights
export const generateCohortInsights = async (
  cohorts: CohortData[]
): Promise<AIInsight[]> => {
  await delay(300);

  const insights: AIInsight[] = [];
  const now = new Date().toISOString();

  if (cohorts.length < 2) {
    return insights;
  }

  // Compare recent cohorts
  const recentCohort = cohorts[cohorts.length - 1];
  const previousCohort = cohorts[cohorts.length - 2];

  if (recentCohort.retentionRates[0] > previousCohort.retentionRates[0]) {
    insights.push({
      id: `insight_cohort_improvement_${Date.now()}`,
      type: 'positive',
      title: 'コホート改善',
      description: `最新コホートの初月継続率が${(recentCohort.retentionRates[0] - previousCohort.retentionRates[0]).toFixed(1)}%向上しています。`,
      createdAt: now,
    });
  }

  // Find best performing cohort
  const bestCohort = cohorts.reduce((best, current) =>
    (current.retentionRates[0] || 0) > (best.retentionRates[0] || 0) ? current : best
  );

  insights.push({
    id: `insight_best_cohort_${Date.now()}`,
    type: 'neutral',
    title: '最高パフォーマンスコホート',
    description: `${bestCohort.cohortMonth}に獲得したユーザーが最も高い継続率（${bestCohort.retentionRates[0]?.toFixed(1)}%）を示しています。`,
    createdAt: now,
  });

  return insights;
};

// What-if simulation for MRR
export interface WhatIfScenario {
  type: 'price_change' | 'churn_improvement' | 'growth_rate';
  changePercent: number;
}

export interface WhatIfResult {
  scenario: WhatIfScenario;
  currentMrr: number;
  projectedMrr: number;
  monthlyChange: number;
  yearlyImpact: number;
}

export const runWhatIfSimulation = async (
  currentMrr: number,
  currentChurnRate: number,
  scenario: WhatIfScenario
): Promise<WhatIfResult> => {
  await delay(200);

  let projectedMrr = currentMrr;
  let monthlyChange = 0;

  switch (scenario.type) {
    case 'price_change':
      // Assume 50% of customers stay at new price
      const retentionFactor = 1 - (Math.abs(scenario.changePercent) / 200);
      projectedMrr = currentMrr * (1 + scenario.changePercent / 100) * retentionFactor;
      break;

    case 'churn_improvement':
      // Calculate impact of reduced churn
      const improvedChurn = currentChurnRate * (1 - scenario.changePercent / 100);
      const monthsRetained = 1 / (improvedChurn / 100);
      const currentMonthsRetained = 1 / (currentChurnRate / 100);
      projectedMrr = currentMrr * (monthsRetained / currentMonthsRetained);
      break;

    case 'growth_rate':
      // Compound growth over 12 months
      projectedMrr = currentMrr * Math.pow(1 + scenario.changePercent / 100, 12);
      break;
  }

  monthlyChange = projectedMrr - currentMrr;
  const yearlyImpact = monthlyChange * 12;

  return {
    scenario,
    currentMrr,
    projectedMrr: Math.round(projectedMrr),
    monthlyChange: Math.round(monthlyChange),
    yearlyImpact: Math.round(yearlyImpact),
  };
};

export default {
  generateInsights,
  generateCohortInsights,
  runWhatIfSimulation,
};
