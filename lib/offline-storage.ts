/**
 * Offline Storage Utilities for CVG Family Law PWA
 * Provides secure offline data storage with encryption and synchronization
 */

import { encryptData, decryptData } from './encryption';

export interface OfflineDataItem {
  id: string;
  type: 'emergency-contact' | 'booking-form' | 'chat-message' | 'risk-assessment';
  data: Record<string, unknown>;
  timestamp: number;
  encrypted: boolean;
  synced: boolean;
}

export interface StorageConfig {
  encryptionEnabled: boolean;
  maxStorageSize: number; // in bytes
  autoSyncEnabled: boolean;
  retentionPeriod: number; // in milliseconds
}

class OfflineStorageManager {
  private dbName = 'CVGOfflineData';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;
  private config: StorageConfig = {
    encryptionEnabled: true,
    maxStorageSize: 50 * 1024 * 1024, // 50MB
    autoSyncEnabled: true,
    retentionPeriod: 30 * 24 * 60 * 60 * 1000, // 30 days
  };

  constructor(config?: Partial<StorageConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    this.initializeDB();
  }

  private async initializeDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('[OfflineStorage] Database initialization failed');
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineStorage] Database initialized successfully');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Offline data store
        if (!db.objectStoreNames.contains('offline_data')) {
          const store = db.createObjectStore('offline_data', { keyPath: 'id' });
          store.createIndex('type', 'type', { unique: false });
          store.createIndex('timestamp', 'timestamp', { unique: false });
          store.createIndex('synced', 'synced', { unique: false });
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('sync_queue')) {
          const queueStore = db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
          queueStore.createIndex('priority', 'priority', { unique: false });
          queueStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Storage metadata store
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
        }
      };
    });
  }

  private async getDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.initializeDB();
    }
    return this.db!;
  }

  /**
   * Store data offline with optional encryption
   */
  async storeData(item: Omit<OfflineDataItem, 'id' | 'timestamp' | 'encrypted' | 'synced'>): Promise<string> {
    try {
      const db = await this.getDB();
      const id = `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      let processedData = item.data;
      let encrypted = false;

      // Encrypt sensitive data if enabled
      if (this.config.encryptionEnabled && this.isSensitiveData(item.type)) {
        const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'fallback-master-key-change-in-production';
        processedData = await encryptData(JSON.stringify(item.data), masterKey);
        encrypted = true;
      }

      const offlineItem: OfflineDataItem = {
        id,
        ...item,
        data: processedData,
        timestamp: Date.now(),
        encrypted,
        synced: false,
      };

      const transaction = db.transaction(['offline_data'], 'readwrite');
      const store = transaction.objectStore('offline_data');

      await new Promise<void>((resolve, reject) => {
        const request = store.put(offlineItem);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });

      // Add to sync queue if auto-sync is enabled
      if (this.config.autoSyncEnabled) {
        await this.addToSyncQueue(id, item.type);
      }

      // Cleanup old data if storage is getting full
      await this.cleanupStorage();

      console.log(`[OfflineStorage] Stored ${item.type} data:`, id);
      return id;
    } catch (error) {
      console.error('[OfflineStorage] Failed to store data:', error);
      throw new Error('Failed to store offline data');
    }
  }

  /**
   * Retrieve data from offline storage
   */
  async retrieveData(id: string): Promise<OfflineDataItem | null> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data'], 'readonly');
      const store = transaction.objectStore('offline_data');

      return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const item = request.result;
          if (item) {
            console.log(`[OfflineStorage] Retrieved data:`, id);
          }
          resolve(item || null);
        };
      });
    } catch (error) {
      console.error('[OfflineStorage] Failed to retrieve data:', error);
      return null;
    }
  }

  /**
   * Get all offline data of a specific type
   */
  async getDataByType(type: OfflineDataItem['type']): Promise<OfflineDataItem[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data'], 'readonly');
      const store = transaction.objectStore('offline_data');
      const index = store.index('type');

      return new Promise((resolve, reject) => {
        const request = index.getAll(type);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
      });
    } catch (error) {
      console.error('[OfflineStorage] Failed to get data by type:', error);
      return [];
    }
  }

  /**
   * Get all unsynced data
   */
  async getUnsyncedData(): Promise<OfflineDataItem[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data'], 'readonly');
      const store = transaction.objectStore('offline_data');
      const index = store.index('synced');

      return new Promise((resolve, reject) => {
        const request = index.openCursor(IDBKeyRange.only(false));
        const results: OfflineDataItem[] = [];
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            results.push(cursor.value);
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      });
    } catch (error) {
      console.error('[OfflineStorage] Failed to get unsynced data:', error);
      return [];
    }
  }

  /**
   * Mark data as synced
   */
  async markAsSynced(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data'], 'readwrite');
      const store = transaction.objectStore('offline_data');

      const item = await this.retrieveData(id);
      if (item) {
        item.synced = true;
        await new Promise<void>((resolve, reject) => {
          const request = store.put(item);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        });

        // Remove from sync queue
        await this.removeFromSyncQueue(id);

        console.log(`[OfflineStorage] Marked as synced:`, id);
      }
    } catch (error) {
      console.error('[OfflineStorage] Failed to mark as synced:', error);
    }
  }

  /**
   * Delete offline data
   */
  async deleteData(id: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data'], 'readwrite');
      const store = transaction.objectStore('offline_data');

      await new Promise<void>((resolve, reject) => {
        const request = store.delete(id);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });

      // Remove from sync queue if present
      await this.removeFromSyncQueue(id);

      console.log(`[OfflineStorage] Deleted data:`, id);
    } catch (error) {
      console.error('[OfflineStorage] Failed to delete data:', error);
    }
  }

  /**
   * Clear all offline data of a specific type
   */
  async clearDataByType(type: OfflineDataItem['type']): Promise<void> {
    try {
      const items = await this.getDataByType(type);
      await Promise.all(items.map(item => this.deleteData(item.id)));
      console.log(`[OfflineStorage] Cleared all ${type} data`);
    } catch (error) {
      console.error('[OfflineStorage] Failed to clear data by type:', error);
    }
  }

  /**
   * Add item to sync queue
   */
  private async addToSyncQueue(dataId: string, type: OfflineDataItem['type']): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['sync_queue'], 'readwrite');
      const store = transaction.objectStore('sync_queue');

      const queueItem = {
        dataId,
        type,
        priority: this.getPriority(type),
        timestamp: Date.now(),
        attempts: 0,
      };

      await new Promise<void>((resolve, reject) => {
        const request = store.put(queueItem);
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
      });

      // Trigger background sync if supported
      if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        await this.triggerBackgroundSync(type);
      }
    } catch (error) {
      console.error('[OfflineStorage] Failed to add to sync queue:', error);
    }
  }

  /**
   * Remove item from sync queue
   */
  private async removeFromSyncQueue(dataId: string): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['sync_queue'], 'readwrite');
      const store = transaction.objectStore('sync_queue');
      const index = store.index('dataId');

      // We need to get the queue item first to get its key
      const queueItems = await new Promise<{ id: number; dataId: string }[]>((resolve, reject) => {
        const request = index.openCursor(IDBKeyRange.only(dataId));
        const results: { id: number; dataId: string }[] = [];
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            results.push({ id: cursor.primaryKey as number, dataId: cursor.value.dataId });
            cursor.continue();
          } else {
            resolve(results);
          }
        };
      });

      if (queueItems.length > 0) {
        await new Promise<void>((resolve, reject) => {
          const request = store.delete(queueItems[0].id);
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        });
      }
    } catch (error) {
      console.error('[OfflineStorage] Failed to remove from sync queue:', error);
    }
  }

  /**
   * Trigger background sync
   */
  private async triggerBackgroundSync(type: OfflineDataItem['type']): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const tag = this.getSyncTag(type);

      // Check if background sync is supported
      if ('sync' in registration) {
        await (registration as any).sync.register(tag);
        console.log(`[OfflineStorage] Background sync triggered: ${tag}`);
      } else {
        console.log('[OfflineStorage] Background sync not supported');
      }
    } catch (error) {
      console.log('[OfflineStorage] Background sync not supported or failed:', error);
    }
  }

  /**
   * Get priority for different data types
   */
  private getPriority(type: OfflineDataItem['type']): number {
    switch (type) {
      case 'emergency-contact':
        return 10; // Highest priority
      case 'risk-assessment':
        return 9;
      case 'booking-form':
        return 7;
      case 'chat-message':
        return 5; // Lower priority
      default:
        return 1;
    }
  }

  /**
   * Get background sync tag for data type
   */
  private getSyncTag(type: OfflineDataItem['type']): string {
    switch (type) {
      case 'emergency-contact':
        return 'emergency-contact';
      case 'booking-form':
        return 'booking-form';
      case 'chat-message':
        return 'chat-message';
      case 'risk-assessment':
        return 'risk-assessment';
      default:
        return 'general-sync';
    }
  }

  /**
   * Check if data type contains sensitive information
   */
  private isSensitiveData(type: OfflineDataItem['type']): boolean {
    return ['emergency-contact', 'risk-assessment'].includes(type);
  }

  /**
   * Clean up old data based on retention period
   */
  private async cleanupStorage(): Promise<void> {
    try {
      const cutoffTime = Date.now() - this.config.retentionPeriod;
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data'], 'readwrite');
      const store = transaction.objectStore('offline_data');
      const index = store.index('timestamp');

      const oldItems = await new Promise<OfflineDataItem[]>((resolve, reject) => {
        const request = index.getAll(IDBKeyRange.upperBound(cutoffTime));
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
      });

      await Promise.all(oldItems.map(item => this.deleteData(item.id)));

      if (oldItems.length > 0) {
        console.log(`[OfflineStorage] Cleaned up ${oldItems.length} old items`);
      }
    } catch (error) {
      console.error('[OfflineStorage] Cleanup failed:', error);
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{
    totalItems: number;
    unsyncedItems: number;
    storageSize: number;
    byType: Record<string, number>;
  }> {
    try {
      const allItems = await this.getAllData();
      const unsyncedItems = allItems.filter(item => !item.synced);

      const byType: Record<string, number> = {};
      allItems.forEach(item => {
        byType[item.type] = (byType[item.type] || 0) + 1;
      });

      // Estimate storage size (rough calculation)
      const storageSize = JSON.stringify(allItems).length * 2; // Rough estimate

      return {
        totalItems: allItems.length,
        unsyncedItems: unsyncedItems.length,
        storageSize,
        byType,
      };
    } catch (error) {
      console.error('[OfflineStorage] Failed to get storage stats:', error);
      return {
        totalItems: 0,
        unsyncedItems: 0,
        storageSize: 0,
        byType: {},
      };
    }
  }

  /**
   * Get all offline data
   */
  private async getAllData(): Promise<OfflineDataItem[]> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data'], 'readonly');
      const store = transaction.objectStore('offline_data');

      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result || []);
      });
    } catch (error) {
      console.error('[OfflineStorage] Failed to get all data:', error);
      return [];
    }
  }

  /**
   * Export all offline data (for backup/debugging)
   */
  async exportData(): Promise<OfflineDataItem[]> {
    const items = await this.getAllData();

    // Decrypt sensitive data for export
    const decryptedItems = await Promise.all(
      items.map(async (item) => {
        if (item.encrypted && this.config.encryptionEnabled) {
          try {
            const masterKey = process.env.ENCRYPTION_MASTER_KEY || 'fallback-master-key-change-in-production';
            const encryptedData = item.data as { encrypted: string; iv: string; tag: string; salt: string };
            const decryptedData = await decryptData(encryptedData, masterKey);
            return { ...item, data: JSON.parse(decryptedData) };
          } catch (error) {
            console.error('[OfflineStorage] Failed to decrypt item for export:', item.id);
            return item;
          }
        }
        return item;
      })
    );

    return decryptedItems;
  }

  /**
   * Clear all offline data (use with caution)
   */
  async clearAllData(): Promise<void> {
    try {
      const db = await this.getDB();
      const transaction = db.transaction(['offline_data', 'sync_queue'], 'readwrite');

      await Promise.all([
        new Promise<void>((resolve, reject) => {
          const request = transaction.objectStore('offline_data').clear();
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        }),
        new Promise<void>((resolve, reject) => {
          const request = transaction.objectStore('sync_queue').clear();
          request.onerror = () => reject(request.error);
          request.onsuccess = () => resolve();
        }),
      ]);

      console.log('[OfflineStorage] All offline data cleared');
    } catch (error) {
      console.error('[OfflineStorage] Failed to clear all data:', error);
    }
  }
}

// Export singleton instance
export const offlineStorage = new OfflineStorageManager();

// Export class for custom instances
export { OfflineStorageManager };