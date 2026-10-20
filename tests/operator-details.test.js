import test from 'node:test';
import assert from 'node:assert/strict';
import {operatorDetails,updateOperatorDetails} from '../server/operator-details.js';
import {defaults} from '../server/domain.js';
test('owner requisites migrate once without changing tariffs, legal approval or later edits',()=>{
  const old={...defaults,legalApproved:false,rates:{resident:{3:12345}},privacy:'Политика студии.\n\nПеред открытием регистрации владелец студии дополнит этот текст своими реквизитами, контактами и сведениями о технических подрядчиках.'};
  const updated=updateOperatorDetails(old);
  assert.equal(updated.email,'Tattoo1office@gmail.com');assert.equal(updated.inn,'183800043387');assert.equal(updated.ogrnip,'323180000038342');assert.equal(updated.bankAccount,'40802810600005342739');assert.equal(updated.privacy,'Политика студии.');assert.deepEqual(updated.rates,old.rates);assert.equal(updated.legalApproved,false);assert.equal(old.email,'');
  const edited={...updated,phone:'edited'};assert.equal(updateOperatorDetails(edited),edited);assert.equal(edited.operatorDetailsVersion,operatorDetails.operatorDetailsVersion);
});
