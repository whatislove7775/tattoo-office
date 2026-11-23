import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { updateStudioWorkspaces } from "../server/studio-workspaces.js";

const numbers = ["01", "02", "03", "04", "05", "06", "07"];

async function workspaceDatabase(t) {
  const db = new PGlite();
  t.after(() => db.close());
  await db.exec(`
    CREATE TABLE resources (
      id uuid PRIMARY KEY, name text NOT NULL, city text NOT NULL,
      photo text NOT NULL DEFAULT '', deleted boolean NOT NULL DEFAULT false,
      active boolean NOT NULL DEFAULT true, calendar_id text
    );
    CREATE TABLE bookings (resource_id uuid REFERENCES resources(id));
  `);
  return db;
}

test("a new studio starts with seven workspaces", async (t) => {
  const db = await workspaceDatabase(t);
  await db.transaction((q) => updateStudioWorkspaces(q, {}));
  const { rows } = await db.query("SELECT name FROM resources ORDER BY name");
  assert.deepEqual(rows.map(({ name }) => name.slice(0, 2)), numbers);
});

test("updating the four existing places keeps bookings and admin settings", async (t) => {
  const db = await workspaceDatabase(t);
  const names = ["01 — у окна", "02 — большой зал", "03 — тихая комната", "04 — у стены"];
  const ids = names.map(() => randomUUID());
  for (const [index, name] of names.entries()) {
    await db.query("INSERT INTO resources(id,name,city) VALUES($1,$2,'spb')", [ids[index], name]);
  }
  await db.query("UPDATE resources SET photo='custom.jpg',active=false,calendar_id='test-calendar' WHERE id=$1", [ids[1]]);
  await db.query("INSERT INTO bookings(resource_id) VALUES($1)", [ids[1]]);
  const settings = await db.transaction((q) => updateStudioWorkspaces(q, { resourcesSeeded: true }));
  await db.transaction((q) => updateStudioWorkspaces(q, settings));

  const { rows } = await db.query("SELECT * FROM resources ORDER BY name");
  assert.deepEqual(rows.map(({ name }) => name.slice(0, 2)), numbers);
  assert.deepEqual(rows.slice(0, 4).map(({ id }) => id), ids);
  assert.equal(rows[1].name, "02 — за перегородкой");
  assert.equal(rows[3].name, "04 — за перегородкой");
  assert.equal(rows[1].photo, "custom.jpg");
  assert.equal(rows[1].active, false);
  assert.equal(rows[1].calendar_id, "test-calendar");
  assert.equal((await db.query("SELECT resource_id FROM bookings")).rows[0].resource_id, ids[1]);
});
