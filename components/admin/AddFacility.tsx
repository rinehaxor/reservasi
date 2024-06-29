'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';

const AddFacility = () => {
   const {
      register,
      handleSubmit,
      setValue,
      reset,
      watch,
      formState: { errors },
   } = useForm({
      defaultValues: {
         name: '',
         image: null,
      },
   });

   const [name, setName] = useState('');
   const [image, setImage] = useState<File | null>(null);
   const supabase = createClient();

   // Simulate fetching user ID from authentication state
   useCheckUserRoleAndRedirect();

   // Protect the page
   //    useAdminAccess(user.role);

   useEffect(() => {
      register('image', { required: 'Image file is required' });
   }, [register]);

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
      const filePath = `facilities/${fileName}`;

      let { error: uploadError, data: uploadData } = await supabase.storage.from('facility-images').upload(filePath, file);

      if (uploadError) {
         console.error('Failed to upload image:', uploadError);
         return null;
      }

      let { data: urlData } = await supabase.storage.from('facility-images').getPublicUrl(filePath);
      if (!urlData.publicUrl) {
         console.error('Failed to get public URL:');
         return null;
      }

      return urlData.publicUrl;
   };

   const handleAddFacility = async (formData: any) => {
      const { name, image } = formData;
      try {
         const imageUrl = await uploadImage(image);
         if (!imageUrl) {
            console.error('Failed to get the image URL');
            return;
         }

         const { data, error } = await supabase.from('facilities').insert([
            {
               name,
               image_url: imageUrl,
            },
         ]);

         if (error) {
            toast.error('Gagal Menambahkan Fasilitas');
            console.error('Error adding facility:', error);
         } else {
            toast.success('Berhasil Menambahkan Fasilitas');
            reset();
         }
      } catch (error) {
         console.error('Error in handleAddFacility:', error);
      }
   };

   return (
      <form onSubmit={handleSubmit(handleAddFacility)} className="flex flex-col gap-4">
         <p className="text-xl font-bold border-b-2 border-orange-500 mb-5">Tambah Fasilitas</p>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="name">Nama Fasilitas</Label>
            <Input
               type="text"
               id="name"
               placeholder="Facility Name"
               {...register('name', {
                  required: 'Masukan Nama Fasilitas',
                  minLength: {
                     value: 5,
                     message: 'Nama kamar minimal 5 karakter',
                  },
                  maxLength: {
                     value: 30,
                     message: 'Tidak boleh lebih dari 30 karakter',
                  },
               })}
               className="form-input"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="image">Gambar Fasilitas </Label>
            <Input type="file" className="form-input" onChange={handleFileChange} />
            {errors.image && <p className="text-red-500 text-xs">Masukan Gambar Fasilitas.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Button variant={'secondary'} type="submit">
               Tambah Fasilitas
            </Button>
         </div>
         <ToastContainer />
      </form>
   );
};

export default AddFacility;
