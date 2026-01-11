// Mock API Service for Indie Pulse
// Simulates fetching data from various platforms

import {
  DashboardMetrics,
  MRRData,
  MRRBreakdown,
  ChurnRate,
  LTV,
  ARPU,
  CustomerMetrics,
  MRRTimeSeriesDataPoint,
  CohortData,
  FunnelData,
  SegmentAnalysis,
  AIInsight,
} from '../types/metrics';
import { PlatformRevenueData, PlatformType } from '../types/platform';

// Simulate network delay
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Generate random variation for mock data
const randomVariation = (base: number, variance: number = 0.1): number => {
  const variation = base * variance * (Math.random() - 0.5) * 2;
  return Math.round(base + variation);
};

// Mock MRR history data (last 12 months)
const generateMRRHistory = (): MRRTimeSeriesDataPoint[] => {
  const history: MRRTimeSeriesDataPoint[] = [];
  const now = new Date();
  let baseMrr = 300000; // Start at ¥300,000

  for (let i = 11; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const growth = 1 + Math.random() * 0.08; // 0-8% monthly growth
    baseMrr = Math.round(baseMrr * growth);

    const newMrr = randomVariation(baseMrr * 0.15, 0.2);
    const expansionMrr = randomVariation(baseMrr * 0.05, 0.3);
    const contractionMrr = randomVariation(baseMrr * 0.02, 0.3);
    const churnMrr = randomVariation(baseMrr * 0.03, 0.2);

    history.push({
      date: date.toISOString().split('T')[0],
      value: baseMrr,
      newMrr,
      expansionMrr,
      contractionMrr,
      churnMrr,
    });
  }

  return history;
};

// Fetch Stripe revenue data
export const fetchStripeData = async (): Promise<PlatformRevenueData> => {
  await delay(800);

  return {
    platform: 'stripe',
    mrr: 320000,
    subscribers: 142,
    revenue: 380000,
    currency: 'JPY',
    periodStart: new Date(new Date().setDate(1)).toISOString(),
    periodEnd: new Date().toISOString(),
    transactions: [
      { date: new Date().toISOString(), type: 'new', amount: 45000, currency: 'JPY', count: 12 },
      { date: new Date().toISOString(), type: 'renewal', amount: 280000, currency: 'JPY', count: 98 },
      { date: new Date().toISOString(), type: 'churn', amount: -15000, currency: 'JPY', count: 5 },
    ],
  };
};

// Fetch App Store Connect data
export const fetchAppStoreData = async (): Promise<PlatformRevenueData> => {
  await delay(600);

  return {
    platform: 'app_store',
    mrr: 95000,
    subscribers: 38,
    revenue: 110000,
    currency: 'JPY',
    periodStart: new Date(new Date().setDate(1)).toISOString(),
    periodEnd: new Date().toISOString(),
    transactions: [
      { date: new Date().toISOString(), type: 'new', amount: 12000, currency: 'JPY', count: 4 },
      { date: new Date().toISOString(), type: 'renewal', amount: 85000, currency: 'JPY', count: 32 },
    ],
  };
};

// Fetch Google Play data
export const fetchGooglePlayData = async (): Promise<PlatformRevenueData> => {
  await delay(700);

  return {
    platform: 'google_play',
    mrr: 70000,
    subscribers: 28,
    revenue: 82000,
    currency: 'JPY',
    periodStart: new Date(new Date().setDate(1)).toISOString(),
    periodEnd: new Date().toISOString(),
    transactions: [
      { date: new Date().toISOString(), type: 'new', amount: 8000, currency: 'JPY', count: 3 },
      { date: new Date().toISOString(), type: 'renewal', amount: 68000, currency: 'JPY', count: 24 },
    ],
  };
};

// Fetch RevenueCat data
export const fetchRevenueCatData = async (): Promise<PlatformRevenueData> => {
  await delay(500);

  // RevenueCat aggregates all platforms - return combined view
  return {
    platform: 'revenuecat',
    mrr: 485000,
    subscribers: 208,
    revenue: 572000,
    currency: 'JPY',
    periodStart: new Date(new Date().setDate(1)).toISOString(),
    periodEnd: new Date().toISOString(),
    transactions: [
      { date: new Date().toISOString(), type: 'new', amount: 65000, currency: 'JPY', count: 19 },
      { date: new Date().toISOString(), type: 'renewal', amount: 433000, currency: 'JPY', count: 154 },
      { date: new Date().toISOString(), type: 'upgrade', amount: 18000, currency: 'JPY', count: 6 },
      { date: new Date().toISOString(), type: 'downgrade', amount: -8000, currency: 'JPY', count: 3 },
      { date: new Date().toISOString(), type: 'churn', amount: -23000, currency: 'JPY', count: 8 },
    ],
  };
};

