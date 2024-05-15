'use client';
import React, { useEffect } from 'react';

import { createClient } from '@/utils/supabase/client';
import SideBar from '@/components/admin/SideBar';

import { WaveSVG } from '@/components/ui/waves';
import { Button } from '@/components/ui/button';
import { useAtom } from 'jotai';
import { roomsAtom } from '@/components/atoms/store';
import { DataTable } from '@/app/admin/rooms/data-table';
import { Room, columns } from '@/app/admin/rooms/columns';
import Link from 'next/link';
import { columnsFasilitas } from '@/app/admin/fasilitas/columns';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';
import { ToastContainer } from 'react-toastify';

async function fetchRooms(): Promise<Room[]> {
   const supabase = createClient();
   let { data, error } = await supabase.from('facilities').select('*');

   if (error) {
      console.error('Error fetching facilities:', error);
      return [];
   }

   return data || [];
}

export default function FasilitasDashboard() {
   const [facilities, setFacilities] = useAtom(roomsAtom);
   const [loading, setLoading] = React.useState(true);

   useCheckUserRoleAndRedirect();

   useEffect(() => {
      async function initializeRooms() {
         if (facilities.length === 0) {
            // Fetch only if the atom is empty, assuming this is initial load.
            setLoading(true);
            const fetchedRooms = await fetchRooms();
            setFacilities(fetchedRooms);
            setLoading(false);
         }
      }
      initializeRooms();
   }, [setFacilities]); // Dependency on rooms.length is to prevent refetching when already loaded

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
               ) : facilities.length > 0 ? (
                  <>
                     <div className="w-[14%] ">
                        <SideBar />
                     </div>
                     <div className="w-[400px] md:w-full py-10 px-10">
                        <div className="flex justify-end items-end mb-10 ">
                           <Link href="/admin/fasilitas/tambah-fasilitas">
                              <Button className="bg-orange-500">Tambah Fasilitas</Button>
                           </Link>
                        </div>
                        <div className=" overflow-x-auto custom-scroll-container">
                           <DataTable columns={columnsFasilitas} data={facilities} />
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
                           <Link href="/admin/fasilitas/tambah-fasilitas" passHref>
                              <Button className="bg-orange-500">Tambah Fasilitas</Button>
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
