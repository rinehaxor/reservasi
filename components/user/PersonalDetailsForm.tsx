'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { bookingDetailsAtom, roomDetailsAtom } from '../atoms/bookingStore';
import Image from 'next/image';
import { Input } from '../ui/input';
import NavbarUserRegister from './NavbarUserRegister';
import { Label } from '../ui/label';
import { differenceInCalendarDays } from 'date-fns';
import { useForm } from 'react-hook-form';

const PersonalDetailsForm = ({ onNext }: any) => {
   const [roomDetails] = useAtom(roomDetailsAtom);
   const router = useRouter();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm();
   const [bookingDetails, setBookingDetails] = useAtom(bookingDetailsAtom);

   const handleBack = () => {
      if (roomDetails?.id) {
         router.push(`/kamar/${roomDetails.id}`);
      } else {
         router.back();
      }
   };
   const days = differenceInCalendarDays(new Date(bookingDetails.checkoutDate), new Date(bookingDetails.checkinDate));

   const onSubmit = (data: any) => {
      const updatedBookingDetails = {
         ...data,
         checkinDate: bookingDetails.checkinDate,
         checkoutDate: bookingDetails.checkoutDate,
      };

      // Update atom Jotai with combined data
      setBookingDetails(updatedBookingDetails);
      onNext();

      // Lanjutkan ke langkah selanjutnya atau navigasi
      onNext();
   };

   return (
      <div className="w-full">
         <NavbarUserRegister />
         <div className="flex justify-center items-center flex-col">
            <p className="font-poppins font-bold text-2xl my-5">HOTEL MAEROKOCO</p>

            <div className="flex flex-row gap-5">
               <div className="bg-orange-300 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-teal-900 font-bold">1</span>
               </div>
               <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-teal-900 font-bold">2</span>
               </div>
               <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-teal-900 font-bold">3</span>
               </div>
            </div>
            <p className="font-poppins  text-xl my-3">Informasi Pemesanan</p>
            <p className="font-poppins  text-lg ">Silakan isi kolom kosong di bawah ini</p>
         </div>
         <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-row gap-16 mt-5 ">
               {' '}
               {roomDetails && (
                  <div className="w-1/2 flex flex-col justify-end items-end">
                     <Image src={roomDetails.image_url} alt="Room Image" width={500} height={400} />
                     <div className="flex justify-between items-center w-1/2">
                        <div className="flex flex-col">
                           <div className="text-xl font-bold"> {roomDetails.name}</div>
                           <div className="text-lg font-normal"> {roomDetails.type}</div>
                        </div>
                        <div className="flex flex-col justify-between items-end">
                           <p className="text-lg font-semibold">{(roomDetails.price_per_night * days).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</p>
                           <p className="text-lg font-semibold">{days} Malam</p>
                        </div>
                     </div>
                  </div>
               )}
               <div className="bg-gray-300 w-px self-stretch mx-8"></div> {/* Garis pemisah */}
               <div className="w-1/2">
                  <div className="w-1/2 flex justify-start items-start flex-col my-10">
                     <div className="w-full">
                        <div className="mb-4">
                           <Label>Nama Lengkap</Label>
                           <Input {...register('name', { required: 'Nama Lengkap wajib diisi' })} placeholder="Full Name" />
                           {errors.name && <p className="text-red-500 text-xs">Masukan Nama Lengkap.</p>}
                        </div>
                        <div className="mb-4">
                           <Label>Nomer HP</Label>
                           <Input {...register('phoneNumber', { required: 'Nomer HP wajib diisi' })} placeholder="Phone Number" />
                           {errors.phoneNumber && <p className="text-red-500 text-xs">Masukan Nomer HP.</p>}
                        </div>
                        <div className="mb-4">
                           <Label>Email</Label>
                           <Input {...register('email', { required: 'Email wajib diisi' })} placeholder="Email" />
                           {errors.email && <p className="text-red-500 text-xs">Masukan Email.</p>}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            <div className="flex flex-col items-center justify-center mt-10">
               <Button variant={'secondary'} type="submit" className="w-32 mb-5">
                  Next
               </Button>
               <Button className="w-32" variant={'destructive'} onClick={handleBack}>
                  Back
               </Button>
            </div>
         </form>
      </div>
   );
};

export default PersonalDetailsForm;
