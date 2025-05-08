import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const debugAdminCheck = async (email: string) => {
  const { data, error } = await supabase
    .from('clientes_vip')
    .select('*')
    .eq('email', email)
    .single();

  return { data, error };
};
