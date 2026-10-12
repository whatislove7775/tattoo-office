import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

function slider() {
  const track = new EventTarget(), thumb = new EventTarget(), window = new EventTarget();
  const handlers = new Map();
  const listen = track.addEventListener.bind(track);
  track.addEventListener = (type, handler) => { handlers.set(type, handler); listen(type, handler); };
  track.clientWidth = 300;
  thumb.offsetWidth = 48;
  track.style = { setProperty() {}, removeProperty() {} };
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
  function gesture(type, x, y) {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { button: 0, pointerType: 'touch', pointerId: 1, clientX: x, clientY: y });
    track.dispatchEvent(event);
    return event;
  }
  return { window, gesture, loseThumbCapture: () => handlers.get("lostpointercapture")({ target: thumb, pointerId: 1 }) };
}

test('vertical touch movement over booking slider does not book or prevent native scrolling', () => {
  const { window, gesture } = slider();
  assert.equal(gesture('pointerdown', 20, 100).defaultPrevented, false);
  assert.equal(gesture('pointermove', 30, 180).defaultPrevented, false);
  gesture('pointerup', 270, 250);
  assert.equal(window.location.hash, '#/masters');
});

test('horizontal touch drag books only after release', () => {
  const { window, gesture } = slider();
  gesture('pointerdown', 20, 100);
  gesture('pointermove', 270, 102);
  assert.equal(window.location.hash, '#/masters');
  gesture('pointerup', 270, 102);
  assert.equal(window.location.hash, '#/booking');
});

test('cancelled touch gesture never books and a short tap remains non-confirming', () => {
  const { window, gesture } = slider();
  gesture('pointerdown', 20, 100);
  gesture('pointermove', 270, 102);
  gesture('pointercancel', 270, 102);
  gesture('pointerup', 270, 102);
  assert.equal(window.location.hash, '#/masters');
  gesture('pointerdown', 20, 100);
  gesture('pointerup', 20, 100);
  assert.equal(window.location.hash, '#/masters');
});

test('transferring implicit touch capture from the thumb to the track keeps dragging', () => {
  const { window, gesture, loseThumbCapture } = slider();
  gesture('pointerdown', 20, 100);
  gesture('pointermove', 40, 101);
  loseThumbCapture();
  gesture('pointermove', 270, 102);
  gesture('pointerup', 270, 102);
  assert.equal(window.location.hash, '#/booking');
});

test('losing capture on the track cancels the gesture', () => {
  const { window, gesture } = slider();
  gesture('pointerdown', 20, 100);
  gesture('pointermove', 270, 102);
  gesture('lostpointercapture', 270, 102);
  gesture('pointerup', 270, 102);
  assert.equal(window.location.hash, '#/masters');
});
