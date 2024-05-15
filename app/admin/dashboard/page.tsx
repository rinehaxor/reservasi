'use client';
import React, { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';
import { LuBedDouble, LuCircleDollarSign } from 'react-icons/lu';
import { HiOutlineUserCircle } from 'react-icons/hi';
import { createClient } from '@/utils/supabase/client';

async function getUserRole(userId: any) {
   const supabase = createClient();
   const { data, error } = await supabase.from('user_roles').select('role_id').eq('user_id', userId).single();

   if (error) {
      console.error('Error fetching user role:', error);
      return null;
   }

   return data.role_id; // role_id 1 adalah 'user', 2 adalah 'admin'
}

export default function DashboardAdmin() {
   const [totalIncome, setTotalIncome] = useState<number>(0);
   const [totalBookings, setTotalBookings] = useState<number>(0);
   const [totalUsers, setTotalUsers] = useState<number>(0);
   const [loading, setLoading] = useState(true);
   const router = useRouter();
   const supabase = createClient();

   useEffect(() => {
      async function fetchUserAndData() {
         const {
            data: { user },
            error: authError,
         } = await supabase.auth.getUser();

         if (authError || !user) {
            return router.push('/login');
         }

         const roleId = await getUserRole(user.id);

         if (roleId !== 2) {
            return router.push('/'); // Redirect user biasa ke homepage atau halaman lain
         }

         const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('total_price').eq('payment_status', 'Disetujui').eq('booking_status', 'Check-Out');

         if (bookingsError) {
            console.error('Error fetching bookings:', bookingsError);
            return;
         }

         const totalIncome = bookingsData.reduce((acc, booking) => acc + booking.total_price, 0);
         setTotalIncome(totalIncome);
         setTotalBookings(bookingsData.length);

         const { count: usersCount, error: usersError } = await supabase.from('user_roles').select('*', { count: 'exact', head: true });

         if (usersError) {
            console.error('Error fetching total users:', usersError);
            return;
         }

         setTotalUsers(usersCount || 0);
         setLoading(false);
      }

      fetchUserAndData();
   }, [supabase, router]);

   if (loading) {
      return (
         <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
         </div>
      );
   }

   return (
      <div className="flex-1 w-full flex flex-col items-center gap-8">
         <div className="w-full">
            <div className="py-6 font-bold bg-orange-500 text-center text-md md:text-xl text-white">Selamat Datang Resepsionis</div>
            <div className="mt-6 flex flex-col sm:flex-row">
               <SideBar />
               <div className="p-4 w-full sm:ml-64">
                  <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                     <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="flex flex-col items-center justify-center h-72 rounded bg-gray-50 dark:bg-gray-800">
                           <p className="text-2xl text-black font-bold dark:text-gray-500">
                              <LuCircleDollarSign className="w-20 h-20 md:w-40 md:h-40 items-center" />
                           </p>
                           <p className="text-black font-bold dark:text-gray-500 text-center text-xs md:text-lg">Pemasukan</p>
                           <p className="text-xs text-black font-bold dark:text-gray-500 text-center md:text-lg">{totalIncome.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center h-72 rounded bg-gray-50 dark:bg-gray-800">
                           <p className="text-2xl text-black font-bold dark:text-gray-500">
                              <LuBedDouble className="w-20 h-20 md:w-40 md:h-40 items-center" />
                           </p>
                           <p className="text-xs text-black font-bold dark:text-gray-500 text-center md:text-lg">Jumlah Reservasi</p>
                           <p className="text-xs text-black font-bold dark:text-gray-500 text-center md:text-lg">{totalBookings}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center h-72 rounded bg-gray-50 dark:bg-gray-800">
                           <p className="text-2xl text-black font-bold dark:text-gray-500">
                              <HiOutlineUserCircle className="w-20 h-20 md:w-40 md:h-40 items-center" />
                           </p>
                           <p className="text-xs text-black font-bold dark:text-gray-500 text-center md:text-lg">Jumlah Pengguna</p>
                           <p className="text-xs text-black font-bold dark:text-gray-500 text-center md:text-lg">{totalUsers.toLocaleString()}</p>
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
