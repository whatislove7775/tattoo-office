import { randomUUID } from "node:crypto";
import { listCalendarEvents } from "./integrations.js";

const states = new WeakMap();
const enabled = () => process.env.GOOGLE_CALENDAR_SYNC_ENABLED === "true";
// Calendars of the four studio workspaces use Europe/Moscow (UTC+03).
const instant = value => value?.dateTime || (value?.date ? value.date + "T00:00:00+03:00" : null);

export async function refreshCalendarBusy(db, maxAge = 15000) {
  if (!enabled()) return;
  let state = states.get(db);
  if (!state) { state = {updated:0,pending:null}; states.set(db,state); }
  if (state.pending) return state.pending;
  if (Date.now() - state.updated < maxAge) return;
  state.pending = (async () => {
    const resources = (await db.query("SELECT id,calendar_id FROM resources WHERE active AND calendar_id IS NOT NULL AND calendar_id<>''")).rows;
    const from = new Date(Date.now() - 86400000).toISOString();
    const until = new Date(Date.now() + 182 * 86400000).toISOString();
    // Fetch all pages first. An API failure never turns cached busy time into free time.
    const snapshots = await Promise.all(resources.map(async r => ({...r,events:await listCalendarEvents(r.calendar_id,from,until)})));
    await db.transaction(async q => {
      await q.query("SELECT id FROM settings WHERE id=1 FOR UPDATE");
      const owned = new Set((await q.query("SELECT replace(id::text,'-','') AS event_id FROM bookings UNION SELECT replace(id::text,'-','') FROM blocks")).rows.map(r => r.event_id));
      for (const r of snapshots) {
        const current = (await q.query("SELECT calendar_id FROM resources WHERE id=$1 AND active",[r.id])).rows[0];
        if (current?.calendar_id !== r.calendar_id) continue;
        const busy = [];
        for (const e of r.events) {
          if (e.status === "cancelled" || e.transparency === "transparent" || owned.has(e.id) || e.extendedProperties?.private?.tattooOffice === "workspace") continue;
          const start = new Date(instant(e.start)), end = new Date(instant(e.end));
          if (!e.id || !instant(e.start) || !instant(e.end) || !Number.isFinite(+start) || !Number.isFinite(+end) || end <= start) throw Error("Google Calendar: некорректный занятый интервал");
          busy.push({id:e.id,start:start.toISOString(),end:end.toISOString()});
        }
        await q.query("DELETE FROM calendar_busy WHERE resource_id=$1 AND NOT(event_id=ANY($2::text[]))",[r.id,busy.map(e=>e.id)]);
        for (const e of busy) await q.query("INSERT INTO calendar_busy(id,resource_id,event_id,starts_at,ends_at) VALUES($1,$2,$3,$4,$5) ON CONFLICT(resource_id,event_id) DO UPDATE SET starts_at=$4,ends_at=$5",[randomUUID(),r.id,e.id,e.start,e.end]);
      }
      await q.query("DELETE FROM calendar_busy WHERE resource_id NOT IN (SELECT id FROM resources WHERE active AND calendar_id IS NOT NULL AND calendar_id<>'')");
    });
    state.updated = Date.now();
  })();
  try { await state.pending; } finally { state.pending = null; }
}
