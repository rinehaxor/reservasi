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
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';

interface Facility {
   id: number;
   name: string;
   image_url?: string;
}

export default function EditFacility({ params }: any) {
   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
   } = useForm({
      defaultValues: {
         name: '',
         image: null,
      },
   });

   const [facility, setFacility] = useState<Facility | null>(null);
   const supabase = createClient();

   useEffect(() => {
      async function fetchFacilityDetails() {
         if (params?.id) {
            const { data, error } = await supabase.from('facilities').select('*').eq('id', params.id).single();
            if (data) {
               setFacility(data);
               setValue('name', data.name);
            }
         }
      }

      fetchFacilityDetails();
      register('image');
   }, [params?.id, register]);

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

   const handleUpdateFacility = async (formData: any) => {
      const { name, image } = formData;

      let imageUrl = facility?.image_url;
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

      const updatedData: Facility = {
         id: facility?.id as number,
         name,
         image_url: imageUrl,
      };

      try {
         const { data, error } = await supabase.from('facilities').update(updatedData).match({ id: facility?.id });
         if (error) throw new Error(`Error updating facility: ${error.message}`);
         toast.success('Berhasil Mengedit Fasilitas');

         setFacility({ ...facility, ...updatedData });
      } catch (error) {
         toast.error('Gagal Mengedit Fasilitas');
         console.error('Error in handleUpdateFacility:', error);
      }
   };
   useCheckUserRoleAndRedirect();

   return (
      <div className="w-full justify-start items-start">
         {' '}
         <SideBar />
         <div className="w-full">
            <div className="flex-1 w-full flex flex-col  items-center mt-10">
               <p className="text-xl font-bold border-b-2 border-orange-500 mb-5">Edit Fasilitas</p>
               <div className="flex flex-row">
                  <form onSubmit={handleSubmit(handleUpdateFacility)} className="flex flex-col gap-4">
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Label htmlFor="name">Nama Fasilitas</Label>
                        <Input type="text" id="name" placeholder="Facility Name" {...register('name', { required: 'Enter facility name' })} className="form-input" />
                        {errors.name && <p className="text-red-500 text-xs">Enter facility name.</p>}
                     </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Label htmlFor="image"> Gambar Fasilitas</Label>
                        <Input type="file" className="form-input" onChange={handleFileChange} />
                     </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Button variant={'secondary'} type="submit">
                           Edit Fasilitas
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
