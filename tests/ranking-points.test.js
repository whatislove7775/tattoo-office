import test from 'node:test';
import assert from 'node:assert/strict';
import {pointRules,scoreMaster} from '../server/ranking-points.js';

const paid={status:'completed',total:420000,rate:320000,paid:420000,balance_used:0,unsettled:0,test_payment:false};
test('only the rent portion of a settled session earns ranking points',()=>{
  const booking={...paid,extras:[{kind:'service',price:50000,qty:1},{kind:'product',price:50000,qty:1}]};
  assert.deepEqual(scoreMaster([booking]),{score:70,pointsBreakdown:{bookings:70}});
  assert.equal(scoreMaster([{...booking,rate:0}]).score,0);
  assert.equal(scoreMaster([]).score,0);
});
test('only completed, fully paid, non-test bookings qualify',()=>{
  for(const changes of [{status:'pending'},{status:'confirmed'},{status:'invoiced'},{status:'cancelled'},{paid:50000},{test_payment:true},{unsettled:1}]){
    assert.equal(scoreMaster([{...paid,...changes}]).score,0);
  }
  assert.equal(scoreMaster([{...paid,paid:370000,balance_used:50000}]).score,70);
});
test('legacy weights are ignored and session rates are rounded per booking',()=>{
  const rules=pointRules({rankingRules:{bookingPoints:140,profilePoints:99,bookingRubles:0}});
  assert.deepEqual(rules,{bookingPoints:140,bookingRubles:3200});
  const booking={...paid,rate:5000};
  assert.equal(scoreMaster([booking,booking],rules).score,4);
});
