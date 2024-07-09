'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { Facility } from '@/app/admin/rooms/edit-rooms/[id]/page';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type FormData = {
   name: string;
   type: string;
   description: string;
   price: string;
   image: File | null;
   bathroom_image: File | null;
   other_image: File | null;
   room_count: number;
};

const AddRoom = () => {
   const {
      register,
      handleSubmit,
      setValue,
      watch,
      reset,
      formState: { errors },
   } = useForm<FormData>({
      defaultValues: {
         name: '',
         type: '',
         description: '',
         price: '',
         room_count: 0,
         image: null,
         bathroom_image: null,
         other_image: null,
      },
   });

   const supabase = createClient();

   const [facilities, setFacilities] = useState<Facility[]>([]);
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
      register('image', { required: 'Image file is required' });
      register('bathroom_image', { required: 'Bathroom image is required' });
      register('other_image', { required: 'Other room view image is required' });
   }, [register]);

   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldName: keyof FormData) => {
      const file = event.target.files?.[0] || null;
      if (file) {
         setValue(fieldName, file, { shouldValidate: true });
      }
   };

   const uploadImage = async (file: File | null) => {
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
      setSelectedFacilities((current) => (current.includes(facilityId) ? current.filter((id) => id !== facilityId) : [...current, facilityId]));
   };

   const generateRandomIntegerId = () => {
      const maxIdValue = 1000000000;
      return Math.floor(Math.random() * maxIdValue);
   };

   const handleAddRoom = async (formData: FormData) => {
      const { name, type, description, price, image, bathroom_image, other_image, room_count } = formData;
      try {
         const imageUrl = await uploadImage(image);
         const bathroomImageUrl = await uploadImage(bathroom_image);
         const otherImageUrl = await uploadImage(other_image);

         if (!imageUrl || !bathroomImageUrl || !otherImageUrl) {
            console.error('Failed to get one or more image URLs');
            return;
         }

         const roomId = generateRandomIntegerId();

         const { error } = await supabase.from('rooms').insert([
            {
               id: roomId,
               name,
               type,
               description,
               price_per_night: parseInt(price, 10),
               image_url: imageUrl,
               bathroom_image_url: bathroomImageUrl,
               other_image_url: otherImageUrl,
               room_count,
            },
         ]);

         if (error) {
            console.error('Error adding room:', error);
            toast.error('Gagal Menambahkan Kamar');
         } else {
            const facilityInserts = selectedFacilities.map((facilityId) => ({
               room_id: roomId,
               facility_id: facilityId,
            }));

            const { error: facilitiesError } = await supabase.from('room_facilities').insert(facilityInserts);
            if (facilitiesError) {
               toast.error('Gagal Menambahkan Fasilitas Kamar');
               console.error('Error adding room facilities:', facilitiesError);
               return;
            }

            reset();
            toast.success('Berhasil Menambahkan Kamar');
         }
      } catch (error) {
         console.error('Error in handleAddRoom:', error);
         toast.error('Terjadi Kesalahan saat Menambahkan Kamar');
      }
   };

   return (
      <div className="max-w-3xl mx-auto p-8 bg-white shadow-md rounded-md">
         <p className="text-2xl font-bold border-b-2 border-orange-500 mb-5">Tambah Kamar</p>
         <form onSubmit={handleSubmit(handleAddRoom)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
               <div>
                  <Label htmlFor="name">Nama Kamar</Label>
                  <Input
                     type="text"
                     id="name"
                     placeholder="Nama Kamar"
                     {...register('name', {
                        required: 'Masukan Nama Kamar',
                        minLength: {
                           value: 5,
                           message: 'Nama kamar minimal 5 karakter',
                        },
                        maxLength: {
                           value: 50,
                           message: 'Tidak boleh lebih dari 50 karakter',
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
                        minLength: {
                           value: 5,
                           message: 'Nama kamar minimal 5 karakter',
                        },
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
                        value: 500,
                        message: 'Deskripsi tidak boleh lebih dari 250 karakter',
                     },
                  })}
               />
               {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
            </div>

            <div>
               <Label htmlFor="price">Harga Per Malam</Label>
               <Input
                  type="number"
                  id="price"
                  placeholder="0"
                  {...register('price', {
                     required: 'Masukan Harga',
                     min: {
                        value: 1000,
                        message: 'Harga harus minimal 4 digit',
                     },
                  })}
               />
               {errors.price && <p className="text-red-500 text-xs">{errors.price.message}</p>}
            </div>
            <div>
               <Label htmlFor="room_count">Jumlah Kamar</Label>
               <Input
                  type="number"
                  id="room_count"
                  placeholder="0"
                  {...register('room_count', {
                     required: 'Masukan Jumlah Kamar',
                     min: {
                        value: 1,
                        message: 'Jumlah kamar minimal 1',
                     },
                     max: {
                        value: 99,
                        message: 'Jumlah kamar maksimal 99',
                     },
                  })}
               />
               {errors.room_count && <p className="text-red-500 text-xs">{errors.room_count.message}</p>}
            </div>
            <div>
               <Label htmlFor="image">Foto Kamar</Label>
               <Input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'image')} />
               {errors.image && <p className="text-red-500 text-xs">Masukan Gambar Kamar.</p>}
            </div>
            <div>
               <Label htmlFor="bathroom_image">Foto Kamar Mandi</Label>
               <Input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'bathroom_image')} />
               {errors.bathroom_image && <p className="text-red-500 text-xs">Masukan Gambar Kamar Mandi.</p>}
            </div>
            <div>
               <Label htmlFor="other_image">Foto Lainnya</Label>
               <Input type="file" className="form-input" onChange={(e) => handleFileChange(e, 'other_image')} />
               {errors.other_image && <p className="text-red-500 text-xs">Masukan Gambar Lainnya.</p>}
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
                  Tambah Kamar
               </Button>
               <ToastContainer autoClose={3000} />
            </div>
         </form>
      </div>
   );
};

export default AddRoom;

{
   /* <input type="file" onChange={handleFileChange} />
         <button onClick={handleAddRoom}>Add Room</button> */
}
{
   /* 
         <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Room Number" />
         <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Room Type" />
         <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
         <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price Per Night" />
    
     */
}
