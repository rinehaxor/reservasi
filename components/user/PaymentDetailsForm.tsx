'use client';
import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { Button } from '@/components/ui/button';
import { bookingDetailsAtom } from '../atoms/bookingStore';
import NavbarUserRegister from './NavbarUserRegister';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useForm } from 'react-hook-form';
import { Payment } from '@/app/admin/payment/column';
import { createClient } from '@/utils/supabase/client';
import { paymentAtom } from '../atoms/store';
import Image from 'next/image';
import Spinner from '../ui/spinner';

async function fetchPayment(): Promise<Payment[]> {
   const supabase = createClient();
   let { data, error } = await supabase.from('payments').select('*');

   if (error) {
      console.error('Error fetching payment:', error);
      return [];
   }

   return data || [];
}

const PaymentDetailsForm = ({ onConfirm, onBack, onNext }: any) => {
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm();
   const [bookingDetails, setBookingDetails] = useAtom(bookingDetailsAtom);
   const supabase = createClient();

   const [payment, setPayment] = useAtom(paymentAtom);
   const [loading, setLoading] = React.useState(true);
   useEffect(() => {
      if (!payment || Object.keys(payment).length === 0) {
         setLoading(false);
         fetchPayment().then((fetchedPayment) => {
            setPayment(fetchedPayment);
            setLoading(false);
         });
      }
   }, [setPayment, payment]);

   // file upload

   useEffect(() => {
      register('image', { required: 'Image file is required' });
   }, [register]);

   const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
         console.log('File selected:', file);
         setValue('image', file, { shouldValidate: true });
      } else {
         console.error('No file selected');
      }
   };

   const uploadImage = async (file: any) => {
      if (!file) {
         console.error('No file provided');
         return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `payments-proof/${fileName}`;

      console.log('Uploading file:', filePath);

      let { error: uploadError, data: uploadData } = await supabase.storage.from('payment-proof').upload(filePath, file);

      if (uploadError) {
         console.error('Failed to upload image:', uploadError);
         return null;
      }

      let { data: urlData } = await supabase.storage.from('payment-proof').getPublicUrl(filePath);
      if (!urlData.publicUrl) {
         console.error('Failed to get public URL');
         return null;
      }

      return urlData.publicUrl;
   };

   const onSubmit = async (data: any) => {
      setLoading(true);
      try {
         console.log('FormData received:', data);
         const file = data.image; // This should directly reference the file set by setValue
         if (!file) {
            throw new Error('No file provided');
         }

         const imageUrl = await uploadImage(file);
         if (!imageUrl) {
            throw new Error('Failed to upload image');
         }

         const updatedBookingDetails = {
            ...bookingDetails,
            paymentName: data.paymentName,
            paymentAccountNumber: data.paymentAccountNumber,
            paymentProofUrl: imageUrl,
         };
         setBookingDetails(updatedBookingDetails);
         console.log('Booking Details after update:', bookingDetails);
      } catch (error) {
         console.error('Error processing payment details:', error);
         alert('Error processing payment details: ' + error);
      } finally {
         setLoading(false);
      }
   };

   // useEffect to check if payment details are entered and proceed
   useEffect(() => {
      // Check if both required payment details are present
      if (bookingDetails.paymentName && bookingDetails.paymentAccountNumber) {
         onConfirm();
         onNext(); // Proceed to confirm or next step
      }
   }, [bookingDetails, onConfirm, onNext]);

   return (
      <div className="w-full">
         <NavbarUserRegister />
         <div className="flex justify-center items-center flex-col">
            <p className="font-poppins font-bold text-2xl my-5">HOTEL MAEROKOCO</p>
            <div className="flex flex-row gap-5">
               <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-teal-900 font-bold">1</span>
               </div>
               <div className="bg-orange-300 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-teal-900 font-bold">2</span>
               </div>
               <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                  <span className="text-teal-900 font-bold">3</span>
               </div>
            </div>
            <p className="font-poppins text-xl my-3 font-semibold">Pembayaran</p>
            <p className="font-poppins text-lg">Silakan isi kolom kosong di bawah ini</p>
         </div>
         <div className="flex justify-center items-center px-4">
            {loading ? ( // Display spinner while loading
               <Spinner />
            ) : (
               <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-4xl">
                  <div className="flex flex-col lg:flex-row gap-5 mt-5">
                     <div className=" w-full md:w-1/2 flex flex-col gap-16 mt-5 items-center justify-center ">
                        {payment.map((item, index) => (
                           <div key={index} className="flex flex-col lg:flex-row gap-5 mt-5 justify-center mitems-center">
                              <div className="w-full lg:w-1/2 flex flex-row md:justify-end items-center justify-center lg:items-end gap-5">
                                 <Image src={item.image_url} alt="Room Image" width={500} height={400} className="w-full lg:w-auto" />
                                 <div className="text-xl font-bold">
                                    {item.bank_name} <br></br>
                                    {item.account_number}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                     <div className="bg-gray-300 w-full lg:w-px self-stretch lg:mx-8"></div> {/* Garis pemisah */}
                     <div className="w-full lg:w-1/2">
                        <div className="w-full flex flex-col my-10">
                           <div className="mb-4">
                              <Label>Nama Pengirim</Label>
                              <Input
                                 className="w-full"
                                 {...register('paymentName', {
                                    required: 'Masukan Nama Pengirim.',
                                    minLength: {
                                       value: 5,
                                       message: 'Nama Pengirim harus minimal 5 karakter.',
                                    },
                                    maxLength: {
                                       value: 35,
                                       message: 'Nama Pengirim harus maksimal 35 karakter.',
                                    },
                                 })}
                                 placeholder="Nama Pengirim"
                              />
                              {errors.paymentName && <p className="text-red-500 text-xs">{errors.paymentName.message as string}</p>}
                           </div>
                           <div className="mb-4">
                              <Input
                                 type="text"
                                 id="paymentAccountNumber"
                                 {...register('paymentAccountNumber', {
                                    required: 'Masukan Nomer Rekening.',
                                    minLength: {
                                       value: 10,
                                       message: 'Nomer Rekening harus minimal 10 karakter.',
                                    },
                                    maxLength: {
                                       value: 20,
                                       message: 'Nomer Rekening harus maksimal 20 karakter.',
                                    },
                                    pattern: {
                                       value: /^[0-9]+$/,
                                       message: 'Nomer Rekening harus berupa angka.',
                                    },
                                 })}
                                 placeholder="Nomer Rekening"
                                 className="form-input"
                              />
                              {errors.paymentAccountNumber && <p className="text-red-500 text-xs">{errors.paymentAccountNumber.message as string}</p>}
                           </div>
                           <div className="mb-4">
                              <Label htmlFor="image">Bukti Pengiriman</Label>
                              <Input type="file" className="form-input w-full" onChange={handleFileChange} />
                              {errors.image && <p className="text-red-500 text-xs">Masukan Bukti Pengiriman.</p>}
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-center justify-center mt-10">
                     <Button variant={'secondary'} type="submit" className="w-32 mb-5">
                        Next
                     </Button>
                     <Button className="w-32" variant={'destructive'} onClick={onBack}>
                        Back
                     </Button>
                  </div>
               </form>
            )}
         </div>
      </div>
   );
};

export default PaymentDetailsForm;
