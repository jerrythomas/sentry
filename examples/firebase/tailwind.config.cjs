const config = {
  mode: 'aot',
  purge: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@jerrythomas/sentry/src/**/*.{html,js,svelte,ts,css}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

module.exports = config
