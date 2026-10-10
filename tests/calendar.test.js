import { test } from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID, generateKeyPairSync } from 'node:crypto';
import { database } from '../server/db.js';
import { createApp } from '../server/index.js';
import { workerTick } from '../server/worker.js';

test('calendar queue syncs closed intervals in payment test mode only when enabled, without duplicates', async () => {
  process.env.DATA_DIR = 'memory://';
  process.env.GOOGLE_CALENDAR_SYNC_ENABLED = 'false';
  const { privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
  process.env.GOOGLE_SERVICE_ACCOUNT = JSON.stringify({ client_email: 'calendar@test.invalid', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) });
  const db = await database();
  await createApp(db);
  const originalFetch = globalThis.fetch, calls = [], events = new Map();
  globalThis.fetch = async (url, options = {}) => {
    if (url === 'https://oauth2.googleapis.com/token') return Response.json({ access_token: 'test-only-token' });
    assert.ok(url.startsWith('https://www.googleapis.com/calendar/v3/calendars/'));
    calls.push({ url, ...options });
    if (options.method === 'POST') {
      const event = JSON.parse(options.body);
      assert.equal(event.visibility, 'default');
      assert.ok(!events.has(event.id));
      events.set(event.id, event);
      return Response.json(event);
    }
    const id = url.split('/').at(-1);
    if (options.method === 'DELETE') { events.delete(id); return new Response(null, { status: 204 }); }
    if (!events.has(id)) return Response.json({}, { status: 404 });
    events.set(id, JSON.parse(options.body));
    return Response.json(events.get(id));
  };
  try {
    const resource = (await db.query('SELECT id FROM resources LIMIT 1')).rows[0];
    await db.query('UPDATE resources SET calendar_id=$1 WHERE id=$2', ['workspace@test.invalid', resource.id]);
    const block = { id: randomUUID(), resource_id: resource.id, starts_at: '2030-01-01T09:00:00Z', ends_at: '2030-01-01T10:00:00Z', reason: 'Test' };
    await db.query('INSERT INTO blocks VALUES($1,$2,$3,$4,$5)', Object.values(block));
    const queue = async (kind, payload, status = 'done') => { const id = randomUUID(); await db.query('INSERT INTO outbox(id,kind,payload) VALUES($1,$2,$3)', [id, kind, JSON.stringify(payload)]); await workerTick(db); assert.equal((await db.query('SELECT status FROM outbox WHERE id=$1', [id])).rows[0].status, status); };
    await queue('calendar.block', { blockId: block.id }, 'simulated');
    assert.equal(calls.length, 0);
    process.env.GOOGLE_CALENDAR_SYNC_ENABLED = 'true';
    assert.equal((await db.query('SELECT data FROM settings')).rows[0].data.mode, 'test');
    await queue('calendar.block', { blockId: block.id });
    await queue('calendar.block', { blockId: block.id });
    assert.equal(events.size, 1);
    assert.equal(calls.filter(c => c.method === 'POST').length, 1);
    await queue('calendar.unblock', { block });
    assert.equal(events.size, 0);
    assert.equal(calls.at(-1).method, 'DELETE');
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.GOOGLE_CALENDAR_SYNC_ENABLED;
    delete process.env.GOOGLE_SERVICE_ACCOUNT;
    await db.close();
  }
});
