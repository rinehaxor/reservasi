import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req) {
   const { email, password, newPassword } = await req.json();

   // Re-authenticate the user
   const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
   });

   if (signInError) {
      return new Response(JSON.stringify({ message: 'Current password is incorrect' }), {
         status: 401,
         headers: { 'Content-Type': 'application/json' },
      });
   }

   // Update the user's password
   const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
   });

   if (passwordError) {
      return new Response(JSON.stringify({ message: 'Failed to update password' }), {
         status: 400,
         headers: { 'Content-Type': 'application/json' },
      });
   }

   return new Response(JSON.stringify({ message: 'Password updated successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
   });
}
