'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import NavbarHome from '../home/NavbarHome';
import SidebarUser from './SidebarUser';
import { User } from '@supabase/supabase-js';

export default function Profile() {
   const supabase = createClient();
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
      setUser(user); // Menyimpan seluruh objek user ke state
   }

   useEffect(() => {
      fetchUser(); // Memanggil fungsi fetchUser ketika komponen dimuat
   }, []); // Dependensi kosong agar useEffect hanya berjalan sekali saat komponen mount

   return (
      <>
         <div className="flex mx-[23rem] ">
            <SidebarUser />

            <div className="bg-white p-8 max-w-4xl my-10 border rounded shadow w-full">
               <div className="text-xl font-semibold mb-6 border-b pb-4">Data Pribadi</div>
               <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                     <div className="font-medium">Nama</div>
                  </div>
                  <div className="col-span-2 border-b pb-2 mb-4">{user?.user_metadata?.name}</div>

                  <div className="col-span-1">
                     <div className="font-medium">Alamat Email</div>
                  </div>
                  <div className="col-span-2 border-b pb-2 mb-4">
                     {user?.email} <span className="text-green-500 ml-2">{user?.email_confirmed_at ? 'Terverifikasi' : 'Belum Terverifikasi'}</span>
                     <div className="text-sm text-gray-500 mt-1">Ini email yang Anda gunakan untuk login akun dan melakukan pemesanan kamar.</div>
                  </div>
                  <div className="col-span-1">
                     <div className="font-medium">Nomor Telepon</div>
                  </div>
                  <div className="col-span-2 border-b pb-2 mb-4">{user?.user_metadata?.phone || 'Tambahkan nomor telepon'}</div>
               </div>
            </div>
         </div>
      </>
   );
}
