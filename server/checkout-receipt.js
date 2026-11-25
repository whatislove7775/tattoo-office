import { fail, validEmail } from "./domain.js";

const rubles = (value) => ({ value:(value / 100).toFixed(2), currency:"RUB" });

export function supportsOnlineReceipt(item, mode) {
  if (item.kind !== "product" || mode !== "live") return true;
  return (process.env.YOOKASSA_UNMARKED_PRODUCT_IDS || "").split(",").map(id => id.trim()).includes(item.id);
}

export function checkoutReceipt(payment, { email, tariff, rate, extras, settings }) {
  // АУСН регистрируется при подключении чеков. Используем СНО магазина.
  if (settings.vat !== 0) fail("Проверьте ставки НДС в настройках кассы", 409);
  let lines;
  if (payment.kind === "hold" || payment.kind === "deposit") {
    lines = [{ name:"Предоставление рабочего места Tattoo Office", kind:"service", price:payment.amount, qty:1 }];
  } else if (payment.kind === "expense") {
    lines = payment.items;
  } else {
    lines = [{ name:`Предоставление рабочего места, ${tariff} ч`, kind:"service", price:rate, qty:1 }, ...extras];
  }
  const items = lines.filter(x => x.price > 0);
  if (items.length > 100 || items.reduce((sum, x) => sum+x.price*x.qty,0) !== payment.amount)
    fail("Сумма позиций не совпадает со счётом. Обратитесь к администратору", 409);
  if (items.some(x => !supportsOnlineReceipt(x,settings.mode)))
    fail("Проверьте фискализацию товаров с администратором", 409);
  return {
    customer:{ email:validEmail(email) },
    internet:true,
    timezone:2,
    items:items.map(x => ({
      description:x.name.trim().slice(0, 128),
      amount:rubles(x.price),
      quantity:x.qty,
      vat_code:1,
      payment_subject:x.kind === "product" ? "commodity" : "service",
      payment_mode:payment.kind === "hold" ? "full_payment" : payment.kind === "deposit" ? "full_prepayment" : "full_payment",
      measure:x.kind === "product" ? "piece" : "another",
    })),
  };
}
