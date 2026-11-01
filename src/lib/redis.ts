import Redis from "ioredis";

declare global {
  // eslint-disable-next-line no-var
  var __globalRedisClient: Redis | undefined;
  // eslint-disable-next-line no-var
  var __globalRedisSubscriber: Redis | undefined;
}

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

export const getRedisClient = (): Redis => {
  if (globalThis.__globalRedisClient) {
    return globalThis.__globalRedisClient;
  }

  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableAutoPipelining: true,
  });

  client.on("error", (err) => {
    // Only log if not in silent mode
    if (process.env.NODE_ENV !== "test") {
      console.warn("⚠️ Redis connection warning:", err.message);
    }
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__globalRedisClient = client;
  }

  return client;
};

export const getRedisSubscriber = (): Redis => {
  if (globalThis.__globalRedisSubscriber) {
    return globalThis.__globalRedisSubscriber;
  }

  const subClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
  });

  if (process.env.NODE_ENV !== "production") {
    globalThis.__globalRedisSubscriber = subClient;
  }

  return subClient;
};

export const redis = getRedisClient();
export default redis;

