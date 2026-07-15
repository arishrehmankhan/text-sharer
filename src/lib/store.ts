const KEY = "shared";

export interface Store {
  get(): Promise<string | null>;
  set(text: string): Promise<void>;
}

function createMemoryStore(): Store {
  let value: string | null = null;
  return {
    async get() {
      return value;
    },
    async set(text: string) {
      value = text;
    },
  };
}

function createKvStore(): Store {
  return {
    async get() {
      const { kv } = await import("@vercel/kv");
      return kv.get<string>(KEY);
    },
    async set(text: string) {
      const { kv } = await import("@vercel/kv");
      await kv.set(KEY, text);
    },
  };
}

export function getStore(): Store {
  if (process.env.KV_URL || process.env.VERCEL_KV_URL) {
    return createKvStore();
  }
  return createMemoryStore();
}
