import { act, renderHook } from '@testing-library/react-native';
import { useDataStore } from '../../src/store/dataStore';

// Mock the API service
jest.mock('../../src/services/apiService', () => ({
  fetchDashboardData: jest.fn(),
  fetchCohortData: jest.fn(),
  fetchFunnelData: jest.fn(),
  fetchSegmentData: jest.fn(),
}));

import {
  fetchDashboardData,
  fetchCohortData,
  fetchFunnelData,
  fetchSegmentData,
} from '../../src/services/apiService';

const mockMetrics = {
  mrr: {
    value: 500000,
    currency: 'JPY',
    previousValue: 450000,
    changePercent: 11.1,
    trend: 'up' as const,
  },
  mrrBreakdown: {
    newMrr: 75000,
    expansionMrr: 25000,
    contractionMrr: 10000,
    churnMrr: 15000,
    netMrr: 50000,
  },
  churnRate: { value: 3.2, previousValue: 3.7, changePercent: -13.5, trend: 'down' as const },
  ltv: { value: 24500, currency: 'JPY', previousValue: 22600, changePercent: 8.4, trend: 'up' as const },
  arpu: { value: 2450, currency: 'JPY', previousValue: 2330, changePercent: 5.2, trend: 'up' as const },
  customers: {
    totalCustomers: 208,
    newCustomers: 23,
    churned: 8,
    activeUsers: 198,
    trialUsers: 15,
    paidUsers: 193,
    conversionRate: 68.5,
  },
  mrrHistory: [],
  updatedAt: new Date().toISOString(),
};

const mockInsights = [
  {
    id: '1',
    type: 'positive' as const,
    title: 'MRR Growth',
    description: 'MRR increased by 12.5%',
    metric: 'mrr',
    changeValue: 12.5,
    createdAt: new Date().toISOString(),
  },
];

const mockCohorts = [
  {
    cohortMonth: '2024-01',
    totalUsers: 30,
    retentionRates: [100, 85, 72],
    ltv: 20000,
  },
];

const mockFunnel = {
  steps: [
    { name: 'Install', count: 1000, conversionRate: 100 },
    { name: 'SignUp', count: 500, conversionRate: 50 },
  ],
  overallConversionRate: 50,
};

const mockSegments = {
  byPlatform: [{ name: 'iOS', mrr: 260000, customers: 108, churnRate: 2.8, ltv: 26000 }],
  byCountry: [{ name: 'Japan', mrr: 320000, customers: 138, churnRate: 2.5, ltv: 28000 }],
  byPlan: [{ name: 'Pro', mrr: 300000, customers: 84, churnRate: 2.2, ltv: 32000 }],
};

