import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../js/pages.js',import.meta.url),'utf8');
const handler=source.slice(source.indexOf("      root.querySelector('.master-share').onclick"),source.indexOf("      var pane = root.querySelector('#worksPane');"));
function setup(navigator) {
  const button={}, messages=[];
  runInNewContext(handler,{root:{querySelector:()=>button},navigator,URL,location:{href:'https://office.test/#/master/zinaida'},m:{id:'zinaida',name:'Зинаида'},pick:x=>x,global:{TO:{toast:x=>messages.push(x)}}});
  return {button,messages};
}
test('profile share passes the correct profile URL and name to native sharing',async()=>{
  let shared;const {button}=setup({share:async data=>{shared=data;}});await button.onclick();
  assert.equal(shared.url,'https://office.test/#/master/zinaida');assert.equal(shared.title,'Зинаида · Tattoo Office');
});
test('profile share copies URL when native sharing is unavailable',async()=>{
  let copied;const {button,messages}=setup({clipboard:{writeText:async url=>{copied=url;}}});await button.onclick();
  assert.equal(copied,'https://office.test/#/master/zinaida');assert.equal(messages[0],'Ссылка на профиль скопирована');
});
test('cancelling native share does not copy or show an error',async()=>{
  let copied=false;const {button,messages}=setup({share:async()=>{throw {name:'AbortError'};},clipboard:{writeText:async()=>{copied=true;}}});await button.onclick();assert.equal(copied,false);assert.deepEqual(messages,[]);
});
test('a denied clipboard shows a helpful message without crashing',async()=>{
  const {button,messages}=setup({clipboard:{writeText:async()=>{throw Error('denied');}}});await button.onclick();assert.match(messages[0],/Скопируйте адрес страницы/);
});
