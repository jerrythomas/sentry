import colors from 'windicss/colors'

const config = {
	extract: {
		include: [
			'./**/*.{html,js,svelte,ts,css}',
			'./node_modules/@jerrythomas/sentry/src/**/*.{html,js,svelte,ts,css}'
			// './node_modules/svelte-themable-ui/src/**/*.{html,js,svelte,ts,css}'
		]
	},
	theme: {
		fontFamily: {
			mono: ['Victor-Mono', 'monospace'],
			serif: ['Montserrat', 'ui-serif', 'sans-serif'],
			body: ['Montserrat', 'ui-serif', 'sans-serif']
		},

		extend: {
			colors: {
				primary: {
					DEFAULT: '#FB8C00',
					50: '#FFF2E2',
					100: '#FFE7C8',
					200: '#FFD095',
					300: '#FFBA62',
					400: '#FFA32F',
					500: '#FB8C00',
					600: '#C87000',
					700: '#955300',
					800: '#623700',
					900: '#2F1A00'
				},
				secondary: colors.pink
			}
		}
	},
	plugins: []
}

module.exports = config
