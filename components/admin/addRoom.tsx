'use client';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { roomsAtom } from '@/components/atoms/store';
import { createClient } from '@/utils/supabase/client';
import NavbarAdmin from './navbarAdmin';

const AddRoom = () => {
   const [name, setName] = useState('');
   const [type, setType] = useState('');
   const [description, setDescription] = useState('');
   const [price, setPrice] = useState('');
   const [image, setImage] = useState(null);
   const supabase = createClient();

   const handleFileChange = (event) => {
      setImage(event.target.files[0]);
   };

   const uploadImage = async () => {
      if (!image) return null;

      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `rooms/${fileName}`;

      let { error: uploadError } = await supabase.storage.from('room-images').upload(filePath, image);

      if (uploadError) {
         console.error('Failed to upload image:', uploadError);
         return null;
      }

      // Dapatkan URL publik untuk file yang diunggah
      let { data } = supabase.storage.from('room-images').getPublicUrl(filePath);
      console.log(data);

      // If there's no publicUrl in data, then something went wrong
      if (!data || !data.publicUrl) {
         console.error('Failed to get public URL.');
         return null;
      }

      const publicURL = data.publicUrl;
      return publicURL;
   };

   const handleAddRoom = async () => {
      try {
         const imageUrl = await uploadImage();
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
         console.log('Insert response:', data, error);
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
      <div>
         {/* <NavbarAdmin /> */}
         <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Room Number" />
         <input value={type} onChange={(e) => setType(e.target.value)} placeholder="Room Type" />
         <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
         <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price Per Night" />
         <input type="file" onChange={handleFileChange} />
         <button onClick={handleAddRoom}>Add Room</button>
      </div>
   );
};

export default AddRoom;
