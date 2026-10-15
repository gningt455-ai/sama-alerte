import { createClient } from '@supabase/supabase-js'

// ⚠️ On utilise les variables d'environnement
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
