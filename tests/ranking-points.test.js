import test from 'node:test';
import assert from 'node:assert/strict';
import {POINT_RULES,pointRules,scoreMaster} from '../server/ranking-points.js';
const master={name:'Artist',avatar:'photo',city:'Москва',bio:'Подробное описание мастера. '.repeat(4),specialty:'Графика',exp:'5 лет'};
const paid={status:'completed',total:420000,rate:320000,paid:420000,balance_used:0,unsettled:0,test_payment:false,extras:[{kind:'service',price:100000,qty:1}]};
test('3200 ₽ settled rent earns 70, service 20, profile 5 and unique work 2',()=>{
  const data={bookings:[paid],media:[{kind:'portfolio',fingerprint:'work'}]};
  const first=scoreMaster(master,data);assert.equal(first.score,97);assert.deepEqual(first.pointsBreakdown,{bookings:70,services:20,products:0,profile:5,works:2,drafts:0});assert.deepEqual(scoreMaster(master,data),first);
});
test('unpaid, partial, test, cancelled and refunded orders cannot inflate points',()=>{
  for(const changes of [{status:'pending'},{status:'confirmed'},{status:'invoiced'},{status:'cancelled'},{paid:50000},{test_payment:true},{unsettled:1}])assert.equal(scoreMaster({}, {bookings:[{...paid,...changes}]}).score,0);
  assert.equal(scoreMaster({}, {bookings:[{...paid,rate:0,total:0,paid:0,extras:[]}]}).score,0);
  assert.equal(scoreMaster({}, {bookings:[{...paid,paid:370000,balance_used:50000}]}).score,90);
});
test('media deduplicates across uploads and categories, deletion removes its award',()=>{
  const media=[{kind:'portfolio',fingerprint:'a'},{kind:'portfolio',fingerprint:'a'},{kind:'drafts',fingerprint:'a'},{kind:'drafts',fingerprint:'b'}];
  assert.equal(scoreMaster({}, {media}).score,3);assert.equal(scoreMaster({}, {media:[]}).score,0);
  assert.equal(scoreMaster({}, {media}, {...POINT_RULES,workLimit:0,draftLimit:0}).score,0);
});
test('profile award requires all public fields, is not cumulative and needs no birth date',()=>{
  const media=[{kind:'portfolio',fingerprint:'a'}];assert.equal(scoreMaster(master,{media}).pointsBreakdown.profile,5);
  for(const field of ['name','avatar','city','bio','specialty','exp'])assert.equal(scoreMaster({...master,[field]:''},{media}).pointsBreakdown.profile,0);
});
test('rules weight revenue proportionally and can be configured without a resident bonus',()=>{
  const rules=pointRules({rankingRules:{bookingPoints:140,profilePoints:10,bookingRubles:0}});assert.equal(rules.bookingRubles,3200);
  assert.equal(scoreMaster({}, {bookings:[{...paid,total:160000,rate:160000,paid:160000,extras:[]}]},rules).score,70);
  assert.equal(scoreMaster({}, {bookings:[{...paid,rate:0,total:200000,paid:200000,extras:[{kind:'product',price:100000,qty:2}]}]}).score,10);
});
