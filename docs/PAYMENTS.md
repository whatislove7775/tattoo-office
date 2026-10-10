# YooKassa test integration

Configure `YOOKASSA_SHOP_ID` and `YOOKASSA_SECRET_KEY` only in the backend's protected `.env`. Keep `APP_ORIGIN` equal to the public frontend origin. The current integration accepts only test keys; live checkout remains disabled.

Checkout is an authenticated POST to `/api/payments/:id/checkout`. Amounts come from the database. Retries reuse the provider payment and a stable idempotence key. Users return to their payment page; the backend fetches the provider payment and verifies amount, currency, metadata and test mode before settlement. Duplicate confirmations never apply money twice.

Optional HTTP notifications: configure `payment.succeeded` in the YooKassa dashboard (Integration → HTTP notifications), URL `https://tattoo-office-ten.vercel.app/api/webhooks/yookassa`. Basic-auth shops must configure notifications in the dashboard, not via the webhook API. Notification bodies are never trusted as proof of payment. A server reconciliation task also checks pending provider payments every 30 seconds, including when the browser is closed. Late deposit payments go to the user's internal balance once and never revive an expired reservation.

Resident exceptions: Admin → People → Edit → No deposit / cash settlement. Only administrators can set this; it applies only to residents and new bookings. No card payment or balance debit occurs at booking. The selected payment method is captured in the booking policy. An administrator issues the final invoice, receives cash and explicitly confirms it with “Cash received”; the full amount is recorded in the payment register and the booking is completed. Test receipts are not fiscal receipts. Live fiscalization requires a separate verified setup before enabling real money.
