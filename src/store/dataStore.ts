// Data Store using Zustand for metrics and dashboard data
import { create } from 'zustand';
import {
  DashboardMetrics,
  AIInsight,
  CohortData,
  FunnelData,
  SegmentAnalysis,
  PeriodFilter,
} from '../types/metrics';
import {
  fetchDashboardData,
  fetchCohortData,
  fetchFunnelData,
  fetchSegmentData,
} from '../services/apiService';

interface DataState {
  // Dashboard data
  metrics: DashboardMetrics | null;
  insights: AIInsight[];

  // Analysis data
  cohorts: CohortData[];
  funnel: FunnelData | null;
  segments: SegmentAnalysis | null;

  // UI state
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: string | null;

  // Filter state
  periodFilter: PeriodFilter;

  // Actions
  fetchDashboard: () => Promise<void>;
  fetchAnalysisData: () => Promise<void>;
  refreshData: () => Promise<void>;
  setPeriodFilter: (filter: PeriodFilter) => void;
  clearError: () => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  // Initial state
  metrics: null,
  insights: [],
  cohorts: [],
  funnel: null,
  segments: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
  lastUpdated: null,
  periodFilter: { type: 'this_month' },

  // Fetch dashboard data
  fetchDashboard: async () => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const { metrics, insights } = await fetchDashboardData();
      set({
        metrics,
        insights,
        isLoading: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error: any) {
      set({
        error: error.message || 'データの取得に失敗しました',
        isLoading: false,
      });
    }
  },

  // Fetch analysis data (cohorts, funnel, segments)
  fetchAnalysisData: async () => {
    set({ isLoading: true, error: null });

    try {
      const [cohorts, funnel, segments] = await Promise.all([
        fetchCohortData(),
        fetchFunnelData(),
        fetchSegmentData(),
      ]);

      set({
        cohorts,
        funnel,
        segments,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || '分析データの取得に失敗しました',
        isLoading: false,
      });
    }
  },

  // Refresh all data
  refreshData: async () => {
    set({ isRefreshing: true, error: null });

    try {
      const [dashboardData, cohorts, funnel, segments] = await Promise.all([
        fetchDashboardData(),
        fetchCohortData(),
        fetchFunnelData(),
        fetchSegmentData(),
      ]);

      set({
        metrics: dashboardData.metrics,
        insights: dashboardData.insights,
        cohorts,
        funnel,
        segments,
        isRefreshing: false,
        lastUpdated: new Date().toISOString(),
      });
    } catch (error: any) {
      set({
        error: error.message || 'データの更新に失敗しました',
        isRefreshing: false,
      });
    }
  },

  // Set period filter
  setPeriodFilter: (filter: PeriodFilter) => {
    set({ periodFilter: filter });
    // Re-fetch data with new filter
    get().fetchDashboard();
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

export default useDataStore;
