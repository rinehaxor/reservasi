'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAtom } from 'jotai';
import { roomsAtom } from '@/components/atoms/store';
import { DataTable } from '@/app/admin/rooms/data-table';
import Link from 'next/link';

import { ToastContainer } from 'react-toastify';
import { Room } from '@/app/admin/rooms/columns';
import { columnsFasilitas } from '@/app/admin/fasilitas/columns';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';

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
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState('');
   const [filteredFacilities, setFilteredFacilities] = useState<Room[]>([]);

   useCheckUserRoleAndRedirect();

   useEffect(() => {
      async function initializeRooms() {
         setLoading(true);
         const fetchedRooms = await fetchRooms();
         setFacilities(fetchedRooms);
         localStorage.setItem('facilities', JSON.stringify(fetchedRooms));
         setLoading(false);
      }

      initializeRooms();
   }, []);

   useEffect(() => {
      if (facilities.length > 0) {
         localStorage.setItem('facilities', JSON.stringify(facilities));
         const filtered = facilities.filter((facility) => facility.name.toLowerCase().includes(searchTerm.toLowerCase()));
         setFilteredFacilities(filtered);
      }
   }, [facilities, searchTerm]);

   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(event.target.value);
   };

   return (
      <div className="w-[100rem] md:w-full flex flex-col h-screen">
         <div className="w-full">
            <div className="flex w-full">
               {loading ? (
                  <div className="flex flex-1 justify-center items-center mt-10">
                     <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
               ) : facilities.length > 0 ? (
                  <>
                     <div className="w-[14%]">
                        <SideBar />
                     </div>
                     <div className="md:w-full py-10 px-10">
                        <div className="flex justify-end items-end mb-10">
                           <Link href="/admin/fasilitas/tambah-fasilitas">
                              <Button className="bg-orange-500" variant={'secondary'}>
                                 Tambah Fasilitas
                              </Button>
                           </Link>
                        </div>
                        <div className="ml-10">
                           <div className="mb-5">
                              <Input type="text" placeholder="Cari Fasilitas" value={searchTerm} onChange={handleSearchChange} className="w-1/4 md:w-1/4" />
                           </div>
                           <div className="overflow-x-auto custom-scroll-container w-[100rem] md:w-full">
                              <DataTable columns={columnsFasilitas} data={filteredFacilities.length > 0 ? filteredFacilities : facilities} />
                           </div>
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
            <ToastContainer />
         </div>
         <WaveSVG />
      </div>
   );
}
