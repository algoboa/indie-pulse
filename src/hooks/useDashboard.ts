// Custom hook for dashboard data and actions
import { useCallback, useEffect } from 'react';
import { useDataStore } from '../store/dataStore';
import { PeriodFilter } from '../types/metrics';

export const useDashboard = () => {
  const {
    metrics,
    insights,
    cohorts,
    funnel,
    segments,
    isLoading,
    isRefreshing,
    error,
    lastUpdated,
    periodFilter,
    fetchDashboard,
    fetchAnalysisData,
    refreshData,
    setPeriodFilter,
    clearError,
  } = useDataStore();

  // Fetch dashboard on mount
  useEffect(() => {
    if (!metrics) {
      fetchDashboard();
    }
  }, [fetchDashboard, metrics]);

  const handlePeriodChange = useCallback(
    (type: PeriodFilter['type']) => {
      setPeriodFilter({ type });
    },
    [setPeriodFilter]
  );

  const handleRefresh = useCallback(async () => {
    try {
      await refreshData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [refreshData]);

  const loadAnalysisData = useCallback(async () => {
    try {
      await fetchAnalysisData();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [fetchAnalysisData]);

  return {
    // Data
    metrics,
    insights,
    cohorts,
    funnel,
    segments,
    lastUpdated,
    periodFilter,

    // State
    isLoading,
    isRefreshing,
    error,

    // Actions
    fetchDashboard,
    loadAnalysisData,
    refresh: handleRefresh,
    setPeriodFilter: handlePeriodChange,
    clearError,
  };
};

export default useDashboard;
