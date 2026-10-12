import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('../js/app.js', import.meta.url), 'utf8');
const clipFunction = source.slice(source.indexOf('  function updatePageClip()'), source.indexOf('  function schedulePageClip()'));
function clip({ scroll = 600, offset = 0, scale = 1 } = {}) {
  const values = new Map();
  runInNewContext(clipFunction + '\nupdatePageClip();', {
    global: { innerWidth: 390, innerHeight: 844, scrollY: scroll, visualViewport: { offsetTop: offset, height: 844, scale } },
    document: { scrollingElement: { scrollHeight: 1444, clientHeight: 844 } },
    view: {
      getBoundingClientRect: () => ({ top: 54 - scroll, bottom: 1300 - scroll }),
      style: { setProperty: (key, value) => values.set(key, value), removeProperty: key => values.delete(key) },
    },
  });
  return [...values.entries()];
}

test('pulling beyond the bottom does not expand the content mask', () => {
  assert.deepEqual(clip({ scroll: 680 }), clip({ scroll: 600 }));
});

test('pulling beyond the top does not shift the content mask', () => {
  assert.deepEqual(clip({ scroll: -80 }), clip({ scroll: 0 }));
});

test('browser toolbar offsets do not become an extra header at normal zoom', () => {
  assert.deepEqual(clip({ offset: 100 }), clip({ offset: 0 }));
});
