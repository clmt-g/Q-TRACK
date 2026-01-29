import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nrqkknpovbmnlwnbfgdi.supabase.co';
const supabasePublishableKey = 'sb_publishable_pp8awnzpEUuqJgSA-1de5w_J3SI9qf1';

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
    auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
