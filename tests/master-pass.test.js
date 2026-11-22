import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source = readFileSync(new URL('../js/pages.js', import.meta.url), 'utf8');

function setup(writeText) {
  const window = {}, button = {}, messages = [];
  const link = { href: 'https://office.test/#/master/OfficeInk' };
  const elements = { '.master-pass__link': link, '[data-copy-master-pass]': button };
  const root = { querySelector: selector => elements[selector] || null };
  runInNewContext(source, { window, navigator: { clipboard: { writeText } } });
  window.Pages.mountMasterPass(root, message => messages.push(message));
  return { button, link, messages, pages: window.Pages };
}

test('Tattoo Office Pass displays a handle and copies its profile URL', async () => {
  let copied;
  const { button, link, messages, pages } = setup(async value => { copied = value; });
  const master = { id: 'account-id', username: 'OfficeInk' };
  assert.match(pages.masterPassHTML(master), /href="#\/master\/OfficeInk">@OfficeInk/);
  assert.equal(pages.masterProfilePath({ id: master.id }), '#/master/account-id');
  await button.onclick();
  assert.equal(copied, 'https://office.test/#/master/OfficeInk');
  assert.equal(messages[0], 'Ссылка на профиль скопирована');
  copied = undefined;
  let prevented = false;
  await link.onclick({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(copied, link.href);
  assert.equal(messages[1], 'Ссылка на профиль скопирована');
  copied = undefined;
  await link.onclick({ ctrlKey: true, preventDefault() { assert.fail('Modified navigation was prevented'); } });
  assert.equal(copied, undefined);
});

test('clipboard denial explains how to copy the link', async () => {
  const { button, messages } = setup(async () => { throw Error('denied'); });
  await button.onclick();
  assert.match(messages[0], /Скопируйте адрес через меню ссылки/);
});
