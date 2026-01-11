// Platform integration type definitions

export type PlatformType = 'stripe' | 'app_store' | 'google_play' | 'revenuecat';

export interface PlatformCredentials {
  apiKey?: string;
  apiSecret?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
}

export interface PlatformConnection {
  id: string;
  platform: PlatformType;
  name: string;
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  lastSyncAt: string | null;
  lastSyncStatus: 'success' | 'failed' | 'partial' | null;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformSyncStatus {
  platformId: string;
  isSyncing: boolean;
  progress: number;  // 0-100
  lastSyncAt: string | null;
  nextScheduledSync: string | null;
  error?: string;
}

export interface PlatformConfig {
  type: PlatformType;
  name: string;
  description: string;
  icon: string;
  color: string;
  authType: 'oauth' | 'api_key';
  oauthUrl?: string;
  requiredScopes?: string[];
}

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  stripe: {
    type: 'stripe',
    name: 'Stripe',
    description: 'Connect your Stripe account to sync subscription and payment data.',
    icon: 'credit-card',
    color: '#635BFF',
    authType: 'oauth',
    oauthUrl: 'https://connect.stripe.com/oauth/authorize',
    requiredScopes: ['read_only'],
  },
  app_store: {
    type: 'app_store',
    name: 'App Store Connect',
    description: 'Connect to App Store Connect for iOS app revenue data.',
    icon: 'apple',
    color: '#0D96F6',
    authType: 'api_key',
  },
  google_play: {
    type: 'google_play',
    name: 'Google Play Console',
    description: 'Connect to Google Play Console for Android app revenue data.',
    icon: 'google-play',
    color: '#01875F',
    authType: 'oauth',
    oauthUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    requiredScopes: ['https://www.googleapis.com/auth/androidpublisher'],
  },
  revenuecat: {
    type: 'revenuecat',
    name: 'RevenueCat',
    description: 'Connect RevenueCat for unified subscription analytics.',
    icon: 'cat',
    color: '#F2545B',
    authType: 'api_key',
  },
};

export interface PlatformRevenueData {
  platform: PlatformType;
  mrr: number;
  subscribers: number;
  revenue: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  transactions: TransactionSummary[];
}

export interface TransactionSummary {
  date: string;
  type: 'new' | 'renewal' | 'upgrade' | 'downgrade' | 'refund' | 'churn';
  amount: number;
  currency: string;
  count: number;
}
