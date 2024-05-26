import { useAtom } from 'jotai';
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import { userAtom } from '@/components/atoms/user';
import { useRouter } from 'next/navigation';

const useCheckUserRoleAndRedirect = () => {
   const [user, setUser] = useAtom(userAtom);
   const router = useRouter();

   useEffect(() => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
         const parsedUser = JSON.parse(userCookie);
         setUser(parsedUser);

         if (parsedUser.role !== 2) {
            router.push('/');
         }
      } else {
         window.location.replace('/');
      }
   }, [setUser, router]);

   return user;
};

export default useCheckUserRoleAndRedirect;