describe('dataStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    act(() => {
      useDataStore.setState({
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
      });
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useDataStore());

      expect(result.current.metrics).toBeNull();
      expect(result.current.insights).toEqual([]);
      expect(result.current.cohorts).toEqual([]);
      expect(result.current.funnel).toBeNull();
      expect(result.current.segments).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.lastUpdated).toBeNull();
      expect(result.current.periodFilter).toEqual({ type: 'this_month' });
    });
  });

  describe('fetchDashboard', () => {
    it('should fetch dashboard data successfully', async () => {
      (fetchDashboardData as jest.Mock).mockResolvedValue({
        metrics: mockMetrics,
        insights: mockInsights,
      });

      const { result } = renderHook(() => useDataStore());

      await act(async () => {
        await result.current.fetchDashboard();
      });

      expect(result.current.metrics).toEqual(mockMetrics);
      expect(result.current.insights).toEqual(mockInsights);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.lastUpdated).not.toBeNull();
    });

    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      (fetchDashboardData as jest.Mock).mockReturnValue(promise);

      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.fetchDashboard();
      });

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!({ metrics: mockMetrics, insights: mockInsights });
        await promise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should set error on fetch failure', async () => {
      (fetchDashboardData as jest.Mock).mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useDataStore());

      await act(async () => {
        await result.current.fetchDashboard();
      });

      expect(result.current.error).toBe('Network error');
      expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch if already loading', async () => {
      (fetchDashboardData as jest.Mock).mockResolvedValue({
        metrics: mockMetrics,
        insights: mockInsights,
      });

      act(() => {
        useDataStore.setState({ isLoading: true });
      });

      const { result } = renderHook(() => useDataStore());

      await act(async () => {
        await result.current.fetchDashboard();
      });

      expect(fetchDashboardData).not.toHaveBeenCalled();
    });
  });

  describe('fetchAnalysisData', () => {
    it('should fetch all analysis data in parallel', async () => {
      (fetchCohortData as jest.Mock).mockResolvedValue(mockCohorts);
      (fetchFunnelData as jest.Mock).mockResolvedValue(mockFunnel);
      (fetchSegmentData as jest.Mock).mockResolvedValue(mockSegments);

      const { result } = renderHook(() => useDataStore());

      await act(async () => {
        await result.current.fetchAnalysisData();
      });

      expect(result.current.cohorts).toEqual(mockCohorts);
      expect(result.current.funnel).toEqual(mockFunnel);
      expect(result.current.segments).toEqual(mockSegments);
      expect(result.current.isLoading).toBe(false);
    });

    it('should set error on analysis fetch failure', async () => {
      (fetchCohortData as jest.Mock).mockRejectedValue(new Error('Failed to fetch cohorts'));
      (fetchFunnelData as jest.Mock).mockResolvedValue(mockFunnel);
      (fetchSegmentData as jest.Mock).mockResolvedValue(mockSegments);

      const { result } = renderHook(() => useDataStore());

      await act(async () => {
        await result.current.fetchAnalysisData();
      });

      expect(result.current.error).toBe('Failed to fetch cohorts');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('refreshData', () => {
    it('should refresh all data', async () => {
      (fetchDashboardData as jest.Mock).mockResolvedValue({
        metrics: mockMetrics,
        insights: mockInsights,
      });
      (fetchCohortData as jest.Mock).mockResolvedValue(mockCohorts);
      (fetchFunnelData as jest.Mock).mockResolvedValue(mockFunnel);
      (fetchSegmentData as jest.Mock).mockResolvedValue(mockSegments);

      const { result } = renderHook(() => useDataStore());

      await act(async () => {
        await result.current.refreshData();
      });

      expect(result.current.metrics).toEqual(mockMetrics);
      expect(result.current.insights).toEqual(mockInsights);
      expect(result.current.cohorts).toEqual(mockCohorts);
      expect(result.current.funnel).toEqual(mockFunnel);
      expect(result.current.segments).toEqual(mockSegments);
      expect(result.current.isRefreshing).toBe(false);
      expect(result.current.lastUpdated).not.toBeNull();
    });

    it('should set isRefreshing during refresh', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      (fetchDashboardData as jest.Mock).mockReturnValue(promise);
      (fetchCohortData as jest.Mock).mockResolvedValue(mockCohorts);
      (fetchFunnelData as jest.Mock).mockResolvedValue(mockFunnel);
      (fetchSegmentData as jest.Mock).mockResolvedValue(mockSegments);

      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.refreshData();
      });

      expect(result.current.isRefreshing).toBe(true);

      await act(async () => {
        resolvePromise!({ metrics: mockMetrics, insights: mockInsights });
        await Promise.resolve();
      });
    });
  });

  describe('setPeriodFilter', () => {
    it('should update period filter', async () => {
      (fetchDashboardData as jest.Mock).mockResolvedValue({
        metrics: mockMetrics,
        insights: mockInsights,
      });

      const { result } = renderHook(() => useDataStore());

      await act(async () => {
        result.current.setPeriodFilter({ type: 'last_3_months' });
      });

      expect(result.current.periodFilter).toEqual({ type: 'last_3_months' });
    });

    it('should trigger dashboard refetch when filter changes (debounced)', async () => {
      jest.useFakeTimers();

      (fetchDashboardData as jest.Mock).mockResolvedValue({
        metrics: mockMetrics,
        insights: mockInsights,
      });

      const { result } = renderHook(() => useDataStore());

      act(() => {
        result.current.setPeriodFilter({ type: 'last_month' });
      });

      // Fetch should not be called immediately (debounced)
      expect(fetchDashboardData).not.toHaveBeenCalled();

      // Advance timers past debounce delay (300ms)
      await act(async () => {
        jest.advanceTimersByTime(350);
      });

      expect(fetchDashboardData).toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      act(() => {
        useDataStore.setState({ error: 'Some error' });
      });

      const { result } = renderHook(() => useDataStore());

      expect(result.current.error).toBe('Some error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
