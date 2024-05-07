import { atom } from 'jotai';

import { Room } from '@/app/admin/rooms/columns'; // Adjust the import according to your project structure

export const roomDetailsAtom = atom<Room | null>(null);

export const bookingDetailsAtom = atom({
   name: '',
   phoneNumber: '',
   email: '',
   checkinDate: '',
   checkoutDate: '',
   paymentName: '',
   paymentAccountNumber: '',
});
