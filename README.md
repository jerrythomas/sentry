# Sentry

Drop in authentication including route protection and redirects for SvelteKit apps.

![sentry](src/sentry.svg)

## Why?

Adding authentication to front end is one of the most time consuming tasks. Building apps in Svelte is great but there is no standard way to implement authentication. There are multiple libraries that allow us to add authentication for multiple providers. However, switching from one to another is not easy. The UI components for all the providers also need to meet the provider guidelines for the final app to be approved.

This is an attempt to make adding authentication to SvelteKit apps as simple as possible. This framework has been designed for Svelte.

## Features

- [x] Configuration driven
- [x] Secrets using environment variables
- [ ] Emulator tests where available
- [x] Route protection
  - [x] Public pages
  - [x] Protected routes
  - [ ] Role based protection for route
  - [ ] Caching blocked routes to be redirected on login
- [ ] Different auth libraries
  - [x] Firebase
  - [ ] Auth0
  - [ ] Supabase
  - [ ] Amplify
- [ ] Multiple providers
  - [x] Google
  - [ ] Password
  - [ ] Github
  - [x] Microsoft
  - [ ] Twitter
  - [ ] Facebook

## Getting started

Get started quickly using [degit](https://github.com/Rich-Harris/degit). Select the library you want to use and run degit to get a sample app.

- [x] [Firebase](examples/firebase)

```bash
degit jerrythomas/sentry/examples/firebase my-app
```

- [ ] [Auth0](examples/auth0)
- [ ] [Amplify](examples/amplify)
- [ ] [Supabase](examples/supabase)

Take a look at the following files in the sample to understand how it works.

- config.js
- hooks.js
- \_\_layout.svelte
- login.svelte
- logout.svelte

### Tailwind

This library uses tailwind and the components will not render properly if the tailwind does not include the requires css classes. Ensure that the sentry library is included in the purge array of `tailwind.config.cjs`

```js
purge: [
    './src/**/*.{html,js,svelte,ts}',
    'node_modules/@jerrythomas/sentry/src/**/*.{html,js,svelte,ts,css}}',
  ],
```

## Route Configuration

Routes are configurable as shown in the example `config.js` file. Sentry assumes that all routes are private by default. Public routes need to be listed so that they can be accessed without logging in.

There are three attributes in the routes configuration.

- home: Landing page after logging in.
- start: Start page to be used as welcome/login page
- public: A list of routes to be treated as public. All child routes are assumed to be public too.

## Components

This library consists of the following components.

- UI component with buttons for different OAuth providers
- Utility functions for various stages of auth lifecycle
- Store for managing the user session
- Cookie to allow server to identify authentication

## License

MIT © [Jerry Thomas](https://jerrythomas.name)
