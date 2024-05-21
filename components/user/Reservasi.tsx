'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SidebarUser from './SidebarUser';
import { DataTableUser } from '@/app/user/reservasi/data-table';
import { columnsBookingsUser } from '@/app/user/reservasi/column';
import useAuth from '@/hooks/useAuth';
import { Input } from '@/components/ui/input';
import Spinner from '../ui/spinner';

export type Booking = {
   id: string;
   room_id: number;
   bank_name: string;
   image_url: string;
   account_number: number;
   booking_status: string;
   payment_status: string;
   total_price: number;
   invoice_number: string;
   name: string;
   checkindate: string;
   checkoutdate: string;
   payment_proof_url: string;
};

export default function UserBookingHistory() {
   const [bookings, setBookings] = useState<Booking[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');

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
            const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*, room:rooms(id, name, image_url)').eq('user_id', user.id);

            if (bookingsError) {
               console.error('Error fetching booking history:', bookingsError.message);
            } else {
               setBookings(bookingsData as Booking[]);
            }
         }
         setLoading(false);
      }

      fetchBookingHistory();
   }, [supabase]);

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
   };
   useAuth();

   const filteredBookings = bookings.filter((booking) => booking.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()));

   return (
      <div className="flex flex-col md:flex-row md:mx-48">
         <div className="hidden md:block md:w-1/4 p-4">
            <SidebarUser />
         </div>
         <div className="w-full md:w-3/4 p-4">
            <div className="bg-white p-6 border rounded shadow-md">
               {loading ? (
                  <div className="flex justify-center items-center h-64">
                     <Spinner />
                  </div>
               ) : bookings.length > 0 ? (
                  <>
                     <div className="text-xl font-semibold mb-6 border-b pb-4">Reservasi</div>
                     <div className="mb-5">
                        <Input type="text" placeholder="Cari Invoice" value={searchTerm} onChange={handleSearchChange} className="w-full md:w-1/2" />
                     </div>
                     <div className="overflow-x-auto custom-scroll-container ">
                        <div className="w-[80rem]">
                           <DataTableUser columns={columnsBookingsUser} data={filteredBookings.length > 0 ? filteredBookings : bookings} />
                        </div>
                     </div>
                  </>
               ) : (
                  <div className="flex justify-center items-center h-64">No data available.</div>
               )}
            </div>
         </div>
      </div>
   );
}
