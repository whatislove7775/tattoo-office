CREATE TABLE IF NOT EXISTS settings(id integer PRIMARY KEY DEFAULT 1, data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS users(id uuid PRIMARY KEY, email text UNIQUE NOT NULL, password text NOT NULL, name text NOT NULL, role text NOT NULL CHECK(role IN ('resident','guest','admin')), active boolean NOT NULL DEFAULT true, balance integer NOT NULL DEFAULT 0 CHECK(balance>=0), sequence integer NOT NULL DEFAULT 0, profile jsonb NOT NULL DEFAULT '{}', telegram_id text UNIQUE, created_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS sessions(token text PRIMARY KEY, user_id uuid REFERENCES users(id), expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS consents(id uuid PRIMARY KEY,user_id uuid REFERENCES users(id), kind text NOT NULL, version text NOT NULL, created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS resources(id uuid PRIMARY KEY, name text NOT NULL, active boolean DEFAULT true, calendar_id text);
CREATE TABLE IF NOT EXISTS catalog(id uuid PRIMARY KEY, name text NOT NULL, kind text NOT NULL CHECK(kind IN ('service','product')), price integer NOT NULL CHECK(price>=0), stock integer NOT NULL DEFAULT 0 CHECK(stock>=0), active boolean DEFAULT true);
CREATE TABLE IF NOT EXISTS bookings(id uuid PRIMARY KEY, user_id uuid REFERENCES users(id),resource_id uuid REFERENCES resources(id), starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, tariff integer NOT NULL, rate integer NOT NULL, extras jsonb NOT NULL DEFAULT '[]', total integer NOT NULL, deposit integer NOT NULL DEFAULT 0, balance_used integer NOT NULL DEFAULT 0, status text NOT NULL, session_no integer, expires_at timestamptz, created_at timestamptz DEFAULT now(), CHECK(ends_at>starts_at));
CREATE INDEX IF NOT EXISTS booking_slots ON bookings(resource_id, starts_at, ends_at);
CREATE TABLE IF NOT EXISTS blocks(id uuid PRIMARY KEY,resource_id uuid REFERENCES resources(id),starts_at timestamptz NOT NULL, ends_at timestamptz NOT NULL, reason text NOT NULL, CHECK(ends_at>starts_at));
CREATE TABLE IF NOT EXISTS ledger(id uuid PRIMARY KEY,user_id uuid REFERENCES users(id),booking_id uuid REFERENCES bookings(id),amount integer NOT NULL,description text NOT NULL,created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS payments(id uuid PRIMARY KEY,booking_id uuid REFERENCES bookings(id),kind text NOT NULL,amount integer NOT NULL CHECK(amount>0),status text NOT NULL DEFAULT 'pending',provider_id text UNIQUE,created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS outbox(id uuid PRIMARY KEY,kind text NOT NULL,payload jsonb NOT NULL,status text NOT NULL DEFAULT 'pending',attempts integer NOT NULL DEFAULT 0,next_at timestamptz DEFAULT now(),last_error text,created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS audit(id uuid PRIMARY KEY,actor uuid REFERENCES users(id),action text NOT NULL,details jsonb NOT NULL DEFAULT '{}',created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS feedback(id uuid PRIMARY KEY,user_id uuid REFERENCES users(id),message text NOT NULL,status text NOT NULL DEFAULT 'new',created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS content(id text PRIMARY KEY,data jsonb NOT NULL);
CREATE TABLE IF NOT EXISTS reminders(booking_id uuid PRIMARY KEY REFERENCES bookings(id));
CREATE TABLE IF NOT EXISTS oauth_flows(state text PRIMARY KEY,verifier text NOT NULL,user_id uuid REFERENCES users(id),expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS telegram_tickets(token text PRIMARY KEY,telegram_id text NOT NULL,chat_id text,expires_at timestamptz NOT NULL);
ALTER TABLE users ADD COLUMN IF NOT EXISTS telegram_chat_id text;
CREATE TABLE IF NOT EXISTS receipts(id uuid PRIMARY KEY,payment_id uuid UNIQUE REFERENCES payments(id),payload jsonb NOT NULL,status text NOT NULL DEFAULT 'prepared',provider_id text,created_at timestamptz DEFAULT now());
CREATE TABLE IF NOT EXISTS notifications(id uuid PRIMARY KEY,user_id uuid REFERENCES users(id),message text NOT NULL,created_at timestamptz DEFAULT now(),read_at timestamptz);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS policy jsonb NOT NULL DEFAULT '{}';

-- The owner requested one full-access site operator instead of staff tiers.
UPDATE users SET role='admin' WHERE role IN ('manager','moderator');
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check CHECK(role IN ('resident','guest','admin'));
