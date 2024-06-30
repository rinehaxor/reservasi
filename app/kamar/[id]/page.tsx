'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Room } from '@/app/admin/rooms/columns';
import Footer from '@/components/home/Footer';
import NavbarHome from '@/components/home/NavbarHome';
import Image from 'next/image';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SlashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { roomDetailsAtom } from '@/components/atoms/bookingStore';
import { useAtom } from 'jotai';
import Spinner from '@/components/ui/spinner';
import { DateRange } from 'react-day-picker';
import { User } from '@supabase/supabase-js';
import { DatePickerWithRange } from '@/components/ui/datePickerWithRange';

interface Booking {
   room: any;
   id: number;
   user_id: number;
   room_id: number;
   bookingdate: string; // Assuming bookingdate is stored as a string
}
interface PostgrestError {
   message: string;
}
export default function Page({ params }: any) {
   const [user, setUser] = useState<User | null>(null);
   const [room, setRoom] = useState<Room | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<PostgrestError | null>(null);
   const [bookings, setBookings] = useState<Booking[]>([]);
   const [, setRoomDetails] = useAtom(roomDetailsAtom);
   const [dateRange, setDateRange] = useState<DateRange | undefined>();

   const supabase = createClient();

   useEffect(() => {
      async function fetchRoomDetail() {
         if (params?.id) {
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
               .eq('id', params.id)
               .single();
            setRoom(data);
            setRoomDetails(data);
            setError(error);
            setLoading(false);
         }
      }

      fetchRoomDetail();
   }, [params?.id]);

   useEffect(() => {
      async function fetchUser() {
         const {
            data: { user },
            error: userError,
         } = await supabase.auth.getUser();

         setUser(user);

         if (userError) {
            console.error('Error fetching user:', userError.message);
            return;
         }
      }

      fetchUser();
   }, []);

   if (loading)
      return (
         <div>
            <Spinner />
         </div>
      );
   if (error) return <div>Error: {error.message}</div>;

   return (
      <>
         <div className="w-full">
            <div className="bg-orange-500 h-16 w-full">
               <NavbarHome faqRef={undefined} />
            </div>
            <div className="mx-4 sm:mx-24 md:mx-48 mb-5">
               <Breadcrumb className="ml-5 font-thin">
                  <BreadcrumbList>
                     <BreadcrumbItem>
                        <BreadcrumbLink href="/">Home</BreadcrumbLink>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator>
                        <SlashIcon />
                     </BreadcrumbSeparator>
                     <BreadcrumbItem>
                        <BreadcrumbLink href="/list-kamar">Kamar</BreadcrumbLink>
                     </BreadcrumbItem>
                     <BreadcrumbSeparator>
                        <SlashIcon />
                     </BreadcrumbSeparator>
                     <BreadcrumbItem>
                        <BreadcrumbPage>{room?.name}</BreadcrumbPage>
                     </BreadcrumbItem>
                  </BreadcrumbList>
               </Breadcrumb>
               <div className="flex justify-center flex-col md:flex-row">
                  <div className="">{room && <Image src={room.image_url} alt="Room Image" width={'500'} height={'400'} className="w-[700px] md:h-[516px]" />}</div>
                  <div className="flex-row md:flex-col">
                     <div className="">{room && <Image src={room?.bathroom_image_url} alt="Room Image" width={'250'} height={'200'} className="w-full md:w-[350px] h-[258px] md:my-0 my-1" />}</div>
                     <div className="">{room && <Image src={room?.other_image_url} alt="Room Image" width={'250'} height={'200'} className="w-full md:w-[350px] h-[258px]" />}</div>
                  </div>
               </div>
               {room && (
                  <div className="flex flex-col md:flex-row mt-5">
                     <div className="md:w-1/2">
                        <h2 className="font-extrabold text-2xl md:text-4xl">{room?.name}</h2>
                        <h2 className="text-xl md:text-2xl">{room?.type}</h2>
                        <p className="mt-5 text-xl md:text-2xl font-bold mb-2">Fasilitas</p>
                        <div className="flex flex-row flex-wrap gap-5">
                           {room?.room_facilities.map((rf) => (
                              <div key={rf.facility_id}>
                                 <div className="md:w-48 gap-5">
                                    <Image src={rf.facility.image_url} width={'50'} height={'50'} alt="Facility" />
                                    <p className="text-center font-semibold">{rf.facility.name}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                        <p className="mt-5 text-sm md:text-md font-semibold mb-2 text-justify">
                           <span className="font-bold">Deskripsi</span>
                           <br></br>
                           {room?.description}
                        </p>
                     </div>
                     <div className="md:w-1/2 flex flex-col mt-5 md:mt-0">
                        <div className="flex justify-end mb-5 items-end flex-col">
                           <p className="font-extrabold text-xl md:text-3xl mb-5">{room?.price_per_night.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}/Malam</p>

                           <DatePickerWithRange date={dateRange} setDate={setDateRange} />

                           <p className={`font-extrabold text-xl md:text-3xl mt-5 ${room?.room_available === 'Tersedia' ? 'text-white bg-green-500 p-2 rounded-md' : 'text-white bg-red-500 p-2 rounded-md'}`}>Kamar {room?.room_available}</p>
                        </div>

                        <div className="flex justify-end mt-10 flex-col items-end">
                           <Button variant={'secondary'} size={'lg'} className="text-bold w-40 text-white " disabled={!dateRange?.from || !dateRange?.to || room?.room_available !== 'Tersedia' || !user || room?.room_count === 0}>
                              <Link href={`/kamar/${room.id}/pesan`}>Pesan</Link>
                           </Button>
                           <li className="md:font-bold md:text-xs text-xs font-bold mt-2">
                              <i>
                                 Catatan : Sebelum memesan harap{' '}
                                 <span className="text-orange-500 border-b-2 border-orange-500">
                                    <Link href="/login">login</Link>
                                 </span>{' '}
                                 terlebih dahulu
                              </i>
                           </li>
                        </div>
                     </div>
                  </div>
               )}
            </div>
            <Footer />
         </div>
      </>
   );
}