// Fetch aggregated dashboard metrics
export const fetchAggregatedMetrics = async (): Promise<DashboardMetrics> => {
  await delay(1000);

  const mrrHistory = generateMRRHistory();
  const currentMrr = mrrHistory[mrrHistory.length - 1].value;
  const previousMrr = mrrHistory[mrrHistory.length - 2].value;
  const mrrChange = ((currentMrr - previousMrr) / previousMrr) * 100;

  const mrr: MRRData = {
    value: currentMrr,
    currency: 'JPY',
    previousValue: previousMrr,
    changePercent: Math.round(mrrChange * 10) / 10,
    trend: mrrChange > 0 ? 'up' : mrrChange < 0 ? 'down' : 'stable',
  };

  const mrrBreakdown: MRRBreakdown = {
    newMrr: mrrHistory[mrrHistory.length - 1].newMrr || 0,
    expansionMrr: mrrHistory[mrrHistory.length - 1].expansionMrr || 0,
    contractionMrr: mrrHistory[mrrHistory.length - 1].contractionMrr || 0,
    churnMrr: mrrHistory[mrrHistory.length - 1].churnMrr || 0,
    netMrr: currentMrr - previousMrr,
  };

  const churnRate: ChurnRate = {
    value: 3.2,
    previousValue: 3.7,
    changePercent: -13.5,
    trend: 'down',
  };

  const ltv: LTV = {
    value: 24500,
    currency: 'JPY',
    previousValue: 22600,
    changePercent: 8.4,
    trend: 'up',
  };

  const arpu: ARPU = {
    value: 2450,
    currency: 'JPY',
    previousValue: 2330,
    changePercent: 5.2,
    trend: 'up',
  };

  const customers: CustomerMetrics = {
    totalCustomers: 208,
    newCustomers: 23,
    churned: 8,
    activeUsers: 198,
    trialUsers: 15,
    paidUsers: 193,
    conversionRate: 68.5,
  };

  return {
    mrr,
    mrrBreakdown,
    churnRate,
    ltv,
    arpu,
    customers,
    mrrHistory,
    updatedAt: new Date().toISOString(),
  };
};

// Fetch cohort analysis data
export const fetchCohortData = async (): Promise<CohortData[]> => {
  await delay(600);

  const cohorts: CohortData[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const cohortMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthsActive = i + 1;
    const retentionRates: number[] = [];

    // Generate declining retention rates
    let retention = 100;
    for (let j = 0; j < monthsActive; j++) {
      retentionRates.push(Math.round(retention * 10) / 10);
      retention *= 0.85 + Math.random() * 0.1; // 85-95% retention per month
    }

    cohorts.push({
      cohortMonth: cohortMonth.toISOString().slice(0, 7),
      totalUsers: randomVariation(30, 0.3),
      retentionRates,
      ltv: randomVariation(20000, 0.2),
    });
  }

  return cohorts;
};

// Fetch funnel analysis data
export const fetchFunnelData = async (): Promise<FunnelData> => {
  await delay(400);

  const steps = [
    { name: 'インストール', count: 1250, conversionRate: 100 },
    { name: 'サインアップ', count: 625, conversionRate: 50 },
    { name: 'トライアル開始', count: 312, conversionRate: 49.9 },
    { name: '有料転換', count: 208, conversionRate: 66.7 },
    { name: '継続（2ヶ月目）', count: 176, conversionRate: 84.6 },
  ];

  return {
    steps,
    overallConversionRate: (208 / 1250) * 100,
  };
};

// Fetch segment analysis data
export const fetchSegmentData = async (): Promise<SegmentAnalysis> => {
  await delay(500);

  return {
    byPlatform: [
      { name: 'iOS', mrr: 260000, customers: 108, churnRate: 2.8, ltv: 26000 },
      { name: 'Android', mrr: 145000, customers: 68, churnRate: 3.5, ltv: 21000 },
      { name: 'Web', mrr: 80000, customers: 32, churnRate: 4.2, ltv: 19000 },
    ],
    byCountry: [
      { name: '日本', mrr: 320000, customers: 138, churnRate: 2.5, ltv: 28000 },
      { name: 'アメリカ', mrr: 95000, customers: 42, churnRate: 3.8, ltv: 22000 },
      { name: 'その他', mrr: 70000, customers: 28, churnRate: 4.5, ltv: 18000 },
    ],
    byPlan: [
      { name: 'Starter', mrr: 185000, customers: 124, churnRate: 4.1, ltv: 18000 },
      { name: 'Pro', mrr: 300000, customers: 84, churnRate: 2.2, ltv: 32000 },
    ],
  };
};

// Fetch AI-generated insights
export const fetchAIInsights = async (): Promise<AIInsight[]> => {
  await delay(800);

  return [
    {
      id: '1',
      type: 'positive',
      title: 'MRR成長好調',
      description: 'MRRが先月比12.5%増加しています。過去3ヶ月の平均成長率を上回る好調な推移です。',
      metric: 'mrr',
      changeValue: 12.5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'positive',
      title: '解約率改善',
      description: '解約率が3.7%から3.2%に改善しました。オンボーディング改善の効果が現れています。',
      metric: 'churn_rate',
      changeValue: -13.5,
      createdAt: new Date().toISOString(),
    },
    {
      id: '3',
      type: 'neutral',
      title: '新規顧客獲得',
      description: '今月の新規顧客は23名で、目標の20名を達成しています。',
      metric: 'new_customers',
      changeValue: 15,
      createdAt: new Date().toISOString(),
    },
    {
      id: '4',
      type: 'warning',
      title: 'トライアル転換率',
      description: 'トライアルからの有料転換率が66.7%で、先月の70%から微減しています。オンボーディングフローの確認を推奨します。',
      metric: 'conversion_rate',
      changeValue: -4.7,
      createdAt: new Date().toISOString(),
    },
  ];
};

// Fetch all dashboard data in parallel
export const fetchDashboardData = async (): Promise<{
  metrics: DashboardMetrics;
  insights: AIInsight[];
}> => {
  const [metrics, insights] = await Promise.all([
    fetchAggregatedMetrics(),
    fetchAIInsights(),
  ]);

  return { metrics, insights };
};

export default {
  fetchStripeData,
  fetchAppStoreData,
  fetchGooglePlayData,
  fetchRevenueCatData,
  fetchAggregatedMetrics,
  fetchCohortData,
  fetchFunnelData,
  fetchSegmentData,
  fetchAIInsights,
  fetchDashboardData,
};
