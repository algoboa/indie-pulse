// Custom hook for platform integrations
import { useCallback } from 'react';
import { useIntegrationsStore } from '../store/integrationsStore';
import { PlatformType, PLATFORM_CONFIGS } from '../types/platform';

export const useIntegrations = () => {
  const {
    connections,
    syncStatuses,
    isLoading,
    isConnecting,
    error,
    connectPlatform,
    disconnectPlatform,
    syncPlatform,
    syncAllPlatforms,
    clearError,
  } = useIntegrationsStore();

  // Check if a platform is connected
  const isConnected = useCallback(
    (platform: PlatformType): boolean => {
      return connections.some((c) => c.platform === platform);
    },
    [connections]
  );

  // Get connection for a platform
  const getConnection = useCallback(
    (platform: PlatformType) => {
      return connections.find((c) => c.platform === platform);
    },
    [connections]
  );

  // Get sync status for a connection
  const getSyncStatus = useCallback(
    (connectionId: string) => {
      return syncStatuses[connectionId];
    },
    [syncStatuses]
  );

  // Connect to a platform
  const handleConnect = useCallback(
    async (platform: PlatformType) => {
      try {
        await connectPlatform(platform);
        return { success: true };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [connectPlatform]
  );

  // Disconnect from a platform
  const handleDisconnect = useCallback(
    async (connectionId: string) => {
      try {
        await disconnectPlatform(connectionId);
        return { success: true };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [disconnectPlatform]
  );

  // Sync a specific platform
  const handleSync = useCallback(
    async (connectionId: string) => {
      try {
        await syncPlatform(connectionId);
        return { success: true };
      } catch (err) {
        return { success: false, error: err };
      }
    },
    [syncPlatform]
  );

  // Sync all platforms
  const handleSyncAll = useCallback(async () => {
    try {
      await syncAllPlatforms();
      return { success: true };
    } catch (err) {
      return { success: false, error: err };
    }
  }, [syncAllPlatforms]);

  // Get connected platforms count
  const connectedCount = connections.length;

  // Get available platforms that are not connected
  const availablePlatforms = (['stripe', 'app_store', 'google_play', 'revenuecat'] as PlatformType[]).filter(
    (platform) => !isConnected(platform)
  );

  return {
    // Data
    connections,
    syncStatuses,
    connectedCount,
    availablePlatforms,
    platformConfigs: PLATFORM_CONFIGS,

    // State
    isLoading,
    isConnecting,
    error,

    // Helpers
    isConnected,
    getConnection,
    getSyncStatus,

    // Actions
    connect: handleConnect,
    disconnect: handleDisconnect,
    sync: handleSync,
    syncAll: handleSyncAll,
    clearError,
  };
};

export default useIntegrations;
