# REST API

Базовый путь `/api`. JSON, HttpOnly cookie `office_session`, SameSite=Lax, Secure в production. Изменяющие запросы проверяют Origin. Суммы в копейках. Роли определяет сервер, клиент не может выбрать роль при регистрации.

| Метод  | Путь                                     | Доступ / назначение                                                             |
| ------ | ---------------------------------------- | ------------------------------------------------------------------------------- |
| GET    | /health                                  | Проверка API/БД                                                                 |
| GET    | /public                                  | Публичные настройки, места, каталог, опубликованный контент                     |
| GET    | /availability?date=YYYY-MM-DD&duration=3&city=spb | Доступные начала и ID мест студии в городе (`spb` или `msk`, по умолчанию `spb`), количество работающих мастеров |
| POST   | /auth/register                           | name,email,password,rules:true,consent:true; только резидент                    |
| POST   | /auth/login                              | email,password                                                                  |
| POST   | /auth/logout                             | Завершить текущую сессию                                                        |
| GET    | /auth/telegram                           | OIDC-переход, либо привязка к текущему аккаунту                                 |
| GET    | /me                                      | Текущий пользователь без пароля                                                 |
| PATCH  | /me                                      | name,profile:{bio,specialty,accent,status}                                      |
| POST   | /me/password                             | current,password; отзывает все сессии                                           |
| GET    | /bookings                                | Свои брони, платежи и баланс                                                    |
| POST   | /bookings                                | date,hour,duration,resourceId,extras:[{id,qty}]; manual,userId только персоналу |
| POST   | /bookings/:id/cancel                     | Своя бронь / админ                                                   |
| POST   | /bookings/:id/upgrade                    | Мастер повышает тариф открытого итогового счёта                                 |
| GET    | /payments/:id                            | Только владелец платежа                                                         |
| GET    | /payments/:id/checkout                   | Параметры виджета с серверной суммой; live отключён                             |
| POST   | /payments/:id/test                       | Только режим test, не production                                                |
| GET    | /notifications                           | Входящие своего аккаунта                                                        |
| POST   | /feedback                                | message, от 5 до 4000 символов                                                  |
| GET    | /admin                                   | Полные данные управления; только админ          |
| PATCH  | /admin/settings                          | Только админ                                                                    |
| POST   | /admin/users                             | Админ: создание резидента, гостя или администратора                                       |
| PATCH  | /admin/users/:id                         | Только админ: email,role,active                                                 |
| POST   | /admin/resources                         | Только админ: id?,name,active,calendarId,city (`spb`/`msk`)                     |
| POST   | /admin/catalog                           | Админ: id?,name,kind,price,stock,active                                |
| POST   | /admin/blocks                            | Админ: resourceId?,startsAt,endsAt,reason                              |
| DELETE | /admin/blocks/:id                        | Админ                                                                  |
| POST   | /admin/bookings/:id/invoice              | Админ: duration                                                        |
| POST   | /admin/bookings/:id/resolve-cancel       | Админ: credit:true/false                                               |
| PUT    | /admin/content/:id                       | Админ: title,body,published; master-N для мастера                     |
| PATCH  | /admin/feedback/:id                      | Сотрудник: status:new/done                                                      |
| POST   | /webhooks/cloudpayments/check            | HMAC от исходного тела запроса                                                  |
| POST   | /webhooks/cloudpayments/pay              | HMAC, сумма/валюта/аккаунт, идемпотентная фиксация                              |
| POST   | /webhooks/cloudpayments/fail             | HMAC, уведомление об ошибке                                                     |

Ошибки: `{error: "понятное сообщение"}`, статусы 400/401/403/404/409/429/500. Бронь: `{bookingId,paymentId}`; `paymentId:null` означает, что внешняя предоплата не требуется.

## Существующий бот

Бизнес-правила не следует переносить в отдельную БД или второй обработчик бронирований. Бот должен вызывать эти же сервисы. Код существующего бота не предоставлен, поэтому реальной синхронизации с ним пока нет. Не выдавайте боту административный пароль. Перед подключением нужен отдельный сервисный способ авторизации, проверка Telegram webhook secret и привязка подтверждённого Telegram ID к пользователю. OAuth-привязка уже реализована.

## Города

Студии работают в нескольких городах (`spb` — Санкт-Петербург, `msk` — Москва). У каждого рабочего места есть поле `city`, в `/public` оно возвращается вместе с местом. Настройки содержат `cities.<id>` с полями `open` (запись открыта), `address` и, для городов кроме Санкт-Петербурга, `rates`; тарифы Санкт-Петербурга по-прежнему лежат в `rates`. Бронь считается по тарифам города выбранного места и сохраняет город в `policy.city`. Запись в закрытый город отклоняется (кроме ручной записи администратором). Администратор меняет города через `PATCH /admin/settings` с телом `{cities:{msk:{open,address,rates}}}`.

## Рейтинг мастеров

`GET /ranking` публично возвращает `{rules, masters}`. В `masters` входят только активные зарегистрированные аккаунты мастеров (`account_type=master`), не скрывшие себя через `profile.rankingVisible=false`. Поля записи: `id,name,city,avatar,resident,bookings,completed,score,rank`; email и закрытые данные не выдаются. Ответ не кэшируется.

Балл = `(0,25 × подтверждённые брони + завершённые сеансы) × 1,05 для резидентов`. Подтверждёнными считаются статусы `confirmed`, `invoiced`, `completed`; отменённые, истёкшие и ожидающие оплаты заявки не учитываются. При равенстве баллов учитываются завершённые сеансы, затем имя и ID. Новые мастера присутствуют с нулём баллов. Объединяются брони всех студий.

В `PATCH /me` поле `profile.rankingVisible` принимает только boolean. По умолчанию участие включено; при обновлении профиля без этого поля ранее выбранная видимость сохраняется. Скрытие убирает запись из публичного ответа, но не затрагивает бронирования.

Аватар профиля: `PATCH /me` принимает `profile.avatar` в формате data URL JPEG/PNG/WebP до 90 000 символов (или пустую строку для удаления). SVG и внешние URL не принимаются. `profile.city` — только `Москва` или `СПБ`. Отсутствующие поля сохраняют предыдущие значения. В рейтинге балл используется для сортировки; интерфейс показывает завершённые сеансы, город и статус участника.
