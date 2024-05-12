import { userAtom } from '@/components/atoms/user';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

const useAdminAccess = () => {
   const [user] = useAtom(userAtom);
   const router = useRouter();

   useEffect(() => {
      // Check if the user role information is already available and act accordingly
      if (user.role && user.role !== 2) {
         console.log('Redirecting non-admin user from admin area');
         router.push('/');
      }
   }, [user, router]);

   return;
};

export default useAdminAccess;
