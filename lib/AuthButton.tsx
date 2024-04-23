// authActions.ts
'use server';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

export async function signOut() {
   const supabase = createClient();
   await supabase.auth.signOut();
   return redirect('/login');
}
