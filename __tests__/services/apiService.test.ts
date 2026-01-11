import {
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
} from '../../src/services/apiService';

// Speed up tests by reducing delays
jest.useFakeTimers();

describe('apiService', () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('fetchStripeData', () => {
    it('should return Stripe revenue data', async () => {
      const promise = fetchStripeData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.platform).toBe('stripe');
      expect(data.mrr).toBe(320000);
      expect(data.subscribers).toBe(142);
      expect(data.currency).toBe('JPY');
      expect(data.transactions).toBeDefined();
      expect(Array.isArray(data.transactions)).toBe(true);
    });
  });

  describe('fetchAppStoreData', () => {
    it('should return App Store revenue data', async () => {
      const promise = fetchAppStoreData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.platform).toBe('app_store');
      expect(data.mrr).toBe(95000);
      expect(data.subscribers).toBe(38);
      expect(data.currency).toBe('JPY');
    });
  });

  describe('fetchGooglePlayData', () => {
    it('should return Google Play revenue data', async () => {
      const promise = fetchGooglePlayData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.platform).toBe('google_play');
      expect(data.mrr).toBe(70000);
      expect(data.subscribers).toBe(28);
      expect(data.currency).toBe('JPY');
    });
  });

  describe('fetchRevenueCatData', () => {
    it('should return RevenueCat aggregated data', async () => {
      const promise = fetchRevenueCatData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.platform).toBe('revenuecat');
      expect(data.mrr).toBe(485000);
      expect(data.subscribers).toBe(208);
      expect(data.transactions.length).toBeGreaterThan(0);
    });

    it('should include upgrade, downgrade, and churn transactions', async () => {
      const promise = fetchRevenueCatData();
      jest.runAllTimers();
      const data = await promise;

      const transactionTypes = data.transactions.map((t) => t.type);
      expect(transactionTypes).toContain('upgrade');
      expect(transactionTypes).toContain('downgrade');
      expect(transactionTypes).toContain('churn');
    });
  });

  describe('fetchAggregatedMetrics', () => {
    it('should return complete dashboard metrics', async () => {
      const promise = fetchAggregatedMetrics();
      jest.runAllTimers();
      const data = await promise;

      expect(data.mrr).toBeDefined();
      expect(data.mrr.value).toBeGreaterThan(0);
      expect(data.mrr.currency).toBe('JPY');
      expect(data.mrr.trend).toMatch(/up|down|stable/);

      expect(data.mrrBreakdown).toBeDefined();
      expect(data.mrrBreakdown.newMrr).toBeGreaterThanOrEqual(0);
      expect(data.mrrBreakdown.expansionMrr).toBeGreaterThanOrEqual(0);
      expect(data.mrrBreakdown.contractionMrr).toBeGreaterThanOrEqual(0);
      expect(data.mrrBreakdown.churnMrr).toBeGreaterThanOrEqual(0);

      expect(data.churnRate).toBeDefined();
      expect(data.ltv).toBeDefined();
      expect(data.arpu).toBeDefined();
      expect(data.customers).toBeDefined();
      expect(data.mrrHistory).toBeDefined();
      expect(data.updatedAt).toBeDefined();
    });

    it('should return 12 months of MRR history', async () => {
      const promise = fetchAggregatedMetrics();
      jest.runAllTimers();
      const data = await promise;

      expect(data.mrrHistory.length).toBe(12);
      data.mrrHistory.forEach((point) => {
        expect(point.date).toBeDefined();
        expect(point.value).toBeGreaterThan(0);
      });
    });

    it('should calculate correct MRR change percentage', async () => {
      const promise = fetchAggregatedMetrics();
      jest.runAllTimers();
      const data = await promise;

      const currentMrr = data.mrrHistory[11].value;
      const previousMrr = data.mrrHistory[10].value;
      const expectedChange = ((currentMrr - previousMrr) / previousMrr) * 100;

      expect(Math.abs(data.mrr.changePercent - Math.round(expectedChange * 10) / 10)).toBeLessThan(0.1);
    });
  });

  describe('fetchCohortData', () => {
    it('should return cohort analysis data', async () => {
      const promise = fetchCohortData();
      jest.runAllTimers();
      const data = await promise;

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(6);

      data.forEach((cohort) => {
        expect(cohort.cohortMonth).toMatch(/^\d{4}-\d{2}$/);
        expect(cohort.totalUsers).toBeGreaterThan(0);
        expect(Array.isArray(cohort.retentionRates)).toBe(true);
        expect(cohort.retentionRates[0]).toBe(100); // First month is always 100%
        expect(cohort.ltv).toBeGreaterThan(0);
      });
    });

    it('should have declining retention rates', async () => {
      const promise = fetchCohortData();
      jest.runAllTimers();
      const data = await promise;

      data.forEach((cohort) => {
        for (let i = 1; i < cohort.retentionRates.length; i++) {
          expect(cohort.retentionRates[i]).toBeLessThanOrEqual(cohort.retentionRates[i - 1]);
        }
      });
    });
  });

  describe('fetchFunnelData', () => {
    it('should return funnel analysis data', async () => {
      const promise = fetchFunnelData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.steps).toBeDefined();
      expect(Array.isArray(data.steps)).toBe(true);
      expect(data.steps.length).toBe(5);
      expect(data.overallConversionRate).toBeGreaterThan(0);
    });

    it('should have decreasing counts through funnel', async () => {
      const promise = fetchFunnelData();
      jest.runAllTimers();
      const data = await promise;

      for (let i = 1; i < data.steps.length; i++) {
        expect(data.steps[i].count).toBeLessThanOrEqual(data.steps[i - 1].count);
      }
    });

    it('should have first step with 100% conversion rate', async () => {
      const promise = fetchFunnelData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.steps[0].conversionRate).toBe(100);
    });
  });

  describe('fetchSegmentData', () => {
    it('should return segment analysis data', async () => {
      const promise = fetchSegmentData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.byPlatform).toBeDefined();
      expect(data.byCountry).toBeDefined();
      expect(data.byPlan).toBeDefined();
    });

    it('should have platform segments', async () => {
      const promise = fetchSegmentData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.byPlatform.length).toBe(3);
      const platformNames = data.byPlatform.map((p) => p.name);
      expect(platformNames).toContain('iOS');
      expect(platformNames).toContain('Android');
      expect(platformNames).toContain('Web');
    });

    it('should have valid segment metrics', async () => {
      const promise = fetchSegmentData();
      jest.runAllTimers();
      const data = await promise;

      data.byPlatform.forEach((segment) => {
        expect(segment.mrr).toBeGreaterThan(0);
        expect(segment.customers).toBeGreaterThan(0);
        expect(segment.churnRate).toBeGreaterThan(0);
        expect(segment.ltv).toBeGreaterThan(0);
      });
    });
  });

  describe('fetchAIInsights', () => {
    it('should return AI-generated insights', async () => {
      const promise = fetchAIInsights();
      jest.runAllTimers();
      const data = await promise;

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(4);

      data.forEach((insight) => {
        expect(insight.id).toBeDefined();
        expect(insight.type).toMatch(/positive|negative|warning|neutral/);
        expect(insight.title).toBeDefined();
        expect(insight.description).toBeDefined();
        expect(insight.metric).toBeDefined();
        expect(insight.createdAt).toBeDefined();
      });
    });

    it('should have different insight types', async () => {
      const promise = fetchAIInsights();
      jest.runAllTimers();
      const data = await promise;

      const types = data.map((i) => i.type);
      expect(types).toContain('positive');
      expect(types).toContain('warning');
    });
  });

  describe('fetchDashboardData', () => {
    it('should fetch metrics and insights in parallel', async () => {
      const promise = fetchDashboardData();
      jest.runAllTimers();
      const data = await promise;

      expect(data.metrics).toBeDefined();
      expect(data.insights).toBeDefined();
      expect(data.metrics.mrr).toBeDefined();
      expect(Array.isArray(data.insights)).toBe(true);
    });
  });
});
