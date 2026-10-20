import test from 'node:test';import assert from 'node:assert/strict';import {ageFromBirthDate} from '../server/profile-age.js';
test('age changes at the start of a birthday in Moscow without editing the profile',()=>{
 assert.equal(ageFromBirthDate('2000-10-17',new Date('2026-10-16T20:59:59Z')),25);
 assert.equal(ageFromBirthDate('2000-10-17',new Date('2026-10-16T21:00:00Z')),26);
 assert.equal(ageFromBirthDate('2000-10-17',new Date('2027-10-16T21:00:00Z')),27);
});
test('invalid dates are rejected and leap day birthdays advance on March 1 in non-leap years',()=>{
 for(const value of ['2000-02-30','2023-02-29','2000-13-01','2000-01-00','',null])assert.equal(ageFromBirthDate(value),null);
 assert.equal(ageFromBirthDate('2000-02-29',new Date('2026-02-28T12:00:00Z')),25);
 assert.equal(ageFromBirthDate('2000-02-29',new Date('2026-03-01T12:00:00Z')),26);
});
