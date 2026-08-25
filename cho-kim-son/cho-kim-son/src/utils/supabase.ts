import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ekkjaatkrvfdxxesonhh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVra2phYXRrcnZmZHh4ZXNvbmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc2NjAwNTUsImV4cCI6MjEwMzIzNjA1NX0.9J7gowFJsKBM5vT_ix4ncDEIGvk7bzEfLv1DqNGgYbA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);