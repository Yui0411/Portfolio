# Supabase Setup

One-time setup for the portfolio's data layer. Do these in order.

## 1. Create the project
1. Go to https://supabase.com → **New project**.
2. Pick an org, name it (e.g. `portfolio`), set a strong **database password** (save it).
3. Choose the region closest to your EC2 instance / users.
4. Wait for provisioning (~2 min).

## 2. Create the tables + RLS
1. **SQL Editor** → **New query**.
2. Paste the contents of [`schema.sql`](./schema.sql) → **Run**.
3. Verify under **Table Editor**: you should see `experience`, `projects`, `certificates`, `analytics`.

## 3. Create the storage bucket
1. **Storage** → **New bucket** → name `images` → toggle **Public bucket** ON → create.
   - Files are organised into folders inside it: `projects/` for project screenshots,
     `certificates/` for certificate images.
2. **SQL Editor** → **New query** → paste [`storage.sql`](./storage.sql) → **Run** (adds the read/write policies).

## 4. Enable email/password auth + create your admin user
1. **Authentication** → **Providers** → ensure **Email** is enabled.
   - For a single-admin site, turn **OFF** "Enable email signups" later if you like (you create your user manually below).
2. **Authentication** → **Users** → **Add user** → **Create new user**.
   - Enter your email + a password. Tick **Auto Confirm User** so you can log in immediately.
   - This is the account you'll use at `/login` to reach `/admin`.

## 5. Grab your API keys
1. **Settings** → **API**.
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret** key → `SUPABASE_SERVICE_ROLE_KEY`
3. In the repo: copy `.env.local.example` → `.env.local` and paste the values.

## Done
Once `.env.local` is filled in and your admin user exists, the app scaffold can connect immediately.
