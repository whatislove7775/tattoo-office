import { test } from "node:test";
import assert from "node:assert/strict";
import { fiscalDrafts, fiscalExample } from "../server/fiscal-drafts.js";

const booking = { deposit: 50000, rate: 320000, tariff: 6, balance_used: 0, extras: [], status: "completed" };

test("500 rubles are a partial advance and are credited on the closing receipt", () => {
  const { drafts, requestExamples } = fiscalExample();
  assert.deepEqual(drafts.map((draft) => [draft.mode, draft.total]), [
    ["partial_prepayment", 50000],
    ["full_payment", 320000],
  ]);
  assert.deepEqual(drafts[1].settlements, [
    { type: "cashless", amount: 270000 },
    { type: "prepayment", amount: 50000 },
  ]);
  assert.equal(requestExamples[0].items[0].payment_mode, "partial_prepayment");
  assert.equal(requestExamples[1].items[0].amount.value, "3200.00");
  assert.deepEqual(requestExamples[1].settlements.map((part) => [part.type, part.amount.value]), [
    ["cashless", "2700.00"],
    ["prepayment", "500.00"],
  ]);
});

test("fully prepaid rental has a closing receipt without a second charge", () => {
  const { drafts } = fiscalDrafts({ ...booking, deposit: booking.rate }, { kind: "deposit", amount: booking.rate });
  assert.equal(drafts[0].mode, "full_prepayment");
  assert.equal(drafts[1].mode, "full_payment");
  assert.deepEqual(drafts[1].settlements, [{ type: "prepayment", amount: booking.rate }]);
});

test("separate expenses use their own amounts and leave the rental advance alone", () => {
  const items = [{ name: "Подготовка", kind: "service", qty: 1, price: 50000 }, { name: "Картридж", kind: "product", qty: 2, price: 12550 }];
  const { drafts, review } = fiscalDrafts(booking, { kind: "expense", amount: 75100, items });
  assert.equal(drafts[0].items[1].subject, "commodity");
  assert.deepEqual(drafts[0].settlements, [{ type: "cashless", amount: 75100 }]);
  assert.match(review.join(" "), /маркировки/);
});

test("a cash payment stays cash and a mixed balance deposit is flagged", () => {
  const cash = fiscalDrafts({ ...booking, policy: { paymentMethod: "cash" } }, { kind: "final", amount: 270000 });
  assert.equal(cash.drafts[0].settlements[0].type, "cash");
  assert.match(cash.review.join(" "), /ККТ/);
  assert.equal(fiscalDrafts({ ...booking, balance_used: 10000 }, { kind: "deposit", amount: 40000 }).drafts.length, 0);
});

test("a draft refuses inconsistent invoice totals", () => {
  assert.throws(() => fiscalDrafts(booking, { kind: "final", amount: 280000 }), /Сумма позиций/);
});
