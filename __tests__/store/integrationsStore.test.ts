import { act, renderHook, waitFor } from '@testing-library/react-native';
import { useIntegrationsStore } from '../../src/store/integrationsStore';

// Mock the delay function to speed up tests
jest.mock('../../src/store/integrationsStore', () => {
  const originalModule = jest.requireActual('../../src/store/integrationsStore');

  // Create a new store with faster delays by overriding the module
  return originalModule;
});

describe('integrationsStore', () => {
  beforeEach(() => {
    // Reset the store state before each test
    act(() => {
      useIntegrationsStore.setState({
        connections: [],
        syncStatuses: {},
        isLoading: false,
        isConnecting: false,
        error: null,
      });
    });
    jest.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useIntegrationsStore());

      expect(result.current.connections).toEqual([]);
      expect(result.current.syncStatuses).toEqual({});
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isConnecting).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('connectPlatform', () => {
    it('should set isConnecting to true when starting connection', () => {
      const { result } = renderHook(() => useIntegrationsStore());

      // Start connection (don't await)
      act(() => {
        result.current.connectPlatform('stripe');
      });

      expect(result.current.isConnecting).toBe(true);
    });
  });

  describe('disconnectPlatform', () => {
    it('should set isLoading during disconnect', () => {
      // Set up initial connection
      act(() => {
        useIntegrationsStore.setState({
          connections: [{
            id: 'conn_123',
            platform: 'stripe',
            name: 'Stripe',
            status: 'connected',
            lastSyncAt: null,
            lastSyncStatus: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }],
        });
      });

      const { result } = renderHook(() => useIntegrationsStore());

      act(() => {
        result.current.disconnectPlatform('conn_123');
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('syncPlatform', () => {
    it('should update sync status when starting sync', () => {
      // Set up initial connection
      act(() => {
        useIntegrationsStore.setState({
          connections: [{
            id: 'conn_123',
            platform: 'stripe',
            name: 'Stripe',
            status: 'connected',
            lastSyncAt: null,
            lastSyncStatus: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }],
        });
      });

      const { result } = renderHook(() => useIntegrationsStore());

      act(() => {
        result.current.syncPlatform('conn_123');
      });

      expect(result.current.syncStatuses['conn_123']).toBeDefined();
      expect(result.current.syncStatuses['conn_123'].isSyncing).toBe(true);
    });

    it('should update connection status to syncing', () => {
      act(() => {
        useIntegrationsStore.setState({
          connections: [{
            id: 'conn_123',
            platform: 'stripe',
            name: 'Stripe',
            status: 'connected',
            lastSyncAt: null,
            lastSyncStatus: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }],
        });
      });

      const { result } = renderHook(() => useIntegrationsStore());

      act(() => {
        result.current.syncPlatform('conn_123');
      });

      expect(result.current.connections[0].status).toBe('syncing');
    });

    it('should not sync if connection not found', async () => {
      const { result } = renderHook(() => useIntegrationsStore());

      await act(async () => {
        await result.current.syncPlatform('nonexistent');
      });

      expect(Object.keys(result.current.syncStatuses).length).toBe(0);
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      act(() => {
        useIntegrationsStore.setState({ error: 'Some error' });
      });

      const { result } = renderHook(() => useIntegrationsStore());

      expect(result.current.error).toBe('Some error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('state management', () => {
    it('should allow adding multiple connections to state', () => {
      act(() => {
        useIntegrationsStore.setState({
          connections: [
            {
              id: 'conn_1',
              platform: 'stripe',
              name: 'Stripe',
              status: 'connected',
              lastSyncAt: null,
              lastSyncStatus: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              id: 'conn_2',
              platform: 'app_store',
              name: 'App Store Connect',
              status: 'connected',
              lastSyncAt: null,
              lastSyncStatus: null,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        });
      });

      const { result } = renderHook(() => useIntegrationsStore());

      expect(result.current.connections.length).toBe(2);
      expect(result.current.connections[0].platform).toBe('stripe');
      expect(result.current.connections[1].platform).toBe('app_store');
    });

    it('should track multiple sync statuses', () => {
      act(() => {
        useIntegrationsStore.setState({
          syncStatuses: {
            'conn_1': {
              platformId: 'conn_1',
              isSyncing: false,
              progress: 100,
              lastSyncAt: new Date().toISOString(),
              nextScheduledSync: null,
            },
            'conn_2': {
              platformId: 'conn_2',
              isSyncing: true,
              progress: 50,
              lastSyncAt: null,
              nextScheduledSync: null,
            },
          },
        });
      });

      const { result } = renderHook(() => useIntegrationsStore());

      expect(result.current.syncStatuses['conn_1'].isSyncing).toBe(false);
      expect(result.current.syncStatuses['conn_1'].progress).toBe(100);
      expect(result.current.syncStatuses['conn_2'].isSyncing).toBe(true);
      expect(result.current.syncStatuses['conn_2'].progress).toBe(50);
    });
  });
});
