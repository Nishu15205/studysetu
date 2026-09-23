import { PrismaClient } from '@prisma/client'
import fs from "fs";
import path from "path";

/**
 * Resolve the SQLite database URL at runtime so the app works everywhere:
 *
 * 1. A non-file DATABASE_URL (hosted DB like Turso/Neon) is used as-is.
 * 2. A file: DATABASE_URL whose file actually exists (local dev / self-host) is used as-is.
 * 3. Fallback for serverless (Vercel): the seeded db/custom.db is bundled with the
 *    function (see next.config.ts outputFileTracingIncludes) and copied once to the
 *    writable /tmp directory on cold start, so even writes work (ephemerally).
 */
function resolveDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL?.trim();

  if (envUrl && !envUrl.startsWith("file:")) return envUrl;

  if (envUrl) {
    const filePath = envUrl.replace(/^file:/, "").split("?")[0];
    try {
      if (fs.existsSync(filePath)) return envUrl;
    } catch {
      /* fall through to bundled fallback */
    }
  }

  const bundled = path.join(process.cwd(), "db", "custom.db");
  try {
    if (fs.existsSync(bundled)) {
      const target = "/tmp/studysetu.db";
      try {
        fs.copyFileSync(bundled, target);
        return `file:${target}?connection_limit=1`;
      } catch {
        return `file:${bundled}?connection_limit=1`;
      }
    }
  } catch {
    /* fall through */
  }

  return envUrl || "file:./db/custom.db?connection_limit=1";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: { url: resolveDatabaseUrl() },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
