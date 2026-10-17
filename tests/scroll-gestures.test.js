import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function slider() {
  const track = new EventTarget(), thumb = new EventTarget(), window = new EventTarget();
  const properties = new Map();
  track.clientWidth = 300;
  thumb.offsetWidth = 48;
  track.style = { setProperty: (key, value) => properties.set(key, value), removeProperty() {} };
  thumb.style = { setProperty() {} };
  track.classList = { add() {}, remove() {} };
  track.setPointerCapture = () => {};
  track.hasPointerCapture = () => false;
  thumb.setAttribute = () => {};
  window.location = { hash: '#/masters' };
  window.setTimeout = () => {};
  runInNewContext(readFileSync(new URL('../js/rent-slider.js', import.meta.url), 'utf8'), {
    window, innerWidth: 390, innerHeight: 844,
    document: { body: {}, getElementById: id => id === 'rentSlider' ? track : thumb, querySelector: () => null },
    ResizeObserver: class { observe() {} }, requestAnimationFrame: () => 1,
  });
  function touch(type, x, y, second = false) {
    const point = { identifier: 1, clientX: x, clientY: y };
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { touches: type === 'touchend' || type === 'touchcancel' ? [] : second ? [point, { identifier: 2, clientX: x + 20, clientY: y + 20 }] : [point], changedTouches: [point] });
    track.dispatchEvent(event);
    return event;
  }
  function pointer(type, x, y) {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { button: 0, pointerType: 'mouse', pointerId: 1, clientX: x, clientY: y });
    track.dispatchEvent(event);
  }
  return { window, touch, pointer, progress: () => Number(properties.get('--slide-progress')) };
}

test('vertical and almost vertical swipes keep native scrolling and never book', () => {
  const { window, touch } = slider();
  assert.equal(touch('touchstart', 20, 100).defaultPrevented, false);
  assert.equal(touch('touchmove', 25, 140).defaultPrevented, false);
  touch('touchmove', 40, 260);
  touch('touchend', 180, 400);
  assert.equal(window.location.hash, '#/masters');
});

test('diagonal right swipe is accepted and completes before the full track length', () => {
  const { window, touch, progress } = slider();
  touch('touchstart', 20, 100);
  assert.equal(touch('touchmove', 35, 125).defaultPrevented, true);
  assert.ok(progress() > 0);
  touch('touchmove', 170, 200);
  assert.equal(window.location.hash, '#/masters');
  touch('touchend', 170, 200);
  assert.equal(window.location.hash, '#/booking');
});

test('after rightward intent is recognised, vertical finger drift does not cancel the slide', () => {
  const { window, touch } = slider();
  touch('touchstart', 20, 100);
  touch('touchmove', 35, 110);
  touch('touchmove', 100, 220);
  touch('touchend', 180, 330);
  assert.equal(window.location.hash, '#/booking');
});

test('cancelled swipe resets and does not book', () => {
  const { window, touch, progress } = slider();
  touch('touchstart', 20, 100);
  touch('touchmove', 200, 140);
  touch('touchcancel', 200, 140);
  assert.equal(progress(), 0);
  assert.equal(window.location.hash, '#/masters');
});

test('short tap and leftward swipe do not book', () => {
  const { window, touch } = slider();
  touch('touchstart', 20, 100);
  touch('touchend', 20, 100);
  touch('touchstart', 200, 100);
  touch('touchmove', 40, 110);
  touch('touchend', 40, 110);
  assert.equal(window.location.hash, '#/masters');
});

test('two-finger gesture cancels the slider and leaves native zoom available', () => {
  const { window, touch, progress } = slider();
  touch('touchstart', 20, 100);
  touch('touchmove', 60, 110);
  assert.equal(touch('touchstart', 60, 110, true).defaultPrevented, false);
  assert.equal(touch('touchmove', 100, 130, true).defaultPrevented, false);
  assert.equal(progress(), 0);
  assert.equal(window.location.hash, '#/masters');
});

test('mouse dragging still works', () => {
  const { window, pointer } = slider();
  pointer('pointerdown', 20, 100);
  pointer('pointermove', 270, 102);
  assert.equal(window.location.hash, '#/booking');
});
