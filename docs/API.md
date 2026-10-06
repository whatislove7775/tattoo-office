# REST API

Базовый путь `/api`. JSON, HttpOnly cookie `office_session`, SameSite=Lax, Secure в production. Изменяющие запросы проверяют Origin. Суммы в копейках. Роли определяет сервер, клиент не может выбрать роль при регистрации.

| Метод  | Путь                                     | Доступ / назначение                                                             |
| ------ | ---------------------------------------- | ------------------------------------------------------------------------------- |
| GET    | /health                                  | Проверка API/БД                                                                 |
| GET    | /public                                  | Публичные настройки, места, каталог, опубликованный контент                     |
| GET    | /availability?date=YYYY-MM-DD&duration=3 | Доступные начала и ID мест, количество работающих мастеров                      |
| POST   | /auth/register                           | name,email,password,rules:true,consent:true; только резидент                    |
| POST   | /auth/login                              | email,password                                                                  |
| POST   | /auth/logout                             | Завершить текущую сессию                                                        |
| GET    | /auth/telegram                           | OIDC-переход, либо привязка к текущему аккаунту                                 |
| GET    | /me                                      | Текущий пользователь без пароля                                                 |
| PATCH  | /me                                      | name,profile:{bio,specialty,accent,status}                                      |
| POST   | /me/password                             | current,password; отзывает все сессии                                           |
| GET    | /bookings                                | Свои брони, платежи и баланс                                                    |
| POST   | /bookings                                | date,hour,duration,resourceId,extras:[{id,qty}]; manual,userId только персоналу |
| POST   | /bookings/:id/cancel                     | Своя бронь / админ / менеджер                                                   |
| POST   | /bookings/:id/upgrade                    | Мастер повышает тариф открытого итогового счёта                                 |
| GET    | /payments/:id                            | Только владелец платежа                                                         |
| GET    | /payments/:id/checkout                   | Параметры виджета с серверной суммой; live отключён                             |
| POST   | /payments/:id/test                       | Только режим test, не production                                                |
| GET    | /notifications                           | Входящие своего аккаунта                                                        |
| POST   | /feedback                                | message, от 5 до 4000 символов                                                  |
| GET    | /admin                                   | Данные по роли сотрудника; модератор не получает финансы/пользователей          |
| PATCH  | /admin/settings                          | Только админ                                                                    |
| POST   | /admin/users                             | Админ; менеджеру разрешено создание гостя                                       |
| PATCH  | /admin/users/:id                         | Только админ: email,role,active                                                 |
| POST   | /admin/resources                         | Только админ: id?,name,active,calendarId                                        |
| POST   | /admin/catalog                           | Админ/менеджер: id?,name,kind,price,stock,active                                |
| POST   | /admin/blocks                            | Админ/менеджер: resourceId?,startsAt,endsAt,reason                              |
| DELETE | /admin/blocks/:id                        | Админ/менеджер                                                                  |
| POST   | /admin/bookings/:id/invoice              | Админ/менеджер: duration                                                        |
| POST   | /admin/bookings/:id/resolve-cancel       | Админ/менеджер: credit:true/false                                               |
| PUT    | /admin/content/:id                       | Админ/модератор: title,body,published; master-N для мастера                     |
| PATCH  | /admin/feedback/:id                      | Сотрудник: status:new/done                                                      |
| POST   | /webhooks/cloudpayments/check            | HMAC от исходного тела запроса                                                  |
| POST   | /webhooks/cloudpayments/pay              | HMAC, сумма/валюта/аккаунт, идемпотентная фиксация                              |
| POST   | /webhooks/cloudpayments/fail             | HMAC, уведомление об ошибке                                                     |

Ошибки: `{error: "понятное сообщение"}`, статусы 400/401/403/404/409/429/500. Бронь: `{bookingId,paymentId}`; `paymentId:null` означает, что внешняя предоплата не требуется.

## Существующий бот

Бизнес-правила не следует переносить в отдельную БД или второй обработчик бронирований. Бот должен вызывать эти же сервисы. Код существующего бота не предоставлен, поэтому реальной синхронизации с ним пока нет. Не выдавайте боту административный пароль. Перед подключением нужен отдельный сервисный способ авторизации, проверка Telegram webhook secret и привязка подтверждённого Telegram ID к пользователю. OAuth-привязка уже реализована.
