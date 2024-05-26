import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const useAuth = () => {
   const router = useRouter();
   const [user, setUser] = useState(null);
   const [loadingUser, setLoadingUser] = useState(true);

   useEffect(() => {
      const userCookie = Cookies.get('user');
      if (userCookie) {
         const parsedUser = JSON.parse(userCookie);
         setUser(parsedUser);
      } else {
         router.push('/login');
      }
      setLoadingUser(false);
   }, [router]);

   return { user, loadingUser };
};

export default useAuth;
