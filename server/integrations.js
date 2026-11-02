import nodemailer from "nodemailer";
import { SignJWT, importPKCS8 } from "jose";
const jsonFetch = async (url, options = {}) => {
  const r = await fetch(url, {
    ...options,
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) throw Error(`Внешний сервис: HTTP ${r.status}`);
  return r.status === 204 ? null : r.json();
};
let googleToken;
async function calendarToken() {
  if (googleToken && googleToken.expires > Date.now()) return googleToken.token;
  if (!process.env.GOOGLE_SERVICE_ACCOUNT)
    throw Error("Google Calendar не настроен");
  const sa = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
    key = await importPKCS8(sa.private_key, "RS256");
  const assertion = await new SignJWT({
    scope: "https://www.googleapis.com/auth/calendar.events",
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuer(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(key);
  const data = await jsonFetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  googleToken = { token: data.access_token, expires: Date.now() + 3300000 };
  return data.access_token;
}
export async function syncCalendar(calendar, id, event) {
  if (!calendar) throw Error("У рабочего места не задан Google Calendar ID");
  const token = await calendarToken(),
    url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar)}/events`,
    eventId = id.replaceAll("-", "");
  const headers = {
    Authorization: "Bearer " + token,
    "Content-Type": "application/json",
  };
  if (!event) {
    const r = await fetch(url + "/" + eventId, {
      method: "DELETE",
      headers,
      signal: AbortSignal.timeout(15000),
    });
    if (!r.ok && ![404, 410].includes(r.status))
      throw Error("Google Calendar: " + r.status);
    return;
  }
  const r = await fetch(url + "/" + eventId, {
    method: "PUT",
    headers,
    body: JSON.stringify(event),
    signal: AbortSignal.timeout(15000),
  });
  if (r.status === 404) {
    const created = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ ...event, id: eventId }),
      signal: AbortSignal.timeout(15000),
    });
    if (!created.ok && created.status !== 409)
      throw Error("Google Calendar: " + created.status);
  } else if (!r.ok) throw Error("Google Calendar: " + r.status);
}
export async function listCalendarEvents(calendar, from, until) {
  const token = await calendarToken(), items = [];
  let pageToken;
  do {
    const params = new URLSearchParams({timeMin:from,timeMax:until,singleEvents:"true",showDeleted:"false",maxResults:"2500",fields:"items(id,status,transparency,start,end,extendedProperties/private),nextPageToken"});
    if (pageToken) params.set("pageToken", pageToken);
    const data = await jsonFetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar)}/events?${params}`, {headers:{Authorization:"Bearer " + token}});
    items.push(...(data.items || []));
    pageToken = data.nextPageToken;
  } while (pageToken);
  return items;
}
export async function sendTelegram(chatId, text) {
  if (!process.env.TELEGRAM_BOT_TOKEN) throw Error("Telegram не настроен");
  const r = await jsonFetch(
    `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        disable_web_page_preview: true,
      }),
    },
  );
  if (!r.ok) throw Error("Telegram отклонил сообщение");
}
export function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD || process.env.EMAIL_API_URL && process.env.EMAIL_API_TOKEN);
}
export async function sendEmail(to, subject, text, id) {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    const port=Number(process.env.SMTP_PORT || 465);
    const transport=nodemailer.createTransport({host:process.env.SMTP_HOST,port,secure:port===465,requireTLS:port!==465,auth:{user:process.env.SMTP_USER,pass:process.env.SMTP_PASSWORD},connectionTimeout:15000,socketTimeout:15000,disableFileAccess:true,disableUrlAccess:true});
    try { await transport.sendMail({from:{name:"Tattoo Office",address:process.env.SMTP_FROM || process.env.SMTP_USER},to,subject,text,messageId:`<${id}@tattoo-office.local>`}); }
    finally {transport.close();}
    return;
  }
  if (!process.env.EMAIL_API_URL || !process.env.EMAIL_API_TOKEN)
    throw Error("Email не настроен");
  if (!process.env.EMAIL_API_URL.startsWith("https://"))
    throw Error("Email API требует HTTPS");
  await jsonFetch(process.env.EMAIL_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.EMAIL_API_TOKEN,
      "Idempotency-Key": id,
    },
    body: JSON.stringify({ to, subject, text }),
  });
}
export function receiptPayload(booking, payment, user, settings) {
  const deposit = payment.kind === "deposit",
    vat = deposit && settings.vat ? settings.vat + 100 : settings.vat;
  const items = deposit
    ? [
        {
          Label: "Предоплата рабочего места",
          Price: payment.amount / 100,
          Quantity: 1,
          Amount: payment.amount / 100,
          Vat: vat,
          Method: 2,
          Object: 4,
        },
      ]
    : [
        {
          Label: `Рабочее место, до ${booking.tariff} часов`,
          Price: booking.rate / 100,
          Quantity: 1,
          Amount: booking.rate / 100,
          Vat: vat,
          Method: 4,
          Object: 4,
        },
        ...booking.extras.map((x) => ({
          Label: x.name,
          Price: x.price / 100,
          Quantity: x.qty,
          Amount: (x.price * x.qty) / 100,
          Vat: vat,
          Method: 4,
          Object: x.kind === "product" ? 1 : 4,
        })),
      ];
  return {
    Inn: settings.inn,
    Type: "Income",
    InvoiceId: payment.id,
    AccountId: user.id,
    CustomerReceipt: {
      Items: items,
      TaxationSystem: settings.taxationSystem,
      Email: user.email,
      Amounts: {
        Electronic: payment.amount / 100,
        AdvancePayment: deposit ? 0 : booking.deposit / 100,
      },
      CalculationPlace: process.env.APP_ORIGIN || "local test",
    },
  };
}
export async function sendReceipt(payload, id) {
  if (!process.env.CLOUDKASSIR_PUBLIC_ID || !process.env.CLOUDKASSIR_API_SECRET)
    throw Error("CloudKassir не настроен");
  const r = await jsonFetch("https://api.cloudpayments.ru/kkt/receipt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(
          process.env.CLOUDKASSIR_PUBLIC_ID +
            ":" +
            process.env.CLOUDKASSIR_API_SECRET,
        ).toString("base64"),
      "X-Request-ID": id,
    },
    body: JSON.stringify(payload),
  });
  if (!r.Success) throw Error("CloudKassir отклонил чек");
  return r.Model?.Id || null;
}
