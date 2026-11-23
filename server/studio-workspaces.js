import { randomUUID } from "node:crypto";

const studioWorkspaces = [
  { name: "01 — у окна", photo: 1 },
  { name: "02 — за перегородкой", previousName: "02 — большой зал", photo: 4 },
  { name: "03 — тихая комната", photo: 4 },
  { name: "04 — за перегородкой", previousName: "04 — у стены", photo: 4 },
  { name: "05 — у стены", photo: 4 },
  { name: "06 — у входа в главный зал", photo: 4 },
  { name: "07 — главный зал", photo: 1 },
];

async function insertWorkspace(db, { name, photo }) {
  await db.query("INSERT INTO resources(id,name,city,photo) VALUES($1,$2,'spb',$3)", [
    randomUUID(),
    name,
    `assets/interior/${photo}.jpg`,
  ]);
}

export async function updateStudioWorkspaces(db, settings) {
  if (settings.studioWorkspacesVersion === 1) return settings;
  const { rows } = await db.query("SELECT id,name,city,photo,deleted FROM resources");

  if (!settings.resourcesSeeded && rows.length === 0) {
    for (const workspace of studioWorkspaces) await insertWorkspace(db, workspace);
  } else {
    const places = rows.filter((row) => row.city === "spb" && !row.deleted);
    const originalPlaces = studioWorkspaces.slice(0, 4);
    const originalRows = originalPlaces.map(({ name, previousName }) =>
      places.find((row) => row.name === (previousName || name)),
    );
    if (places.length === originalPlaces.length && originalRows.every(Boolean)) {
      for (const [index, workspace] of originalPlaces.entries()) {
        const original = originalRows[index];
        await db.query("UPDATE resources SET name=$1,photo=$2 WHERE id=$3", [
          workspace.name,
          original.photo || `assets/interior/${workspace.photo}.jpg`,
          original.id,
        ]);
      }
      for (const workspace of studioWorkspaces.slice(4)) await insertWorkspace(db, workspace);
    }
  }
  return { ...settings, resourcesSeeded: true, studioWorkspacesVersion: 1 };
}
