import { Pool, type PoolConfig } from "pg";
import { env } from "./env.js";

const poolConfig: PoolConfig = {
  connectionString: env.databaseUrl,
  ssl: env.nodeEnv === "production" ? { rejectUnauthorized: false } : undefined,
};

export const dbPool = new Pool(poolConfig);

export async function testDatabaseConnection(): Promise<void> {
  const client = await dbPool.connect();
  try {
    await client.query("SELECT 1");
  } finally {
    client.release();
  }
}

process.on("SIGINT", async () => {
  await dbPool.end();
  process.exit(0);
});
