import { randomUUID } from "node:crypto";
import { fail, integer } from "./domain.js";

const one = async (q, sql, params) => (await q.query(sql, params)).rows[0];
const uuidPattern = /^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i;

// The booking, inventory and any pending invoice are changed under the same
// lock as checkout and settlement, so an in-flight payment keeps its amount.
export async function addBookingExpenses(q, bookingId, actor, { requestId, items } = {}) {
  if (!uuidPattern.test(bookingId)) fail("Бронь не найдена", 404);
  if (typeof requestId !== "string" || !uuidPattern.test(requestId)) fail("Повторите форму начисления");
  if (!Array.isArray(items) || items.length === 0 || items.length > 10) fail("Выберите от 1 до 10 позиций");
  const quantities = new Map();
  for (const item of items) {
    if (typeof item?.id !== "string" || !uuidPattern.test(item.id)) fail("Выберите позицию из каталога");
    const id = item.id.toLowerCase();
    quantities.set(id, integer((quantities.get(id) || 0) + integer(item.qty, 1, 100, "Количество"), 1, 100, "Количество"));
  }
  const requested = [...quantities].sort(([a], [b]) => a.localeCompare(b));
  const previous = await one(q, "SELECT actor,action,details FROM audit WHERE id=$1", [requestId]);
  if (previous) {
    if (previous.actor !== actor || previous.action !== "booking.expenses.add" || previous.details.bookingId !== bookingId ||
        JSON.stringify(previous.details.requested) !== JSON.stringify(requested)) fail("Запрос уже был обработан с другими данными", 409);
    return previous.details.result;
  }
  const b = await one(q, "SELECT * FROM bookings WHERE id=$1 FOR UPDATE", [bookingId]);
  if (!b) fail("Бронь не найдена", 404);
  if (!["confirmed", "invoiced", "completed"].includes(b.status) || new Date(b.starts_at) > new Date())
    fail("Расходы можно добавить к начавшейся или завершённой записи", 409);

  const lines = [];
  for (const [id, qty] of requested) {
    const x = await one(q, "SELECT * FROM catalog WHERE id=$1 AND active=true FOR UPDATE", [id]);
    if (!x) fail("Позиция больше недоступна", 409);
    if (x.price <= 0) fail(`Укажите цену в каталоге: ${x.name}`, 409);
    if (x.kind === "product") {
      if (x.stock < qty) fail(`Недостаточно на складе: ${x.name}`, 409);
      await q.query("UPDATE catalog SET stock=stock-$1 WHERE id=$2", [qty, id]);
      await q.query("INSERT INTO stock_moves(id,catalog_id,delta,reason,actor) VALUES($1,$2,$3,$4,$5)",
        [randomUUID(), id, -qty, "Расходы по записи " + b.id.slice(0, 8), actor]);
    }
    lines.push({ id, qty, name: x.name, kind: x.kind, price: x.price, addedOnSite: true });
  }
  const amount = lines.reduce((sum, x) => sum + x.qty * x.price, 0);
  const final = b.status === "invoiced" ? await one(q,
    "SELECT id,amount,checkout_id FROM payments WHERE booking_id=$1 AND kind='final' AND status='pending' FOR UPDATE", [b.id]) : null;
  if (b.status === "invoiced" && !final) fail("Итоговый счёт недоступен. Обновите запись", 409);

  let result;
  if (b.status === "confirmed" || (final && !final.checkout_id)) {
    integer(b.total + amount, 1, 2147483647, "Стоимость записи");
    await q.query("UPDATE bookings SET total=total+$1,extras=extras || $2::jsonb WHERE id=$3", [amount, JSON.stringify(lines), b.id]);
    if (final) await q.query("UPDATE payments SET amount=amount+$1 WHERE id=$2", [amount, final.id]);
    result = { paymentId: final?.id || null, separate: false, amount };
  } else {
    const open = await one(q, `SELECT id,amount FROM payments WHERE booking_id=$1 AND kind='expense'
      AND status='pending' AND checkout_id IS NULL ORDER BY created_at DESC LIMIT 1 FOR UPDATE`, [b.id]);
    const paymentId = open?.id || randomUUID();
    if (open) {
      integer(open.amount + amount, 1, 2147483647, "Сумма счёта");
      await q.query("UPDATE payments SET amount=amount+$1,items=items || $2::jsonb WHERE id=$3", [amount, JSON.stringify(lines), paymentId]);
    } else {
      integer(amount, 1, 2147483647, "Сумма счёта");
      await q.query("INSERT INTO payments(id,booking_id,kind,amount,items) VALUES($1,$2,'expense',$3,$4)", [paymentId, b.id, amount, JSON.stringify(lines)]);
    }
    result = { paymentId, separate: true, amount };
  }
  const label = result.separate ? "Выставлен счёт за расходы" : "К записи добавлены расходы";
  const totalRubles = (amount / 100).toLocaleString("ru-RU", { maximumFractionDigits: 2 });
  const message = [label, ...lines.map(x => `${x.name} × ${x.qty}`), "Добавлено " + totalRubles + " ₽", "Запись " + b.id.slice(0, 8)].join("\n");
  await q.query("INSERT INTO notifications(id,user_id,message) VALUES($1,$2,$3)", [randomUUID(), b.user_id, message]);
  await q.query("INSERT INTO audit(id,actor,action,details) VALUES($1,$2,'booking.expenses.add',$3)", [requestId, actor,
    JSON.stringify({ bookingId, requested, lines, result })]);
  return result;
}
