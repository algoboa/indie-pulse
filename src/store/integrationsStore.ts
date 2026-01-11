// Integrations Store using Zustand
import { create } from 'zustand';
import { PlatformConnection, PlatformType, PlatformSyncStatus } from '../types/platform';

interface IntegrationsState {
  // Connected platforms
  connections: PlatformConnection[];
  syncStatuses: Record<string, PlatformSyncStatus>;

  // UI state
  isLoading: boolean;
  isConnecting: boolean;
  error: string | null;

  // Actions
  connectPlatform: (platform: PlatformType) => Promise<void>;
  disconnectPlatform: (connectionId: string) => Promise<void>;
  syncPlatform: (connectionId: string) => Promise<void>;
  syncAllPlatforms: () => Promise<void>;
  clearError: () => void;
}

// Simulate delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useIntegrationsStore = create<IntegrationsState>((set, get) => ({
  // Initial state
  connections: [],
  syncStatuses: {},
  isLoading: false,
  isConnecting: false,
  error: null,

  // Connect to a platform (mock OAuth flow)
  connectPlatform: async (platform: PlatformType) => {
    set({ isConnecting: true, error: null });

    // Simulate OAuth flow
    console.log(`[${platform}] との連携を開始します`);

    try {
      await delay(1500);

      const newConnection: PlatformConnection = {
        id: `conn_${Date.now()}`,
        platform,
        name: getPlatformDisplayName(platform),
        status: 'connected',
        lastSyncAt: null,
        lastSyncStatus: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      set((state) => ({
        connections: [...state.connections, newConnection],
        isConnecting: false,
      }));

      // Trigger initial sync
      await get().syncPlatform(newConnection.id);
    } catch (error: any) {
      set({
        error: `${getPlatformDisplayName(platform)}との連携に失敗しました`,
        isConnecting: false,
      });
    }
  },

  // Disconnect from a platform
  disconnectPlatform: async (connectionId: string) => {
    set({ isLoading: true, error: null });

    try {
      await delay(500);

      set((state) => ({
        connections: state.connections.filter((c) => c.id !== connectionId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: '連携の解除に失敗しました',
        isLoading: false,
      });
    }
  },

  // Sync data from a platform
  syncPlatform: async (connectionId: string) => {
    const connection = get().connections.find((c) => c.id === connectionId);
    if (!connection) return;

    // Update sync status
    set((state) => ({
      syncStatuses: {
        ...state.syncStatuses,
        [connectionId]: {
          platformId: connectionId,
          isSyncing: true,
          progress: 0,
          lastSyncAt: connection.lastSyncAt,
          nextScheduledSync: null,
        },
      },
    }));

    // Update connection status
    set((state) => ({
      connections: state.connections.map((c) =>
        c.id === connectionId ? { ...c, status: 'syncing' as const } : c
      ),
    }));

    try {
      // Simulate sync progress
      for (let progress = 0; progress <= 100; progress += 20) {
        await delay(300);
        set((state) => ({
          syncStatuses: {
            ...state.syncStatuses,
            [connectionId]: {
              ...state.syncStatuses[connectionId],
              progress,
            },
          },
        }));
      }

      const now = new Date().toISOString();

      // Update connection
      set((state) => ({
        connections: state.connections.map((c) =>
          c.id === connectionId
            ? {
                ...c,
                status: 'connected' as const,
                lastSyncAt: now,
                lastSyncStatus: 'success' as const,
                updatedAt: now,
              }
            : c
        ),
        syncStatuses: {
          ...state.syncStatuses,
          [connectionId]: {
            platformId: connectionId,
            isSyncing: false,
            progress: 100,
            lastSyncAt: now,
            nextScheduledSync: new Date(
              Date.now() + 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        },
      }));
    } catch (error: any) {
      set((state) => ({
        connections: state.connections.map((c) =>
          c.id === connectionId
            ? {
                ...c,
                status: 'error' as const,
                lastSyncStatus: 'failed' as const,
                errorMessage: 'データの同期に失敗しました',
              }
            : c
        ),
        syncStatuses: {
          ...state.syncStatuses,
          [connectionId]: {
            ...state.syncStatuses[connectionId],
            isSyncing: false,
            error: 'データの同期に失敗しました',
          },
        },
      }));
    }
  },

  // Sync all connected platforms
  syncAllPlatforms: async () => {
    const { connections, syncPlatform } = get();

    for (const connection of connections) {
      if (connection.status !== 'syncing') {
        await syncPlatform(connection.id);
      }
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));

// Helper function
const getPlatformDisplayName = (platform: PlatformType): string => {
  const names: Record<PlatformType, string> = {
    stripe: 'Stripe',
    app_store: 'App Store Connect',
    google_play: 'Google Play Console',
    revenuecat: 'RevenueCat',
  };
  return names[platform];
};

export default useIntegrationsStore;
