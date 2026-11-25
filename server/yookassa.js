import { fail } from "./domain.js";
export const yookassaEnabled = () => Boolean(process.env.YOOKASSA_SHOP_ID && process.env.YOOKASSA_SECRET_KEY);
export const yookassaTest = () => process.env.YOOKASSA_SECRET_KEY?.startsWith("test_") === true;
export async function yookassaRequest(path, body, key) {
  if (!yookassaEnabled()) fail("ЮKassa пока не подключена", 409);
  let response;
  try {
    response = await fetch("https://api.yookassa.ru/v3/" + path, {
      method: body ? "POST" : "GET",
      headers: {
        Authorization: "Basic " + Buffer.from(process.env.YOOKASSA_SHOP_ID + ":" + process.env.YOOKASSA_SECRET_KEY).toString("base64"),
        "Content-Type": "application/json",
        ...(key ? { "Idempotence-Key": key } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
    });
  } catch { fail("ЮKassa не ответила. Повторите попытку", 502); }
  if (!response.ok) fail("Не удалось открыть ЮKassa. Повторите попытку", 502);
  return response.json();
}
export function verifyYookassaPayment(remote, local) {
  if (remote.id !== local.checkout_id || remote.metadata?.payment_id !== local.id ||
      remote.amount?.currency !== "RUB" || remote.amount.value !== (local.amount / 100).toFixed(2) ||
      remote.test !== yookassaTest()) fail("Данные платежа не совпадают", 409);
  return remote.status === "succeeded" && remote.paid === true;
}

export function verifyYookassaRefund(remote, local) {
  if (!remote.id || (local.refund_id && remote.id !== local.refund_id) ||
      remote.payment_id !== local.checkout_id || remote.amount?.currency !== "RUB" ||
      remote.amount.value !== (local.amount / 100).toFixed(2))
    fail("Данные возврата не совпадают", 502);
}

export async function yookassaFiscalStatus(payment) {
  if (!payment.checkout_id || !payment.provider_id?.startsWith("yookassa:")) return null;
  const registration = (remote) => ["pending","succeeded","canceled"].includes(remote.receipt_registration)
    ? remote.receipt_registration : "unreported";
  const jobs = [async () => {
    const remote = await yookassaRequest("payments/" + encodeURIComponent(payment.checkout_id));
    if (!verifyYookassaPayment(remote, payment)) fail("ЮKassa не подтвердила оплату", 409);
    return registration(remote);
  }];
  if (payment.refund_id) jobs.push(async () => {
    const remote = await yookassaRequest("refunds/" + encodeURIComponent(payment.refund_id));
    verifyYookassaRefund(remote, payment);
    return registration(remote);
  });
  const [charge,refund] = (await Promise.allSettled(jobs.map(read => read())))
    .map(result => result.status === "fulfilled" ? result.value : "unavailable");
  return { charge, refund:refund ?? null, test:payment.is_test ?? yookassaTest() };
}
