'use client';
import React, { useEffect, useState } from 'react';
import SidebarUser from './SidebarUser';
import { Bookings, columnsBookings } from '@/app/admin/reservasi/column';
import { createClient } from '@/utils/supabase/client';
import { DataTable } from '@/app/admin/rooms/data-table';
import { DataTableUser } from '@/app/user/reservasi/data-table';
import { columnsBookingsUser } from '@/app/user/reservasi/column';
import useAuth from '@/hooks/useAuth';
import Spinner from '../ui/spinner';

export default function Reservasi() {
   const [bookings, setBookings] = useState<Bookings[]>([]);

   const supabase = createClient();

   useEffect(() => {
      async function fetchBookingHistory() {
         const {
            data: { user },
            error: userError,
         } = await supabase.auth.getUser();

         if (userError) {
            console.error('Error fetching user:', userError.message);
            return;
         }

         if (user) {
            const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*,  room:rooms(id, name,image_url)').eq('user_id', user.id);

            if (bookingsError) {
               console.error('Error fetching booking history:', bookingsError.message);
            } else {
               setBookings(bookingsData);
            }
         }
      }

      fetchBookingHistory();
   }, []);

   const { user, loadingUser } = useAuth();
   if (loadingUser) {
      return <Spinner />; // Menampilkan spinner saat sedang memeriksa status autentikasi
   }
   return (
      <div>
         <div className="flex flex-col md:flex-row items-start p-4 md:p-8 md:mx-28">
            <div className="hidden md:block md:w-1/4">
               <SidebarUser />
            </div>
            <div className="w-full md:w-3/4 p-4">
               <div className="bg-white p-6 border rounded shadow-md">
                  <div className="text-xl font-semibold mb-6 border-b pb-4">Reservasi</div>
                  <div className="overflow-x-auto custom-scroll-container">
                     <DataTableUser columns={columnsBookingsUser} data={bookings} />
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
