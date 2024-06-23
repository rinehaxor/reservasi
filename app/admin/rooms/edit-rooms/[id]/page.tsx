'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useCheckUserRoleAndRedirect from '@/hooks/useCheckUserRoleAndRedirect ';

interface Room {
   id?: string; // Making id optional
   name: string;
   type: string;
   description: string;
   price_per_night: number;
   image_url?: string;
   bathroom_image_url?: string;
   other_image_url?: string;
}

interface Booking {
   id: number;
   user_id: number;
   // Add other booking properties here
}

export default function Page({ params }: any) {
   const {
      register,
      handleSubmit,
      setValue,
      watch,
      formState: { errors },
   } = useForm<Room>({
      defaultValues: {
         name: '',
         type: '',
         description: '',
         price_per_night: 0,
         image_url: '',
         bathroom_image_url: '',
         other_image_url: '',
      },
   });

   const supabase = createClient();
   const [room, setRoom] = useState<Room | null>(null);
   const [loading, setLoading] = useState(true);
   const [facilities, setFacilities] = useState<Facility[]>([]);
   const [currentFacilities, setCurrentFacilities] = useState<number[]>([]);
   const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);

   useEffect(() => {
      const fetchFacilities = async () => {
         const { data, error } = await supabase.from('facilities').select('*');
         if (error) {
            console.error('Error fetching facilities:', error);
         } else {
            setFacilities(data);
         }
      };

      fetchFacilities();
   }, []);

   useEffect(() => {
      const fetchRoomDetail = async () => {
         if (params?.id) {
            const { data, error } = await supabase.from('rooms').select('*').eq('id', params.id).single();
            if (data) {
               setRoom(data);
               setValue('name', data.name);
               setValue('type', data.type);
               setValue('description', data.description);
               setValue('price_per_night', data.price_per_night);
               setValue('image_url', data.image_url);
               setValue('bathroom_image_url', data.bathroom_image_url);
               setValue('other_image_url', data.other_image_url);

               const { data: facilityData, error: facilityError } = await supabase.from('room_facilities').select('facility_id').eq('room_id', data.id);
               if (facilityData) {
                  setCurrentFacilities(facilityData.map((fac) => fac.facility_id));
               }
            }
            setLoading(false);
         }
      };

      fetchRoomDetail();
   }, [params?.id, setValue]);

   useEffect(() => {
      setSelectedFacilities(currentFacilities);
   }, [currentFacilities]);

   const handleFileChange = (event: any, fieldName: keyof Room) => {
      const file = event.target.files[0];
      if (file) {
         setValue(fieldName, file, { shouldValidate: true });
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

   const handleFacilityChange = (facilityId: number) => {
      setSelectedFacilities((prev) => (prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId]));
   };

   const updateRoom = async (formData: Room) => {
      const { name, type, description, price_per_night, image_url, bathroom_image_url, other_image_url } = formData;

      let updatedImageUrl = room?.image_url;
      let updatedBathroomImageUrl = room?.bathroom_image_url;
      let updatedOtherImageUrl = room?.other_image_url;

      if (image_url && typeof image_url !== 'string') {
         const uploadedImageUrl = await uploadImage(image_url);
         if (uploadedImageUrl) {
            updatedImageUrl = uploadedImageUrl;
         }
      }

      if (bathroom_image_url && typeof bathroom_image_url !== 'string') {
         const uploadedBathroomImageUrl = await uploadImage(bathroom_image_url);
         if (uploadedBathroomImageUrl) {
            updatedBathroomImageUrl = uploadedBathroomImageUrl;
         }
      }

      if (other_image_url && typeof other_image_url !== 'string') {
         const uploadedOtherImageUrl = await uploadImage(other_image_url);
         if (uploadedOtherImageUrl) {
            updatedOtherImageUrl = uploadedOtherImageUrl;
         }
      }
      const updatedData = {
         name,
         type,
         description,
         price_per_night,
         image_url: updatedImageUrl,
         bathroom_image_url: updatedBathroomImageUrl,
         other_image_url: updatedOtherImageUrl,
      };

      try {
         const { data: roomData, error: roomError } = await supabase.from('rooms').update(updatedData).match({ id: room?.id });
         if (roomError) throw new Error(`Error updating room: ${roomError.message}`);

         const { error: deleteError } = await supabase.from('room_facilities').delete().match({ room_id: room?.id });
         if (deleteError) throw new Error(`Error deleting old facilities: ${deleteError.message}`);

         const facilityInserts = selectedFacilities.map((facilityId) => ({
            room_id: room?.id,
            facility_id: facilityId,
         }));
         const { error: insertError } = await supabase.from('room_facilities').insert(facilityInserts);
         if (insertError) throw new Error(`Error inserting new facilities: ${insertError.message}`);
         toast.success('Berhasil Mengedit Kamar');

         //  alert('Berhasil Mengedit Kamar');
         setRoom({ ...room, ...updatedData });
      } catch (error) {
         toast.error('Gagal Mengedit Kamar');
         alert(error);
      }
   };

   useCheckUserRoleAndRedirect();

   return (
      <div className="flex">
         <SideBar />
         <div className="flex-1 p-8">
            <div className="max-w-3xl mx-auto bg-white shadow-md rounded-md p-6">
               <p className="text-2xl font-bold border-b-2 border-orange-500 mb-5">Edit Kamar</p>
               <form onSubmit={handleSubmit(updateRoom)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                     <div>
                        <Label htmlFor="name">Nama Kamar</Label>
                        <Input
                           type="text"
                           id="name"
                           placeholder="Nama Kamar"
                           {...register('name', {
                              required: 'Masukan Nama Kamar',
                              maxLength: {
                                 value: 50,
                                 message: 'Nama Kamar tidak boleh lebih dari 50 karakter',
                              },
                           })}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                     </div>

                     <div>
                        <Label htmlFor="type">Tipe Kamar</Label>
                        <Input
                           type="text"
                           id="type"
                           placeholder="Tipe Kamar"
                           {...register('type', {
                              required: 'Masukan Tipe Kamar',
                              maxLength: {
                                 value: 50,
                                 message: 'Tidak boleh lebih dari 50 karakter',
                              },
                           })}
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                     </div>
                  </div>
                  <div>
                     <Label htmlFor="description">Deskripsi Kamar</Label>
                     <Textarea
                        id="description"
                        placeholder="Deskripsi"
                        {...register('description', {
                           required: 'Masukan Deskripsi',
                           minLength: {
                              value: 30,
                              message: 'Deskripsi harus minimal 30 karakter',
                           },
                           maxLength: {
                              value: 250,
                              message: 'Deskripsi tidak boleh lebih dari 50 karakter',
                           },
                        })}
                     />
                     {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                  </div>
                  <div>
                     <Label htmlFor="price">Harga Per Malam</Label>
                     <Input type="number" id="price" placeholder="0" {...register('price_per_night', { required: 'Masukan Harga' })} />
                     {errors.price_per_night && <p className="text-red-500 text-xs">Masukan Harga.</p>}
                  </div>
                  <div>
                     <Label htmlFor="image">Foto Kamar</Label>
                     <Input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'image_url')} />
                  </div>
                  <div>
                     <Label htmlFor="bathroom_image">Foto Kamar Mandi</Label>
                     <Input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'bathroom_image_url')} />
                  </div>
                  <div>
                     <Label htmlFor="other_image">Foto Lainnya</Label>
                     <Input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'other_image_url')} />
                  </div>
                  <div>
                     <Label>Fasilitas</Label>
                     <div className="grid gap-2 md:grid-cols-3">
                        {facilities.map((facility) => (
                           <Label className="flex items-center gap-2" key={facility.id}>
                              <input type="checkbox" value={facility.id} checked={selectedFacilities.includes(facility.id)} onChange={() => handleFacilityChange(facility.id)} />
                              {facility.name}
                           </Label>
                        ))}
                     </div>
                  </div>
                  <div className="mt-4">
                     <Button variant="secondary" type="submit" className="w-full">
                        Edit Kamar
                     </Button>
                  </div>
               </form>
               <WaveSVG />
               <ToastContainer autoClose={3000} />
            </div>
         </div>
      </div>
   );
}

export type Facility = {
   id: number;
   name: string;
   image: string;
};
