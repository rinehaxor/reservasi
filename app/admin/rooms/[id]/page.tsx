'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Page({ params }) {
   const [room, setRoom] = useState(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
   const [bookings, setBookings] = useState([]);

   const supabase = createClient();

   useEffect(() => {
      async function fetchRoomDetail() {
         if (params?.id) {
            const { data, error } = await supabase.from('rooms').select('*').eq('id', params.id).single();
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
      <div>
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
      </div>
   );
}
