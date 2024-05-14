'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SidebarUser from './SidebarUser';
import { User } from '@supabase/supabase-js';
import Spinner from '../ui/spinner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditProfile() {
   const supabase = createClient();
   const { register, handleSubmit, reset } = useForm();
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   async function fetchUser() {
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
         console.error('Error fetching user:', userError);
         setLoading(false);
         return;
      }

      setUser(user);
      setLoading(false);
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
         toast.error('Gagal Mengedit Profile.');
         console.error('Error updating email:', emailError);
         return;
      }

      fetchUser(); // Refresh user data after update
      toast.success('Berhasil Mengedit Profile.');
   };

   return (
      <div>
         <div className="flex flex-col md:flex-row items-start p-4 md:p-8 md:mx-48">
            <div className="hidden md:block md:w-1/4">
               <SidebarUser />
            </div>
            <div className="w-full md:w-3/4 p-4">
               <div className="bg-white p-6 border rounded shadow-md">
                  {loading ? (
                     <Spinner /> // Display the spinner while loading
                  ) : (
                     <>
                        <div className="text-xl font-semibold mb-6 border-b pb-4">Edit Data Pribadi</div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="md:col-span-1">
                                 <div className="font-medium">
                                    <Label>Nama</Label>
                                 </div>
                              </div>
                              <div className="md:col-span-2">
                                 <input type="text" {...register('name')} className="w-full p-2 border rounded" />
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="md:col-span-1">
                                 <div className="font-medium">
                                    {' '}
                                    <Label>Alamat Email</Label>
                                 </div>
                              </div>
                              <div className="md:col-span-2">
                                 <Input type="email" {...register('email')} className="w-full p-2 border rounded" />
                                 <div className="text-sm text-gray-500 mt-1">Ini email yang Anda gunakan untuk login akun dan melakukan pemesanan kamar.</div>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="md:col-span-1">
                                 <div className="font-medium">
                                    {' '}
                                    <Label>Nomor Telepon</Label>
                                 </div>
                              </div>
                              <div className="md:col-span-2">
                                 <Input type="text" {...register('phone')} className="w-full p-2 border rounded" />
                              </div>
                           </div>

                           <div className="flex justify-end">
                              <Button type="submit" variant={'secondary'}>
                                 Simpan
                              </Button>
                           </div>
                        </form>
                     </>
                  )}
               </div>
            </div>
         </div>
         <ToastContainer />
      </div>
   );
}
