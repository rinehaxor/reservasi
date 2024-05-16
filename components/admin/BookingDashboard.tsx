'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SideBar from '@/components/admin/SideBar';

import { WaveSVG } from '@/components/ui/waves';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { bookingsAtom, updateTriggerAtom } from '@/components/atoms/store';
import { DataTable } from '@/app/admin/rooms/data-table';
import Link from 'next/link';
import { columnsFasilitas } from '@/app/admin/fasilitas/columns';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';
import { Bookings, columnsBookings } from '@/app/admin/reservasi/column';
import { useUpdatePaymentStatus } from '../atoms/bookingStore';

async function fetchBookings(): Promise<Bookings[]> {
   const supabase = createClient();
   let { data, error } = await supabase.from('bookings').select(
      `
   *,
   room:rooms(id, name,image_url)

 `
   );
   //   .not('payment_status', 'eq', 'Disetujui')
   //   .neq('booking_status', 'Check-Out');
   if (error) {
      console.error('Error fetching bookings:', error);
      return [];
   }

   return data || [];
}

export default function BookingsDashboard() {
   const [bookings, setBookings] = useAtom(bookingsAtom);
   const [loading, setLoading] = React.useState(true);
   const updateBookingStatus = useUpdatePaymentStatus();
   const [updateTrigger, setUpdateTrigger] = useAtom(updateTriggerAtom);

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

   useEffect(() => {
      async function initializeBookings() {
         setLoading(true);
         const fetchedBookings = await fetchBookings();
         setBookings(fetchedBookings);
         setLoading(false);
      }

      initializeBookings();
   }, [updateTrigger]);

   useCheckUserRoleAndRedirect();

   return (
      <div className=" w-full flex flex-col h-screen ">
         <div className="w-full">
            {/* <NavbarAdmin /> */}
            <div className="flex w-full">
               {loading ? (
                  <>
                     <div className="flex flex-1 justify-center items-center mt-10">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                     </div>
                  </>
               ) : bookings.length > 0 ? (
                  <>
                     <div className="w-[14%] ">
                        <SideBar />
                     </div>
                     <div className="w-[400px] md:w-full py-10 px-10">
                        <div className="flex justify-end items-end mb-10 ">
                           {/* <Link href="/admin/fasilitas/tambah-fasilitas">
                              <Button className="bg-orange-500">Tambah Fasilitas</Button>
                           </Link> */}
                        </div>
                        <div className=" overflow-x-auto custom-scroll-container">
                           <DataTable columns={columnsBookings} data={bookings} />
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="w-[14%] flex justify-start items-start ">
                        <SideBar />
                     </div>
                     <div className="w-full py-10 px-10">
                        <div className="flex justify-end items-end mb-10 ">
                           {/* <Link href="/admin/fasilitas/tambah-fasilitas" passHref>
                              <Button className="bg-orange-500">Tambah Fasilitas</Button>
                           </Link> */}
                        </div>
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
