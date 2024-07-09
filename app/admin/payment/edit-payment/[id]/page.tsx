'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { WaveSVG } from '@/components/ui/waves';
import SideBar from '@/components/admin/SideBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Swal from 'sweetalert2';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';

interface Payment {
   id: number;
   name: string;
   image_url?: string;
   account_number: number;
   bank_name: string;
}

export default function EditPayment({ params }: any) {
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm({
      defaultValues: {
         name: '',
         bank_name: '',
         account_number: '',
         image: null,
      },
   });

   const [payment, setPayment] = useState<Payment | null>(null);
   const supabase = createClient();

   useEffect(() => {
      async function fetchPaymentDetails() {
         if (params?.id) {
            const { data, error } = await supabase.from('payments').select('*').eq('id', params.id).single();
            if (data) {
               setPayment(data);
               setValue('name', data.name);
               setValue('bank_name', data.bank_name);
               setValue('account_number', data.account_number);
            }
         }
      }

      fetchPaymentDetails();
      register('image');
   }, [params?.id, register, setValue]);

   const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
         setValue('image', file, { shouldValidate: true });
      }
   };

   const uploadImage = async (file: any) => {
      if (!file) return null;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `payment-images/${fileName}`;

      let { error: uploadError, data: uploadData } = await supabase.storage.from('payment-images').upload(filePath, file);
      if (uploadError) {
         console.error('Failed to upload image:', uploadError);
         return null;
      }

      let { data: urlData } = await supabase.storage.from('payment-images').getPublicUrl(filePath);
      if (!urlData.publicUrl) {
         console.error('Failed to get public URL:');
         return null;
      }

      return urlData.publicUrl;
   };

   const handleUpdatePayment = async (formData: any) => {
      const result = await Swal.fire({
         title: 'Apakah Anda yakin?',
         text: 'Pastikan data yang diubah sudah benar.',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Ya, perbarui!',
         cancelButtonText: 'Batal',
      });

      if (!result.isConfirmed) {
         return;
      }

      const { name, image, account_number, bank_name } = formData;

      let imageUrl = payment?.image_url;
      if (image instanceof File) {
         const uploadedImageUrl = await uploadImage(image);
         if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
         } else {
            console.error('Failed to upload new image');
            alert('Failed to upload new image');
            return;
         }
      }

      const updatedData: Payment = {
         id: payment?.id as number,
         name,
         image_url: imageUrl,
         account_number,
         bank_name,
      };

      try {
         const { data, error } = await supabase.from('payments').update(updatedData).match({ id: payment?.id });
         if (error) throw new Error(`Error updating payment: ${error.message}`);
         toast.success('Berhasil Mengedit Pembayaran');
         setPayment({ ...payment, ...updatedData });
      } catch (error) {
         toast.error('Gagal Mengedit Pembayaran');
         console.error('Error in handleUpdatePayment:', error);
      }
   };

   useCheckUserRoleAndRedirect();

   return (
      <div className="w-full justify-start items-start">
         <SideBar />
         <div className="w-full">
            <div className="flex-1 w-full flex flex-col items-center mt-10">
               <p className="text-xl font-bold border-b-2 border-orange-500 mb-5">Edit Pembayaran</p>
               <div className="flex flex-row">
                  <form onSubmit={handleSubmit(handleUpdatePayment)} className="flex flex-col gap-4">
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Label htmlFor="bank_name">Nama Bank</Label>
                        <Input
                           type="text"
                           id="bank_name"
                           placeholder="Nama Pembayaran"
                           {...register('bank_name', {
                              required: 'Masukan Nama Pembayaran',
                              minLength: {
                                 value: 5,
                                 message: 'Nama Pembayaran  minimal 5 karakter',
                              },
                              maxLength: {
                                 value: 30,
                                 message: 'Nama Pembayaran maksimal 30 karakter',
                              },
                           })}
                           className="form-input"
                        />
                        {errors.bank_name && <p className="text-red-500 text-xs">{errors.bank_name.message}</p>}
                     </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Label htmlFor="account_number">Nomer Rekening Bank</Label>
                        <Input
                           type="number"
                           id="account_number"
                           placeholder="Nomer Rekening Bank"
                           {...register('account_number', {
                              required: 'Masukan Nomer Rekening',
                              minLength: {
                                 value: 10,
                                 message: 'Nomer Rekening  minimal 10 karakter',
                              },
                              maxLength: {
                                 value: 20,
                                 message: 'Nomer Rekening maksimal 20 karakter',
                              },
                           })}
                           className="form-input"
                        />
                        {errors.account_number && <p className="text-red-500 text-xs">{errors.account_number.message}</p>}
                     </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Label htmlFor="image">Masukan Gambar Bank</Label>
                        <Input type="file" className="form-input" onChange={handleFileChange} />
                     </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Button variant={'secondary'} type="submit">
                           Update Pembayaran
                        </Button>
                     </div>
                     <ToastContainer />
                  </form>
                  <WaveSVG />
               </div>
            </div>
         </div>
      </div>
   );
}
