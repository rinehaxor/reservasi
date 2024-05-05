'use client';
import React, { useEffect } from 'react';
import ReadRoom from '@/components/admin/readRoom';
import NavbarAdmin from '@/components/admin/navbarAdmin';
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
   }, [setFacilities, facilities.length]); // Dependency on rooms.length is to prevent refetching when already loaded

   return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
         <div className="w-full">
            {/* <NavbarAdmin /> */}
            <div className="flex w-full">
               <div className="w-[14%]">
                  <SideBar />
               </div>
               <div className="flex-1 ">
                  {loading ? (
                     <>
                        <div className="flex justify-center items-center">
                           <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
                        </div>
                     </>
                  ) : facilities.length > 0 ? (
                     <>
                        <div className="w-[14%] ">
                           <SideBar />
                        </div>
                        <div className=" md:w-[600px] py-10 px-10">
                           <div className="flex justify-end items-end mb-10">
                              <Link href="/admin/fasilitas/tambah-fasilitas">
                                 {' '}
                                 <Button variant={'secondary'} className="bg-orange-500">
                                    Tambah Fasilitas
                                 </Button>
                              </Link>
                           </div>

                           <DataTable columns={columnsFasilitas} data={facilities} />
                        </div>
                     </>
                  ) : (
                     <div className="flex justify-center items-center h-screen">No data available.</div>
                  )}
               </div>
            </div>
         </div>
         <WaveSVG />
      </div>
   );
}
