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

interface Room {
   id?: string; // Making id optional
   name: string;
   type: string;
   description: string;
   price_per_night: number;
   image_url?: string;
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
   } = useForm({
      defaultValues: {
         name: '',
         type: '',
         description: '',
         price: '',
         image: null,
      },
   });

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

   const [room, setRoom] = useState<Room | null>(null);
   const [loading, setLoading] = useState(true);

   const [bookings, setBookings] = useState<Booking[]>([]);

   const supabase = createClient();

   const [currentFacilities, setCurrentFacilities] = useState<number[]>([]);

   const [facilities, setFacilities] = useState<Facility[]>([]);

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
      async function fetchCurrentFacilities() {
         if (room) {
            const { data, error } = await supabase.from('room_facilities').select('facility_id').eq('room_id', room.id);

            if (error) {
               console.error('Error fetching facilities:', error);
            } else {
               setCurrentFacilities(data.map((fac) => fac.facility_id));
            }
         }
      }

      fetchCurrentFacilities();
   }, [room]);

   const [selectedFacilities, setSelectedFacilities] = useState<number[]>([]);

   useEffect(() => {
      setSelectedFacilities(currentFacilities);
   }, [currentFacilities]);

   const handleFacilityChange = (facilityId: any) => {
      setSelectedFacilities((prev) => (prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId]));
   };

   useEffect(() => {
      async function fetchRoomDetail() {
         if (params?.id) {
            const { data, error } = await supabase.from('rooms').select('*').eq('id', params.id).single();
            if (data) {
               setRoom(data);
               setValue('name', data.name); // Set the name in the form
               setValue('type', data.type); // Set the type in the form
               setValue('description', data.description); // Set the description in the form
               setValue('price', data.price_per_night.toString()); // Set the price in the form
            }
            setRoom(data);

            setLoading(false);
         }
      }

      fetchRoomDetail();
   }, [params?.id]);

   useEffect(() => {
      async function fetchBookingHistory() {
         const {
            data: { user },
            error: userError,
         } = await supabase.auth.getUser();

         if (userError) {
            console.error('Error fetching user:', userError.message);
            return;
         }

         if (user) {
            const { data: bookingsData, error: bookingsError } = await supabase.from('bookings').select('*').eq('user_id', user.id);

            if (bookingsError) {
               console.error('Error fetching booking history:', bookingsError.message);
            } else {
               setBookings(bookingsData);
            }
         }
      }

      fetchBookingHistory();
   }, []);
   const updateRoom = async (formData: any) => {
      const { name, type, description, price, image } = formData;

      let imageUrl = room?.image_url; // Default to existing image URL
      if (image instanceof File) {
         // Check if a new file was uploaded
         const uploadedImageUrl = await uploadImage(image);
         if (uploadedImageUrl) {
            imageUrl = uploadedImageUrl;
         } else {
            console.error('Failed to upload new image');
            alert('Failed to upload new image');
            return;
         }
      }

      const updatedData = {
         name,
         type,
         description,
         price_per_night: parseInt(price, 10),
         image_url: imageUrl,
      };

      try {
         // Update room details
         const { data: roomData, error: roomError } = await supabase.from('rooms').update(updatedData).match({ id: room?.id });
         if (roomError) throw new Error(`Error updating room: ${roomError.message}`);

         // Update room facilities
         // First, delete existing facilities
         const { error: deleteError } = await supabase.from('room_facilities').delete().match({ room_id: room?.id });
         if (deleteError) throw new Error(`Error deleting old facilities: ${deleteError.message}`);

         // Insert updated facilities
         const facilityInserts = selectedFacilities.map((facilityId) => ({
            room_id: room?.id,
            facility_id: facilityId,
         }));
         const { error: insertError } = await supabase.from('room_facilities').insert(facilityInserts);
         if (insertError) throw new Error(`Error inserting new facilities: ${insertError.message}`);

         alert('Room and facilities updated successfully!');
         setRoom({ ...room, ...updatedData }); // Update local state to reflect changes
      } catch (error) {
         console.error(error);
         alert(error);
      }
   };

   return (
      <div className="w-full justify-start items-start">
         {' '}
         <SideBar />
         <div className="w-full">
            <div className="flex-1 w-full flex flex-col gap-20 items-center mt-10">
               <p className="text-xl font-bold">Edit Kamar</p>
               <div className="flex flex-row">
                  <form onSubmit={handleSubmit(updateRoom)} className="flex flex-col gap-4">
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
                     </div>
                     <div>
                        {facilities.map((facility) => (
                           <label key={facility.id}>
                              <input type="checkbox" value={facility.id} checked={selectedFacilities.includes(facility.id)} onChange={() => handleFacilityChange(facility.id)} />
                              {facility.name}
                           </label>
                        ))}
                     </div>
                     <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                        <Button variant={'secondary'} type="submit">
                           Tambah Kamar
                        </Button>
                     </div>
                  </form>
                  <WaveSVG />
               </div>
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
