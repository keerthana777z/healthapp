import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = "https://uffssvnqqlfyybcbpavw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmZnNzdm5xcWxmeXliY2JwYXZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0NTUzNjMsImV4cCI6MjA3NDAzMTM2M30.ScTUoYXofR2KRQkf_mrdp7NUlHZQZVAR0YgtVE0FlJg";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});