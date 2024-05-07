'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Room } from '@/app/admin/rooms/columns';
import Link from 'next/link';

export default function ListRooms() {
   const [rooms, setRooms] = useState<Room[]>([]);
   const supabase = createClient();

   const fetchRoomsAndFacilities = async () => {
      const { data, error } = await supabase.from('rooms').select(`
            *,
            room_facilities!inner(
              facility_id,
              facility:facilities(id, name, image_url)
            )
          `);

      if (error) {
         console.error('error fetching rooms and facilities', error);
      } else {
         console.log('Fetched rooms with facilities:', data);
         // Transform the data to a more useful structure if needed
      }

      return data;
   };

   useEffect(() => {
      const fetchData = async () => {
         const fetchedRooms = await fetchRoomsAndFacilities();
         setRooms(fetchedRooms || []);
      };

      fetchData();
   }, []);

   return (
      <div className="w-full">
         <div className="flex flex-col items-center justify-center my-20">
            <p className="text-6xl font-bold border-b-8 border-orange-500 mb-5 ">LIST KAMAR</p>
         </div>
         {rooms.map((room, index) => (
            <div key={room.id} className={`flex flex-row  p-4 mx-48 gap-5 `}>
               <div className="w-1/2 ">
                  <div className="flex justify-end w-full">
                     <Image src={room.image_url} alt="Room Image" width={'400'} height={'100'} className="w-[500px] h-[300px]" />{' '}
                  </div>
               </div>
               <div className="w-1/2 ">
                  <h2 className="font-extrabold text-4xl">{room.name}</h2>
                  <h2 className=" text-2xl">{room.type}</h2>
                  {/* <h3 className="text-xl font-semibold mt-5">Fasilitas</h3> */}
                  <div className="flex flex-row gap-5">
                     {room.room_facilities.map((rf) => (
                        <>
                           <div className="">
                              <div key={rf.facility_id}>
                                 <Image src={rf.facility.image_url} width={'50'} height={'50'} alt="Facility" />
                              </div>
                           </div>
                        </>
                     ))}
                  </div>
                  <p className="mt-5 text-2xl font-bold mb-2">Harga</p>
                  <p className="inline-block bg-orange-500 font-extrabold text-3xl text-white rounded-sm border-orange-500 border-2 p-2">
                     <span>{room.price_per_night.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                  </p>
                  <br></br>
                  <div className="flex">
                     <Button className="ml-auto mt-5 font-extrabold w-1/4 text-xl" variant={'secondary'}>
                        <Link href={`/kamar/${room.id}`}>Pesan</Link>
                     </Button>
                  </div>
               </div>
            </div>
         ))}
      </div>
   );
}
