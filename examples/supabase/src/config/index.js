import { sentry } from '@jerrythomas/sentry'
import { supabase } from './auth'
import { routes } from './routes'

export { providers } from './providers'

sentry.init({ adapter: supabase, routes, providers })

export { supabase, sentry }
