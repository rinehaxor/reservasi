'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

const EditRoom = () => {
   const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
   } = useForm({
      defaultValues: {
         name: '',
         type: '',
         description: '',
         price: '',
         image: null,
      },
   });

   const supabase = createClient();

   useEffect(() => {
      register('image', { required: 'File gambar wajib diunggah' });
   }, [register]);

   //    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
   //       if (event.target.files && event.target.files[0]) {
   //          setImage(event.target.files[0]); // Now safely assigning File to state
   //       }
   //    };

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
      const filePath = `rooms/${fileName}`;

      let { error: uploadError, data: uploadData } = await supabase.storage.from('room-images').upload(filePath, file);

      if (uploadError) {
         console.error('Failed to upload image:', uploadError);
         return null;
      }

      let { data: urlData } = await supabase.storage.from('room-images').getPublicUrl(filePath);
      if (!urlData.publicUrl) {
         console.error('Failed to get public URL:');
         return null;
      }

      return urlData.publicUrl;
   };

   const handleAddRoom = async (formData: any) => {
      const { name, type, description, price, image } = formData;
      try {
         const imageUrl = await uploadImage(image);
         if (!imageUrl) {
            console.error('Failed to get the image URL');
            return;
         }

         const { data, error } = await supabase.from('rooms').insert([
            {
               name,
               type,
               description,
               price_per_night: parseInt(price, 10),
               image_url: imageUrl,
            },
         ]);

         if (error) {
            console.error('Error adding room:', error);
         } else {
            alert('Room added successfully!');
         }
      } catch (error) {
         console.error('Error in handleAddRoom:', error);
      }
   };

   return (
      <form onSubmit={handleSubmit(handleAddRoom)} className="flex flex-col gap-4">
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="name">Nama Kamar</Label>
            <Input type="text" id="name" placeholder="Nama Kamar" {...register('name', { required: 'Masukan Namar Kamar' })} className="form-input" />
            {errors.name && <p className="text-red-500 text-xs md:text-md">Masukan Namar Kamar.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="type">Tipe Kamar</Label>
            <Input type="text" id="type" placeholder="Tipe Kamar" {...register('type', { required: 'Masukan Tipe Kamar' })} className="form-input" />
            {errors.type && <p className="text-red-500 text-xs md:text-md">Masukan Tipe Kamar.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="type">Deskripsi Kamar</Label>
            <Textarea id="description" placeholder="Deskripsi" {...register('description', { required: 'Masukan Deskripsi' })} className="form-input" />
            {errors.description && <p className="text-red-500 text-xs md:text-md">Masukan Deskripsi.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="price">Harga Per Malam</Label>
            <Input type="number" id="price" placeholder="0" {...register('price', { required: 'Masukan Harga' })} className="form-input" />
            {errors.price && <p className="text-red-500 text-xs md:text-md">Masukan Harga.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Label htmlFor="price">Foto Kamar</Label>
            <Input type="file" className="form-input" onChange={handleFileChange} />
            {errors.image && <p className="text-red-500 text-xs">Masukan Gambar.</p>}
         </div>
         <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
            <Button variant={'secondary'} type="submit">
               Tambah Kamar
            </Button>
         </div>
         {/* <input type="file" onChange={handleFileChange} />
         <button onClick={handleAddRoom}>Add Room</button> */}
         {/* 
         <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Room Number" />
         <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Room Type" />
         <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
         <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price Per Night" />
    
     */}
      </form>
   );
};

export default EditRoom;
