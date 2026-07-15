export interface Store {
  get(id: string): Promise<string | null>;
  set(id: string, text: string): Promise<void>;
}

function createMemoryStore(): Store {
  const map = new Map<string, string>();
  return {
    async get(id: string) {
      return map.get(id) ?? null;
    },
    async set(id: string, text: string) {
      map.set(id, text);
    },
  };
}

function createKvStore(): Store {
  return {
    async get(id: string) {
      const { kv } = await import("@vercel/kv");
      return kv.get<string>(id);
    },
    async set(id: string, text: string) {
      const { kv } = await import("@vercel/kv");
      await kv.set(id, text);
    },
  };
}

export function getStore(): Store {
  if (process.env.KV_URL || process.env.VERCEL_KV_URL) {
    return createKvStore();
  }
  return createMemoryStore();
}
