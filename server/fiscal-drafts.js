import { fail, integer } from "./domain.js";

const maxMoney = 2147483647;
const cents = (value) => integer(value, 0, maxMoney, "Сумма для чека");
const totalOf = (items) => cents(items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0));

function bookingItems(booking) {
  const rent = { name: `Предоставление рабочего места, до ${booking.tariff} ч`, kind: "service", qty: 1, price: booking.rate };
  return itemsFor([rent, ...(booking.extras || [])]);
}

function itemsFor(lines) {
  return lines.filter((line) => cents(line.price) > 0).map((line) => {
    if (!["service", "product"].includes(line.kind) || !line.name?.trim()) fail("Проверьте позицию в чеке");
    return {
      description: line.name.trim(),
      subject: line.kind === "service" ? "service" : "commodity",
      quantity: integer(line.qty, 1, 100000, "Количество в чеке"),
      unitPrice: line.price,
    };
  });
}

function receipt(items, mode, settlements, channel) {
  const total = totalOf(items);
  if (!total || total !== cents(settlements.reduce((sum, s) => sum + s.amount, 0)))
    fail("Сумма позиций не совпадает с суммой расчёта. Проверьте запись перед оформлением чека.", 409);
  return { items, mode, settlements, total, channel };
}

export function fiscalDrafts(booking, payment, prepaidPayment) {
  const drafts = [], review = [];
  const amount = cents(payment.amount);
  const cash = booking.policy?.paymentMethod === "cash" || payment.provider_id?.startsWith("cash:");
  const channel = cash ? "cash" : "cashless";
  const settlements = [{ type: channel, amount }];
  const applied = cents(booking.deposit);

  if (payment.kind === "expense") {
    drafts.push(receipt(itemsFor(payment.items || []), "full_payment", settlements, channel));
  } else if (payment.kind === "deposit") {
    if (cents(booking.balance_used) || amount !== applied)
      return { drafts, review: ["В платеже участвует внутренний баланс или исходная сумма предоплаты изменилась. Сверьте операции до оформления чека."] };
    const items = bookingItems(booking);
    const total = totalOf(items);
    if (!total || amount > total || (booking.policy?.fullPrepay && amount !== total))
      return { drafts, review: ["Исходный состав или стоимость заказа изменились. Сверьте первоначальные позиции предоплаты."] };
    const full = amount === total;
    if (!full && amount >= booking.rate)
      return { drafts, review: ["Предоплата затрагивает несколько позиций. Уточните распределение суммы по товарам и услугам."] };
    const advanceItems = full ? items : [{ ...items[0], unitPrice: amount }];
    drafts.push(receipt(advanceItems, full ? "full_prepayment" : "partial_prepayment", settlements, channel));
    if (full && booking.status === "completed") {
      drafts.push(receipt(items, "full_payment", [{ type: "prepayment", amount }], channel));
    }
  } else if (payment.kind === "final") {
    if (applied) settlements.push({ type: "prepayment", amount: applied });
    drafts.push(receipt(bookingItems(booking), "full_payment", settlements, channel));
    if (applied && (booking.balance_used || prepaidPayment?.amount !== applied))
      review.push("Сумма зачёта в счёте требует сверки с фактически полученной предоплатой и внутренним балансом.");
    else if (applied)
      review.push("Перед отправкой проверьте, что на предоплату уже зарегистрирован чек.");
  } else {
    fail("Вид платежа не поддерживается для предпросмотра", 409);
  }

  if (drafts.some((draft) => draft.items.some((item) => item.subject === "commodity")))
    review.push("Для товаров подтвердите ставку НДС и необходимость маркировки отдельно по каждой позиции.");
  if (cash)
    review.push("Наличные оформляются на ККТ при расчёте в студии. Отметка оплаты на сайте не оформляет чек.");
  if (["expired", "cancelled", "cancel_requested", "no_show"].includes(booking.status))
    review.push("Неявка, отмена и перенос денег на баланс требуют отдельной проверки. Этот предпросмотр показывает только чек прихода.");
  return { drafts, review };
}

// Formats a reviewed, cashless draft for the external-KKT "payment, then receipt" flow.
export function yookassaReceiptRequest(draft, { paymentId, email, taxSystemCode, vatCodes }) {
  if (draft.channel !== "cashless" || draft.settlements.some((part) => !["cashless", "prepayment"].includes(part.type)))
    fail("Наличный расчёт нужно оформить через ККТ студии");
  if (typeof paymentId !== "string" || !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(paymentId))
    fail("Проверьте идентификатор платежа ЮKassa");
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fail("Проверьте email для чека");
  if (!Array.isArray(vatCodes) || vatCodes.length !== draft.items.length || draft.items.length > 100)
    fail("Подтвердите ставку НДС каждой позиции");
  const rubles = (n) => ({ value: (cents(n) / 100).toFixed(2), currency: "RUB" });
  return {
    type: "payment",
    payment_id: paymentId,
    send: true,
    internet: true,
    customer: { email },
    ...(taxSystemCode == null ? {} : { tax_system_code: integer(taxSystemCode, 1, 6, "Код СНО ЮKassa") }),
    items: draft.items.map((item, i) => ({
      description: item.description,
      amount: rubles(item.unitPrice),
      quantity: item.quantity,
      vat_code: integer(vatCodes[i], 1, 12, "Код НДС"),
      payment_mode: draft.mode,
      payment_subject: item.subject,
    })),
    settlements: draft.settlements.map((part) => ({ type: part.type, amount: rubles(part.amount) })),
  };
}

export function fiscalExample() {
  const booking = { tariff: 6, rate: 320000, deposit: 50000, balance_used: 0, extras: [], status: "completed" };
  const advance = { kind: "deposit", amount: 50000 };
  const drafts = [
    ...fiscalDrafts(booking, advance).drafts,
    ...fiscalDrafts(booking, { kind: "final", amount: 270000 }, advance).drafts,
  ];
  const requestExamples = drafts.map((draft, i) => yookassaReceiptRequest(draft, {
    paymentId: "00000000-0000-4000-8000-00000000000" + (i + 1),
    email: "customer@example.com",
    vatCodes: [1],
  }));
  return { drafts, review: [], requestExamples };
}
