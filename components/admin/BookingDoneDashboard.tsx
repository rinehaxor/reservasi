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

import { PDFDownloadLink } from '@react-pdf/renderer';
import ExportPDF from './ExportReservasiPDF';

import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '../ui/rangePicker';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';
import ExportExcel from './ExportReservasiExcel';
import { FaRegFilePdf } from 'react-icons/fa';

async function fetchBookings(dateRange?: DateRange, roomType?: string): Promise<Bookings[]> {
   const supabase = createClient();
   let query = supabase
      .from('bookings')
      .select(
         `
      *,
      room:rooms!inner(id, name, image_url)
      `
      )
      .eq('payment_status', 'Disetujui')
      .eq('booking_status', 'Check-Out')
      .order('created_at', { ascending: false });

   if (roomType) {
      query = query.eq('rooms.name', roomType); // Filter untuk nama ruangan
   }

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

async function fetchRoomTypes() {
   const supabase = createClient();
   const { data, error } = await supabase.from('rooms').select('name');
   if (error) {
      console.error('Error fetching room types:', error);
      return [];
   }
   return data.map((room) => room.name) || [];
}

export default function BookingDoneDashboard() {
   const [bookings, setBookings] = useAtom(bookingsAtom);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [filteredBookings, setFilteredBookings] = useState<Bookings[]>([]);
   const updateBookingStatus = useUpdatePaymentStatus();
   const [updateTrigger, setUpdateTrigger] = useAtom(updateTriggerAtom);
   const [dateRange, setDateRange] = useState<DateRange | undefined>();
   const [roomType, setRoomType] = useState<string | undefined>();
   const [roomTypes, setRoomTypes] = useState<string[]>([]);

   useEffect(() => {
      async function initializeData() {
         setLoading(true);
         const fetchedRoomTypes = await fetchRoomTypes();
         setRoomTypes(fetchedRoomTypes);
         const fetchedBookings = await fetchBookings(undefined, roomType);
         setBookings(fetchedBookings);
         localStorage.setItem('bookings_done', JSON.stringify(fetchedBookings));
         setLoading(false);
      }

      initializeData();
   }, [roomType]);

   // Effect to reload bookings when dateRange changes and both dates are selected
   useEffect(() => {
      async function reloadBookings() {
         if (dateRange?.from && dateRange?.to) {
            setLoading(true);
            const fetchedBookings = await fetchBookings(dateRange, roomType);
            setBookings(fetchedBookings);
            localStorage.setItem('bookings_done', JSON.stringify(fetchedBookings));
            setLoading(false);
         }
      }

      reloadBookings();
   }, [dateRange, updateTrigger, roomType]);

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

   const handleRoomTypeChange = (value: string) => {
      setRoomType(value);
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
                              <Input type="text" placeholder="Cari Invoice Reservasi" value={searchTerm} onChange={handleSearchChange} className="w-1/3" />
                              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                              <div className="w-1/3">
                                 <Select onValueChange={handleRoomTypeChange}>
                                    <SelectTrigger className="">
                                       <SelectValue placeholder="Tipe Kamar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectGroup>
                                          <SelectLabel>Tipe Kamar</SelectLabel>
                                          {roomTypes.map((type) => (
                                             <SelectItem key={type} value={type}>
                                                {type}
                                             </SelectItem>
                                          ))}
                                       </SelectGroup>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                           <div className="flex flex-row gap-5">
                              <PDFDownloadLink document={<ExportPDF bookings={filteredBookings.length > 0 ? filteredBookings : bookings} />} fileName="Laporan_Reservasi_Selesai.pdf">
                                 {({ blob, url, loading, error }) =>
                                    loading ? (
                                       'Loading document...'
                                    ) : (
                                       <Button className="bg-red-500 text-white">
                                          <FaRegFilePdf className="w-5 h-5" />
                                          <span className="ml-2">Export PDF</span>
                                       </Button>
                                    )
                                 }
                              </PDFDownloadLink>
                              <ExportExcel bookings={filteredBookings.length > 0 ? filteredBookings : bookings} /> {/* Tambahkan tombol ekspor ke Excel */}
                           </div>
                        </div>
                        <div className="overflow-x-auto custom-scroll-container w-[90rem]">
                           <DataTable columns={columnsBookings} data={filteredBookings.length > 0 ? filteredBookings : bookings} />
                        </div>
                     </div>
                  </>
               ) : (
                  <>
                     <div className="w-[14%] ">
                        <SideBar />
                     </div>
                     <div className=" md:w-full md:ml-[14%] py-10 px-10">
                        <div className="flex justify-between mb-5">
                           <div className="flex flex-row gap-5">
                              <Input type="text" placeholder="Cari Invoice Reservasi" value={searchTerm} onChange={handleSearchChange} className="w-1/3" />
                              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                              <div className="w-1/3">
                                 <Select onValueChange={handleRoomTypeChange}>
                                    <SelectTrigger className="">
                                       <SelectValue placeholder="Tipe Kamar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                       <SelectGroup>
                                          <SelectLabel>Tipe Kamar</SelectLabel>
                                          {roomTypes.map((type) => (
                                             <SelectItem key={type} value={type}>
                                                {type}
                                             </SelectItem>
                                          ))}
                                       </SelectGroup>
                                    </SelectContent>
                                 </Select>
                              </div>
                           </div>
                        </div>
                        <div className="w-full py-10">
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
