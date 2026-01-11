// User and subscription type definitions

export type SubscriptionPlan = 'starter' | 'pro';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  plan: SubscriptionPlan;
  status: 'active' | 'trialing' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  trialEnd: string | null;
}

export interface UserSettings {
  currency: 'JPY' | 'USD' | 'EUR' | 'GBP';
  timezone: string;
  language: 'ja' | 'en';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: {
    weeklyReport: boolean;
    monthlyReport: boolean;
    alerts: boolean;
  };
  push: {
    mrrChanges: boolean;
    churnAlerts: boolean;
    milestones: boolean;
    aiInsights: boolean;
  };
}

export interface CustomAlert {
  id: string;
  name: string;
  metric: 'mrr' | 'churn_rate' | 'ltv' | 'arpu' | 'new_customers';
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  enabled: boolean;
  lastTriggered: string | null;
  createdAt: string;
}

export interface UserData {
  profile: UserProfile;
  subscription: UserSubscription;
  settings: UserSettings;
  alerts: CustomAlert[];
}

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
  starter: {
    maxPlatforms: 2,
    maxMrr: 1000000,  // ¥1,000,000
    aiInsights: false,
    cohortAnalysis: false,
    whatIfSimulation: false,
    pdfReports: true,
    customAlerts: 3,
  },
  pro: {
    maxPlatforms: Infinity,
    maxMrr: Infinity,
    aiInsights: true,
    cohortAnalysis: true,
    whatIfSimulation: true,
    pdfReports: true,
    customAlerts: Infinity,
  },
};

export interface PlanLimits {
  maxPlatforms: number;
  maxMrr: number;
  aiInsights: boolean;
  cohortAnalysis: boolean;
  whatIfSimulation: boolean;
  pdfReports: boolean;
  customAlerts: number;
}

export const PLAN_PRICING: Record<SubscriptionPlan, PlanPricing> = {
  starter: {
    monthly: 2500,
    yearly: 25000,
    currency: 'JPY',
  },
  pro: {
    monthly: 5000,
    yearly: 50000,
    currency: 'JPY',
  },
};

export interface PlanPricing {
  monthly: number;
  yearly: number;
  currency: string;
}
