import pg from "pg";
import { PGlite } from "@electric-sql/pglite";
export async function database() {
  if (process.env.DATABASE_URL) {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    return {
      query: (s, p) => pool.query(s, p),
      transaction: async (fn) => {
        const c = await pool.connect();
        try {
          await c.query("BEGIN");
          const r = await fn(c);
          await c.query("COMMIT");
          return r;
        } catch (e) {
          await c.query("ROLLBACK");
          throw e;
        } finally {
          c.release();
        }
      },
      close: () => pool.end(),
    };
  }
  if (process.env.NODE_ENV === "production")
    throw Error("DATABASE_URL required in production");
  const db = new PGlite(process.env.DATA_DIR || "./work/database");
  await db.waitReady;
  let tail = Promise.resolve();
  const serial = (fn) => {
    const p = tail.then(fn, fn);
    tail = p.catch(() => {});
    return p;
  };
  return {
    query: (s, p) => serial(() => db.query(s, p)),
    transaction: (fn) => serial(() => db.transaction(fn)),
    close: () => db.close(),
  };
}
