import { useEffect, useState } from 'react';

import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const useAuth = () => {
   const supabase = createClient();
   const router = useRouter();
   const [user, setUser] = useState<User | null>(null);
   const [loadingUser, setLoadingUser] = useState(true);

   useEffect(() => {
      const checkUser = async () => {
         const { data, error } = await supabase.auth.getUser();
         if (error || !data.user) {
            router.push('/login'); // Redirect to login page if not authenticated
         } else {
            setUser(data.user);
         }
         setLoadingUser(false);
      };
      checkUser();
   }, [router, supabase]);

   return { user, loadingUser };
};

export default useAuth;
