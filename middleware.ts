import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';
import Cookies from 'js-cookie';
import { createClient } from '@/utils/supabase/client';

export async function middleware(request: NextRequest) {
   const response = await updateSession(request);
   const supabase = createClient();

   // Get user after login or update session
   const {
      data: { user },
      error,
   } = await supabase.auth.getUser();
   if (error || !user) {
      return response; // Handle error or no user case appropriately
   }

   // Get user role
   const { data: roleData, error: roleError } = await supabase.from('user_roles').select('role_id').eq('user_id', user.id).single();
   if (roleError || !roleData) {
      return response; // Handle error or no role case appropriately
   }

   // Set cookie
   Cookies.set('user', JSON.stringify({ id: user.id, role: roleData.role_id, email: user.email }), { expires: 7 });

   return response;
}

export const config = {
   matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
