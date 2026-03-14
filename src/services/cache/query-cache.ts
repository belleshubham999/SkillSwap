const memory = new Map<string, { value: unknown; expires: number }>();

export const queryCache = {
  set<T>(key: string, value: T, ttlMs = 60_000) {
    memory.set(key, { value, expires: Date.now() + ttlMs });
  },
  get<T>(key: string): T | null {
    const item = memory.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      memory.delete(key);
      return null;
    }
    return item.value as T;
  },
  invalidate(prefix: string) {
    [...memory.keys()].forEach((k) => k.startsWith(prefix) && memory.delete(k));
  }
};
