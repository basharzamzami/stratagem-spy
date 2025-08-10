// Minimal Redis client wrapper with lazy init and graceful MOCK_MODE fallback
// Uses ioredis if available; when MOCK_MODE=true returns an in-memory mock suitable for tests.

let redisInstance: any;

class InMemoryRedisMock {
  private store = new Map<string, { value: string; expireAt?: number }>();

  private isExpired(key: string) {
    const entry = this.store.get(key);
    if (!entry) return true;
    if (!entry.expireAt) return false;
    if (Date.now() > entry.expireAt) {
      this.store.delete(key);
      return true;
    }
    return false;
  }

  async set(key: string, value: string, mode?: string, ttlSeconds?: number) {
    const expireAt = mode?.toUpperCase() === "EX" && ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined;
    this.store.set(key, { value, expireAt });
    return "OK";
  }

  async get(key: string) {
    if (this.isExpired(key)) return null;
    return this.store.get(key)?.value ?? null;
  }

  async del(key: string) {
    this.store.delete(key);
    return 1;
  }

  async setnx(key: string, value: string) {
    if (this.isExpired(key)) {
      this.store.set(key, { value });
      return 1;
    }
    if (!this.store.has(key)) {
      this.store.set(key, { value });
      return 1;
    }
    return 0;
  }

  async expire(key: string, ttlSeconds: number) {
    const entry = this.store.get(key);
    if (!entry) return 0;
    entry.expireAt = Date.now() + ttlSeconds * 1000;
    this.store.set(key, entry);
    return 1;
  }

  async incrby(key: string, by: number) {
    const current = parseInt((await this.get(key)) || "0", 10);
    const next = current + by;
    await this.set(key, String(next));
    return next;
  }
}

export function getRedis() {
  if (redisInstance) return redisInstance;
  if (process.env.MOCK_MODE === "true") {
    redisInstance = new InMemoryRedisMock();
    return redisInstance;
  }
  try {
    // Dynamically require to avoid hard dependency if not installed
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const IORedis = require("ioredis");
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    redisInstance = new IORedis(url, {
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    });
    return redisInstance;
  } catch (e) {
    // Fallback to in-memory if ioredis isn't installed to keep dev experience smooth
    redisInstance = new InMemoryRedisMock();
    return redisInstance;
  }
}

