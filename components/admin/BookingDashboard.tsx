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
import { PDFDownloadLink } from '@react-pdf/renderer';
import ExportPDF from './ExportReservasiPDF';

import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/rangePicker';

async function fetchBookings(dateRange?: DateRange): Promise<Bookings[]> {
   const supabase = createClient();
   let query = supabase.from('bookings').select(` *, room:rooms(id, name, image_url) `).or('payment_status.neq.Disetujui,booking_status.neq.Check-Out').order('created_at', { ascending: false });

   if (dateRange?.from && dateRange?.to) {
      query = query.gte('created_at', dateRange.from.toISOString()).lte('created_at', dateRange.to.toISOString());
   }

   const { data, error } = await query;

   if (error) {
      console.error('Error fetching bookings:', error);
      return [];
   }

   return data || [];
}

export default function BookingDoneDashboard() {
   const [bookings, setBookings] = useAtom(bookingsAtom);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [filteredBookings, setFilteredBookings] = useState<Bookings[]>([]);
   const updateBookingStatus = useUpdatePaymentStatus();
   const [updateTrigger, setUpdateTrigger] = useAtom(updateTriggerAtom);
   const [dateRange, setDateRange] = useState<DateRange | undefined>();

   useEffect(() => {
      async function initializeBookings() {
         setLoading(true);
         const fetchedBookings = await fetchBookings();
         setBookings(fetchedBookings);
         localStorage.setItem('bookings_done', JSON.stringify(fetchedBookings));
         setLoading(false);
      }

      initializeBookings();
   }, []);

   // Effect to reload bookings when dateRange changes and both dates are selected
   useEffect(() => {
      async function reloadBookings() {
         if (dateRange?.from && dateRange?.to) {
            setLoading(true);
            const fetchedBookings = await fetchBookings(dateRange);
            setBookings(fetchedBookings);
            localStorage.setItem('bookings_done', JSON.stringify(fetchedBookings));
            setLoading(false);
         }
      }

      reloadBookings();
   }, [dateRange, updateTrigger]);

   useEffect(() => {
      if (bookings.length > 0) {
         localStorage.setItem('bookings_done', JSON.stringify(bookings));
         const filtered = bookings.filter((booking) => booking.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()));
         setFilteredBookings(filtered);
      }
   }, [bookings, searchTerm]);

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
                        <div className="flex justify-between mb-5">
                           <div className="flex flex-row gap-5">
                              <Input type="text" placeholder="Cari Invoice Reservasi" value={searchTerm} onChange={handleSearchChange} className="w-full md:w-full" />
                              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                           </div>
                        </div>
                        <div className="overflow-x-auto custom-scroll-container w-[90rem]">
                           <DataTable columns={columnsBookings} data={filteredBookings.length > 0 ? filteredBookings : bookings} />
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="w-[14%] flex justify-start items-start">
                        <SideBar />
                     </div>
                     <div className=" md:w-full md:ml-[14%] py-10 px-10">
                        <div className="flex justify-between mb-5">
                           <div className="flex flex-row gap-5">
                              <Input type="text" placeholder="Cari Invoice Reservasi" value={searchTerm} onChange={handleSearchChange} className="w-full md:w-full" />
                              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                           </div>
                        </div>
                        <div className="w-full py-10 px-10">
                           <div className="flex justify-center items-center h-screen">No data available.</div>
                        </div>
                     </div>
                  </>
               )}
            </div>
         </div>
         <WaveSVG />
      </div>
   );
}
