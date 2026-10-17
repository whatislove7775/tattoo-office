import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const source=readFileSync(new URL('../js/app.js',import.meta.url),'utf8');
const detection=source.slice(source.indexOf('  var telegramBrowser'),source.indexOf('  /* ------------------------------ маршруты'));
const safari='Mozilla/5.0 (iPhone) AppleWebKit/605.1.15 Version/26.6 Mobile/15E148 Safari/604.1';
function mode(ua,handlers={}) {
  const document={documentElement:{dataset:{}}};
  runInNewContext(detection,{document,navigator:{userAgent:ua},global:{webkit:{messageHandlers:handlers}}});
  return document.documentElement.dataset.browser;
}
test('ordinary Safari avoids the embedded-browser clipping workaround',()=>assert.equal(mode(safari),'safari'));
test('Telegram keeps edge protection even when it reports a Safari user agent',()=>assert.equal(mode(safari,{contentInterface:{},performAction:{}}),'telegram'));
test('one unrelated WebKit message handler does not identify Telegram',()=>assert.equal(mode(safari,{contentInterface:{}}),'safari'));
test('Yandex keeps its native unclipped page',()=>assert.equal(mode(safari+' YaBrowser/26.8 YaApp_iOS/2608'),'yandex'));
