import { useAtom } from 'jotai';
import { useEffect } from 'react';

import { createClient } from '@/utils/supabase/client';
import { userAtom } from '@/components/atoms/user';
import { useRouter } from 'next/navigation';

const useCheckUserRoleAndRedirect = () => {
   const [user, setUser] = useAtom(userAtom);
   const router = useRouter();
   const supabase = createClient();

   useEffect(() => {
      const fetchUserDetails = async () => {
         try {
            const {
               data: { user: fetchedUser },
               error,
            } = await supabase.auth.getUser();
            if (error) {
               console.error('Error fetching user:', error.message);
               window.location.replace('/');
            }

            if (!fetchedUser) {
               console.log('User does not exist');
               window.location.replace('/');
               return;
            }

            const response = await supabase.from('user_roles').select('role_id').eq('user_id', fetchedUser.id).single();
            if (response.error) throw new Error('Error fetching user role');
            console.log(response.data.role_id);

            if (response.data.role_id !== 2) {
               router.push('/');
            }

            // setUser({ ...fetchedUser, role: response.data.role_id }); // Assuming role_id is directly usable
         } catch (e: any) {
            console.error(e.message);
         }
      };

      fetchUserDetails();
   }, [setUser, router, supabase]);

   return user;
};

export default useCheckUserRoleAndRedirect;
