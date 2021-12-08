# Svelte with Supabase

A basic template that can be used as a starter for your supabase + svelte apps.

- Public routes
  - home
  - about
  - login
- Authenticated routes
  - todos

Todo's are stored into supabase as todos table

```sql
create table public.todos
(
  id        uuid not null primary key default extensions.uuid_generate_v4()
, text      varchar
, user_id   uuid references auth.users(id)
);
```

Row level security enabled on user id

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm i --save-dev @jerrythomas/sentry@beta
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

Before creating a production version of your app, install an [adapter](https://kit.svelte.dev/docs#adapters) for your target environment. Then:

```bash
npm run build
```

> You can preview the built app with `npm run preview`, regardless of whether you installed an adapter. This should _not_ be used to serve your app in production.
