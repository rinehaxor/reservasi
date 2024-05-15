'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPayment = () => {
   const {
      register,
      handleSubmit,
      setValue,
      reset,
      formState: { errors },
   } = useForm({
      defaultValues: {
         bank_name: '',
         account_number: '',
         image: null,
      },
   });

   const [image, setImage] = useState<File | null>(null);
   const supabase = createClient();

   useCheckUserRoleAndRedirect();

   useEffect(() => {
      register('image', { required: 'Image file is required' });
   }, [register]);

   const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
         setValue('image', file, { shouldValidate: true });
         setImage(file);
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
      return urlData.publicUrl || null;
   };

   const handleAddPayment = async (formData: any) => {
      const { bank_name, account_number, image } = formData;
      const imageUrl = await uploadImage(image);
      if (!imageUrl) {
         console.error('Failed to get the image URL');
         return;
      }

      const { data, error } = await supabase.from('payments').insert([
         {
            bank_name,
            account_number,
            image_url: imageUrl,
         },
      ]);

      if (error) {
         toast.error('Gagal Menambahkan Pembayaran');
         console.error('Error adding payment method:', error);
      } else {
         toast.success('Berhasil Menambahkan Pembayran');
         reset();
      }
   };

   return (
      <form onSubmit={handleSubmit(handleAddPayment)} className="flex flex-col gap-4">
         <p className="text-xl font-bold border-b-2 border-orange-500 mb-5">Tambah Pembayaran</p>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="bank_name">Nama Bank</Label>
            <Input type="text" id="bank_name" placeholder="Nama Bank" {...register('bank_name', { required: 'Bank name is required' })} className="form-input" />
            {errors.bank_name && <p className="text-red-500 text-xs">Masukan Nama Bank.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="account_number">Nomer Rekening Bank</Label>
            <Input type="number" id="account_number" placeholder="12345" {...register('account_number', { required: 'Account number is required' })} className="form-input" />
            {errors.account_number && <p className="text-red-500 text-xs">Masukan Nomer Rekening.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="image">Bank Logo</Label>
            <Input type="file" className="form-input" onChange={handleFileChange} />
            {errors.image && <p className="text-red-500 text-xs">Masukan Gambar Bank.</p>}
         </div>
         <Button type="submit" variant="secondary">
            Tambah Pembayaran
         </Button>
         <ToastContainer />
      </form>
   );
};

export default AddPayment;
