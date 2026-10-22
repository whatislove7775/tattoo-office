// One-time migration for the existing Tattoo Office production settings.
// Run inside the app container with --apply after backing up PostgreSQL.
import { createHash } from "node:crypto";
import { database } from "../server/db.js";
import { legalSamples } from "../server/domain.js";
import { studioRules, studioRulesVersion } from "../server/studio-rules.js";

const expected = {
  openHour: 10,
  closeHour: 22,
  cancelHours: 24,
  lateCancellation: "review",
  rulesVersion: "2026-10-16",
  rulesHash: "32b01dbf8de343b6f8d6b552812748a78cd6f48cef84703c9699b2378112b6c5",
  offerHash: "158e3490bf13184c4c07f97fb40a4b2978a0b4b53cfc80328a57149b81b7588b",
};
const sha256 = (text) => createHash("sha256").update(text).digest("hex");

if (!process.argv.includes("--apply")) {
  console.log("Add --apply to update the production settings after a database backup.");
  process.exit(0);
}
if (process.env.NODE_ENV !== "production" || !process.env.DATABASE_URL)
  throw Error("This migration requires the production app database connection.");

const db = await database();
try {
  await db.transaction(async (query) => {
    const row = (await query.query("SELECT data FROM settings WHERE id=1 FOR UPDATE")).rows[0];
    if (!row) throw Error("Studio settings are missing; no changes made.");
    const current = row.data;
    for (const key of ["openHour", "closeHour", "cancelHours", "lateCancellation", "rulesVersion"])
      if (current[key] !== expected[key])
        throw Error(`Unexpected existing ${key}; no changes made.`);
    if (sha256(current.rules) !== expected.rulesHash || sha256(current.offer) !== expected.offerHash)
      throw Error("Rules or offer changed since review; no changes made.");

    const next = {
      ...current,
      openHour: 0,
      closeHour: 24,
      cancelHours: 48,
      lateCancellation: "retain",
      rules: studioRules,
      rulesVersion: studioRulesVersion,
      offer: legalSamples.offer,
    };
    await query.query("UPDATE settings SET data=$1::jsonb WHERE id=1", [JSON.stringify(next)]);
    await query.query(
      "INSERT INTO audit(id,actor,action,details) VALUES(gen_random_uuid(),NULL,$1,$2::jsonb)",
      ["settings.24h-48h", JSON.stringify({ openHour: 0, closeHour: 24, cancelHours: 48, lateCancellation: "retain" })],
    );
  });
  console.log("Updated Tattoo Office: 24-hour booking and 48-hour cancellation rule.");
} finally {
  await db.close();
}
