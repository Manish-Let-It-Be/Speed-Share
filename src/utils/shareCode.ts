import { nanoid } from 'nanoid';

const STORAGE_KEY = 'speedshare_items';

interface ShareStore {
  [key: string]: any;
}

// Load items from localStorage
const loadStore = (): ShareStore => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save items to localStorage
const saveStore = (store: ShareStore) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

// Check URL for share code on load
export const checkUrlForShareCode = (): string | null => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
};

export const generateShareCode = (): string => {
  return nanoid(6).toUpperCase();
};

const shareStore: ShareStore = loadStore();

export const storeItem = (code: string, item: any) => {
  shareStore[code] = item;
  saveStore(shareStore);
};

export const retrieveItem = (code: string) => {
  return shareStore[code];
};

export const removeItem = (code: string) => {
  delete shareStore[code];
  saveStore(shareStore);
};