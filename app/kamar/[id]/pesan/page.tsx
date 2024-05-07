'use client';
import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { createClient } from '@/utils/supabase/client';

import PersonalDetailsForm from '@/components/user/PersonalDetailsForm';
import PaymentDetailsForm from '@/components/user/PaymentDetailsForm';
import ConfirmationMessage from '@/components/user/ConfirmationMessage';

import { bookingDetailsAtom, roomDetailsAtom } from '@/components/atoms/bookingStore';

const BookingPage = () => {
   const [step, setStep] = useState(1);
   const [bookingDetails] = useAtom(bookingDetailsAtom);
   const [roomDetails] = useAtom(roomDetailsAtom);
   const supabase = createClient();

   const handleBooking = async () => {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (user) {
         const details = {
            user_id: user.id,
            room_id: roomDetails?.id,
            bookingdate: new Date().toISOString(),
            // payment_name: bookingDetails.paymentName,
            // payment_account_number: bookingDetails.paymentAccountNumber,
         };

         const { error } = await supabase.from('bookings').insert([details]);
         if (error) {
            alert('Failed to book room: ' + error.message);
            return;
         }

         setStep(step + 1); // Move to confirmation step
         alert('Room booked successfully!');
      } else {
         alert('You must be logged in to book a room.');
      }
   };

   return (
      <div>
         {step === 1 && <PersonalDetailsForm onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />}
         {step === 2 && <PaymentDetailsForm onConfirm={handleBooking} onBack={() => setStep(step - 1)} />}
         {step === 3 && <ConfirmationMessage />}
      </div>
   );
};

export default BookingPage;
