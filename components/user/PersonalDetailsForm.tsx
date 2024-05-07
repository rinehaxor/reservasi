'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { bookingDetailsAtom, roomDetailsAtom } from '../atoms/bookingStore';
import Image from 'next/image';

const PersonalDetailsForm = ({ onNext }: any) => {
   const [bookingDetails, setBookingDetails] = useAtom(bookingDetailsAtom);
   const [roomDetails] = useAtom(roomDetailsAtom);
   const router = useRouter();

   const handleInputChange = (e: any) => {
      setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
   };
   const handleBack = () => {
      // You can navigate to a dynamic route or simply go back
      if (roomDetails?.id) {
         router.push(`/kamar/${roomDetails.id}`); // Adjust the route as per your application's URL scheme
      } else {
         router.back(); // Or just go back to the previous history entry
      }
   };

   return (
      <div>
         {roomDetails && (
            <div>
               <Image src={roomDetails.image_url} alt="Room Image" width={500} height={400} />
               <h1>{roomDetails.name}</h1>
               <p>{roomDetails.description}</p>
            </div>
         )}
         <input name="name" value={bookingDetails.name} onChange={handleInputChange} placeholder="Full Name" />
         <input name="phoneNumber" value={bookingDetails.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" />
         <input name="email" value={bookingDetails.email} onChange={handleInputChange} placeholder="Email" />
         <Button onClick={handleBack}>Back</Button>
         <Button onClick={onNext}>Next</Button>
      </div>
   );
};

export default PersonalDetailsForm;
