'use client';
import React, { useEffect } from 'react';
import ReadRoom from '@/components/admin/readRoom';
import NavbarAdmin from '@/components/admin/navbarAdmin';
import { createClient } from '@/utils/supabase/client';
import SideBar from '@/components/admin/SideBar';

import { WaveSVG } from '@/components/ui/waves';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { paymentAtom, roomsAtom } from '@/components/atoms/store';
import { DataTable } from '@/app/admin/rooms/data-table';
import { Room, columns } from '@/app/admin/rooms/columns';
import Link from 'next/link';
import { columnsFasilitas } from '@/app/admin/fasilitas/columns';
import { Payment, columnsPayment } from '@/app/admin/payment/column';
import { ToastContainer } from 'react-toastify';
import { DataTableUser } from '@/app/user/reservasi/data-table';

async function fetchPayment(): Promise<Payment[]> {
   const supabase = createClient();
   let { data, error } = await supabase.from('payments').select('*');

   if (error) {
      console.error('Error fetching payment:', error);
      return [];
   }

   return data || [];
}

export default function PaymentDashboard() {
   const [payment, setPayment] = useAtom(paymentAtom);
   const [loading, setLoading] = React.useState(true);

   useEffect(() => {
      async function initializeRooms() {
         if (payment.length === 0) {
            // Fetch only if the atom is empty, assuming this is initial load.
            setLoading(true);
            const fetchedRooms = await fetchPayment();
            setPayment(fetchedRooms);
            setLoading(false);
         }
      }
      initializeRooms();
   }, [setPayment, payment.length]); // Dependency on rooms.length is to prevent refetching when already loaded

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
               ) : payment.length > 0 ? (
                  <>
                     <div className="w-[14%] ">
                        <SideBar />
                     </div>
                     <div className="w-[400px] md:w-full py-10 px-10">
                        <div className="flex justify-end items-end mb-10 ">
                           <Link href="/admin/payment/tambah-payment">
                              <Button className="bg-orange-500">Tambah Pembayaran</Button>
                           </Link>
                        </div>
                        <div className=" overflow-x-auto custom-scroll-container">
                           <DataTableUser columns={columnsPayment} data={payment} />
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
                           <Link href="/admin/fasilitas/tambah-payment" passHref>
                              <Button className="bg-orange-500">Tambah Pembayaran</Button>
                           </Link>
                        </div>
                        <div className="flex justify-center items-center h-screen">No data available.</div>
                     </div>
                  </>
               )}
            </div>
            <ToastContainer />
         </div>
         <WaveSVG />
      </div>
   );
}
