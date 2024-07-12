'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Room } from '@/app/admin/rooms/columns';
import Link from 'next/link';
import Spinner from '../ui/spinner';
import Footer from './Footer';
import StarRating from '../user/StarRating ';

export default function ListRooms() {
   const [rooms, setRooms] = useState<Room[]>([]);
   const [loading, setLoading] = useState(true);
   const supabase = createClient();

   const fetchRoomsAndFacilities = async () => {
      const { data, error } = await supabase
         .from('rooms')
         .select(
            `
            *,
            room_facilities!inner(
              facility_id,
              facility:facilities(id, name, image_url)
            )
          `
         )
         .order('price_per_night', { ascending: false });

      if (error) {
         console.error('error fetching rooms and facilities', error);
      } else {
         console.log('Fetched rooms with facilities:', data);
         setLoading(false);
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

   if (loading)
      return (
         <div>
            <Spinner />
         </div>
      );

   return (
      <div className="w-full">
         {loading ? (
            <Spinner /> // Display the spinner while loading
         ) : (
            <>
               <div className="flex flex-col items-center justify-center my-10 sm:my-20">
                  <p className="text-3xl sm:text-6xl font-bold border-b-8 border-orange-500 mb-5">LIST KAMAR</p>
               </div>
               {rooms.map((room, index) => (
                  <div key={room.id} className="flex flex-col sm:flex-row p-4 mx-4 sm:mx-48 gap-5">
                     <div className="w-full sm:w-1/2">
                        <div className="flex justify-center sm:justify-end w-full">
                           <Image src={room.image_url} layout="responsive" width={300} height={200} alt="Room Image" />
                        </div>
                     </div>
                     <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                        <h2 className="font-extrabold text-2xl sm:text-4xl">{room.name}</h2>
                        <h2 className="text-xl sm:text-2xl font-bold md:my-10">{room.type}</h2>
                        <div className="flex flex-wrap gap-2 sm:gap-5 mt-3">
                           {room.room_facilities.map((rf) => (
                              <div key={rf.facility_id}>
                                 <img src={rf.facility.image_url} alt="Facility" style={{ width: '50px', height: '50px' }} />
                              </div>
                           ))}
                        </div>
                        <p className="mt-3 text-xl sm:text-2xl font-bold ">Harga</p>
                        <p className="inline-block bg-orange-500 font-extrabold text-xl sm:text-3xl text-white rounded-sm border-orange-500 border-2 p-2">
                           <span>{room.price_per_night.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
                        </p>
                        <p className="text-orange-500 font-bold">Kamar Tersisa {room?.room_count}</p>
                        <div className="flex mt-10 justify-between">
                           <div className="">
                              {room.average_rating ? (
                                 <>
                                    <p className="text-xl font-bold">Rating</p>
                                    <StarRating rating={room.average_rating} />{' '}
                                 </>
                              ) : (
                                 <p className="text-xl font-bold">Belum ada rating</p>
                              )}
                           </div>

                           <Link href={`/kamar/${room.id}`}>
                              <Button className="ml-auto font-extrabold text-lg sm:text-xl py-2 px-4 " variant={'secondary'}>
                                 Pesan
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </div>
               ))}
               <Footer />
            </>
         )}
      </div>
   );
}
