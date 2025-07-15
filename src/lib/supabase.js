import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://henhcvnthxqurkompekg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlbmhjdm50aHhxdXJrb21wZWtnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTI3NzEsImV4cCI6MjA2ODA4ODc3MX0.0YTDFV15ZIBY_DD3GcUY0PXusY7ADJzgs3x3-FnhJPg'

if(SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>'){
  throw new Error('Missing Supabase variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
})

export default supabase;