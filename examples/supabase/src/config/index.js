import { sentry } from '@jerrythomas/sentry/supabase'
import { supabase } from './auth'
import { routes } from './routes'

export { providers } from './providers'

sentry.init({ supabase, routes })

export { supabase, sentry }
