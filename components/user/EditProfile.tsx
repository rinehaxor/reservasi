'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SidebarUser from './SidebarUser';
import { User } from '@supabase/supabase-js';

export default function EditProfile() {
   const supabase = createClient();
   const { register, handleSubmit, reset } = useForm();
   const [user, setUser] = useState<User | null>(null);

   async function fetchUser() {
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
         console.error('Error fetching user:', userError);
         return;
      }

      console.log(user);
      setUser(user);
      reset({
         name: user?.user_metadata?.name,
         email: user?.email,
         phone: user?.user_metadata?.phone,
      });
   }

   useEffect(() => {
      fetchUser(); // Memanggil fungsi fetchUser ketika komponen dimuat
   }, []); // Dependensi kosong agar useEffect hanya berjalan sekali saat komponen mount

   const onSubmit = async (data: any) => {
      const { name, email, phone } = data;

      // Update user metadata
      const { error: metadataError } = await supabase.auth.updateUser({
         data: { name, phone },
      });

      if (metadataError) {
         console.error('Error updating user metadata:', metadataError);
         return;
      }

      // Update email
      const { error: emailError } = await supabase.auth.updateUser({
         email: email,
      });

      if (emailError) {
         console.error('Error updating email:', emailError);
         return;
      }

      fetchUser(); // Refresh user data after update
      alert('Profile updated successfully!');
   };

   return (
      <>
         <div className="flex mx-[23rem] ">
            <SidebarUser />

            <div className="bg-white p-8 max-w-4xl my-10 border rounded shadow w-full">
               <div className="text-xl font-semibold mb-6 border-b pb-4">Edit Data Pribadi</div>
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="col-span-1">
                        <div className="font-medium">Nama</div>
                     </div>
                     <div className="col-span-2">
                        <input type="text" {...register('name')} className="w-full p-2 border rounded" />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="col-span-1">
                        <div className="font-medium">Alamat Email</div>
                     </div>
                     <div className="col-span-2">
                        <input type="email" {...register('email')} className="w-full p-2 border rounded" />
                        <div className="text-sm text-gray-500 mt-1">Ini email yang Anda gunakan untuk login akun dan melakukan pemesanan kamar.</div>
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="col-span-1">
                        <div className="font-medium">Nomor Telepon</div>
                     </div>
                     <div className="col-span-2">
                        <input type="text" {...register('phone')} className="w-full p-2 border rounded" />
                     </div>
                  </div>

                  <div className="flex justify-end">
                     <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Simpan
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </>
   );
}
