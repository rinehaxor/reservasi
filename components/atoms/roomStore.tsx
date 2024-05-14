import { Room } from '@/app/admin/rooms/columns';
import { atom, useAtom } from 'jotai';
import { createClient } from '@/utils/supabase/client';
import { updateTriggerAtom } from './store';

export const roomDetailsAtom = atom<Room[]>([]);
export const useUpdateRoomStatus = () => {
   const [roomDetail, setRoomDetail] = useAtom(roomDetailsAtom);
   const [, setUpdateTrigger] = useAtom(updateTriggerAtom);
   const supabase = createClient();

   const updateBookingStatus = async (roomId: string, newStatus: string) => {
      const { data, error } = await supabase.from('rooms').update({ room_available: newStatus }).match({ id: roomId });

      if (!error) {
         setRoomDetail((currentRooms) => currentRooms.map((room) => (room.id === roomId ? { ...room, room_available: newStatus } : room)));
         setUpdateTrigger((prev) => prev + 1);
      } else {
         console.error('Error updating bookings:', error);
      }
   };

   return updateBookingStatus;
};
