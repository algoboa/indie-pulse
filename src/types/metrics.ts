// Metrics type definitions for Indie Pulse

export interface MRRData {
  value: number;
  currency: string;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface MRRBreakdown {
  newMrr: number;
  expansionMrr: number;
  contractionMrr: number;
  churnMrr: number;
  netMrr: number;
}

export interface ChurnRate {
  value: number;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface LTV {
  value: number;
  currency: string;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ARPU {
  value: number;
  currency: string;
  previousValue: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  churned: number;
  activeUsers: number;
  trialUsers: number;
  paidUsers: number;
  conversionRate: number;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface MRRTimeSeriesDataPoint extends TimeSeriesDataPoint {
  newMrr?: number;
  expansionMrr?: number;
  contractionMrr?: number;
  churnMrr?: number;
}

export interface DashboardMetrics {
  mrr: MRRData;
  mrrBreakdown: MRRBreakdown;
  churnRate: ChurnRate;
  ltv: LTV;
  arpu: ARPU;
  customers: CustomerMetrics;
  mrrHistory: MRRTimeSeriesDataPoint[];
  updatedAt: string;
}

export interface CohortData {
  cohortMonth: string;
  totalUsers: number;
  retentionRates: number[];  // Array of retention rates for each month
  ltv: number;
}

export interface FunnelStep {
  name: string;
  count: number;
  conversionRate: number;
}

export interface FunnelData {
  steps: FunnelStep[];
  overallConversionRate: number;
}

export interface SegmentData {
  name: string;
  mrr: number;
  customers: number;
  churnRate: number;
  ltv: number;
}

export interface SegmentAnalysis {
  byPlatform: SegmentData[];
  byCountry: SegmentData[];
  byPlan: SegmentData[];
}

export interface AIInsight {
  id: string;
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  metric?: string;
  changeValue?: number;
  createdAt: string;
}

export interface PeriodFilter {
  type: 'this_month' | 'last_month' | 'last_3_months' | 'last_6_months' | 'last_year' | 'custom';
  startDate?: string;
  endDate?: string;
}

export type Currency = 'JPY' | 'USD' | 'EUR' | 'GBP';
