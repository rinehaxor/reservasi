'use client';
import React, { useEffect, useState } from 'react';
import SidebarUser from './SidebarUser';
import { Bookings, columnsBookings } from '@/app/admin/reservasi/column';
import { createClient } from '@/utils/supabase/client';
import { DataTable } from '@/app/admin/rooms/data-table';
import { DataTableUser } from '@/app/user/reservasi/data-table';
import { columnsBookingsUser } from '@/app/user/reservasi/column';

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
   return (
      <div className="flex mx-[23rem] ">
         <SidebarUser />

         <div className="bg-white p-8 max-w-4xl my-10 border rounded shadow w-full">
            <div className="text-xl font-semibold mb-6 border-b pb-4">Reservasi</div>

            <div className=" overflow-x-auto custom-scroll-container">
               <DataTableUser columns={columnsBookingsUser} data={bookings} />
            </div>
         </div>
      </div>
   );
}
