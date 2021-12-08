import { sentry } from '@jerrythomas/sentry/supabase'
import { supabase } from './auth'

export { providers } from './providers'
// export { routes } from './routes'

sentry.init({ supabase })

export { supabase, sentry }
