import localforage from 'localforage';

export type StorageType = 'local' | 'session';

export function createStorage<T extends object>(type: StorageType, storagePrefix: string) {
  const stg = type === 'session' ? window.sessionStorage : window.localStorage;

  const storage = {
    /**
     * Set session
     * 
     * @param key Session key
     * @param value Session value
     */
    set<K extends keyof T>(key: K, value: T[K]) {
      const json = JSON.stringify(value);

      stg.setItem(this.getKey(key), json);
    },

    /**
     * Get session
     * 
     * @param key Session key
     */
    get<K extends keyof T>(key: K): T[K] | null {
      const json = stg.getItem(this.getKey(key));
      if (json) {
        let storageData: T[K] | null = null;
        try {
          storageData = JSON.parse(json)
        } catch { }

        if (storageData !== null) {
          return storageData;
        }
      }
      stg.removeItem(this.getKey(key));
      
      return null;
    },

    remove(key: keyof T) {
      stg.removeItem(this.getKey(key));
    },

    clear() {
      stg.clear();
    },

    getKey(key: keyof T) {
      return `${storagePrefix}${key as string}`;
    }
  };

  return storage;
}

type LocalForage<T extends object> = Omit<typeof localforage, 'getItem' | 'setItem' | 'removeItem'> & {
  getItem<K extends keyof T>(key: K, callback?: (err: any, value: T[K] | null) => void): Promise<T[K] | null>;
  setItem<K extends keyof T>(key: K, value: T[K] | null, callback?: (err: any, value: T[K] | null) => void): Promise<T[K] | null>;
  removeItem(key: keyof T, callback?: (err: any) => void): Promise<void>;
}

type LocalforageDriver = 'local' | 'indexedDB' | 'webSQL';

export function createLocalforage<T extends object>(driver: LocalforageDriver) {
  const driverMap: Record<LocalforageDriver, string> = {
    local: localforage.LOCALSTORAGE,
    indexedDB: localforage.INDEXEDDB,
    webSQL: localforage.WEBSQL,
  };

  localforage.config({
    driver: driverMap[driver],
  });
  return localforage as LocalForage<T>;
}