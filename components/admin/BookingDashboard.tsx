'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAtom } from 'jotai';
import { bookingsAtom, updateTriggerAtom } from '@/components/atoms/store';
import { DataTable } from '@/app/admin/rooms/data-table';
import { Bookings, columnsBookings } from '@/app/admin/reservasi/column';
import { useUpdatePaymentStatus } from '../atoms/bookingStore';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';
import { DataTableUser } from '@/app/user/reservasi/data-table';

async function fetchBookings(): Promise<Bookings[]> {
   const supabase = createClient();
   const { data, error } = await supabase
      .from('bookings')
      .select(
         `
         *,
         room:rooms(id, name, image_url)
      `
      )
      .or('payment_status.neq.Disetujui,booking_status.neq.Check-Out');

   if (error) {
      console.error('Error fetching bookings:', error);
      return [];
   }

   return data || [];
}

export default function BookingsDashboard() {
   const [bookings, setBookings] = useAtom(bookingsAtom);
   const [loading, setLoading] = React.useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [filteredBookings, setFilteredBookings] = useState<Bookings[]>([]);
   const updateBookingStatus = useUpdatePaymentStatus();
   const [updateTrigger, setUpdateTrigger] = useAtom(updateTriggerAtom);

   useEffect(() => {
      async function initializeBookings() {
         setLoading(true);
         const fetchedBookings = await fetchBookings();
         setBookings(fetchedBookings);
         localStorage.setItem('bookings', JSON.stringify(fetchedBookings));
         setLoading(false);
      }

      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
         setBookings(JSON.parse(storedBookings));
         setLoading(false);
      } else {
         initializeBookings();
      }
   }, [updateTrigger]);

   useEffect(() => {
      const storedBookings = localStorage.getItem('bookings');
      if (storedBookings) {
         const bookingsData: Bookings[] = JSON.parse(storedBookings);
         const filtered = bookingsData.filter((booking) => booking.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()));
         setFilteredBookings(filtered);
      }
   }, [searchTerm]);

   useCheckUserRoleAndRedirect();

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
   };

   return (
      <div className="w-full flex flex-col h-screen">
         <div className="w-full">
            <div className="flex w-full">
               {loading ? (
                  <div className="flex flex-1 justify-center items-center mt-10">
                     <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
               ) : bookings.length > 0 ? (
                  <>
                     <div className="w-[14%]">
                        <SideBar />
                     </div>
                     <div className=" md:w-full md:ml-[14%] py-10 px-10">
                        <div className="mb-5">
                           <Input type="text" placeholder="Cari Invoice Reservasi" value={searchTerm} onChange={handleSearchChange} className="w-full md:w-1/4" />
                        </div>
                        <div className="overflow-x-auto custom-scroll-container w-[120rem]">
                           <DataTableUser columns={columnsBookings} data={filteredBookings.length > 0 ? filteredBookings : bookings} />
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="w-[14%] flex justify-start items-start">
                        <SideBar />
                     </div>
                     <div className="w-full py-10 px-10">
                        <div className="flex justify-center items-center h-screen">No data available.</div>
                     </div>
                  </>
               )}
            </div>
         </div>
         <WaveSVG />
      </div>
   );
}

//    useEffect(() => {
//       async function initializeBookings() {
//          if (bookings.length === 0) {
//             setLoading(true);
//             const fetchedBookings = await fetchBookings();
//             setBookings(fetchedBookings);
//             setLoading(false);
//          }
//       }
//       console.log(updateTrigger);

//       initializeBookings();
//    }, [setBookings, bookings.length, updateTrigger]);
