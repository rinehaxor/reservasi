'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { bookingDetailsAtom } from '../atoms/bookingStore';
import NavbarUserRegister from './NavbarUserRegister';
import Link from 'next/link';
import { Button } from '../ui/button';

const ConfirmationMessage = () => {
   const [bookingDetails] = useAtom(bookingDetailsAtom);

   // Function to format dates
   const formatDate = (date: any) => {
      return new Date(date).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
      });
   };
   console.log(bookingDetails);

   return (
      <div>
         <div className="w-full">
            <NavbarUserRegister />
            <div className="flex justify-center items-center flex-col">
               <p className="font-poppins font-bold text-2xl my-5">HOTEL MAEROKOCO</p>
               <div className="flex flex-row gap-5">
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                     <span className="text-teal-900 font-bold">1</span>
                  </div>
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                     <span className="text-teal-900 font-bold">2</span>
                  </div>
                  <div className="bg-orange-300 rounded-full w-12 h-12 flex items-center justify-center">
                     <span className="text-teal-900 font-bold">3</span>
                  </div>
               </div>
               <p className="font-poppins text-xl my-3 font-semibold">Berhasil</p>
            </div>
            <div className="text-center p-6 bg-white shadow-lg rounded-lg mx-4 md:mx-48 mt-8 md:mt-16">
               <svg viewBox="0 0 24 24" className="w-16 h-16 text-green-500 mx-auto">
                  <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,17L7,12L8.41,10.59L12,14.17L17.59,8.59L19,10L12,17Z" />
               </svg>
               <h1 className="font-poppins font-bold text-2xl mt-5">Selamat, transaksi kamu telah berhasil!</h1>
               <p className="text-gray-600 mt-2">
                  Terima kasih, {bookingDetails.name}. Pemesanan Anda telah dikonfirmasi untuk tanggal {formatDate(bookingDetails.checkinDate)} - {formatDate(bookingDetails.checkoutDate)}.
               </p>
               <div className="flex items-center justify-center mt-10">
                  <Link href="/user/reservasi">
                     <Button variant={'secondary'} className="w-32 mb-5">
                        Selesai
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ConfirmationMessage;
