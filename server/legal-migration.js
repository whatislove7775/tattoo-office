import { createHash } from 'node:crypto';
import { legalSamples } from './domain.js';

// Only the original template texts are migrated. Admin-edited documents remain intact.
const legacyHashes = {
  privacy: new Set(['d35f1dae3711f2079d6e2cfcbe0c0ad978e81e9fcef561397fff780480847deb','60f1733ab5769e15bef4d6cc6b9822115dcabcec35d6326420768691c5215d05']),
  offer: new Set(['a916e4d7ef8fdf541ba32fd1592e3c4ad234fc9e175ce467581e6ea21e3a7b04']),
  consent: new Set(['f27aabfac1e7ad889cb2fe5639c9da080a6d181ec1d55f0d1b611a0f6c9d2422','019fa91a7fa8467a00b44ae81a087828535743e012ac481120e74715cf6b2f89']),
};

export function updateLegalDocuments(settings) {
  let next;
  for (const key of Object.keys(legacyHashes)) {
    const text = settings[key];
    if (typeof text !== 'string') continue;
    const hash = createHash('sha256').update(text).digest('hex');
    if (!legacyHashes[key].has(hash)) continue;
    next ||= { ...settings, legalApproved: false };
    next[key] = legalSamples[key];
  }
  return next || settings;
}
