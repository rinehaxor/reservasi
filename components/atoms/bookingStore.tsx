import { atom, useAtom } from 'jotai';

import { Room } from '@/app/admin/rooms/columns'; // Adjust the import according to your project structure
import { createClient } from '@/utils/supabase/client';
import { Bookings } from '@/app/admin/reservasi/column';
import { updateTriggerAtom } from './store';

export const roomDetailsAtom = atom<Room | null>(null);

export const bookingDetailsAtom = atom({
   name: '',
   phoneNumber: '',
   email: '',
   checkinDate: '',
   checkoutDate: '',
   paymentName: '',
   paymentAccountNumber: '',
   paymentProofUrl: '',
   totalPrice: 0,
   price_per_night: 0,
   invoice_number: '',
});

export const bookingsAtom = atom<Bookings[]>([]);
export const useUpdatePaymentStatus = () => {
   const [bookings, setBookings] = useAtom(bookingsAtom);
   const [, setUpdateTrigger] = useAtom(updateTriggerAtom);
   const supabase = createClient();

   const updatePaymentStatus = async (bookingId: string, newStatus: string, reason?: string) => {
      const updates: any = {
         payment_status: newStatus,
      };

      if (newStatus === 'Disetujui') {
         updates.rejection_reason = null;
      } else if (reason !== undefined) {
         updates.rejection_reason = reason;
      }

      const { data, error } = await supabase.from('bookings').update(updates).match({ id: bookingId });

      if (!error) {
         setBookings((currentBookings) => currentBookings.map((booking) => (booking.id === bookingId ? { ...booking, payment_status: newStatus, rejection_reason: updates.rejection_reason } : booking)));
         setUpdateTrigger((prev) => prev + 1);
      } else {
         console.error('Error updating Payment:', error);
      }
   };

   return updatePaymentStatus;
};

export const useUpdateBookingStatus = () => {
   const [bookings, setBookings] = useAtom(bookingsAtom);
   const [, setUpdateTrigger] = useAtom(updateTriggerAtom);
   const supabase = createClient();

   const updateBookingStatus = async (bookingId: string, newStatus: string) => {
      const { data, error } = await supabase.from('bookings').update({ booking_status: newStatus }).match({ id: bookingId });

      if (!error) {
         setBookings((currentBookings) => currentBookings.map((booking) => (booking.id === bookingId ? { ...booking, booking_status: newStatus } : booking)));
         setUpdateTrigger((prev) => prev + 1);
      } else {
         console.error('Error updating bookings:', error);
      }
   };

   return updateBookingStatus;
};
