'use client';
import React from 'react';
import { useAtom } from 'jotai';
import { bookingDetailsAtom } from '../atoms/bookingStore';

const ConfirmationMessage = () => {
   const [bookingDetails] = useAtom(bookingDetailsAtom);

   return (
      <div>
         <h1>Booking Confirmed!</h1>
         <p>
            Thank you, {bookingDetails.name}. Your booking has been confirmed for the dates {bookingDetails.dateRange}.
         </p>
      </div>
   );
};

export default ConfirmationMessage;
