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
import { LuBedDouble, LuCircleDollarSign } from 'react-icons/lu';
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
            <div className="py-6 font-bold bg-orange-500 text-center  text-md md:text-xl">Selamat Datang Resepsionis</div>
            {/* <Button className="bg-black">
               {' '}
               <Link href="/admin/rooms/create-rooms">Buat Kamar </Link>
            </Button> */}
            <div className="mt-20">
               <SideBar />
               <div className="p-4 sm:ml-64">
                  <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                     <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="grid items-center justify-center h-72 rounded bg-gray-50 dark:bg-gray-800">
                           <p className="text-2xl text-gray-400 dark:text-gray-500">
                              <LuCircleDollarSign className="w-[90px] h-[90px] md:w-[200px] md:h-[200px] items-center" />
                           </p>
                           <p className=" text-gray-400 dark:text-gray-500 text-center text-xs md:text-lg"> Pemasukan</p>
                           <p className="text-xs text-gray-400 dark:text-gray-500 text-center md:text-lg"> 10.000</p>
                        </div>
                        <div className="grid items-center justify-center h-72 rounded bg-gray-50 dark:bg-gray-800">
                           <p className="text-2xl text-gray-400 dark:text-gray-500">
                              <LuBedDouble className="w-[90px] h-[90px] md:w-[200px] md:h-[200px] items-center" />
                           </p>
                           <p className="text-xs text-gray-400 dark:text-gray-500 text-center md:text-lg"> Jumlah Reservasi</p>
                           <p className="text-xs text-gray-400 dark:text-gray-500 text-center md:text-lg"> 10</p>
                        </div>
                        <div className="flex items-center justify-center h-72 rounded bg-gray-50 dark:bg-gray-800">
                           <p className="text-2xl text-gray-400 dark:text-gray-500">
                              <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 1v16M1 9h16" />
                              </svg>
                           </p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <WaveSVG />
         </div>
      </div>
   );
}
