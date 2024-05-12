// store.js
import { atom } from 'jotai';
import { createClient } from '@/utils/supabase/client';
import { Room } from '@/app/admin/rooms/columns';
import { Payment } from '@/app/admin/payment/column';
export const roomsAtom = atom<Room[]>([]);
export const paymentAtom = atom<Payment[]>([]);

//delete room
const supabase = createClient();
const deleteRoom = async (roomId: any) => {
   const { data, error } = await supabase.from('rooms').delete().match({ id: roomId });
   if (error) {
      console.error('Error deleting room:', error);
      return { error };
   }
   return { data };
};

export const deleteRoomAtom = atom(null, async (get, set, roomId) => {
   const { error } = await deleteRoom(roomId);
   if (!error) {
      const updatedRooms = get(roomsAtom).filter((room) => room.id !== roomId);
      set(roomsAtom, updatedRooms);
   } else {
      alert('Failed to delete room');
   }
});

const deleteFasilitas = async (facilitiesId: any) => {
   const { data, error } = await supabase.from('facilities').delete().match({ id: facilitiesId });
   if (error) {
      console.error('Error deleting facilities:', error);
      return { error };
   }
   return { data };
};

export const deleteFasilitasAtom = atom(null, async (get, set, facilitiesId) => {
   const { error } = await deleteFasilitas(facilitiesId);
   if (!error) {
      const updatedRooms = get(roomsAtom).filter((facilities) => facilities.id !== facilitiesId);
      set(roomsAtom, updatedRooms);
   } else {
      alert('Failed to delete Fasilitas');
   }
});

const deletePayment = async (paymentId: any) => {
   const { data, error } = await supabase.from('payment').delete().match({ id: paymentId });
   if (error) {
      console.error('Error deleting payment:', error);
      return { error };
   }
   return { data };
};

export const deletePaymentAtom = atom(null, async (get, set, paymentId) => {
   const { error } = await deletePayment(paymentId);
   if (!error) {
      const updatedPayment = get(paymentAtom).filter((payment) => payment.id !== paymentId);
      set(paymentAtom, updatedPayment);
   } else {
      alert('Failed to delete room');
   }
});
