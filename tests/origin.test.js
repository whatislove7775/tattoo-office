import test from "node:test";
import assert from "node:assert/strict";
import { allowedOrigin } from "../server/domain.js";

test("изменяющие запросы принимаются с основного адреса и превью проекта Vercel", () => {
  const appOrigin = "https://tattoo-office-ten.vercel.app";
  assert.equal(allowedOrigin(undefined, { appOrigin }), true);
  assert.equal(allowedOrigin(appOrigin, { appOrigin }), true);
  assert.equal(allowedOrigin("https://tattoo-office-git-admin-users-whatislove7775s-projects.vercel.app", { appOrigin }), true);
  assert.equal(allowedOrigin("https://tattoo-office-jd60cqet1-whatislove7775s-projects.vercel.app", { appOrigin }), true);
  for (const origin of [
    "https://evil.example",
    "https://tattoo-office-x-otherteam-projects.vercel.app",
    "https://tattoo-office-x-whatislove7775s-projects.vercel.app.evil.example",
    "http://tattoo-office-x-whatislove7775s-projects.vercel.app",
    "https://other-app-whatislove7775s-projects.vercel.app",
  ]) assert.equal(allowedOrigin(origin, { appOrigin }), false, origin);
  assert.equal(allowedOrigin("https://tattoo-office-git-x-whatislove7775s-projects.vercel.app", { appOrigin, previewPattern: "" }), false);
  assert.equal(allowedOrigin("http://localhost:3000", { host: "localhost:3000" }), true);
});
