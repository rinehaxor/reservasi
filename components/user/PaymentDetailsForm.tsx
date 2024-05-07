'use client';
import React from 'react';
import { useAtom } from 'jotai';

import { Button } from '@/components/ui/button';
import { bookingDetailsAtom } from '../atoms/bookingStore';

const PaymentDetailsForm = ({ onConfirm, onBack }: any) => {
   const [bookingDetails, setBookingDetails] = useAtom(bookingDetailsAtom);

   const handleInputChange = (e: any) => {
      setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
   };

   return (
      <div>
         <input name="paymentName" value={bookingDetails.paymentName} onChange={handleInputChange} placeholder="Account Holder Name" />
         <input name="paymentAccountNumber" value={bookingDetails.paymentAccountNumber} onChange={handleInputChange} placeholder="Account Number" />
         <Button onClick={onBack}>Back</Button>
         <Button onClick={onConfirm}>Confirm Booking</Button>
      </div>
   );
};

export default PaymentDetailsForm;
