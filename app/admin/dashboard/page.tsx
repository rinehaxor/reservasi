import AuthButton from '@/components/AuthButton';
import DeployButton from '@/components/DeployButton';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import NavbarAdmin from '@/components/admin/navbarAdmin';
import Link from 'next/link';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';
import TestSidebar from '@/components/admin/TestSidebar';
async function getUserRole(userId: any) {
   const supabase = createClient();
   const { data, error } = await supabase.from('user_roles').select(`role_id`).eq('user_id', userId).single();

   if (error) {
      console.error('Error fetching user role:', error);
      return null;
   }

   return data.role_id; // asumsikan role_id 1 adalah 'user', 2 adalah 'admin'
}

export default async function ProtectedPage() {
   const supabase = createClient();

   const {
      data: { user },
   } = await supabase.auth.getUser();

   if (!user) {
      return redirect('/login');
   }

   const roleId = await getUserRole(user.id);

   if (roleId !== 2) {
      // asumsikan 2 adalah 'admin'
      return redirect('/'); // Redirect user biasa ke homepage atau halaman lain
   }

   // Lanjutkan render halaman admin jika roleId adalah 2
   return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
         <div className="w-full">
            {/* <NavbarAdmin /> */}
            <div className="py-6 font-bold bg-orange-600 text-center  text-md md:text-xl">Selamat Datang Resepsionis</div>
            {/* <Button className="bg-black">
               {' '}
               <Link href="/admin/rooms/create-rooms">Buat Kamar </Link>
            </Button> */}
            <div className="mt-20">
               <SideBar />
               {/* <TestSidebar /> */}
            </div>

            <WaveSVG />
         </div>
      </div>
   );
}
