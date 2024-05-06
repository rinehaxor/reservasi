'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Room } from '@/app/admin/rooms/columns';
import Footer from '@/components/home/Footer';
import NavbarHome from '@/components/home/NavbarHome';
import Image from 'next/image';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { SlashIcon } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/datePickerWithRange';
import { Button } from '@/components/ui/button';

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
   const [room, setRoom] = useState<Room | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<PostgrestError | null>(null);
   const [bookings, setBookings] = useState<Booking[]>([]);

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
            setError(error);
            setLoading(false);
         }
      }

      fetchRoomDetail();
   }, [params?.id]);

   useEffect(() => {
      async function fetchBookingHistory() {
         const {
            data: { user },
            error: userError,
         } = await supabase.auth.getUser();

         if (userError) {
            console.error('Error fetching user:', userError.message);
            return;
         }

         if (user) {
            const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*').eq('user_id', user.id);

            if (bookingsError) {
               console.error('Error fetching booking history:', bookingsError.message);
            } else {
               setBookings(bookingsData);
            }
         }
      }

      fetchBookingHistory();
   }, []);

   async function handleBooking() {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (user) {
         const bookingDetails = {
            user_id: user?.id, // Make sure 'user_id' matches the column name in your database
            room_id: room?.id,
            bookingdate: new Date().toISOString(),
         };

         const { error } = await supabase.from('bookings').insert([bookingDetails]);
         if (error) {
            alert('Failed to book room: ' + error.message);
         } else {
            alert('Room booked successfully!');
         }
      } else {
         alert('You must be logged in to book a room.');
      }
   }

   if (loading) return <div>Loading...</div>;
   if (error) return <div>Error: {error.message}</div>;

   return (
      <>
         <div className="w-full">
            <div className=" bg-orange-500 h-16 w-full">
               <NavbarHome />
            </div>
            <div className="mx-48 mb-5">
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
               <div className="flex justify-center">{room && <Image src={room.image_url} alt="Room Image" width={'500'} height={'400'} className="w-[700px] h-auto" />}</div>
               {room && (
                  <div className="flex flex-row mt-5">
                     <div className="w-1/2">
                        <h2 className="font-extrabold text-4xl">{room?.name}</h2>
                        <h2 className=" text-2xl">{room?.type}</h2>
                        <p className="mt-5 text-2xl font-bold mb-2">Fasilitas</p>
                        <div className="flex flex-row gap-5">
                           {room?.room_facilities.map((rf) => (
                              <>
                                 <div className="">
                                    <div key={rf.facility_id}>
                                       <Image src={rf.facility.image_url} width={'50'} height={'50'} alt="Facility" />
                                       <p className="text-center font-semibold">{rf.facility.name}</p>
                                    </div>
                                 </div>
                              </>
                           ))}
                        </div>
                        <p className="mt-5 text-md font-semibold mb-2 w-2/3 text-justify">{room?.description}</p>
                        <p className="mt-5 text-2xl font-bold mb-2">Harga</p>
                        <p className="inline-block font-extrabold text-3xl   ">{room?.price_per_night.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                     </div>
                     <div className="w-1/2 flex flex-col">
                        <div className="flex justify-end">
                           <DatePickerWithRange />
                        </div>
                        <div className="flex justify-end mt-10">
                           <Button variant={'secondary'} size={'lg'} className="text-bold w-40 text-white">
                              Pesan
                           </Button>
                        </div>
                     </div>
                  </div>
               )}
            </div>
            <Footer />
         </div>
         <h1>Room Details</h1>
         {room ? (
            <div>
               <p>ID: {room.id}</p>
               <p>Name: {room.name}</p>
            </div>
         ) : (
            <p>Loading room details...</p>
         )}
         <button onClick={handleBooking}>Book This Room</button>
         <h1>Your Booking History</h1>
         <ul>
            {bookings.map((booking) => (
               <li key={booking.id}>
                  {booking?.room?.name} - Booked on: {new Date(booking.bookingdate).toLocaleDateString()}
               </li>
            ))}
         </ul>
      </>
   );
}
