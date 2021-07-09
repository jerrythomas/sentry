# README

A working sample that can be used as a starter for your apps.

## Getting started

Get started quickly using [degit](https://github.com/Rich-Harris/degit).

```bash
degit jerrythomas/sentry/examples/firebase my-app
cd my-app
pnpm i --save-dev @jerrythomas/sentry@beta
```

## Configure

Set the following environment variables based on the configuration obtained from [Firebase Console](https://console.firebase.google.com).

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
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
