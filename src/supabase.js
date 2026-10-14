import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://adimkhhwakaoaxamuvlv.supabase.co"   // juste l’URL du projet
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."   // ta clé anon

export const supabase = createClient(supabaseUrl, supabaseKey)
