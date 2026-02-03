import 'expo-sqlite/localStorage/install';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nrqkknpovbmnlwnbfgdi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ycWtrbnBvdmJtbmx3bmJmZ2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTg4NzcsImV4cCI6MjA4NTI3NDg3N30.ATKkki8K7167hVAP261W9ha0uU3b959yXe8LS9jbh0w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: localStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
