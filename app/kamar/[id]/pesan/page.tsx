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
   const [bookingDetails] = useAtom(bookingDetailsAtom); // Global state booking details
   const [roomDetails] = useAtom(roomDetailsAtom);
   const supabase = createClient();

   async function handleBooking() {
      const {
         data: { user },
      } = await supabase.auth.getUser();

      //invoice
      function generateInvoiceNumber() {
         const prefix = 'BOK';
         const randomNumber = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, '0'); // Creates a six-digit number
         return `${prefix}${randomNumber}`;
      }
      const invoiceNumber = generateInvoiceNumber();

      //date formatting
      function formatDateToYYYYMMDD(date: any) {
         const d = new Date(date);
         const year = d.getFullYear();
         const month = d.getMonth() + 1; // getMonth() returns months from 0-11
         const day = d.getDate();
         return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      }

      if (user) {
         const bookingPayload = {
            user_id: user.id,
            room_id: roomDetails?.id,
            invoice_number: invoiceNumber,
            bookingdate: new Date().toISOString(),
            checkindate: formatDateToYYYYMMDD(bookingDetails.checkinDate),
            checkoutdate: formatDateToYYYYMMDD(bookingDetails.checkoutDate),
            name: bookingDetails.name,
            phone_number: bookingDetails.phoneNumber,
            email: bookingDetails.email,
            payment_name: bookingDetails.paymentName,
            payment_account_number: bookingDetails.paymentAccountNumber,
            payment_proof_url: bookingDetails.paymentProofUrl,
            total_price: bookingDetails.totalPrice,
         };
         console.log('Final payload being sent to the server:', bookingPayload);
         const { error } = await supabase.from('bookings').insert([bookingPayload]);
         if (error) {
            alert('Failed to book room: ' + error.message);
         }
      } else {
         alert('You must be logged in to book a room.');
      }
   }

   console.log(' ini data booking', bookingDetails);

   return (
      <div className="w-full">
         {step === 1 && <PersonalDetailsForm onNext={() => setStep(step + 1)} onBack={() => setStep(step - 1)} />}
         {step === 2 && <PaymentDetailsForm onConfirm={handleBooking} onBack={() => setStep(step - 1)} onNext={() => setStep(step + 1)} />}
         {step === 3 && <ConfirmationMessage />}
      </div>
   );
};

export default BookingPage;
